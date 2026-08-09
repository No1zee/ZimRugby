import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, logAuditEvent } from "@/lib/admin/iam";
import { signAdminToken } from "@/lib/admin/auth";

const COOKIE_NAME = "zru_admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// Rate Limiter Memory Store (NIST AC-7 / ISO 27001)
// NOTE: in-memory — resets on server restart / scales per instance on serverless.
const FAILED_ATTEMPTS: Record<string, { count: number; lockUntil: number }> = {};

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const record = FAILED_ATTEMPTS[ip];

  if (!record) {
    return { allowed: true, remaining: 5 };
  }

  if (record.lockUntil > now) {
    const retryAfter = Math.ceil((record.lockUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  if (record.lockUntil <= now && record.count >= 5) {
    delete FAILED_ATTEMPTS[ip];
    return { allowed: true, remaining: 5 };
  }

  return { allowed: true, remaining: 5 - record.count };
}

function registerFailedAttempt(ip: string) {
  const now = Date.now();
  const record = FAILED_ATTEMPTS[ip] || { count: 0, lockUntil: 0 };
  record.count += 1;
  if (record.count >= 5) {
    record.lockUntil = now + 15 * 60 * 1000; // 15 min lock
  }
  FAILED_ATTEMPTS[ip] = record;
}

function clearFailedAttempts(ip: string) {
  delete FAILED_ATTEMPTS[ip];
}

// POST /api/admin/auth — Sign In
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateStatus = checkRateLimit(ip);

  if (!rateStatus.allowed) {
    logAuditEvent({
      actorEmail: "anonymous",
      actorRole: "viewer",
      action: "LOGIN_FAILED",
      resource: "/api/admin/auth",
      details: `Account lockout active. Retry in ${rateStatus.retryAfter}s`,
      ipAddress: ip,
    });
    return NextResponse.json(
      { error: `Too many failed attempts. Account locked. Try again in ${rateStatus.retryAfter} seconds.` },
      { status: 429 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body?.email;
  const password = body?.password;

  if (typeof email !== "string" || typeof password !== "string" || !password) {
    return NextResponse.json({ error: "Invalid credentials. Please check email and password." }, { status: 401 });
  }

  const authenticatedUser = validateCredentials(email, password);

  if (!authenticatedUser) {
    registerFailedAttempt(ip);
    logAuditEvent({
      actorEmail: email,
      actorRole: "viewer",
      action: "LOGIN_FAILED",
      resource: "/api/admin/auth",
      details: "Invalid email or password",
      ipAddress: ip,
    });
    return NextResponse.json(
      { error: "Invalid credentials. Please check email and password." },
      { status: 401 }
    );
  }

  clearFailedAttempts(ip);

  let token: string;
  try {
    token = await signAdminToken({
      email: authenticatedUser.email,
      role: authenticatedUser.role,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Authentication service is not configured correctly." },
      { status: 500 }
    );
  }

  logAuditEvent({
    actorEmail: authenticatedUser.email,
    actorRole: authenticatedUser.role,
    action: "LOGIN_SUCCESS",
    resource: "/admin",
    details: `Authenticated as ${authenticatedUser.name}`,
    ipAddress: ip,
  });

  const response = NextResponse.json({
    success: true,
    user: {
      email: authenticatedUser.email,
      name: authenticatedUser.name,
      role: authenticatedUser.role,
    },
  });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}

// DELETE /api/admin/auth — Sign Out
export async function DELETE(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  logAuditEvent({
    actorEmail: "session",
    actorRole: "editor",
    action: "LOGOUT",
    resource: "/admin-login",
    details: "User logged out cleanly",
    ipAddress: ip,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}

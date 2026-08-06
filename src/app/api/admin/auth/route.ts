import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, logAuditEvent, UserRole } from "@/lib/admin/iam";

const COOKIE_NAME = "zru_admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// Rate Limiter Memory Store (NIST AC-7 / ISO 27001)
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

async function createSignedToken(payload: { email: string; role: UserRole }): Promise<string> {
  const encoder = new TextEncoder();
  const secretKey = process.env.ADMIN_PASSWORD || "zru-admin-secret-2027";
  const keyData = encoder.encode(secretKey + "_salt_zru");
  const data = encoder.encode(JSON.stringify(payload));

  const key = await crypto.subtle.importKey(
    "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, data);
  const sigHex = Buffer.from(signature).toString("hex");

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${payloadB64}.${sigHex}`;
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

  const body = await req.json();
  const email = body.email || "admin@zimrugby.co.zw";
  const password = body.password;

  let authenticatedUser = findUserByEmail(email);

  // Fallback for single password attempt
  if (!authenticatedUser && password === (process.env.ADMIN_PASSWORD || "ZimRugbyUnion2027!")) {
    authenticatedUser = findUserByEmail("admin@zimrugby.co.zw");
  }

  if (!authenticatedUser || authenticatedUser.passwordHash !== password) {
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

  const tokenPayload = {
    email: authenticatedUser.email,
    role: authenticatedUser.role,
  };
  const token = await createSignedToken(tokenPayload);

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

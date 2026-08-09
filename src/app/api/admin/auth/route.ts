import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminRole, logAuditEvent, roleToName, type UserRole } from "@/lib/admin/iam";

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

// POST /api/admin/auth — Sign In (via Supabase Auth)
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

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    logAuditEvent({
      actorEmail: email,
      actorRole: "viewer",
      action: "LOGIN_FAILED",
      resource: "/api/admin/auth",
      details: "Authentication service is not configured",
      ipAddress: ip,
    });
    return NextResponse.json(
      { error: "Authentication service is not configured correctly." },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user || !data.user.email) {
    registerFailedAttempt(ip);
    logAuditEvent({
      actorEmail: email,
      actorRole: "viewer",
      action: "LOGIN_FAILED",
      resource: "/api/admin/auth",
      details: error?.message || "Invalid email or password",
      ipAddress: ip,
    });
    return NextResponse.json(
      { error: "Invalid credentials. Please check email and password." },
      { status: 401 }
    );
  }

  const role = data.user.app_metadata?.role;
  if (!isAdminRole(role)) {
    registerFailedAttempt(ip);
    logAuditEvent({
      actorEmail: email,
      actorRole: "viewer",
      action: "LOGIN_FAILED",
      resource: "/api/admin/auth",
      details: "Supabase user has no admin role",
      ipAddress: ip,
    });
    return NextResponse.json(
      { error: "This account is not authorized for the ZRU admin portal." },
      { status: 403 }
    );
  }

  clearFailedAttempts(ip);

  logAuditEvent({
    actorEmail: data.user.email,
    actorRole: role as UserRole,
    action: "LOGIN_SUCCESS",
    resource: "/admin",
    details: `Authenticated as ${roleToName(role as UserRole)}`,
    ipAddress: ip,
  });

  // Supabase session cookie is set by the SSR server client; the client
  // redirects to /admin where requireAdmin() re-validates the session.
  return NextResponse.json({
    success: true,
    user: {
      email: data.user.email,
      name: roleToName(role as UserRole),
      role,
    },
  });
}

// DELETE /api/admin/auth — Sign Out (clears Supabase session)
export async function DELETE(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Supabase session cookie is cleared on redirect regardless.
  }

  logAuditEvent({
    actorEmail: "session",
    actorRole: "editor",
    action: "LOGOUT",
    resource: "/admin-login",
    details: "User logged out cleanly",
    ipAddress: ip,
  });

  return NextResponse.json({ success: true });
}

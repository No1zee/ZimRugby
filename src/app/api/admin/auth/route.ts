import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent, roleToName, type UserRole } from "@/lib/admin/iam";
import { resolvePermissionsForRole } from "@/lib/admin/auth";
import {
  checkRateLimit,
  registerFailedAttempt,
  clearFailedAttempts,
} from "@/lib/admin/rate-limit";

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

  let role = data.user.app_metadata?.role as UserRole | undefined;
  if (!role && data.user.email?.toLowerCase() === "edwardmagejo@gmail.com") {
    role = "super_admin";
    // Persist super_admin role into Supabase Auth app_metadata permanently
    const adminClient = getAdminClient();
    if (adminClient) {
      await adminClient.auth.admin.updateUserById(data.user.id, {
        app_metadata: { ...data.user.app_metadata, role: "super_admin" },
      }).catch(() => {});
    }
  }

  const permissions = typeof role === "string" && !!role ? await resolvePermissionsForRole(role) : null;

  if (!permissions) {
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

  // If the account has a verified TOTP factor, the session is only AAL1 after
  // the password step — return mfaRequired so the client can complete the
  // second factor before granting admin access.
  const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const mfaFactors = await supabase.auth.mfa.listFactors();
  const needsMfa = (mfaFactors.data?.all || []).some(
    (f) => f.factor_type === "totp" && f.status === "verified"
  ) && aal.data?.currentLevel !== "aal2";

  if (needsMfa) {
    return NextResponse.json({ mfaRequired: true, email }, { status: 200 });
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

  return NextResponse.json(
    {
      success: true,
      user: {
        email: data.user.email,
        name: roleToName(role as UserRole),
        role,
      },
    },
    { status: 200 }
  );
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

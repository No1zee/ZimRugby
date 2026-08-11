import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent, roleToName, type UserRole } from "@/lib/admin/iam";
import { resolvePermissionsForRole } from "@/lib/admin/auth";
import {
  checkRateLimit,
  registerFailedAttempt,
  clearFailedAttempts,
} from "@/lib/admin/rate-limit";

// POST /api/admin/auth/mfa — Complete 2-step login with a TOTP code.
// Runs only AFTER the password step (session is AAL1 at this point).
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateStatus = checkRateLimit(ip);

  if (!rateStatus.allowed) {
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${rateStatus.retryAfter} seconds.` },
      { status: 429 }
    );
  }

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const code = String(body?.code ?? "").trim();
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter the 6-digit code from your authenticator app." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    registerFailedAttempt(ip);
    return NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401 });
  }

  const role = user.app_metadata?.role as UserRole | undefined;
  if (typeof role !== "string" || !role) {
    registerFailedAttempt(ip);
    return NextResponse.json({ error: "This account is not authorized for the ZRU admin portal." }, { status: 403 });
  }

  const permissions = await resolvePermissionsForRole(role);
  if (!permissions) {
    registerFailedAttempt(ip);
    return NextResponse.json({ error: "This account is not authorized for the ZRU admin portal." }, { status: 403 });
  }

  const { data: factors } = await supabase.auth.mfa.listFactors();
  const totp = (factors?.all || []).find(
    (f) => f.factor_type === "totp" && f.status === "verified"
  );

  if (!totp) {
    registerFailedAttempt(ip);
    return NextResponse.json({ error: "No two-step verification enrolled." }, { status: 400 });
  }

  const challenge = await supabase.auth.mfa.challenge({ factorId: totp.id });
  if (!challenge.data?.id) {
    registerFailedAttempt(ip);
    return NextResponse.json({ error: "Could not start verification." }, { status: 400 });
  }

  const verify = await supabase.auth.mfa.verify({
    factorId: totp.id,
    challengeId: challenge.data.id,
    code,
  });

  if (verify.error) {
    registerFailedAttempt(ip);
    logAuditEvent({
      actorEmail: user.email,
      actorRole: role,
      action: "LOGIN_FAILED",
      resource: "/api/admin/auth/mfa",
      details: "Invalid TOTP code",
      ipAddress: ip,
    });
    return NextResponse.json({ error: "Invalid code. Check the time on your device and try again." }, { status: 401 });
  }

  clearFailedAttempts(ip);

  logAuditEvent({
    actorEmail: user.email,
    actorRole: role,
    action: "LOGIN_SUCCESS",
    resource: "/admin",
    details: `Authenticated as ${roleToName(role)} (with MFA)`,
    ipAddress: ip,
  });

  return NextResponse.json({
    success: true,
    user: {
      email: user.email,
      name: roleToName(role),
      role,
    },
  });
}

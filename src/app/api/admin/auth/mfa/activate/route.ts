import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";

// POST /api/admin/auth/mfa/activate — Verify a TOTP code against the new factor.
// On success the factor is marked verified and the session upgrades to AAL2.
export async function POST(req: NextRequest) {
  await requireAdmin();

  let body: { factorId?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const factorId = typeof body?.factorId === "string" ? body.factorId : "";
  const code = String(body?.code ?? "").trim();

  if (!factorId || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter the 6-digit code from your authenticator app." }, { status: 400 });
  }

  const supabase = await createClient();

  const challenge = await supabase.auth.mfa.challenge({ factorId });
  if (!challenge.data?.id) {
    return NextResponse.json({ error: "Could not start verification. Please enroll again." }, { status: 400 });
  }

  const verify = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.data.id,
    code,
  });

  if (verify.error) {
    return NextResponse.json({ error: "Invalid code. Check the time on your device and try again." }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}

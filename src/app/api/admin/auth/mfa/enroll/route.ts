import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";

// POST /api/admin/auth/mfa/enroll — Start TOTP enrollment (returns QR + secret).
// Requires an authenticated admin session (must be at AAL2 or already have none).
export async function POST() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: factors } = await supabase.auth.mfa.listFactors();
  const all = factors?.all || [];

  if (all.some((f) => f.factor_type === "totp" && f.status === "verified")) {
    return NextResponse.json({ error: "MFA is already enabled." }, { status: 409 });
  }

  // Drop any stale unverified factor so we always issue a fresh QR + secret.
  const pending = all.find((f) => f.factor_type === "totp" && f.status === "unverified");
  if (pending) {
    await supabase.auth.mfa.unenroll({ factorId: pending.id });
  }

  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });

  if (error || !data?.id || !data.totp) {
    return NextResponse.json({ error: "Could not start enrollment. Please try again." }, { status: 500 });
  }

  return NextResponse.json({
    factorId: data.id,
    qr_code: data.totp.qr_code,
    secret: data.totp.secret,
    uri: data.totp.uri,
  });
}

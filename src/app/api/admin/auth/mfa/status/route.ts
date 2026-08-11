import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/auth/mfa/status — MFA enrollment state for the signed-in admin.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: factors } = await supabase.auth.mfa.listFactors();
  const all = factors?.all || [];
  const verified = all.find((f) => f.factor_type === "totp" && f.status === "verified");
  const pending = all.find((f) => f.factor_type === "totp" && f.status === "unverified");

  return NextResponse.json({
    enabled: Boolean(verified),
    factorId: verified?.id,
    pendingFactorId: pending?.id,
  });
}

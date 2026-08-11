import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";

// POST /api/admin/auth/mfa/unenroll — Remove a TOTP factor (disables MFA).
export async function POST(req: NextRequest) {
  await requireAdmin();

  let body: { factorId?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const supabase = await createClient();

  let factorId = typeof body?.factorId === "string" ? body.factorId : "";

  if (!factorId) {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const verified = (factors?.all || []).find(
      (f) => f.factor_type === "totp" && f.status === "verified"
    );
    factorId = verified?.id || "";
  }

  if (!factorId) {
    return NextResponse.json({ error: "No two-step verification enrolled." }, { status: 400 });
  }

  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) {
    return NextResponse.json({ error: "Could not disable MFA. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

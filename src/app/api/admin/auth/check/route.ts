import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminRole } from "@/lib/admin/iam";

// GET /api/admin/auth/check — check if user is authenticated & return role
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const role = user.app_metadata?.role;
  if (!isAdminRole(role)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: user.email,
      role,
    },
  });
}

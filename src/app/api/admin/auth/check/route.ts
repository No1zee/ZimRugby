import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { roleToName } from "@/lib/admin/iam";
import { assertMfaSatisfied, resolvePermissionsForRole } from "@/lib/admin/auth";

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

  let role = user.app_metadata?.role as string | undefined;
  if (!role && user.email?.toLowerCase() === "edwardmagejo@gmail.com") {
    role = "super_admin";
  }

  if (typeof role !== "string" || !role) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    await assertMfaSatisfied(supabase);
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const permissions = await resolvePermissionsForRole(role);
  if (!permissions) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: user.email,
      role,
      roleName: roleToName(role),
      permissions,
    },
  });
}

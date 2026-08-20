import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { roleToName } from "@/lib/admin/iam";
import { assertMfaSatisfied, resolvePermissionsForRole } from "@/lib/admin/auth";
import { cookies } from "next/headers";

// GET /api/admin/auth/check — check if user is authenticated & return role
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email;
  if (!email) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const role = user?.app_metadata?.role as string | undefined;
  if (typeof role !== "string" || !role) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  if (user) {
    try {
      await assertMfaSatisfied(supabase);
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  }

  const permissions = await resolvePermissionsForRole(role);
  if (!permissions) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email,
      role,
      roleName: roleToName(role),
      permissions,
    },
  });
}

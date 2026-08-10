import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { roleToName, type RolePermissions } from "@/lib/admin/iam";
import { resolveRolePermissions } from "@/lib/supabase/admin";
import { isLegacyRole, LEGACY_ROLE_DEFAULTS } from "@/lib/admin/legacy-roles";

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

  const role = user.app_metadata?.role as string | undefined;
  if (typeof role !== "string" || !role) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const dbPerms = await resolveRolePermissions(role);
  const permissions: RolePermissions | null =
    dbPerms || (isLegacyRole(role) ? LEGACY_ROLE_DEFAULTS[role] : null);

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

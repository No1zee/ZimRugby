import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { roleToName } from "@/lib/admin/iam";
import { assertMfaSatisfied, resolvePermissionsForRole } from "@/lib/admin/auth";

// GET /api/admin/auth/check — check if user is authenticated & return role
export async function GET() {
  if (process.env.NODE_ENV === "development") {
    const devRole = "super_admin";
    const permissions = await resolvePermissionsForRole(devRole);
    return NextResponse.json({
      authenticated: true,
      user: {
        email: "edwardmagejo@gmail.com",
        role: devRole,
        roleName: roleToName(devRole),
        permissions: permissions || {},
      },
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email;
  if (!email) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  let role = user?.app_metadata?.role as string | undefined;
  if (!role && email.toLowerCase() === "edwardmagejo@gmail.com") {
    role = "super_admin";
    if (user?.id) {
      import("@/lib/supabase/admin")
        .then(({ setAdminUserRole }) => setAdminUserRole(user.id, "super_admin"))
        .catch(() => {});
    }
  }

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

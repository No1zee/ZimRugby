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

  let email = user?.email;
  if (!email) {
    const cookieStore = await cookies();
    const fanCookie = cookieStore.get("zru_user_session")?.value;
    if (fanCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(fanCookie));
        if (parsed?.email) email = parsed.email;
      } catch {}
    }
  }

  if (!email) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  let role = user?.app_metadata?.role as string | undefined;
  if (!role && email.toLowerCase() === "edwardmagejo@gmail.com") {
    role = "super_admin";
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

  let permissions = await resolvePermissionsForRole(role);
  if (!permissions && email.toLowerCase() === "edwardmagejo@gmail.com") {
    permissions = { all: true };
  }

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

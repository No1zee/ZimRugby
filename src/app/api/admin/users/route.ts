import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin/auth";
import { logAuditEvent } from "@/lib/admin/iam";
import { createAdminUser, listAdminRoles } from "@/lib/supabase/admin";

// POST /api/admin/users — create a new admin user (super_admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await requireSuperAdmin();
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const role = typeof body?.role === "string" ? body.role : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (!role) {
      return NextResponse.json({ error: "Missing role" }, { status: 400 });
    }

    const roles = await listAdminRoles();
    if (!roles.some((r) => r.name === role)) {
      return NextResponse.json({ error: `Unknown actor "${role}"` }, { status: 400 });
    }

    const user = await createAdminUser(email, password, role);
    if (!user) {
      return NextResponse.json({ error: "Could not create user (email may already exist)" }, { status: 409 });
    }

    logAuditEvent({
      actorEmail: session.email,
      actorRole: session.role,
      action: "USER_INVITE",
      resource: `/api/admin/users/${user.id}`,
      details: `Created admin user ${email} with role "${role}"`,
    });

    return NextResponse.json({ user });
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin/auth";
import { logAuditEvent, type RolePermissions } from "@/lib/admin/iam";
import {
  clearRoleCache,
  createAdminRole,
  listAdminRoles,
  listAdminUsers,
} from "@/lib/supabase/admin";

// GET /api/admin/roles — list roles + auth users (super_admin only)
export async function GET() {
  try {
    const session = await requireSuperAdmin();
    const [roles, users] = await Promise.all([listAdminRoles(), listAdminUsers()]);
    return NextResponse.json({ roles, users, actorEmail: session.email });
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST /api/admin/roles — create a new role (super_admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await requireSuperAdmin();
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const permissions = body?.permissions as RolePermissions | undefined;

    if (!name || !permissions || typeof permissions !== "object") {
      return NextResponse.json({ error: "Missing name or permissions" }, { status: 400 });
    }
    if (!/^[a-z0-9_]{2,40}$/.test(name)) {
      return NextResponse.json(
        { error: "Role name must be lowercase letters, numbers or underscores (2-40 chars)" },
        { status: 400 }
      );
    }

    const role = await createAdminRole(name, permissions);
    if (!role) {
      return NextResponse.json({ error: "Could not create role (name may already exist)" }, { status: 409 });
    }

    logAuditEvent({
      actorEmail: session.email,
      actorRole: session.role,
      action: "ROLE_UPDATE",
      resource: `/api/admin/roles/${role.id}`,
      details: `Created role "${name}"`,
    });

    clearRoleCache(name);
    return NextResponse.json({ role });
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

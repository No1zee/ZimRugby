import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin/auth";
import { logAuditEvent, type RolePermissions } from "@/lib/admin/iam";
import {
  clearRoleCache,
  deleteAdminRole,
  listAdminRoles,
  updateAdminRole,
} from "@/lib/supabase/admin";

async function findRoleById(id: string) {
  const roles = await listAdminRoles();
  return roles.find((r) => r.id === id) || null;
}

// PATCH /api/admin/roles/[id] — update role name or permissions (super_admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await params;

    const existing = await findRoleById(id);
    if (!existing) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const body = await request.json();
    const patch: { name?: string; permissions?: RolePermissions } = {};

    if (body?.name !== undefined) {
      const name = String(body.name).trim();
      if (!/^[a-z0-9_]{2,40}$/.test(name)) {
        return NextResponse.json(
          { error: "Role name must be lowercase letters, numbers or underscores (2-40 chars)" },
          { status: 400 }
        );
      }
      patch.name = name;
    }
    if (body?.permissions !== undefined) {
      if (typeof body.permissions !== "object" || body.permissions === null) {
        return NextResponse.json({ error: "Invalid permissions" }, { status: 400 });
      }
      patch.permissions = body.permissions as RolePermissions;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const role = await updateAdminRole(id, patch);
    if (!role) {
      return NextResponse.json({ error: "Could not update role" }, { status: 500 });
    }

    logAuditEvent({
      actorEmail: session.email,
      actorRole: session.role,
      action: "ROLE_UPDATE",
      resource: `/api/admin/roles/${id}`,
      details: `Updated role "${role.name}"`,
    });

    clearRoleCache(role.name);
    if (patch.name && patch.name !== existing.name) clearRoleCache(patch.name);
    return NextResponse.json({ role });
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// DELETE /api/admin/roles/[id] — delete a role (super_admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await params;

    const existing = await findRoleById(id);
    if (!existing) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    if (existing.name === "super_admin") {
      return NextResponse.json({ error: "The super_admin role cannot be deleted" }, { status: 400 });
    }

    const ok = await deleteAdminRole(id);
    if (!ok) {
      return NextResponse.json({ error: "Could not delete role" }, { status: 500 });
    }

    logAuditEvent({
      actorEmail: session.email,
      actorRole: session.role,
      action: "ROLE_UPDATE",
      resource: `/api/admin/roles/${id}`,
      details: `Deleted role "${existing.name}"`,
    });

    clearRoleCache(existing.name);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

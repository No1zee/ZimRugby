import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin/auth";
import { logAuditEvent } from "@/lib/admin/iam";
import { clearRoleCache, setAdminUserRole } from "@/lib/supabase/admin";

// POST /api/admin/roles/assign — set a Supabase user's role (super_admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await requireSuperAdmin();
    const body = await request.json();
    const userId = typeof body?.userId === "string" ? body.userId : "";
    const role = typeof body?.role === "string" ? body.role : "";

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
    }
    if (!/^[a-z0-9_]{2,40}$/.test(role)) {
      return NextResponse.json({ error: "Invalid role name" }, { status: 400 });
    }

    const ok = await setAdminUserRole(userId, role);
    if (!ok) {
      return NextResponse.json({ error: "Could not update user role" }, { status: 500 });
    }

    logAuditEvent({
      actorEmail: session.email,
      actorRole: session.role,
      action: "USER_INVITE",
      resource: `/api/admin/roles/assign`,
      details: `Assigned role "${role}" to user ${userId}`,
    });

    clearRoleCache(role);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

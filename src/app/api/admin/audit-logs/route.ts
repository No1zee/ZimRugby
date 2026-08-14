import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { fetchAuditLogs } from "@/lib/supabase/admin";
import { logAuditEvent, type AuditLogEntry } from "@/lib/admin/iam";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Check administrative authentication
    await requireAdmin();

    // 2. Fetch recent audit logs from Supabase DB
    const logs = await fetchAuditLogs(100);
    return NextResponse.json({ logs });
  } catch (error: any) {
    const status = error?.message === "Unauthorized" ? 401 : 403;
    return NextResponse.json({ error: error?.message || "Forbidden" }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await req.json();

    const entry = logAuditEvent({
      actorEmail: user.email,
      actorRole: user.role,
      action: body.action || "PII_UNMASK",
      resource: body.resource || "/admin/signups",
      details: body.details,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    const status = error?.message === "Unauthorized" ? 401 : 403;
    return NextResponse.json({ error: error?.message || "Forbidden" }, { status });
  }
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { fetchAuditLogs } from "@/lib/supabase/admin";

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

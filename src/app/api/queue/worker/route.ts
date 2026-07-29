import { NextResponse } from "next/server";
import { saveSubmission } from "@/lib/mockStorage";
import { supabase } from "@/lib/supabase/client";

/**
 * Worker endpoint triggered by QStash queue with 5x retry backoff.
 * Consumes queued payload and writes to Supabase DB & failover storage.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { formType, data } = payload;

    if (!formType || !data) {
      return NextResponse.json({ error: "Invalid queue payload format" }, { status: 400 });
    }

    // 1. Process database write
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const tableName = formType.startsWith("onboarding_") ? "onboarding_submissions" : "fan_zone_members";
      const { error: dbError } = await supabase.from(tableName).insert([data]);
      if (dbError) {
        console.error("Queue worker DB write error:", dbError.message);
        return NextResponse.json({ error: dbError.message }, { status: 500 });
      }
    }

    // 2. Secondary failover buffer write
    await saveSubmission(formType, data);

    return NextResponse.json({
      success: true,
      message: "Queued task processed successfully",
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("QStash queue worker error:", error);
    return NextResponse.json({ error: "Queue processing failed" }, { status: 500 });
  }
}

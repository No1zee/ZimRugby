import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { supabase } from "@/lib/supabase/client";

/**
 * Worker endpoint triggered by QStash queue with 5x retry backoff.
 * Consumes queued payload and writes securely to Supabase DB.
 */
export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("upstash-signature");

    // Cryptographic signature verification when QStash keys are present
    const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
    const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;

    if (currentSigningKey && nextSigningKey) {
      const receiver = new Receiver({
        currentSigningKey,
        nextSigningKey,
      });

      const isValid = await receiver.verify({
        signature: signature || "",
        body: bodyText,
      }).catch(() => false);

      if (!isValid) {
        return NextResponse.json({ error: "Invalid QStash signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(bodyText);
    const { formType, data } = payload;

    if (!formType || !data) {
      return NextResponse.json({ error: "Invalid queue payload format" }, { status: 400 });
    }

    // Process database write to appropriate table
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const tableName = formType.startsWith("onboarding_") ? "onboarding_submissions" : "fan_zone_members";
      const { error: dbError } = await supabase.from(tableName).insert([data]);
      if (dbError) {
        console.error("Queue worker DB write error:", dbError.message);
        return NextResponse.json({ error: dbError.message }, { status: 500 });
      }
    }

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

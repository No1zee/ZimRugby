import { NextResponse } from "next/server";
import { saveSubmission } from "@/lib/mockStorage";
import { supabase } from "@/lib/supabase/client";

interface TallyWebhookPayload {
  eventId: string;
  eventType: string;
  createdAt: string;
  data: {
    submissionId: string;
    formId: string;
    formName: string;
    responseId: string;
    responderId: string | null;
    createdAt: string;
    fields: Array<{
      key: string;
      label: string;
      type: string;
      value: unknown;
    }>;
  };
}

function parseTallyFields(
  fields: TallyWebhookPayload["data"]["fields"]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.value !== undefined && field.value !== null) {
      result[field.key] = field.value;
    }
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object" || !body.eventType || !body.data) {
      return NextResponse.json(
        { error: "Invalid Tally webhook payload" },
        { status: 400 }
      );
    }

    const payload = body as TallyWebhookPayload;
    const flattenedData = parseTallyFields(payload.data.fields);

    const submissionData = {
      eventId: payload.eventId,
      eventType: payload.eventType,
      formId: payload.data.formId,
      formName: payload.data.formName,
      responseId: payload.data.responseId,
      submittedAt: payload.data.createdAt,
      ...flattenedData,
    };

    // 1. Write to Supabase (if configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error: dbError } = await supabase
        .from("onboarding_submissions")
        .insert([submissionData]);

      if (dbError) {
        console.warn("Supabase write fallback to local buffer:", dbError.message);
      }
    }

    // 2. Dual-write buffer (local failover log)
    await saveSubmission("tally_webhook" as Parameters<typeof saveSubmission>[0], submissionData);

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("Tally webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

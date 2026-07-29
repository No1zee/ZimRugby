import { NextResponse } from "next/server";
import { z } from "zod";
import { saveSubmission } from "@/lib/mockStorage";
import { supabase } from "@/lib/supabase/client";

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  role: z.enum(["player", "coach", "referee", "club-registrar"]),
  organization: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ actor: string }> }) {
  try {
    const { actor } = await params;
    const body = await req.json();

    const result = onboardingSchema.safeParse({ ...body, role: actor });
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const payload = {
      ...result.data,
      submittedAt: new Date().toISOString(),
    };

    // 1. Write to Supabase table
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from("onboarding_submissions").insert([payload]);
    }

    // 2. Dual-write fallback
    await saveSubmission(`onboarding_${actor}` as Parameters<typeof saveSubmission>[0], payload);

    return NextResponse.json({
      success: true,
      message: `Registration for ${actor} submitted successfully!`,
      data: payload,
    });
  } catch (error) {
    console.error("Onboarding submission error:", error);
    return NextResponse.json(
      { error: "Failed to process onboarding request." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { saveSubmission } from "@/lib/mockStorage";
import { supabase } from "@/lib/supabase/client";

// In-memory rate limiting shield: max 5 submissions per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (record.count >= 5) {
    return false;
  }
  record.count += 1;
  return true;
}

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email required").max(150),
  phone: z.string().max(30).optional(),
  role: z.enum(["player", "coach", "referee", "club-registrar"]),
  organization: z.string().max(150).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ actor: string }> }) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submission attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }

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

    // Write to Supabase table
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error: dbError } = await supabase.from("onboarding_submissions").insert([payload]);
      if (dbError) {
        console.warn("Supabase onboarding insert warning:", dbError.message);
      }
    }

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

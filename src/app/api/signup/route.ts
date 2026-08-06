import { NextResponse } from "next/server";
import { z } from "zod";
import { saveSubmission } from "@/lib/mockStorage";
import { supabase } from "@/lib/supabase/client";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["fan", "player", "coach", "referee", "club-registrar"]),
  organization: z.string().optional(),
}).refine(data => {
  if (data.role !== "fan" && (!data.organization || data.organization.length < 2)) {
    return false;
  }
  return true;
}, {
  message: "Organization/Club is required for official roles",
  path: ["organization"]
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const payload = {
      fullName: result.data.fullName,
      email: result.data.email,
      phone: result.data.phone || "",
      role: result.data.role,
      organization: result.data.organization || "ZRU Fan Club",
      submittedAt: new Date().toISOString(),
    };

    // 1. Save to Supabase (if active)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from("onboarding_submissions").insert([payload]);
    }

    // 2. Save to Directus CMS (if active)
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/onboarding_submissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (directusError) {
        console.error("Failed to write to Directus onboarding_submissions collection:", directusError);
      }
    }

    // 3. Save to Local MockStorage Fallback
    await saveSubmission(`onboarding_${result.data.role}` as any, payload);

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully!",
      data: payload,
    });
  } catch (error) {
    console.error("Signup onboarding API error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration." },
      { status: 500 }
    );
  }
}

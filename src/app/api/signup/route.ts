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
  cdpaConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to data processing under Zimbabwe CDPA 2021",
  }),
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

    const fanMember = {
      name: result.data.fullName,
      email: result.data.email,
      cdpa_consent: result.data.cdpaConsent,
      registered_at: new Date().toISOString(),
    };

    // 1. Save to Supabase (if active) — everyone who signs up is a fan,
    //    so they land in the Fan Zone registry; the role/org detail is
    //    kept in onboarding_submissions for the Enquiries tab.
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error: fanError } = await supabase.from("fan_zone_members").insert([fanMember]);
      if (fanError) {
        console.warn("Fan Zone registry write failed:", fanError.message);
      }
      const { error: onbError } = await supabase.from("onboarding_submissions").insert([payload]);
      if (onbError) {
        console.warn("onboarding_submissions Supabase write failed (table may not exist):", onbError.message);
      }
    }

    // 2. Save to Directus CMS (if active) — snake_case fields match the
    //    production collection schema (camelCase was silently ignored).
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/onboarding_submissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.DIRECTUS_TOKEN
              ? { Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}` }
              : {}),
          },
          body: JSON.stringify({
            full_name: result.data.fullName,
            email: result.data.email,
            phone: result.data.phone || "",
            role: result.data.role,
            organization: result.data.organization || "ZRU Fan Club",
            submitted_at: new Date().toISOString(),
          }),
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

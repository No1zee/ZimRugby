import { NextResponse } from "next/server";
import { fanSignupSchema } from "@/lib/validations/fanSignup";
import { saveSubmission } from "@/lib/mockStorage";
import { supabase } from "@/lib/supabase/client";

// Simple in-memory rate limiter: max 5 requests per minute per IP
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

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = fanSignupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const memberData = {
      name: result.data.name,
      email: result.data.email,
      favorite_team: result.data.favoriteTeam,
      cdpa_consent: result.data.cdpaConsent,
      vip_code: "SABLES2027",
      registered_at: new Date().toISOString(),
    };

    // 1. Write to Supabase (if configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error: dbError } = await supabase
        .from("fan_zone_members")
        .insert([memberData]);
      
      if (dbError) {
        console.warn("Supabase write fallback to local buffer:", dbError.message);
      }
    }

    // 2. Dual-write buffer (local failover log)
    await saveSubmission("fan_zone_member", memberData);

    return NextResponse.json({
      success: true,
      message: "VIP Fan Zone registration successful!",
      vipBadge: {
        code: "SABLES2027",
        title: "VIP SABLES MEMBER PASS",
        discount: "10% OFF OFFICIAL MERCHANDISE",
      },
    });
  } catch (error) {
    console.error("Error in Fan Zone registration:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

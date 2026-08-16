import { NextResponse } from "next/server";
import { getActiveCampaigns } from "@/lib/api/campaigns";

export async function GET() {
  try {
    const data = await getActiveCampaigns();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Failed to fetch campaigns in API handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

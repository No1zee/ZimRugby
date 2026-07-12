import { NextResponse } from "next/server";
import { getAnnouncements } from "@/lib/api/announcements";

export async function GET() {
  try {
    const data = await getAnnouncements();
    // Cache announcements route for 60 seconds at the edge, revalidate every 60s
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Failed to fetch announcements in API handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

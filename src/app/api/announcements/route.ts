import { NextResponse } from "next/server";
import { getAnnouncements } from "@/lib/api/announcements";

export async function GET() {
  try {
    const data = await getAnnouncements();
    // Cache announcements route at the edge, revalidate on demand or every hour
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
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

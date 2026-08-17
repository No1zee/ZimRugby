import { NextResponse } from "next/server";
import { getCalendarOccurrences } from "@/lib/calendar/occurrences";
import { generateCalendarIcs } from "@/lib/calendar/ics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const occurrences = await getCalendarOccurrences();
    const icsContent = generateCalendarIcs(occurrences);

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="zimrugby-calendar.ics"',
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate iCal feed", details: String(error) },
      { status: 500 }
    );
  }
}
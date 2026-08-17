import { NextResponse } from "next/server";
import { getCalendarOccurrences } from "@/lib/calendar/occurrences";
import { generateCalendarIcs } from "@/lib/calendar/ics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const occurrences = await getCalendarOccurrences();
    const icsContent = generateCalendarIcs(occurrences);

    return new NextResponse(icsContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="zimrugby_calendar.ics"',
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Failed to generate ICS calendar:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
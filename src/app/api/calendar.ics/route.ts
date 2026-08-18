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
        // Short CDN TTL: the Directus revalidate flow purges the fetch cache,
        // but revalidateTag can't reach the edge cache of this force-dynamic
        // route — s-maxage bounds how long cancels/schedule changes linger.
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate iCal feed", details: String(error) },
      { status: 500 }
    );
  }
}
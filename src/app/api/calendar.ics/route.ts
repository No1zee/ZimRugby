import { NextResponse } from "next/server";
import { getEvents } from "@/lib/api/events";

export async function GET() {
  try {
    const events = await getEvents();
    
    let icsLines: string[] = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Zimbabwe Rugby Union//Master Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Zimbabwe Rugby Union Calendar",
      "X-WR-TIMEZONE:Africa/Harare",
    ];

    for (const ev of events) {
      if (!ev.date) continue;

      // Format date to YYYYMMDD
      const dateParts = ev.date.match(/(\d{4})-(\d{2})-(\d{2})/);
      let dtStart = "";
      if (dateParts) {
        dtStart = `${dateParts[1]}${dateParts[2]}${dateParts[3]}`;
      } else {
        const d = new Date(ev.date);
        if (!isNaN(d.getTime())) {
          dtStart = d.toISOString().replace(/[-:]/g, "").split("T")[0];
        }
      }

      if (!dtStart) continue;

      const summary = ev.title.replace(/,/g, "\\,").replace(/\n/g, " ");
      const description = (ev.description || ev.subtitle || "").replace(/,/g, "\\,").replace(/\n/g, " ");
      const location = (ev.location || "").replace(/,/g, "\\,").replace(/\n/g, " ");

      icsLines.push(
        "BEGIN:VEVENT",
        `UID:zru-event-${ev.id}@zimrugby.org`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `DTSTART;VALUE=DATE:${dtStart}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
    }

    icsLines.push("END:VCALENDAR");

    const icsContent = icsLines.join("\r\n");

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

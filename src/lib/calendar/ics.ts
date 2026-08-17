import type { CalendarOccurrence } from "@/lib/calendar/occurrences";
import { toCatWallTime } from "@/lib/calendar/occurrences";

/**
 * Single RFC 5545 ICS generator — the one calendar feed for the whole site.
 * Both /api/calendar and /api/calendar.ics serve this output; all surfaces
 * subscribe to the same occurrence stream.
 */

const CRLF = "\r\n";

function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** YYYYMMDDTHHmmssZ from a UTC ISO string. */
function utcStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** All-day DTSTART/VALUE=DATE:YYYYMMDD (Africa/Harare date). */
function dateValue(iso: string): string {
  return toCatWallTime(iso).date.replace(/-/g, "");
}

/** Local wall-clock stamp YYYYMMDDTHHmmss in Africa/Harare. */
function localStamp(iso: string): string {
  const wall = toCatWallTime(iso);
  const [date, time] = [wall.date.replace(/-/g, ""), wall.time.replace(":", "")];
  return `${date}T${time}00`;
}

function fold(line: string): string {
  return line.length <= 73 ? line : line.slice(0, 73) + CRLF + " " + line.slice(73);
}

function statusLine(status: string): string {
  switch (status) {
    case "tentative":
      return "STATUS:TENTATIVE";
    case "cancelled":
      return "STATUS:CANCELLED";
    default:
      return "STATUS:CONFIRMED";
  }
}

export function generateCalendarIcs(occurrences: CalendarOccurrence[]): string {
  const now = utcStamp(new Date().toISOString());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Zimbabwe Rugby Union//Calendar SSoT//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Zimbabwe Rugby Union Calendar",
    "X-WR-TIMEZONE:Africa/Harare",
    "X-WR-CALDESC:Official matches, events, announcements and campaigns for the Zimbabwe Rugby Union",
  ];

  for (const occ of occurrences) {
    const wall = toCatWallTime(occ.startsAt);
    if (!wall.date) continue;

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${occ.uid}`);
    lines.push(`DTSTAMP:${now}`);
    lines.push(`SEQUENCE:${occ.sequence || 0}`);
    lines.push(statusLine(occ.status));

    if (occ.allDay) {
      lines.push(`DTSTART;VALUE=DATE:${dateValue(occ.startsAt)}`);
      if (occ.endsAt) {
        lines.push(`DTEND;VALUE=DATE:${dateValue(occ.endsAt)}`);
      }
    } else {
      lines.push(`DTSTART;TZID=Africa/Harare:${localStamp(occ.startsAt)}`);
      if (occ.endsAt) {
        lines.push(`DTEND;TZID=Africa/Harare:${localStamp(occ.endsAt)}`);
      }
    }

    lines.push(`SUMMARY:${escapeIcs(occ.title)}`);

    if (occ.subtitle) lines.push(`CATEGORIES:${escapeIcs(occ.subtitle)}`);

    if (occ.venue) lines.push(`LOCATION:${escapeIcs(occ.venue)}`);

    const descriptionParts: string[] = [];
    if (occ.subtitle) descriptionParts.push(occ.subtitle);
    if (occ.source !== "event") descriptionParts.push(`Type: ${occ.source.toUpperCase()}`);
    if (occ.badge) descriptionParts.push(`Round: ${occ.badge}`);
    if (occ.description) descriptionParts.push(occ.description);
    if (occ.scope && occ.scope.length > 0) descriptionParts.push(`Scope: ${occ.scope.join(", ")}`);
    if (descriptionParts.length > 0) {
      lines.push(`DESCRIPTION:${escapeIcs(descriptionParts.join("\\n"))}`);
    }

    if (occ.href) lines.push(`URL:${escapeIcs(occ.href)}`);

    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.map(fold).join(CRLF) + CRLF;
}

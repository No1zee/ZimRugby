/**
 * Shared event-status derivation for the Events calendar.
 *
 * Editors only provide a date + optional time. The system derives a
 * "live" status from the clock at render time — no cron, no DB writes —
 * so an event is automatically Upcoming -> Today -> Completed as time
 * passes. One-off events only (no recurrence).
 */

export type DerivedEventStatus = "upcoming" | "ongoing" | "completed";

export function deriveEventStatus(
  dateIso: string | null | undefined,
  time: string | null | undefined,
  now: Date = new Date()
): DerivedEventStatus {
  if (!dateIso) return "upcoming";

  // Accept "YYYY-MM-DD" (Directus date) or a full ISO timestamp.
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateIso);
  if (!dateMatch) return "upcoming";

  const [, year, month, day] = dateMatch.map((v) => Number(v));

  let hour = 0;
  let minute = 0;
  if (time) {
    const timeMatch = /^(\d{1,2}):(\d{2})/.exec(time);
    if (timeMatch) {
      hour = Number(timeMatch[1]);
      minute = Number(timeMatch[2]);
    }
  }

  const start = new Date(year, month - 1, day, hour, minute);
  if (isNaN(start.getTime())) return "upcoming";

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventEnd = new Date(start);
  // Treat the event as "ongoing" for the whole day it starts on — we only
  // have a start date/time, no duration.
  eventEnd.setDate(start.getDate() + 1);

  if (now < start) return "upcoming";
  if (now < eventEnd) return "ongoing";
  return "completed";
}

export function derivedStatusLabel(status: DerivedEventStatus): string {
  switch (status) {
    case "ongoing":
      return "Today";
    case "completed":
      return "Completed";
    default:
      return "Upcoming";
  }
}

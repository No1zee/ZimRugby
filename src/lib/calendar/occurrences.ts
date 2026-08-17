import { directusFetch } from "@/lib/directus/fetch";
import type { Announcements as DirectusAnnouncement } from "@/types/directus-generated";

/**
 * Calendar SSoT — unified occurrence stream.
 *
 * Every scheduled surface (Master Calendar, ICS feeds, upcoming fixtures,
 * announcement windows, campaign windows) subscribes to getCalendarOccurrences().
 * Matches stay in `matches`; standalone events get rows in `event_occurrences`;
 * announcement/campaign date windows are derived at read time. Nothing is
 * duplicated across collections.
 */

export type OccurrenceSource = "event" | "match" | "announcement" | "campaign";
export type OccurrenceStatus = "confirmed" | "tentative" | "cancelled";

export interface CalendarOccurrence {
  /** Stable ICS UID — never changes for the same underlying record. */
  uid: string;
  source: OccurrenceSource;
  sourceId: string | number;
  /** Id of the parent record (event id / match id / announcement id / campaign id). */
  parentId: string | number;
  title: string;
  subtitle?: string;
  /** UTC ISO instant. */
  startsAt: string;
  /** UTC ISO instant, optional. */
  endsAt?: string | null;
  allDay: boolean;
  /** IANA timezone the local wall-clock time is expressed in. */
  timezone: string;
  venue?: string | null;
  location?: string | null;
  description?: string;
  status: OccurrenceStatus;
  /** ICS SEQUENCE — bumped when an occurrence is edited/cancelled. */
  sequence: number;
  href?: string;
  badge?: string;
  scope?: string[];
}

export const CAT_TZ = "Africa/Harare";

export interface CatWallTime {
  /** YYYY-MM-DD in Africa/Harare. */
  date: string;
  /** HH:mm in Africa/Harare ("" when the instant is null). */
  time: string;
}

const catDateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: CAT_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const catTimeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: CAT_TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Convert a UTC ISO instant to Africa/Harare wall-clock parts. */
export function toCatWallTime(iso: string | null | undefined): CatWallTime {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: "", time: "" };
  return {
    date: catDateFmt.format(d),
    time: catTimeFmt.format(d).replace("24:", "00:"),
  };
}

/**
 * Treat a naive `kickoff_at` (no zone) as Africa/Harare local and return the
 * true UTC instant. Explicitly-zoned values pass through untouched.
 */
export function kickoffToUtc(naive: string): string {
  if (!naive) return "";
  if (/[zZ]$/.test(naive) || /[+-]\d{2}:?\d{2}$/.test(naive)) {
    const d = new Date(naive);
    return isNaN(d.getTime()) ? "" : d.toISOString();
  }
  const d = new Date(`${naive}+02:00`);
  return isNaN(d.getTime()) ? "" : d.toISOString();
}

interface DirectusOccurrence {
  id: number;
  event_id: number | null;
  starts_at: string | null;
  ends_at: string | null;
  all_day?: boolean;
  venue_id?: string | null;
  status?: string;
  sequence?: number;
  note?: string | null;
}

interface DirectusEvent {
  id: number;
  title: string;
  subtitle?: string | null;
  location?: string | null;
  description?: string | null;
  event_type?: string | null;
  timezone?: string | null;
  visibility?: string | null;
  status?: string | null;
}

interface DirectusMatch {
  id: string;
  slug: string;
  kickoff_at: string | null;
  status?: string | null;
  team_id?: string | null;
  opponent_id?: string | null;
  competition_id?: string | null;
  venue_id?: string | null;
  round_label?: string | null;
  home_or_away?: string | null;
  title?: string | null;
  display_time_label?: string | null;
  ticket_url?: string | null;
}

interface DirectusCampaign {
  id: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
  status?: string | null;
}

interface DirectusVenue {
  id: string;
  name: string;
  city?: string | null;
}

const OCCURRENCE_FIELDS = [
  "id",
  "event_id",
  "starts_at",
  "ends_at",
  "all_day",
  "venue_id",
  "status",
  "sequence",
  "note",
] as const;

/** Run a fetcher and return [] on failure so one broken source can't kill the calendar. */
async function safe<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn();
  } catch (err) {
    console.warn("[calendar] source fetch failed, skipping:", err);
    return [];
  }
}

/**
 * Merge every scheduled record into one sorted occurrence stream.
 *
 * Sources:
 *  - events        → event_occurrences rows (only published, public events)
 *  - matches       → kickoff_at (stays authoritative in `matches`)
 *  - announcements → date windows (starts_at/ends_at), non-ticker
 *  - campaigns     → start_date/end_date windows
 */
export async function getCalendarOccurrences(): Promise<CalendarOccurrence[]> {
  const [occurrences, events, rawMatches, announcements, campaigns, venues, teams, opponents, competitions] =
    await Promise.all([
      safe(() =>
        directusFetch<DirectusOccurrence>("event_occurrences", {
          fields: [...OCCURRENCE_FIELDS],
          sort: ["starts_at"],
        })
      ),
      safe(() =>
        directusFetch<DirectusEvent>("events", {
          fields: ["id", "title", "subtitle", "location", "description", "event_type", "timezone", "visibility", "status"],
        })
      ),
      safe(() =>
        directusFetch<DirectusMatch>("matches", {
          fields: ["id", "slug", "kickoff_at", "status", "team_id", "opponent_id", "competition_id", "venue_id", "round_label", "home_or_away", "title", "display_time_label", "ticket_url"],
          sort: ["kickoff_at"],
        })
      ),
      safe(() =>
        directusFetch<DirectusAnnouncement>("announcements", {
          fields: ["id", "title", "starts_at", "ends_at", "badge", "scope", "design_variant", "is_enabled", "status"],
        })
      ),
      safe(() =>
        directusFetch<DirectusCampaign>("campaigns", {
          fields: ["id", "name", "start_date", "end_date", "status"],
        })
      ),
      safe(() =>
        directusFetch<DirectusVenue>("venues", {
          fields: ["id", "name", "city"],
        })
      ),
      safe(() =>
        directusFetch<Record<string, unknown>>("teams", { fields: ["id", "name", "short_name", "code", "filter_label"] })
      ),
      safe(() =>
        directusFetch<Record<string, unknown>>("opponents", { fields: ["id", "name", "short_name", "team_type"] })
      ),
      safe(() =>
        directusFetch<Record<string, unknown>>("competitions", { fields: ["id", "name"] })
      ),
    ]);

  const eventMap = new Map(
    events
      .filter((e) => e.status === "published" && e.visibility !== "internal")
      .map((e) => [String(e.id), e])
  );
  const venueMap = new Map(venues.map((v) => [String(v.id), v]));

  const out: CalendarOccurrence[] = [];

  // 1. Standalone events → their occurrences
  for (const occ of occurrences) {
    const event = eventMap.get(String(occ.event_id));
    if (!event) continue;
    if (!occ.starts_at) continue;
    const statusRaw = (occ.status || "confirmed") as OccurrenceStatus;
    const venue = venueMap.get(String(occ.venue_id));
    out.push({
      uid: `zru-event-${occ.id}@zimrugby.org`,
      source: "event",
      sourceId: occ.id,
      parentId: event.id,
      title: event.title,
      subtitle: event.subtitle || undefined,
      startsAt: occ.starts_at,
      endsAt: occ.ends_at,
      allDay: !!occ.all_day,
      timezone: event.timezone || CAT_TZ,
      venue: venue?.name || event.location || null,
      location: venue && venue.city ? `${venue.name}, ${venue.city}` : event.location || null,
      description: event.description || undefined,
      status: statusRaw,
      sequence: Number(occ.sequence || 0),
    });
  }

  // 2. Matches (authoritative in `matches`; naive kickoff_at = Africa/Harare local)
  const teamMap = new Map(teams.map((t) => [String(t.id), t]));
  const oppMap = new Map(opponents.map((o) => [String(o.id), o]));
  const compMap = new Map(competitions.map((c) => [String(c.id), c]));
  for (const m of rawMatches) {
    const startsAt = kickoffToUtc(String(m.kickoff_at || ""));
    if (!startsAt) continue;
    const isAway = m.home_or_away === "away";
    const teamName = (teamMap.get(String(m.team_id))?.name as string) || "Zimbabwe Sables";
    const oppName = (oppMap.get(String(m.opponent_id))?.name as string) || "Opponent";
    const compName = (compMap.get(String(m.competition_id))?.name as string) || "Match";
    const venue = venueMap.get(String(m.venue_id));
    const cancelled = m.status === "cancelled";
    out.push({
      uid: `zru-match-${m.id}@zimrugby.org`,
      source: "match",
      sourceId: m.id,
      parentId: m.id,
      title: m.title || `${isAway ? `${teamName} @ ${oppName}` : `${teamName} vs ${oppName}`}`,
      subtitle: compName,
      startsAt,
      allDay: false,
      timezone: CAT_TZ,
      venue: venue?.name || null,
      location: venue && venue.city ? `${venue.name}, ${venue.city}` : venue?.name || null,
      description: `Official ${compName} fixture${m.round_label ? ` — ${m.round_label}` : ""}.`,
      status: cancelled ? "cancelled" : "confirmed",
      sequence: cancelled ? 1 : 0,
      badge: m.round_label || undefined,
      href: `/match-centre`,
    });
  }

  // 3. Announcement windows (skip tickers — those are marquee notices, not calendar items)
  for (const a of announcements) {
    if (a.design_variant === "ticker") continue;
    if (!a.starts_at) continue;
    if (a.is_enabled === false) continue;
    if (a.status && a.status !== "published") continue;
    const scopeRaw = a.scope;
    const scope = Array.isArray(scopeRaw) ? scopeRaw : typeof scopeRaw === "string" ? scopeRaw.split(",") : [];
    out.push({
      uid: `zru-announcement-${a.id}@zimrugby.org`,
      source: "announcement",
      sourceId: a.id || 0,
      parentId: a.id || 0,
      title: a.title || `Announcement ${a.id}`,
      startsAt: a.starts_at,
      endsAt: a.ends_at,
      allDay: true,
      timezone: CAT_TZ,
      status: "confirmed",
      sequence: 0,
      badge: a.badge || a.design_variant || undefined,
      scope,
    });
  }

  // 4. Campaign windows
  for (const c of campaigns) {
    if (c.status !== "published") continue;
    if (!c.start_date) continue;
    out.push({
      uid: `zru-campaign-${c.id}@zimrugby.org`,
      source: "campaign",
      sourceId: c.id,
      parentId: c.id,
      title: c.name,
      startsAt: c.start_date,
      endsAt: c.end_date,
      allDay: true,
      timezone: CAT_TZ,
      status: "confirmed",
      sequence: 0,
      badge: "CAMPAIGN",
      href: `/campaigns/${c.name}`,
    });
  }

  return out.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

/** Occurrences that fall on a given calendar day (YYYY-MM-DD, Africa/Harare). */
export function occurrencesOnDay(
  occurrences: CalendarOccurrence[],
  day: string
): CalendarOccurrence[] {
  return occurrences.filter((o) => {
    const start = toCatWallTime(o.startsAt).date;
    const end = o.endsAt ? toCatWallTime(o.endsAt).date : start;
    return day >= start && day <= end;
  });
}

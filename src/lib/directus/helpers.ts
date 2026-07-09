import { Match } from "@/types";

/**
 * Shared helpers for the `src/lib/api/*` data-access layer.
 *
 * Every API module follows the same shape: expose typed mock/fallback data and,
 * when a Directus instance is configured, try to load real data and gracefully
 * fall back to the mock on error. These utilities centralise that behaviour so
 * the individual modules only describe their query and field mapping.
 */

/** Base URL of the configured Directus instance, if any. */
export const directusUrl = () => process.env.NEXT_PUBLIC_DIRECTUS_URL;

/**
 * Build a fully-qualified Directus asset URL from an asset id.
 * Returns `undefined` when no id is provided so callers can fall back with `??`.
 */
export function directusAsset(assetId?: string | null): string | undefined {
  if (!assetId) return undefined;
  return `${directusUrl()}/assets/${assetId}`;
}

/**
 * Run a Directus-backed loader, falling back to `fallback` when Directus is not
 * configured, the loader yields no usable data (`null`/`undefined`), or it throws.
 *
 * `fallback` may be a value or a (possibly async) factory so callers can defer
 * building expensive mock data until it is actually needed. The loader should
 * return `null` to signal "no data, use the fallback".
 */
export async function fetchFromDirectus<T>(
  loader: () => Promise<T | null | undefined>,
  fallback: T | (() => T | Promise<T>),
  context: string,
): Promise<T> {
  const resolveFallback = () =>
    typeof fallback === "function" ? (fallback as () => T | Promise<T>)() : fallback;

  if (!directusUrl()) return resolveFallback();

  try {
    const result = await loader();
    return result ?? resolveFallback();
  } catch (error) {
    console.warn(`Directus fetch failed for ${context}, falling back to mock data:`, error);
    return resolveFallback();
  }
}

/** Format a date as a short, uppercased `DD MMM YYYY` label (e.g. `27 JUL 2025`). */
export function formatShortDate(date: string | number | Date): string {
  return new Date(date)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

/** Format a date as a `DD MMM YYYY` label without changing case (e.g. `27 Jul 2025`). */
export function formatDayMonthYear(date: string | number | Date): string {
  return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/** Format a date as a long `D Month YYYY` label (e.g. `27 July 2025`). */
export function formatLongDate(date: string | number | Date): string {
  return new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

/** Format a date as a 24-hour `HH:mm` time label. */
export function formatTime(date: string | number | Date): string {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

/** Shape of a Directus `matches` collection item. */
export interface DirectusMatchItem {
  id: string | number;
  competition?: string;
  round?: string;
  date: string;
  date_label?: string;
  time?: string;
  venue?: string;
  home_team_name?: string;
  home_team_logo?: string;
  home_team_score?: number | null;
  away_team_name?: string;
  away_team_logo?: string;
  away_team_score?: number | null;
  status: string;
  category?: string;
}

/** Map a raw Directus match item into the app's `Match` shape. */
export function mapDirectusMatch(m: DirectusMatchItem): Match {
  return {
    id: String(m.id),
    competition: m.competition || "International Match",
    round: m.round || "Standard",
    date: m.date_label || formatLongDate(m.date),
    time: m.time || formatTime(m.date),
    venue: m.venue || "TBA",
    homeTeam: {
      name: m.home_team_name || "Zimbabwe Sables",
      logo: directusAsset(m.home_team_logo),
      score: m.home_team_score !== null ? Number(m.home_team_score) : undefined,
    },
    awayTeam: {
      name: m.away_team_name || "Opponent",
      logo: directusAsset(m.away_team_logo),
      score: m.away_team_score !== null ? Number(m.away_team_score) : undefined,
    },
    status: m.status as Match["status"],
    category: m.category || "Sables",
  };
}

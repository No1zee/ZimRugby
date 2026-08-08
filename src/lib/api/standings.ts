import { directusFetch } from "@/lib/directus/fetch";

export interface StandingsRow {
  id: string;
  table_id: string;
  team_ref?: string | null;
  team_name: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points_for: number;
  points_against: number;
  points_difference: number;
  bonus_points: number;
  table_points: number;
  form?: string;
}

export interface StandingsTable {
  id: string;
  title: string;
  slug: string;
  competition_id?: string;
  season_year?: number;
  notes?: string | null;
  is_active?: number | boolean;
  rows?: StandingsRow[];
}

// ----- Fallback static data -----
const fallbackRows: StandingsRow[] = [
  { id: "f1", table_id: "fb", team_name: "Namibia",  position: 1, played: 3, won: 3, drawn: 0, lost: 0, points_for: 92, points_against: 28,  points_difference: 64,  bonus_points: 3, table_points: 15, form: "WWW" },
  { id: "f2", table_id: "fb", team_name: "Zimbabwe", position: 2, played: 3, won: 2, drawn: 0, lost: 1, points_for: 74, points_against: 42,  points_difference: 32,  bonus_points: 2, table_points: 10, form: "WLW" },
  { id: "f3", table_id: "fb", team_name: "Kenya",    position: 3, played: 3, won: 1, drawn: 0, lost: 2, points_for: 55, points_against: 60,  points_difference: -5,  bonus_points: 1, table_points: 5,  form: "LLW" },
  { id: "f4", table_id: "fb", team_name: "Algeria",  position: 4, played: 3, won: 0, drawn: 0, lost: 3, points_for: 18, points_against: 109, points_difference: -91, bonus_points: 0, table_points: 0,  form: "LLL" },
];

const fallbackTable: StandingsTable = {
  id: "fb",
  title: "Rugby Africa Cup 2026 Standings",
  slug: "rugby-africa-cup-2026-standings",
  season_year: 2026,
  is_active: true,
  rows: fallbackRows,
};

/**
 * Fetch the active standings table plus its rows from Directus.
 */
export async function getActiveStandingsTable(): Promise<StandingsTable | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackTable;

    const tables = await directusFetch<StandingsTable>("standings_tables", {
      filter: { status: { _eq: "published" }, is_active: { _eq: true } },
      sort: ["-season_year"],
      limit: 1,
    });

    const table = tables?.[0];
    if (!table) return fallbackTable;

    const rows = await directusFetch<StandingsRow>("standings_rows", {
      filter: { table_id: { _eq: table.id } },
      sort: ["position"],
      limit: 50,
    });

    return { ...table, rows: rows && rows.length > 0 ? rows : fallbackRows };
  } catch {
    console.warn("Failed to fetch standings from Directus, using fallback");
    return fallbackTable;
  }
}

/**
 * Fetch standings table by slug.
 */
export async function getStandingsBySlug(slug: string): Promise<StandingsTable | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      return slug === fallbackTable.slug ? fallbackTable : null;
    }

    const tables = await directusFetch<StandingsTable>("standings_tables", {
      filter: { slug: { _eq: slug }, status: { _eq: "published" } },
      limit: 1,
    });

    const table = tables?.[0];
    if (!table) return null;

    const rows = await directusFetch<StandingsRow>("standings_rows", {
      filter: { table_id: { _eq: table.id } },
      sort: ["position"],
      limit: 50,
    });

    return { ...table, rows: rows ?? [] };
  } catch {
    return null;
  }
}

/**
 * List all published standings tables.
 */
export async function getAllStandingsTables(): Promise<StandingsTable[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return [fallbackTable];

    const tables = await directusFetch<StandingsTable>("standings_tables", {
      filter: { status: { _eq: "published" } },
      sort: ["-season_year"],
      limit: 20,
    });

    return tables && tables.length > 0 ? tables : [fallbackTable];
  } catch {
    return [fallbackTable];
  }
}

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

/**
 * Fetch the active standings table plus its rows from Directus.
 */
export async function getActiveStandingsTable(): Promise<StandingsTable | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return null;

    const tables = await directusFetch<StandingsTable>("standings_tables", {
      filter: { status: { _eq: "published" }, is_active: { _eq: true }, deleted_at: { _null: true } },
      sort: ["-season_year"],
      limit: 1,
    });

    const table = tables?.[0];
    if (!table) return null;

    const rows = await directusFetch<StandingsRow>("standings_rows", {
      filter: { table_id: { _eq: table.id } },
      sort: ["position"],
      limit: 50,
    });

    return { ...table, rows: rows || [] };
  } catch (error) {
    console.warn("Failed to fetch standings from Directus:", error);
    return null;
  }
}

/**
 * Fetch standings table by slug.
 */
export async function getStandingsBySlug(slug: string): Promise<StandingsTable | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return null;

    const tables = await directusFetch<StandingsTable>("standings_tables", {
      filter: { slug: { _eq: slug }, status: { _eq: "published" }, deleted_at: { _null: true } },
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
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return [];

    const tables = await directusFetch<StandingsTable>("standings_tables", {
      filter: { status: { _eq: "published" }, deleted_at: { _null: true } },
      sort: ["-season_year"],
      limit: 20,
    });

    return tables || [];
  } catch {
    return [];
  }
}

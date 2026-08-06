import { directusFetch } from "@/lib/directus/fetch";

export type FixtureStatus =
  | "ON_SALE"
  | "COMING_SOON"
  | "SOLD_OUT"
  | "CANCELLED"
  | "POSTPONED"
  | "ENDED";

export interface Fixture {
  id: string;
  competition: string;
  teams: string;
  date: string;
  time: string;
  venue: string;
  city?: string;
  status: FixtureStatus;
  url?: string;
  tags?: string[];
  category?: string;
  isWorldCupPathway?: boolean;
}

interface DirectusFixtureItem {
  id: string | number;
  competition: string;
  teams: string;
  date: string;
  time: string;
  venue: string;
  city?: string;
  status: string;
  url?: string;
  tags?: string[];
  category?: string;
  is_world_cup_pathway?: boolean;
}

export async function getFixtures(): Promise<Fixture[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const items = await directusFetch<DirectusFixtureItem>(
        "tickets",
        { sort: ["date"], limit: 50 },
        300
      );

      if (items && items.length > 0) {
        return items.map((item) => ({
          id: String(item.id),
          competition: item.competition || "",
          teams: item.teams || "",
          date: item.date || "",
          time: item.time || "",
          venue: item.venue || "",
          city: item.city || undefined,
          status: (item.status as FixtureStatus) || "COMING_SOON",
          url: item.url || undefined,
          tags: item.tags || undefined,
          category: item.category || undefined,
          isWorldCupPathway: Boolean(item.is_world_cup_pathway),
        }));
      }
    }
  } catch (error) {
    console.error("Error fetching fixtures from Directus:", error);
  }

  return [];
}

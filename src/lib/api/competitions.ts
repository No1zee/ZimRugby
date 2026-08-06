import { directusFetch } from "@/lib/directus/fetch";
import { assetUrl } from "@/lib/directus/assets";

export interface Competition {
  id: string;
  name: string;
  short_name?: string;
  slug?: string;
  competition_type?: string;
  season_label?: string;
  governing_body?: string;
  logo?: string;
  description?: string;
  is_standings_enabled?: boolean;
}

const fallbackCompetitions: Competition[] = [
  { id: "1", name: "Rugby Africa Cup 2026", short_name: "Africa Cup", slug: "rugby-africa-cup-2026", competition_type: "cup", season_label: "2026", description: "Africa's premier rugby union competition featuring the continent's top national teams." },
  { id: "2", name: "Victoria Cup", short_name: "Victoria Cup", slug: "victoria-cup", competition_type: "tournament", season_label: "2026", description: "Annual East African rugby tournament contested between Zimbabwe, Uganda, and Kenya." },
  { id: "3", name: "Battle of the Zambezi", short_name: "Zambezi Cup", slug: "battle-of-the-zambezi", competition_type: "test", season_label: "2026", description: "The historic cross-border test series between Zimbabwe and Zambia." },
];

export async function getCompetitions(): Promise<Competition[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackCompetitions;

    const comps = await directusFetch<Competition>("competitions", {
      filter: { status: { _eq: "published" } },
      sort: ["sort"],
      limit: 20,
    });

    if (comps && comps.length > 0) {
      return comps.map(c => ({
        ...c,
        logo: assetUrl(c.logo ?? undefined) || c.logo,
      }));
    }

    return fallbackCompetitions;
  } catch {
    return fallbackCompetitions;
  }
}

export async function getCompetitionBySlug(slug: string): Promise<Competition | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackCompetitions.find(c => c.slug === slug) || null;

    const comps = await directusFetch<Competition>("competitions", {
      filter: { slug: { _eq: slug }, status: { _eq: "published" } },
      limit: 1,
    });

    if (comps && comps.length > 0) {
      return { ...comps[0], logo: assetUrl(comps[0].logo ?? undefined) || comps[0].logo };
    }

    return fallbackCompetitions.find(c => c.slug === slug) || null;
  } catch {
    return fallbackCompetitions.find(c => c.slug === slug) || null;
  }
}
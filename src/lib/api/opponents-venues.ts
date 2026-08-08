import { directusFetch } from "@/lib/directus/fetch";
import { assetUrl } from "@/lib/directus/assets";

export interface Opponent {
  id: string;
  name: string;
  short_name?: string;
  slug?: string;
  code?: string;
  country?: string | null;
  crest?: string | null;
  team_type?: string | null;
}

export interface Venue {
  id: string;
  name: string;
  slug?: string;
  city?: string;
  region?: string | null;
  country?: string;
  full_label?: string | null;
  google_maps_url?: string | null;
  timezone?: string | null;
  capacity?: number | null;
  address?: string | null;
}

// ----- Fallbacks -----
const fallbackOpponents: Opponent[] = [
  { id: "opp-ken", name: "Kenya Simbas",    short_name: "Kenya",   code: "KEN", slug: "kenya-simbas"    },
  { id: "opp-nam", name: "Namibia",         short_name: "Namibia", code: "NAM", slug: "namibia"         },
  { id: "opp-uga", name: "Uganda Cricket",  short_name: "Uganda",  code: "UGA", slug: "uganda"          },
  { id: "opp-sam", name: "Zambia",          short_name: "Zambia",  code: "ZAM", slug: "zambia"          },
];

const fallbackVenues: Venue[] = [
  { id: "ven-hsc", name: "Harare Sports Club", city: "Harare", country: "Zimbabwe" },
  { id: "ven-pe",  name: "Prince Edward Grounds", city: "Harare", country: "Zimbabwe" },
];

// ----- API functions -----

export async function getOpponents(): Promise<Opponent[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackOpponents;

    const items = await directusFetch<Opponent>("opponents", {
      filter: { status: { _eq: "published" } },
      sort: ["name"],
      limit: 100,
    });

    if (!items || items.length === 0) return fallbackOpponents;

    return items.map(o => ({
      ...o,
      crest: o.crest ? assetUrl(o.crest) || o.crest : undefined,
    }));
  } catch {
    return fallbackOpponents;
  }
}

export async function getOpponentBySlug(slug: string): Promise<Opponent | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      return fallbackOpponents.find(o => o.slug === slug) ?? null;
    }

    const items = await directusFetch<Opponent>("opponents", {
      filter: { slug: { _eq: slug }, status: { _eq: "published" } },
      limit: 1,
    });

    const o = items?.[0];
    if (!o) return null;

    return { ...o, crest: o.crest ? assetUrl(o.crest) || o.crest : undefined };
  } catch {
    return null;
  }
}

export async function getVenues(): Promise<Venue[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackVenues;

    const items = await directusFetch<Venue>("venues", {
      filter: { status: { _eq: "published" } },
      sort: ["name"],
      limit: 100,
    });

    return items && items.length > 0 ? items : fallbackVenues;
  } catch {
    return fallbackVenues;
  }
}

export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      return fallbackVenues.find(v => v.slug === slug) ?? null;
    }

    const items = await directusFetch<Venue>("venues", {
      filter: { slug: { _eq: slug }, status: { _eq: "published" } },
      limit: 1,
    });

    return items?.[0] ?? null;
  } catch {
    return null;
  }
}

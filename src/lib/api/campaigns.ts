import { directusFetch } from "@/lib/directus/fetch";

export interface CampaignPlayer {
  id: number;
  player_id: number;
  role: string;
  is_featured: boolean;
}

export interface CampaignMatch {
  id: number;
  match_id: string;
}

export interface CampaignMedia {
  id: number;
  media_asset_id: string;
  label?: string;
  type: "image" | "video" | "reel";
  sort_order: number;
  featured: boolean;
}

export interface Campaign {
  id: number;
  name: string;
  slug: string;
  subtitle?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  auto_archive?: boolean;
  priority?: number;
  hero_image?: string;
  cta_label?: string;
  cta_url?: string;
  status?: string;
  sort?: number;
  players?: CampaignPlayer[];
  matches?: CampaignMatch[];
  media?: CampaignMedia[];
  countdown_target?: string;
  items?: Record<string, unknown>;
}

const fallbackCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Road to Australia 2027",
    slug: "road-to-australia-2027",
    subtitle: "The journey to the World Cup",
    description: "The Zimbabwe Sables campaign to qualify for the 2027 Rugby World Cup in Australia. Bold, proud, and unstoppable.",
    priority: 0,
    hero_image: "edad0b11-9eab-45ca-b08c-19ffd9b7edf0",
    cta_label: "Support the Campaign",
    cta_url: "/world-cup-campaign",
    status: "published",
    sort: 1,
    auto_archive: false,
    players: [],
    matches: [],
    media: [],
  },
  {
    id: 2,
    name: "Africa Cup Tour 2026",
    slug: "africa-cup-tour-2026",
    subtitle: "Conquering the continent, one match at a time",
    description: "The Zimbabwe Sables embark on their Africa Cup campaign, facing off against the continent's best teams. Follow the journey as they battle for supremacy and Rugby World Cup qualification points.",
    start_date: "2026-05-01T00:00:00Z",
    end_date: "2026-10-31T00:00:00Z",
    priority: 10,
    hero_image: "edad0b11-9eab-45ca-b08c-19ffd9b7edf0",
    cta_label: "Follow the Tour",
    cta_url: "/campaigns/africa-cup-tour-2026",
    status: "active",
    sort: 2,
    auto_archive: true,
    players: [
      { id: 1, player_id: 1, role: "captain", is_featured: true },
      { id: 2, player_id: 2, role: "player", is_featured: true },
      { id: 3, player_id: 3, role: "player", is_featured: false },
    ],
    matches: [
      { id: 1, match_id: "2026-fixture-01" },
      { id: 2, match_id: "2026-fixture-02" },
      { id: 3, match_id: "2026-fixture-03" },
      { id: 4, match_id: "2026-fixture-07" },
      { id: 5, match_id: "2026-fixture-08" },
    ],
    media: [
      { id: 1, media_asset_id: "edad0b11-9eab-45ca-b08c-19ffd9b7edf0", label: "Africa Cup Tour 2026 - Campaign Hero", type: "image", sort_order: 1, featured: true },
      { id: 2, media_asset_id: "d74702bf-b290-4a5c-9738-01b8b7ace81c", label: "Match Day Intensity", type: "image", sort_order: 2, featured: false },
      { id: 3, media_asset_id: "edc610ba-a389-4b69-9924-3fd21c121677", label: "Team Training Session", type: "image", sort_order: 3, featured: false },
    ],
  },
  {
    id: 3,
    name: "Schools Festival 2026",
    slug: "schools-festival-2026",
    subtitle: "Building the future of Zimbabwe rugby",
    description: "The ZRU Schools Festival brings together the nation's best schoolboy rugby talent for a week of competition, coaching, and development. Scouts from top universities and academies will be in attendance.",
    start_date: "2026-08-15T00:00:00Z",
    end_date: "2026-08-22T00:00:00Z",
    priority: 7,
    hero_image: "a958c30c-5dfc-434a-9af5-48abf0c7bbd5",
    cta_label: "View Fixtures",
    cta_url: "/campaigns/schools-festival-2026",
    status: "active",
    sort: 3,
    auto_archive: true,
    players: [],
    matches: [
      { id: 6, match_id: "2026-fixture-01" },
      { id: 7, match_id: "2026-fixture-09" },
    ],
    media: [
      { id: 4, media_asset_id: "a958c30c-5dfc-434a-9af5-48abf0c7bbd5", label: "Schools Festival 2026", type: "image", sort_order: 1, featured: true },
      { id: 5, media_asset_id: "1d988817-af99-4a96-bda7-5d307263ad05", label: "Future Sables in action", type: "image", sort_order: 2, featured: false },
    ],
  },
];

export async function getActiveCampaigns(): Promise<Campaign[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackCampaigns.filter(c => c.status === "active" || c.status === "published");

    const fields = ["id", "name", "slug", "subtitle", "description", "start_date", "end_date", "auto_archive", "priority", "hero_image", "cta_label", "cta_url", "status", "sort", "players.*", "matches.*", "media.*"];

    const campaigns = await directusFetch<Campaign>("campaigns", {
      fields,
      sort: ["-priority", "sort"],
      limit: 10,
    });

    if (Array.isArray(campaigns)) return campaigns;
    return [];
  } catch {
    console.warn("Failed to fetch campaigns from Directus, using fallback");
    return fallbackCampaigns;
  }
}

export async function getPrimaryCampaign(): Promise<Campaign | null> {
  const campaigns = await getActiveCampaigns();
  return campaigns[0] || null;
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const fields = ["id", "name", "slug", "subtitle", "description", "start_date", "end_date", "auto_archive", "priority", "hero_image", "cta_label", "cta_url", "status", "sort", "players.*", "matches.*", "media.*"];

      const campaigns = await directusFetch<Campaign>("campaigns", {
        fields,
        filter: { slug: { _eq: slug } },
        limit: 1,
      });

      if (campaigns && campaigns.length > 0) return campaigns[0];
    }

    const match = fallbackCampaigns.find(c => c.slug === slug);
    return match || null;
  } catch {
    console.warn("Failed to fetch campaign by slug from Directus, using fallback");
    return fallbackCampaigns.find(c => c.slug === slug) || null;
  }
}

export async function getCampaignByMatchId(matchId: string): Promise<Campaign | null> {
  const campaigns = await getActiveCampaigns();
  return campaigns.find(c => c.matches?.some(m => m.match_id === matchId)) || null;
}

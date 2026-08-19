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

export async function getActiveCampaigns(): Promise<Campaign[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return [];

    const fields = ["id", "name", "slug", "subtitle", "description", "start_date", "end_date", "auto_archive", "priority", "hero_image", "cta_label", "cta_url", "status", "sort", "players.*", "matches.*", "media.*"];

    const campaigns = await directusFetch<Campaign>("campaigns", {
      fields,
      filter: { status: { _in: ["running", "published"] }, deleted_at: { _null: true } },
      sort: ["-priority", "sort"],
      limit: 10,
    });

    return campaigns || [];
  } catch (error) {
    console.warn("Failed to fetch campaigns from Directus:", error);
    return [];
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
        filter: { slug: { _eq: slug }, deleted_at: { _null: true } },
        limit: 1,
      });

      if (campaigns && campaigns.length > 0) return campaigns[0];
    }
    return null;
  } catch {
    console.warn(`Failed to fetch campaign by slug "${slug}" from Directus`);
    return null;
  }
}

export async function getCampaignByMatchId(matchId: string): Promise<Campaign | null> {
  const campaigns = await getActiveCampaigns();
  return campaigns.find(c => c.matches?.some(m => m.match_id === matchId)) || null;
}

import { directusFetch } from "@/lib/directus/fetch";
import { headshotAssetUrl } from "@/lib/directus/assets";

export interface Player {
  id: number;
  name: string;
  slug?: string;
  position?: string;
  team?: string;
  team_id?: number;
  caps?: number;
  age?: number;
  photo?: string;
  bio?: string;
  featured?: boolean;
  status?: string;
  sort?: number;
}

function resolvePhoto(player: Player): string {
  if (player.photo) {
    const asset = headshotAssetUrl(player.photo);
    if (asset && asset !== '/zru-placeholder-hero.webp') return asset;
  }
  if (player.name) {
    return `/images/teams/headshots/${player.name}.jpg`;
  }
  return '/zru-placeholder-hero.webp';
}

function mapPlayer(p: Player): Player {
  return { ...p, photo: resolvePhoto(p) };
}

export async function getPlayers(): Promise<Player[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return [];

    const players = await directusFetch<Player>("players", {
      filter: { status: { _eq: "published" }, deleted_at: { _null: true } },
      sort: ["id"],
      limit: 50,
    });

    if (players && players.length > 0) return players.map(mapPlayer);
    return [];
  } catch (error) {
    console.warn("Failed to fetch players from Directus:", error);
    return [];
  }
}

export async function getFeaturedPlayers(): Promise<Player[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return [];

    const players = await directusFetch<Player>("players", {
      filter: { status: { _eq: "published" }, featured: { _eq: true }, deleted_at: { _null: true } },
      sort: ["id"],
      limit: 10,
    });

    if (players && players.length > 0) return players.map(mapPlayer);
    return [];
  } catch (error) {
    console.warn("Failed to fetch featured players from Directus:", error);
    return [];
  }
}

export async function getPlayerBySlug(slug: string): Promise<Player | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return null;

    const players = await directusFetch<Player>("players", {
      filter: { slug: { _eq: slug }, status: { _eq: "published" }, deleted_at: { _null: true } },
      limit: 1,
    });

    if (players && players.length > 0) return mapPlayer(players[0]);
    return null;
  } catch {
    console.warn(`Failed to fetch player by slug "${slug}" from Directus`);
    return null;
  }
}

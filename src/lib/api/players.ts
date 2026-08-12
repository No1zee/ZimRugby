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

const fallbackPlayers: Player[] = [
  { id: 1, name: "Bornwell Gwinji", position: "Prop", team: "Sables", caps: 42, age: 28, photo: "/images/teams/headshots/Bornwell Gwinji.jpg", slug: "bornwell-gwinji" },
  { id: 2, name: "Brandan Mudzekenyedzi", position: "Lock", team: "Sables", caps: 35, age: 27, photo: "/images/teams/headshots/Brandan Mudzekenyedzi.jpg", slug: "brandan-mudzekenyedzi" },
  { id: 3, name: "Brendon Marume", position: "Scrumhalf", team: "Sables", caps: 28, age: 26, photo: "/images/teams/headshots/Brendon Marume.jpg", slug: "brendon-marume" },
];

export async function getPlayers(): Promise<Player[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackPlayers;

    const players = await directusFetch<Player>("players", {
      filter: { status: { _eq: "published" } },
      sort: ["id"],
      limit: 50,
    });

    if (players && players.length > 0) return players.map(mapPlayer);

    return fallbackPlayers;
  } catch {
    console.warn("Failed to fetch players from Directus, using fallback");
    return fallbackPlayers;
  }
}

export async function getFeaturedPlayers(): Promise<Player[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackPlayers;

    const players = await directusFetch<Player>("players", {
      filter: { status: { _eq: "published" }, featured: { _eq: true } },
      sort: ["id"],
      limit: 10,
    }).catch(() => fallbackPlayers);

    if (players && players.length > 0) return players.map(mapPlayer);

    return fallbackPlayers;
  } catch {
    console.warn("Failed to fetch featured players from Directus, using fallback");
    return fallbackPlayers;
  }
}

export async function getPlayerBySlug(slug: string): Promise<Player | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackPlayers.find(p => p.slug === slug) || null;

    const players = await directusFetch<Player>("players", {
      filter: { slug: { _eq: slug }, status: { _eq: "published" } },
      limit: 1,
    });

    if (players && players.length > 0) return mapPlayer(players[0]);

    return fallbackPlayers.find(p => p.slug === slug) || null;
  } catch {
    console.warn(`Failed to fetch player by slug "${slug}" from Directus, using fallback`);
    return fallbackPlayers.find(p => p.slug === slug) || null;
  }
}

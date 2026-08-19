import { directusFetch } from "@/lib/directus/fetch";
import { assetUrl } from "@/lib/directus/assets";
import { getSchoolInitiatives } from "@/lib/api/schools";

export interface GrassrootsInitiative {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  stats: string;
  image: string;
  link: string;
  btnText: string;
  gradient: string;
  accentGlow: string;
}

interface DirectusGrassrootsInitiative {
  id: string | number;
  title?: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  stat?: string;
  stat_label?: string;
  image?: string;
  link?: string;
  sort?: number | null;
  status?: string;
}

export async function getGrassrootsInitiatives(): Promise<GrassrootsInitiative[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const items = await directusFetch<DirectusGrassrootsInitiative>(
        "grassroots_initiatives",
        { filter: { status: { _eq: "published" }, deleted_at: { _null: true } }, sort: ["sort"] },
        60
      );
      if (items && items.length > 0) {
        return items.map((item) => ({
          id: String(item.id),
          title: item.title || "",
          badge: item.badge || "GRASSROOTS DEVELOPMENT",
          subtitle: item.subtitle || "",
          description: item.description || "",
          stats: [item.stat, item.stat_label].filter(Boolean).join(" "),
          image: assetUrl(item.image) || item.image || "/images/schools/schoolboy-team-group.jpg",
          link: item.link || "/schools",
          btnText: "EXPLORE",
          gradient: "from-[#003822] via-[#002B19] to-[#001D11]",
          accentGlow: "rgba(0,200,83,0.25)",
        }));
      }
    }
  } catch (err) {
    console.warn("Failed to fetch grassroots initiatives:", err);
  }

  return [];
}

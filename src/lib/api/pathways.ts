import { directusFetch } from "@/lib/directus/fetch";

export interface RugbyPathwayStage {
  id: number;
  title: string;
  category: string;
  age_group: string;
  description: string;
  icon_name?: string;
  link_url?: string;
  cta_label?: string;
  badge_text?: string;
  sort: number;
}

export async function getRugbyPathways(): Promise<RugbyPathwayStage[]> {
  try {
    const response = await directusFetch<any>("pathways", {
      filter: { is_active: { _eq: 1 } },
      sort: ["sort"],
    });

    if (response && response.length > 0) {
      return response.map((item: any) => ({
        id: Number(item.id),
        title: item.title,
        category: item.category,
        age_group: item.age_group,
        description: item.description,
        icon_name: item.icon_name,
        link_url: item.link_url,
        cta_label: item.cta_label,
        badge_text: item.badge_text,
        sort: Number(item.sort || 0),
      }));
    }
  } catch (error) {
    console.warn("Directus fetch failed for pathways:", error);
  }

  // If Directus is offline or empty, return empty array
  return [];
}

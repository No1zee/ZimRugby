import { directusFetch } from "@/lib/directus/fetch";

export interface SchoolInitiative {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  stat?: string;
  status?: string;
  sort?: number;
  image?: string;
}

export async function getSchoolInitiatives(): Promise<SchoolInitiative[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const initiatives = await directusFetch<SchoolInitiative>("school_initiatives", {
        filter: { status: { _eq: "published" } },
        sort: ["sort"],
        limit: 20,
      });

      if (initiatives && initiatives.length > 0) {
        return initiatives;
      }
    }
  } catch (error) {
    console.warn("Failed to fetch school initiatives from Directus:", error);
  }

  return [];
}

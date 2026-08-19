import { directusFetch } from "@/lib/directus/fetch";

export interface Club {
  id: number;
  name: string;
  slug: string;
  province?: string;
  league?: string;
  venue?: string;
  color?: string;
  contact?: string;
  description?: string;
  status?: string;
  sort?: number;
}

export async function getClubs(): Promise<Club[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return [];

    const clubs = await directusFetch<Club>("clubs", {
      filter: { status: { _eq: "published" }, deleted_at: { _null: true } },
      sort: ["sort"],
      limit: 50,
    });

    return clubs || [];
  } catch (error) {
    console.warn("Failed to fetch clubs from Directus:", error);
    return [];
  }
}

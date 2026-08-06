import { directusFetch } from "@/lib/directus/fetch";

export interface Faq {
  id: string | number;
  question?: string;
  answer?: string;
  category?: string;
  sort?: number | null;
  status?: string;
}

export async function getFaqs(): Promise<Faq[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return [];
    const items = await directusFetch<Faq>(
      "faqs",
      { filter: { status: { _eq: "published" } }, sort: ["sort"], limit: 50 },
      60
    );
    return items;
  } catch (error) {
    console.warn("Directus fetch failed for faqs collection:", error);
    return [];
  }
}

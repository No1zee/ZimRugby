import { directusFetch } from "@/lib/directus/fetch";

export interface HomepageBlock {
  id: number;
  block_key: string;
  title: string | null;
  content: string | null;
  items: any[] | null;
  image_url: string | null;
  sort: number | null;
  status: string;
}

export async function getHomepageBlocks(): Promise<HomepageBlock[]> {
  try {
    const response = await directusFetch<HomepageBlock>("homepage_content", {
      sort: ["sort"],
    });
    return response || [];
  } catch (error) {
    console.warn("Directus fetch failed for homepage content:", error);
    return [];
  }
}

export async function getHomepageBlock(blockKey: string): Promise<HomepageBlock | null> {
  try {
    const response = await directusFetch<HomepageBlock>("homepage_content", {
      filter: { block_key: { _eq: blockKey } },
      limit: 1,
    });
    return response?.[0] || null;
  } catch (error) {
    console.warn(`Directus fetch failed for homepage block "${blockKey}":`, error);
    return null;
  }
}

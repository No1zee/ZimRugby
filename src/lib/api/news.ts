import { directusFetch } from "@/lib/directus/fetch";
import { assetUrl } from "@/lib/directus/assets";
import type { Report } from "@/lib/data-fetcher";

export interface DirectusNewsItem {
  id: string | number;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  image?: string;
  category?: string;
  date?: string;
  status?: string;
}

export function newsImageToUrl(image?: string): string {
  if (!image) return "/images/teams/sables.jpg";
  return assetUrl(image) || image;
}

export function newsItemToReport(item: DirectusNewsItem): Report {
  const parsed = item.date ? new Date(item.date) : null;
  const hasDate = parsed && !isNaN(parsed.getTime());
  return {
    id: `news-${item.id}`,
    title: item.title || "",
    excerpt: item.excerpt || "",
    content: item.body || item.excerpt || "",
    date: hasDate
      ? parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()
      : "",
    image: newsImageToUrl(item.image),
    category: item.category || "NEWS",
    url: item.slug ? `/media/${item.slug}` : "/media",
    source: "website",
    type: "news",
  };
}

export async function getNewsArticles(limit = 4): Promise<Report[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return [];
    const items = await directusFetch<DirectusNewsItem>(
      "news",
      { filter: { status: { _eq: "published" } }, sort: ["-date"], limit },
      60
    );
    return items.map(newsItemToReport);
  } catch (error) {
    console.warn("Directus fetch failed for news collection:", error);
    return [];
  }
}

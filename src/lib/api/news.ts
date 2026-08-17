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
  publish_at?: string | null;
  expire_at?: string | null;
}

/**
 * Filter object that hides scheduled-but-not-yet-live articles and
 * expired ones. publish_at null = immediately visible; expire_at null =
 * never hidden. Applied at query time so the public site never sees
 * future/expired news.
 */
export function newsVisibilityFilter(now = new Date()): Record<string, unknown> {
  const iso = now.toISOString();
  return {
    status: { _eq: "published" },
    _and: [
      { _or: [{ publish_at: { _null: true } }, { publish_at: { _lte: iso } }] },
      { _or: [{ expire_at: { _null: true } }, { expire_at: { _gte: iso } }] },
    ],
  };
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
      { filter: newsVisibilityFilter(), sort: ["-date"], limit },
      60
    );
    return items.map(newsItemToReport);
  } catch (error) {
    console.warn("Directus fetch failed for news collection:", error);
    return [];
  }
}

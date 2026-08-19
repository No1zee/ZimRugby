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
  category?: string | string[];
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

export function parseCategories(category?: string | string[]): string[] {
  if (!category) return ["ZRU"];
  if (Array.isArray(category)) return category.filter(Boolean);
  if (typeof category === "string") {
    const trimmed = category.trim();
    if (!trimmed) return ["ZRU"];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        // fallback to split
      }
    }
    const list = trimmed
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    return list.length > 0 ? list : ["ZRU"];
  }
  return ["ZRU"];
}

export function newsImageToUrl(image?: string): string {
  if (!image) return "/images/teams/sables.jpg";
  return assetUrl(image) || image;
}

export function newsItemToReport(item: DirectusNewsItem): Report {
  const parsed = item.date ? new Date(item.date) : null;
  const hasDate = parsed && !isNaN(parsed.getTime());
  const categories = parseCategories(item.category);
  return {
    id: `news-${item.id}`,
    title: item.title || "",
    excerpt: item.excerpt || "",
    content: item.body || item.excerpt || "",
    date: hasDate
      ? parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()
      : "",
    image: newsImageToUrl(item.image),
    category: categories[0] || "ZRU",
    categories,
    url: item.slug ? `/media/${item.slug}` : "/media",
    source: "website",
    type: "news",
  };
}

export async function getNewsArticles(limit = 6, category?: string): Promise<Report[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return [];
    const filter: Record<string, unknown> = newsVisibilityFilter();
    
    const items = await directusFetch<DirectusNewsItem>(
      "news",
      { filter, sort: ["-date"], limit: limit * 2 },
      60
    );
    const reports = items.map(newsItemToReport);
    
    if (category && category !== "ALL") {
      const target = category.toLowerCase();
      const filtered = reports.filter((r) =>
        r.categories?.some((c) => c.toLowerCase() === target || c.toLowerCase().includes(target))
      );
      return filtered.slice(0, limit);
    }

    return reports.slice(0, limit);
  } catch (error) {
    console.warn("Directus fetch failed for news collection:", error);
    return [];
  }
}

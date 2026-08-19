export interface Match {
  id: string;
  homeTeam: { name: string; logo?: string };
  awayTeam: { name: string; logo?: string };
  date: string;
  time: string;
  venue: string;
  competition: string;
  category: string;
  status: 'upcoming' | 'live' | 'completed';
  score?: { home: number; away: number };
}

export interface Report {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  image: string;
  category: string;
  categories?: string[];
  url: string;
  source: 'website' | 'social';
  type?: 'news' | 'video';
}

import { staticData } from './static-data';

/**
 * Read the static fallback JSON (matches/reports/social).
 * Files are bundled at build time (see static-data.ts), so this always
 * works on every runtime — including Vercel serverless, where fs reads of
 * public/ fail and VERCEL_URL fetches can return the HTML index page.
 */
async function readStaticJson<T>(filename: string, _revalidateSeconds: number): Promise<T[]> {
  try {
    const data = staticData[filename];
    if (!data) {
      console.error(`No static fallback registered for ${filename}`);
      return [];
    }
    return data as T[];
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

import { getDirectusMatches } from './match-centre/api';

export async function getLiveMatches(): Promise<Match[]> {
  try {
    const directusMatches = await getDirectusMatches();
    if (directusMatches && directusMatches.length > 0) {
      return directusMatches.map(m => ({
        id: String(m.id),
        homeTeam: { name: m.homeTeam.name, logo: m.homeTeam.logo },
        awayTeam: { name: m.awayTeam.name, logo: m.awayTeam.logo },
        date: m.dateIso ? new Date(m.dateIso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '',
        time: m.time,
        venue: m.venue,
        competition: m.competition,
        category: m.teamCategory,
        status: m.status === 'completed' ? 'completed' : (m.status as 'upcoming' | 'live' | 'completed'),
        score: (m.homeTeam.score !== undefined && m.awayTeam.score !== undefined) ? { home: m.homeTeam.score, away: m.awayTeam.score } : undefined
      }));
    }
  } catch (error) {
    console.warn("Directus fetch failed for live matches, falling back to static:", error);
  }

  const data = await readStaticJson<Match>('matches.json', 60);
  return data.filter((m: Match) => m.homeTeam?.name !== 'Date');
}

import { directusFetch } from './directus/fetch';
import type { Announcements as DirectusAnnouncement, SocialPosts as DirectusSocialPost } from '@/types/directus-generated';
import { newsItemToReport, newsVisibilityFilter, type DirectusNewsItem } from './api/news';

function announcementToReport(da: DirectusAnnouncement): Report {
  const body = da.body || "";
  const starts = da.starts_at ? new Date(da.starts_at) : null;
  const hasStart = starts && !isNaN(starts.getTime());
  const priority = Number(da.priority) || 0;
  return {
    id: `directus-${da.id}`,
    title: da.title || "",
    excerpt: body.length > 140 ? body.substring(0, 140) + "..." : body,
    content: da.body || "",
    date: hasStart
      ? starts.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : "Just now",
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1200&auto=format&fit=crop",
    category: da.badge || (priority >= 30 ? "URGENT ANNOUNCEMENT" : "Official Announcement"),
    url: `/media/directus-${da.id}`,
    source: "website",
    type: "news",
  };
}

export async function getLatestReports(): Promise<Report[]> {
  const [newsItems, staticReports, directusAnnouncements] = await Promise.allSettled([
    directusFetch<DirectusNewsItem>("news", { filter: newsVisibilityFilter(), sort: ["-date"] }, 60),
    readStaticJson<Report>("reports.json", 300),
    directusFetch<DirectusAnnouncement>("announcements", {}, 60)
  ]);

  const cmsAnnouncements = directusAnnouncements.status === 'fulfilled'
    ? directusAnnouncements.value.map(announcementToReport)
    : [];

  // News collection is the source of truth. If Directus is up, show the
  // full live list; if it fails, fall back to the build-time bundled copy
  // (stale > empty). Same id scheme as getNewsArticles so hub dedupe works.
  const cmsNews = newsItems.status === 'fulfilled' && newsItems.value.length > 0
    ? newsItems.value.map(newsItemToReport)
    : [];

  if (cmsNews.length > 0) {
    return [...cmsAnnouncements, ...cmsNews];
  }

  const reports = staticReports.status === 'fulfilled' ? staticReports.value : [];
  return [...cmsAnnouncements, ...reports];
}


function socialPostToReport(p: DirectusSocialPost): Report {
  return {
    id: `social-${p.id}`,
    title: p.title || "",
    excerpt: p.excerpt || "",
    date: p.date_label || "",
    image: p.image_url || "/images/media/fb_placeholder.jpg",
    category: p.category || "NEWS",
    url: p.post_url || "#",
    source: "social",
  };
}

export async function getSocialPosts(): Promise<Report[]> {
  try {
    const response = await directusFetch<DirectusSocialPost>("social_posts", { sort: ["sort"] });
    if (response && response.length > 0) {
      return response.map(socialPostToReport);
    }
  } catch (error) {
    console.warn("Directus fetch failed for social posts, falling back to static:", error);
  }
  return await readStaticJson<Report>('social.json', 300);
}

export async function getReportById(id: string): Promise<Report | undefined> {
  const reports = await getLatestReports();
  const found = reports.find(r => r.id === id || r.slug === id || r.url === `/media/${id}` || r.url.endsWith(`/${id}`));
  if (found) return found;

  // Fall back to the Directus news collection keyed by slug (homepage /media links use news slugs).
  try {
    const items = await directusFetch<DirectusNewsItem>("news", {
      filter: { ...newsVisibilityFilter(), slug: { _eq: id } },
      limit: 1,
    }, 60);
    if (items && items[0]) {
      const item = items[0];
      const parsed = item.date ? new Date(item.date) : null;
      const hasDate = parsed && !isNaN(parsed.getTime());
      const image = item.image || "";
      const plainExcerpt = (item.excerpt || (item.body || ""))
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return {
        id: `news-${item.id}`,
        title: item.title || "",
        excerpt: item.excerpt || plainExcerpt.slice(0, 200),
        content: (item.body || item.excerpt || ""),
        date: hasDate
          ? parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()
          : "",
        image: /^[a-f0-9-]{36}$/i.test(image) ? `/api/assets/${image}` : image || "/images/teams/sables.jpg",
        category: Array.isArray(item.category) ? item.category.join(", ") : (item.category || "NEWS"),
        categories: Array.isArray(item.category)
          ? item.category
          : typeof item.category === "string"
          ? item.category.split(",").map((s: string) => s.trim()).filter(Boolean)
          : ["NEWS"],
        url: `/media/${item.slug || id}`,
        source: "website",
        type: "news",
      };
    }
  } catch (error) {
    console.warn("Failed to fetch news article by slug:", error);
  }

  return undefined;
}

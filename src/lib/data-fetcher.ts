export interface Match {
  id: string;
  homeTeam: { name: string; logo?: string };
  awayTeam: { name: string; logo?: string };
  date: string;
  time: string;
  venue: string;
  competition: string;
  category: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: { home: number; away: number };
}

export interface Report {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  image: string;
  category: string;
  url: string;
  source: 'website' | 'social';
  type?: 'news' | 'video';
}

/**
 * Fetch static JSON from public/data with ISR revalidation.
 * Uses fetch() with next.revalidate so Next.js caches and revalidates automatically.
 */
async function readStaticJson<T>(filename: string, _revalidateSeconds: number): Promise<T[]> {
  try {
    if (typeof window === 'undefined') {
      // Server-side / Build-time: Read directly from public/data via fs to avoid localhost ECONNREFUSED during static export
      const [fs, path] = await Promise.all([import('fs'), import('path')]);
      const filePath = path.join(process.cwd(), 'public', 'data', filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } else {
      // Client-side: direct fetch
      const res = await fetch(`/data/${filename}`);
      if (!res.ok) throw new Error(`Failed to fetch ${filename}`);
      return await res.json();
    }
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

export async function getLiveMatches(): Promise<Match[]> {
  const data = await readStaticJson<Match>('matches.json', 60);
  return data.filter((m: Match) => m.homeTeam?.name !== 'Date');
}

import { directusFetch } from './directus/fetch';

interface DirectusAnnouncement {
  id: number;
  title: string;
  body: string;
  category?: string;
  date?: string;
  urgent?: boolean;
}

function announcementToReport(da: DirectusAnnouncement): Report {
  return {
    id: `directus-${da.id}`,
    title: da.title,
    excerpt: da.body.length > 140 ? da.body.substring(0, 140) + "..." : da.body,
    content: da.body,
    date: da.date ? new Date(da.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Just now",
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1200&auto=format&fit=crop",
    category: da.category || "Official Announcement",
    url: `/media/directus-${da.id}`,
    source: "website",
    type: "news",
  };
}

export async function getLatestReports(): Promise<Report[]> {
  const [staticReports, directusAnnouncements] = await Promise.allSettled([
    readStaticJson<Report>('reports.json', 300),
    directusFetch<DirectusAnnouncement>("announcements", {}, 60)
  ]);

  const cmsAnnouncements = directusAnnouncements.status === 'fulfilled' 
    ? directusAnnouncements.value.map(announcementToReport) 
    : [];

  const reports = staticReports.status === 'fulfilled' ? staticReports.value : [];
  return [...cmsAnnouncements, ...reports];
}


interface DirectusSocialPost {
  id: number;
  source_id: string;
  title: string;
  excerpt: string;
  date_label: string;
  image_url: string;
  category: string;
  post_url: string;
  source_platform: string;
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
  const found = reports.find(r => r.id === id);
  if (found) return found;

  // Fall back to the Directus news collection keyed by slug (homepage /media links use news slugs).
  try {
    const items = await directusFetch<DirectusNewsLookup>("news", {
      filter: { slug: { _eq: id } },
      limit: 1,
    }, 60);
    if (items && items[0]) {
      const item = items[0];
      const parsed = item.date ? new Date(item.date) : null;
      const hasDate = parsed && !isNaN(parsed.getTime());
      const image = item.image || "";
      const plainBody = (item.body || item.excerpt || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return {
        id: `news-${item.id}`,
        title: item.title || "",
        excerpt: item.excerpt || "",
        content: plainBody,
        date: hasDate
          ? parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()
          : "",
        image: /^[a-f0-9-]{36}$/i.test(image) ? `/api/assets/${image}` : image || "/images/teams/sables.jpg",
        category: item.category || "NEWS",
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

interface DirectusNewsLookup {
  id: string | number;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  image?: string;
  category?: string;
  date?: string;
}

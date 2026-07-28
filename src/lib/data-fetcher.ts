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

export async function getLatestReports(): Promise<Report[]> {
  return await readStaticJson<Report>('reports.json', 300);
}

export async function getSocialPosts(): Promise<Report[]> {
  return await readStaticJson<Report>('social.json', 300);
}

export async function getReportById(id: string): Promise<Report | undefined> {
  const reports = await getLatestReports();
  return reports.find(r => r.id === id);
}

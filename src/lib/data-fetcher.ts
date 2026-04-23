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

async function readStaticJson<T>(filename: string): Promise<T[]> {
  try {
    if (typeof window === 'undefined') {
      // Use dynamic imports to avoid bundling fs/path in the browser
      const [fs, path] = await Promise.all([
        import('fs'),
        import('path')
      ]);
      const filePath = path.join(process.cwd(), 'public', 'data', filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } else {
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
  const data = await readStaticJson<Match>('matches.json');
  return data.filter((m: Match) => m.homeTeam?.name !== 'Date'); // Filter header row if present
}

export async function getLatestReports(): Promise<Report[]> {
  return await readStaticJson<Report>('reports.json');
}

export async function getSocialPosts(): Promise<Report[]> {
  return await readStaticJson<Report>('social.json');
}

export async function getReportById(id: string): Promise<Report | undefined> {
  const reports = await getLatestReports();
  return reports.find(r => r.id === id);
}

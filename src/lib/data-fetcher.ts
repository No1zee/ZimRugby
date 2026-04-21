import fs from 'fs';
import path from 'path';

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
  date: string;
  image: string;
  category: string;
  url: string;
  source: 'website' | 'social';
  type?: 'news' | 'video';
}

const isServer = typeof window === 'undefined';

async function readStaticJson<T>(filename: string): Promise<T[]> {
  try {
    if (isServer) {
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


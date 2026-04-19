// Data Fetcher Utility
// Handles fetching of matches and reports from the generated data store.

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

export async function getLiveMatches(): Promise<Match[]> {
  try {
    // In a production environment, this would be a transition from 
    // Static JSON -> Firebase Firestore real-time subscription.
    const res = await fetch('/data/matches.json');
    if (!res.ok) throw new Error('Failed to fetch matches');
    const data = await res.json();
    return data.filter((m: Match) => m.homeTeam.name !== 'Date'); // Filter header row
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

export async function getLatestReports(): Promise<Report[]> {
  try {
    const res = await fetch('/data/reports.json');
    if (!res.ok) throw new Error('Failed to fetch reports');
    return await res.json();
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
}

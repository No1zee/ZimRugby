
export interface Fixture {
  id: string;
  competition: string;
  round: string;
  date: Date;
  time: string;
  venue: string;
  homeTeam: {
    name: string;
    score?: number;
    logo?: string;
  };
  awayTeam: {
    name: string;
    score?: number;
    logo?: string;
  };
  status: 'upcoming' | 'live' | 'completed';
  teamCategory?: string;
}

/**
 * A lightweight, zero-dependency ICS parser for World Rugby fixtures.
 */
function parseICS(text: string) {
  const events: Record<string, string>[] = [];
  const unfoldedText = text.replace(/\r?\n[ \t]/g, '');
  const lines = unfoldedText.split(/\r?\n/);
  let currentEvent: Record<string, string> | null = null;

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = {};
    } else if (line.startsWith('END:VEVENT')) {
      if (currentEvent) events.push(currentEvent);
      currentEvent = null;
    } else if (currentEvent) {
      const match = line.match(/^([A-Z;=]+):(.*)$/);
      if (match) {
        const key = match[1].split(';')[0];
        const val = match[2].trim();
        currentEvent[key] = val;
      }
    }
  }

  return events;
}

function parseDate(icsStr: string): Date {
  const cleanStr = icsStr.includes(':') ? icsStr.split(':')[1] : icsStr;
  const match = cleanStr.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if (!match) return new Date();
  
  const [, y, m, d, h, min, s] = match.map(Number);
  return new Date(Date.UTC(y, m - 1, d, h, min, s));
}

/**
 * Try to extract a score from a match summary.
 * World Rugby ICS uses formats like:
 *   "Zimbabwe 29-3 Algeria"
 *   "Zimbabwe 10 - 24 Algeria"
 *   "Zimbabwe vs Algeria" (no score yet)
 */
function extractScore(summary: string): { homeScore?: number; awayScore?: number } | null {
  // Match patterns like "29-3", "10 - 24", "32–10" (various dash types)
  const scoreMatch = summary.match(/(\d+)\s*[-–—]\s*(\d+)/);
  if (scoreMatch) {
    return {
      homeScore: parseInt(scoreMatch[1], 10),
      awayScore: parseInt(scoreMatch[2], 10),
    };
  }
  return null;
}

/**
 * Determine fixture status based on date and score.
 */
function determineStatus(date: Date, hasScore: boolean): 'upcoming' | 'live' | 'completed' {
  const now = new Date();
  const matchEnd = new Date(date.getTime() + 2 * 60 * 60 * 1000); // assume ~2hr match duration

  if (hasScore) return 'completed';
  if (now > matchEnd) return 'completed';
  if (now >= date && now <= matchEnd) return 'live';
  return 'upcoming';
}

export async function getWorldRugbyFixtures(): Promise<Fixture[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch('https://www.world.rugby/tournaments/fixtures-results/ical?team=zimbabwe', { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`Failed to fetch World Rugby ICAL (status ${res.status}): ${res.statusText}`);
      return [];
    }
    
    const text = await res.text();
    const rawEvents = parseICS(text);

    return rawEvents
      .filter(e => {
        const summary = e.SUMMARY || '';
        return summary.toLowerCase().includes('zimbabwe');
      })
      .map(e => {
        const summary = e.SUMMARY || '';
        const location = e.LOCATION || 'TBA';
        const startStr = e.DTSTART;
        const startDate = startStr ? parseDate(startStr) : new Date();
        
        // Extract score from summary if present (e.g. "Zimbabwe 29-3 Algeria")
        const score = extractScore(summary);

        // Parse team names — strip out the score portion first
        const summaryWithoutScore = summary.replace(/\d+\s*[-–—]\s*\d+/, '').trim();
        const participants = summaryWithoutScore.split(/\s+(?:vs?|v)\s+/i).map((p: string) => p.trim());
        const homeName = participants[0] || 'Zimbabwe';
        const awayName = participants[1] || 'TBA';

        const pad = (n: number) => n.toString().padStart(2, '0');
        const timeStr = `${pad(startDate.getUTCHours())}:${pad(startDate.getUTCMinutes())}`;

        const status = determineStatus(startDate, !!score);

        return {
          id: `wr-${e.UID || Math.random().toString(36).substring(2, 11)}`,
          competition: 'International Test',
          round: 'International',
          date: startDate,
          time: timeStr,
          venue: location,
          homeTeam: { name: homeName, score: score?.homeScore },
          awayTeam: { name: awayName, score: score?.awayScore },
          status,
        };
      });
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error fetching World Rugby fixtures (likely timeout):', error);
    return [];
  }
}

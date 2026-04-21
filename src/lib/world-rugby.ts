
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
}

/**
 * A lightweight, zero-dependency ICS parser for World Rugby fixtures.
 */
function parseICS(text: string) {
  const events: any[] = [];
  const lines = text.split(/\r?\n/);
  let currentEvent: any = null;

  for (let line of lines) {
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
  const y = parseInt(icsStr.substring(0, 4));
  const m = parseInt(icsStr.substring(4, 6)) - 1;
  const d = parseInt(icsStr.substring(6, 8));
  const h = parseInt(icsStr.substring(9, 11));
  const min = parseInt(icsStr.substring(11, 13));
  const s = parseInt(icsStr.substring(13, 15));
  
  return new Date(Date.UTC(y, m, d, h, min, s));
}

export async function getWorldRugbyFixtures(): Promise<Fixture[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const res = await fetch('https://www.world.rugby/tournaments/fixtures-results/ical?team=zimbabwe', { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to fetch World Rugby ICAL: ${res.statusText}`);
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
        
        const participants = summary.split(/\s+vs?\s+/i).map((p: string) => p.trim());
        let homeName = participants[0] || 'Zimbabwe';
        let awayName = participants[1] || 'TBA';
        
        if (summary.includes(' v ')) {
            const parts = summary.split(' v ').map((p: string) => p.trim());
            homeName = parts[0];
            awayName = parts[1];
        }

        return {
          id: `wr-${e.UID || Math.random().toString(36).substr(2, 9)}`,
          competition: 'International Test',
          round: 'International',
          date: startDate,
          time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          venue: location,
          homeTeam: { name: homeName },
          awayTeam: { name: awayName },
          status: 'upcoming',
        };
      });
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error fetching World Rugby fixtures (likely timeout):', error);
    return [];
  }
}

import type { VEvent } from 'node-ical';

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

interface ICALAttribute {
  val: string;
}

export async function getWorldRugbyFixtures(): Promise<Fixture[]> {
  try {
    const ical = await import('node-ical');
    const res = await fetch('https://www.world.rugby/tournaments/fixtures-results/ical?team=zimbabwe', { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch World Rugby ICAL: ${res.statusText}`);
    }
    
    const text = await res.text();
    const events = ical.parseICS(text);

    return Object.values(events)
      .filter((e): e is VEvent => {
        if (!e || e.type !== 'VEVENT') return false;
        const summary = typeof e.summary === 'string' ? e.summary : (e.summary as ICALAttribute | undefined)?.val || '';
        return summary.toLowerCase().includes('zimbabwe');
      })
      .map(e => {
        const summary = typeof e.summary === 'string' ? e.summary : (e.summary as ICALAttribute | undefined)?.val || '';
        const location = typeof e.location === 'string' ? e.location : (e.location as ICALAttribute | undefined)?.val || 'TBA';
        
        // Basic parsing of "Team A vs Team B" or "Team A v Team B"
        const participants = summary.split(/\s+vs?\s+/i).map((p: string) => p.trim());
        let homeName = participants[0] || 'Zimbabwe';
        let awayName = participants[1] || 'TBA';
        
        // Sometimes the summary is just "Zimbabwe v Zambia" or "Zambia v Zimbabwe"
        // Let's try to be smart about who is home/away if not specified
        if (summary.includes(' v ')) {
            const parts = summary.split(' v ').map((p: string) => p.trim());
            homeName = parts[0];
            awayName = parts[1];
        }

        return {
          id: `wr-${e.uid}`,
          competition: 'International Test', // Default if not found in summary
          round: 'International',
          date: e.start as Date,
          time: e.start ? new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : 'TBA',
          venue: location,
          homeTeam: { name: homeName },
          awayTeam: { name: awayName },
          status: 'upcoming',
        };
      });
  } catch (error) {
    console.error('Error fetching World Rugby fixtures:', error);
    return [];
  }
}

import { Fixture } from './world-rugby';

interface TMAttraction {
  name: string;
}

interface TMVenue {
  name: string;
}

interface TMEvent {
  id: string;
  url: string;
  dates: {
    start: {
      dateTime?: string;
      localDate: string;
      localTime?: string;
    }
  };
  _embedded?: {
    attractions?: TMAttraction[];
    venues?: TMVenue[];
  };
}

const TM_API_KEY = process.env.TICKETMASTER_API_KEY;

export async function getTicketmasterFixtures(): Promise<Fixture[]> {
  if (!TM_API_KEY) {
    console.warn('TICKETMASTER_API_KEY is missing. Skipping Ticketmaster fetch.');
    return [];
  }

  const url = `https://app.ticketmaster.com/discovery/v2/events.json`
            + `?keyword=zimbabwe+rugby&countryCode=CA`
            + `&classificationName=sports&apikey=${TM_API_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    
    const events: TMEvent[] = data._embedded?.events ?? [];
    
    return events.map((e: TMEvent) => {
      const attractions = e._embedded?.attractions || [];
      const homeTeam = attractions.find((a: TMAttraction) => !a.name.toLowerCase().includes('zimbabwe'))?.name || 'Opponent';
      const awayTeam = attractions.find((a: TMAttraction) => a.name.toLowerCase().includes('zimbabwe'))?.name || 'Zimbabwe';

      return {
        id: `tm-${e.id}`,
        competition: 'NATIONS CUP 2026',
        round: 'Tour Match',
        date: new Date(e.dates.start.dateTime || e.dates.start.localDate),
        time: e.dates.start.localTime || 'TBA',
        venue: e._embedded?.venues?.[0]?.name || 'TBA',
        homeTeam: { name: homeTeam },
        awayTeam: { name: awayTeam },
        status: 'upcoming',
        ticketUrl: e.url
      };
    });
  } catch (error) {
    console.error('Error fetching Ticketmaster fixtures:', error);
    return [];
  }
}

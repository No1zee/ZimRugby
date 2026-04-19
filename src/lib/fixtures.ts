import { Fixture, getWorldRugbyFixtures } from './world-rugby';
import { getTicketmasterFixtures } from './ticketmaster';

export async function getAllFixtures(): Promise<Fixture[]> {
  const [worldRugbyResults, tmResults] = await Promise.allSettled([
    getWorldRugbyFixtures(),
    getTicketmasterFixtures(),
  ]);

  const allFixtures: Fixture[] = [
    ...(worldRugbyResults.status === 'fulfilled' ? worldRugbyResults.value : []),
    ...(tmResults.status === 'fulfilled' ? tmResults.value : []),
    ...getVerifiedStaticFixtures(),
  ];

  return deduplicateFixtures(allFixtures);
}

/**
 * Verified fixtures found via ZRU and World Rugby News that might not be in the ICAL feed yet.
 */
function getVerifiedStaticFixtures(): Fixture[] {
  return [
    {
      id: 'static-zru-zambia-1',
      competition: 'International Series',
      round: 'Final',
      date: new Date('2026-04-25T15:00:00'),
      time: '15:00',
      venue: 'Hartsfield, Bulawayo',
      homeTeam: { name: 'Zimbabwe' },
      awayTeam: { name: 'Zambia' },
      status: 'upcoming',
    },
    {
      id: 'static-zru-zambia-2',
      competition: 'International Series',
      round: 'Final',
      date: new Date('2026-05-02T15:00:00'),
      time: '15:00',
      venue: 'Prince Edward School, Harare',
      homeTeam: { name: 'Zimbabwe' },
      awayTeam: { name: 'Zambia' },
      status: 'upcoming',
    },
    {
      id: 'static-zru-sa-a',
      competition: 'International Double Header',
      round: 'Exhibition',
      date: new Date('2026-06-20T17:00:00'),
      time: '17:00',
      venue: 'Nelson Mandela Bay Stadium, SA',
      homeTeam: { name: 'South Africa A' },
      awayTeam: { name: 'Zimbabwe' },
      status: 'upcoming',
    }
  ];
}

function deduplicateFixtures(fixtures: Fixture[]): Fixture[] {
  const seen = new Map<string, Fixture>();

  fixtures.sort((a, b) => a.date.getTime() - b.date.getTime());

  for (const fixture of fixtures) {
    // Generate a unique key based on date (day only) and participants
    const dateKey = fixture.date.toISOString().split('T')[0];
    const teams = [fixture.homeTeam.name.toLowerCase(), fixture.awayTeam.name.toLowerCase()].sort();
    const key = `${dateKey}-${teams.join('-')}`;

    if (!seen.has(key)) {
      seen.set(key, fixture);
    } else {
      // If we have a duplicate, prefer the one with more info (e.g. Ticketmaster might have venue/ticket info)
      const existing = seen.get(key)!;
      if (fixture.id.startsWith('tm-') && !existing.id.startsWith('tm-')) {
        seen.set(key, fixture);
      }
    }
  }

  return Array.from(seen.values());
}

export function formatFixtureForUI(fixture: Fixture) {
  const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedDate = fixture.date.toLocaleDateString('en-GB', dateOptions).toUpperCase();
  
  const getLogo = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('zimbabwe')) return '/images/teams/zimbabwe.png';
    if (n.includes('tonga')) return '/images/teams/tonga.png';
    if (n.includes('usa')) return '/images/teams/usa.svg';
    if (n.includes('canada')) return '/images/teams/canada.svg';
    if (n.includes('chile')) return '/images/teams/chile.png';
    if (n.includes('samoa')) return '/images/teams/samoa.png';
    if (n.includes('uruguay')) return '/images/teams/uruguay.png';

    if (n.includes('south africa')) return '/images/teams/south-africa.png';
    return undefined;
  };

  return {
    ...fixture,
    date: formattedDate,
    homeTeam: {
      ...fixture.homeTeam,
      logo: getLogo(fixture.homeTeam.name)
    },
    awayTeam: {
      ...fixture.awayTeam,
      logo: getLogo(fixture.awayTeam.name)
    }
  };
}

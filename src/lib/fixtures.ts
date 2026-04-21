import { Fixture, getWorldRugbyFixtures } from './world-rugby';
import { getTicketmasterFixtures } from './ticketmaster';
import { getFlagUrl } from './flags';

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
      id: 'zru-zambia-2026',
      competition: 'Battle of Mosi-oa-Tunya',
      round: 'International',
      date: new Date('2026-04-25T15:00:00'),
      time: '15:00',
      venue: 'Harare Sports Club',
      homeTeam: { name: 'Zimbabwe' },
      awayTeam: { name: 'Zambia' },
      status: 'upcoming',
    },
    {
      id: 'zru-tonga-2026',
      competition: 'International Tour',
      round: 'Nations Cup',
      date: new Date('2026-06-12T19:00:00'),
      time: '19:00',
      venue: 'Teufaiva Stadium, Nukuʻalofa',
      homeTeam: { name: 'Tonga' },
      awayTeam: { name: 'Zimbabwe' },
      status: 'upcoming',
    },
    {
      id: 'zru-usa-2026',
      competition: 'International Tour',
      round: 'Nations Cup',
      date: new Date('2026-07-04T16:00:00'),
      time: '16:00',
      venue: 'Infinity Park, Denver',
      homeTeam: { name: 'USA' },
      awayTeam: { name: 'Zimbabwe' },
      status: 'upcoming',
    },
    {
      id: 'zru-canada-2026',
      competition: 'International Tour',
      round: 'Nations Cup',
      date: new Date('2026-07-18T14:00:00'),
      time: '14:00',
      venue: 'BMO Field, Toronto',
      homeTeam: { name: 'Canada' },
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
  
  const getLogo = (team: { name: string, logo?: string }) => {
    if (team.logo) return team.logo;
    return getFlagUrl(team.name);
  };

  return {
    ...fixture,
    date: formattedDate,
    homeTeam: {
      ...fixture.homeTeam,
      logo: getLogo(fixture.homeTeam)
    },
    awayTeam: {
      ...fixture.awayTeam,
      logo: getLogo(fixture.awayTeam)
    }
  };
}

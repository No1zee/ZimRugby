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
      id: 'zru-zambia-2026',
      competition: 'Battle of the Zambezi',
      round: 'International',
      date: new Date('2026-04-25T15:00:00'),
      time: '15:00',
      venue: 'Harare Sports Club',
      homeTeam: { name: 'Zimbabwe', logo: 'https://r2.thesportsdb.com/common/standard/logo/zimbabwe_rugby_union-v3.png' },
      awayTeam: { name: 'Zambia', logo: 'https://r2.thesportsdb.com/common/standard/logo/zambia_rugby_union-v3.png' },
      status: 'upcoming',
    },
    {
      id: 'zru-tonga-2026',
      competition: 'International Tour',
      round: 'Nations Cup',
      date: new Date('2026-06-12T19:00:00'),
      time: '19:00',
      venue: 'Teufaiva Stadium, Nukuʻalofa',
      homeTeam: { name: 'Tonga', logo: 'https://r2.thesportsdb.com/common/standard/logo/tonga_rugby_union-v3.png' },
      awayTeam: { name: 'Zimbabwe', logo: 'https://r2.thesportsdb.com/common/standard/logo/zimbabwe_rugby_union-v3.png' },
      status: 'upcoming',
    },
    {
      id: 'zru-usa-2026',
      competition: 'International Tour',
      round: 'Nations Cup',
      date: new Date('2026-07-04T16:00:00'),
      time: '16:00',
      venue: 'Infinity Park, Denver',
      homeTeam: { name: 'USA', logo: 'https://r2.thesportsdb.com/common/standard/logo/usa_rugby-v3.png' },
      awayTeam: { name: 'Zimbabwe', logo: 'https://r2.thesportsdb.com/common/standard/logo/zimbabwe_rugby_union-v3.png' },
      status: 'upcoming',
    },
    {
      id: 'zru-canada-2026',
      competition: 'International Tour',
      round: 'Nations Cup',
      date: new Date('2026-07-18T14:00:00'),
      time: '14:00',
      venue: 'BMO Field, Toronto',
      homeTeam: { name: 'Canada', logo: 'https://r2.thesportsdb.com/common/standard/logo/rugby_canada-v3.png' },
      awayTeam: { name: 'Zimbabwe', logo: 'https://r2.thesportsdb.com/common/standard/logo/zimbabwe_rugby_union-v3.png' },
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

    const n = team.name.toLowerCase();
    
    // Explicit high-quality team logos where available
    if (n.includes('zimbabwe')) return 'https://r2.thesportsdb.com/common/standard/logo/zimbabwe_rugby_union-v3.png';
    if (n.includes('tonga')) return 'https://r2.thesportsdb.com/common/standard/logo/tonga_rugby_union-v3.png';
    if (n.includes('usa')) return 'https://r2.thesportsdb.com/common/standard/logo/usa_rugby-v3.png';
    if (n.includes('canada')) return 'https://r2.thesportsdb.com/common/standard/logo/rugby_canada-v3.png';
    if (n.includes('chile')) return 'https://r2.thesportsdb.com/common/standard/logo/chilean_rugby_federation-v3.png';
    if (n.includes('zambia')) return 'https://r2.thesportsdb.com/common/standard/logo/zambia_rugby_union-v3.png';

    // Comprehensive public flag CDN fallback using standard ISO codes
    const nameToISO: Record<string, string> = {
      'south africa': 'za', 'new zealand': 'nz', 'australia': 'au', 'england': 'gb-eng',
      'ireland': 'ie', 'france': 'fr', 'scotland': 'gb-sct', 'wales': 'gb-wls',
      'argentina': 'ar', 'fiji': 'fj', 'japan': 'jp', 'italy': 'it', 'samoa': 'ws',
      'georgia': 'ge', 'portugal': 'pt', 'uruguay': 'uy', 'spain': 'es', 'romania': 'ro',
      'namibia': 'na', 'uganda': 'ug', 'kenya': 'ke', 'botswana': 'bw', 'madagascar': 'mg',
    };

    for (const [key, code] of Object.entries(nameToISO)) {
      if (n.includes(key)) return `https://flagcdn.com/w160/${code}.png`;
    }

    return undefined;
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

import { Fixture, getWorldRugbyFixtures } from './world-rugby';
import { getTicketmasterFixtures } from './ticketmaster';
import { getFlagUrl } from './flags';
import { getAllTeamFixtures } from './api/teams';
import { getLiveMatches } from './data-fetcher';

/**
 * Map a data-fetcher Match to our Fixture type so it flows into the match centre.
 */
function matchToFixture(m: { id: string; homeTeam: { name: string; logo?: string }; awayTeam: { name: string; logo?: string }; date: string; time: string; venue: string; competition: string; category?: string; status: string; score?: { home: number; away: number } }): Fixture {
  // Parse "25 April, 2026" style dates
  const parsed = new Date(m.date.replace(/(\d+)(st|nd|rd|th)/, '$1'));
  const date = isNaN(parsed.getTime()) ? new Date() : parsed;

  return {
    id: m.id,
    competition: m.competition,
    round: m.category || 'Sables',
    date,
    time: m.time,
    venue: m.venue,
    homeTeam: { name: m.homeTeam.name, logo: m.homeTeam.logo, score: m.score?.home },
    awayTeam: { name: m.awayTeam.name, logo: m.awayTeam.logo, score: m.score?.away },
    status: m.status === 'finished' ? 'completed' : (m.status as 'upcoming' | 'live' | 'completed'),
    teamCategory: m.category || 'Sables',
  };
}

export async function getAllFixtures(): Promise<Fixture[]> {
  const [worldRugbyResults, tmResults, teamResults, staticMatches] = await Promise.allSettled([
    getWorldRugbyFixtures(),
    getTicketmasterFixtures(),
    getAllTeamFixtures(),
    getLiveMatches()
  ]);

  const allFixtures: Fixture[] = [
    ...(worldRugbyResults.status === 'fulfilled' ? worldRugbyResults.value.map(f => ({ ...f, teamCategory: "Sables" })) : []),
    ...(tmResults.status === 'fulfilled' ? tmResults.value.map(f => ({ ...f, teamCategory: "Sables" })) : []),
    ...getVerifiedStaticFixtures().map(f => ({ ...f, teamCategory: "Sables" })),
    ...(teamResults.status === 'fulfilled' ? teamResults.value : []),
    ...(staticMatches.status === 'fulfilled' ? staticMatches.value.map(matchToFixture) : []),
  ];

  return deduplicateFixtures(allFixtures);
}

/**
 * Verified fixtures found via ZRU and World Rugby News that might not be in the ICAL feed yet.
 * These should be kept minimal — only add fixtures here if the ICS feed doesn't include them.
 * Remove once the ICS feed reliably provides the data.
 */
function getVerifiedStaticFixtures(): Fixture[] {
  return [];
}

function deduplicateFixtures(fixtures: Fixture[]): Fixture[] {
  const seen = new Map<string, Fixture>();

  // Clone array before sorting to prevent mutating parameter array
  const sorted = [...fixtures].sort((a, b) => a.date.getTime() - b.date.getTime());

  for (const fixture of sorted) {
    // Ensure date object is valid before running ISO methods
    const isValidDate = fixture.date instanceof Date && !isNaN(fixture.date.getTime());
    const dateKey = isValidDate ? fixture.date.toISOString().split('T')[0] : 'invalid-date';
    
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
  const dateOptions: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    timeZone: 'UTC' // Force UTC to avoid local mismatch hydration errors
  };
  const formattedDate = fixture.date.toLocaleDateString('en-GB', dateOptions).toUpperCase();
  
  const getLogo = (team: { name: string, logo?: string }) => {
    if (team.logo) return team.logo;
    return getFlagUrl(team.name);
  };

  return {
    ...fixture,
    date: formattedDate,
    dateIso: fixture.date.toISOString(),
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

/**
 * Select the union-wide next match from all formatted fixtures.
 * Considers all team categories, filters to upcoming, sorts by date ascending.
 * Returns the earliest upcoming fixture or null.
 */
export function getNextUnionMatch(
  fixtures: { status?: string; dateIso?: string; teamCategory?: string; homeTeam: { name: string; logo?: string }; awayTeam: { name: string; logo?: string }; venue: string; competition: string; id: string | number; time: string; ticketUrl?: string }[]
): { id: string | number; homeTeam: { name: string; logo?: string }; awayTeam: { name: string; logo?: string }; venue: string; competition: string; teamCategory?: string; dateIso: string; time: string; ticketUrl?: string } | null {
  const now = Date.now();

  const upcoming = fixtures
    .filter(f => f.status === 'upcoming' || !f.status)
    .filter(f => {
      if (!f.dateIso) return false;
      const t = new Date(f.dateIso).getTime();
      return !isNaN(t) && t > now;
    });

  if (upcoming.length === 0) return null;

  upcoming.sort((a, b) => {
    const ta = new Date(a.dateIso!).getTime();
    const tb = new Date(b.dateIso!).getTime();
    return ta - tb;
  });

  return upcoming[0] as { id: string | number; homeTeam: { name: string; logo?: string }; awayTeam: { name: string; logo?: string }; venue: string; competition: string; teamCategory?: string; dateIso: string; time: string; ticketUrl?: string };
}

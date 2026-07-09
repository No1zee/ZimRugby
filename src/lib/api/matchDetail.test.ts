import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Match } from '@/lib/data-fetcher';

const getLiveMatches = vi.fn<() => Promise<Match[]>>();

vi.mock('@/lib/data-fetcher', () => ({
  getLiveMatches: () => getLiveMatches(),
}));

import { getMatchDetail } from './matchDetail';

function match(overrides: Partial<Match> & { id: string }): Match {
  return {
    homeTeam: { name: 'Zimbabwe Sables' },
    awayTeam: { name: 'Zambia' },
    date: '01 Jan 2026',
    time: '15:00',
    venue: 'Harare',
    competition: 'Africa Cup',
    category: 'Sables',
    status: 'upcoming',
    ...overrides,
  };
}

describe('getMatchDetail (mock fallback)', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_DIRECTUS_URL', '');
    getLiveMatches.mockReset();
  });
  afterEach(() => vi.unstubAllEnvs());

  it('returns null when the match id is not found', async () => {
    getLiveMatches.mockResolvedValue([match({ id: 'm1' })]);
    expect(await getMatchDetail('does-not-exist')).toBeNull();
  });

  it('returns lineups without stats/report for an upcoming match', async () => {
    getLiveMatches.mockResolvedValue([match({ id: 'up-1', status: 'upcoming' })]);

    const detail = await getMatchDetail('up-1');
    expect(detail).not.toBeNull();
    expect(detail!.homeLineup.length).toBe(23);
    expect(detail!.awayLineup.length).toBe(15);
    expect(detail!.stats).toBeUndefined();
    expect(detail!.report).toBeUndefined();
  });

  it('includes stats and report for a completed match', async () => {
    getLiveMatches.mockResolvedValue([match({ id: 'done-1', status: 'finished' })]);

    const detail = await getMatchDetail('done-1');
    expect(detail!.stats).toBeDefined();
    expect(detail!.stats!.possession.home + detail!.stats!.possession.away).toBe(100);
    expect(detail!.report).toBeDefined();
    expect(detail!.report!.scorerTimeline.length).toBeGreaterThan(0);
  });

  it('includes stats but no report for a live match', async () => {
    getLiveMatches.mockResolvedValue([match({ id: 'live-1', status: 'live' })]);

    const detail = await getMatchDetail('live-1');
    expect(detail!.stats).toBeDefined();
    expect(detail!.report).toBeUndefined();
  });
});

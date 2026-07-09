import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Fixture } from './world-rugby';

const getWorldRugbyFixtures = vi.fn<() => Promise<Fixture[]>>();
const getTicketmasterFixtures = vi.fn<() => Promise<Fixture[]>>();

vi.mock('./world-rugby', () => ({
  getWorldRugbyFixtures: () => getWorldRugbyFixtures(),
}));
vi.mock('./ticketmaster', () => ({
  getTicketmasterFixtures: () => getTicketmasterFixtures(),
}));

import { getAllFixtures, formatFixtureForUI } from './fixtures';

function makeFixture(overrides: Partial<Fixture> & { id: string }): Fixture {
  return {
    competition: 'Test',
    round: 'Round',
    date: new Date('2026-01-01T12:00:00Z'),
    time: '12:00',
    venue: 'Venue',
    homeTeam: { name: 'Home' },
    awayTeam: { name: 'Away' },
    status: 'upcoming',
    ...overrides,
  };
}

describe('formatFixtureForUI', () => {
  it('formats the date as an uppercase en-GB string', () => {
    const result = formatFixtureForUI(
      makeFixture({ id: 'a', date: new Date('2026-04-25T15:00:00Z') })
    );
    expect(result.date).toBe('25 APR 2026');
  });

  it('resolves flag logos from team names when no logo is provided', () => {
    const result = formatFixtureForUI(
      makeFixture({
        id: 'a',
        homeTeam: { name: 'Zimbabwe' },
        awayTeam: { name: 'Zambia' },
      })
    );
    expect(result.homeTeam.logo).toBe('https://flagcdn.com/w160/zw.png');
    expect(result.awayTeam.logo).toBe('https://flagcdn.com/w160/zm.png');
  });

  it('prefers an explicit team logo over the flag lookup', () => {
    const result = formatFixtureForUI(
      makeFixture({
        id: 'a',
        homeTeam: { name: 'Zimbabwe', logo: '/custom.png' },
      })
    );
    expect(result.homeTeam.logo).toBe('/custom.png');
  });

  it('yields an empty logo for teams without a mapped country', () => {
    const result = formatFixtureForUI(
      makeFixture({ id: 'a', homeTeam: { name: 'Nowhere' } })
    );
    expect(result.homeTeam.logo).toBe('');
  });
});

describe('getAllFixtures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getWorldRugbyFixtures.mockResolvedValue([]);
    getTicketmasterFixtures.mockResolvedValue([]);
  });

  it('includes the verified static fixtures sorted by date', async () => {
    const fixtures = await getAllFixtures();
    const ids = fixtures.map((f) => f.id);
    expect(ids).toContain('zru-zambia-2026');
    expect(ids).toContain('zru-usa-2026');

    const times = fixtures.map((f) => f.date.getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it('merges fixtures from all sources', async () => {
    getWorldRugbyFixtures.mockResolvedValue([
      makeFixture({ id: 'wr-1', date: new Date('2025-01-01T10:00:00Z') }),
    ]);
    getTicketmasterFixtures.mockResolvedValue([
      makeFixture({ id: 'tm-1', date: new Date('2025-02-01T10:00:00Z') }),
    ]);

    const ids = (await getAllFixtures()).map((f) => f.id);
    expect(ids).toContain('wr-1');
    expect(ids).toContain('tm-1');
  });

  it('deduplicates same-day fixtures, preferring the Ticketmaster entry', async () => {
    const day = new Date('2027-03-03T10:00:00Z');
    getWorldRugbyFixtures.mockResolvedValue([
      makeFixture({
        id: 'wr-dup',
        date: day,
        homeTeam: { name: 'Zimbabwe' },
        awayTeam: { name: 'Kenya' },
      }),
    ]);
    getTicketmasterFixtures.mockResolvedValue([
      makeFixture({
        id: 'tm-dup',
        date: new Date('2027-03-03T18:00:00Z'),
        homeTeam: { name: 'Kenya' },
        awayTeam: { name: 'Zimbabwe' },
      }),
    ]);

    const fixtures = await getAllFixtures();
    const matching = fixtures.filter(
      (f) => f.id === 'wr-dup' || f.id === 'tm-dup'
    );
    expect(matching).toHaveLength(1);
    expect(matching[0].id).toBe('tm-dup');
  });

  it('ignores a source that rejects and still returns the others', async () => {
    getWorldRugbyFixtures.mockRejectedValue(new Error('network down'));
    getTicketmasterFixtures.mockResolvedValue([
      makeFixture({ id: 'tm-ok', date: new Date('2028-01-01T10:00:00Z') }),
    ]);

    const ids = (await getAllFixtures()).map((f) => f.id);
    expect(ids).toContain('tm-ok');
    expect(ids).toContain('zru-zambia-2026');
    expect(ids).not.toContain('wr-1');
  });
});

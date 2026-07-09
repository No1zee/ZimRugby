import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getTeamData } from './teams';

describe('getTeamData (mock fallback)', () => {
  beforeEach(() => vi.stubEnv('NEXT_PUBLIC_DIRECTUS_URL', ''));
  afterEach(() => vi.unstubAllEnvs());

  it.each(['sables', 'lady-sables', 'junior-sables', 'cheetahs', 'u20'])(
    'returns a fully-populated team for slug "%s"',
    async (slug) => {
      const team = await getTeamData(slug);
      expect(team).not.toBeNull();
      expect(team!.id).toBe(slug);
      expect(team!.name).toBeTruthy();
      expect(team!.squad.length).toBeGreaterThan(0);
      expect(team!.coachingStaff.length).toBeGreaterThan(0);
      expect(team!.matches.length).toBeGreaterThan(0);
      for (const m of team!.matches) {
        expect(['upcoming', 'completed']).toContain(m.status);
      }
    }
  );

  it('returns null for an unknown slug', async () => {
    expect(await getTeamData('nonexistent')).toBeNull();
  });
});

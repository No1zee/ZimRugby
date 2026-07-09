import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getFixtureTwinData } from './fixtures';

describe('getFixtureTwinData (mock fallback)', () => {
  beforeEach(() => vi.stubEnv('NEXT_PUBLIC_DIRECTUS_URL', ''));
  afterEach(() => vi.unstubAllEnvs());

  it('returns a completed previous match and an upcoming next match', async () => {
    const { previous, upcoming } = await getFixtureTwinData();

    expect(previous.status).toBe('completed');
    expect(previous.homeTeam.score).toBe(32);
    expect(previous.awayTeam.score).toBe(10);

    expect(upcoming.status).toBe('upcoming');
    expect(upcoming.homeTeam.name).toBe('Zimbabwe Sables');
    expect(upcoming.awayTeam.score).toBeUndefined();
  });
});

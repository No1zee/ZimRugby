import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getRankingsData } from './rankings';

describe('getRankingsData (mock fallback)', () => {
  beforeEach(() => vi.stubEnv('NEXT_PUBLIC_DIRECTUS_URL', ''));
  afterEach(() => vi.unstubAllEnvs());

  it('returns world and africa ranking details plus rivals', async () => {
    const data = await getRankingsData();

    expect(data.world.position).toBe(28);
    expect(data.africa.position).toBe(2);
    expect(['up', 'down', 'stable']).toContain(data.world.trend);
    expect(['up', 'down', 'stable']).toContain(data.africa.trend);

    expect(data.rivals.length).toBeGreaterThan(0);
    for (const r of data.rivals) {
      expect(r.name).toBeTruthy();
      expect(typeof r.position).toBe('number');
      expect(typeof r.points).toBe('number');
    }
  });

  it('lists rivals in ascending world-ranking order', async () => {
    const { rivals } = await getRankingsData();
    const positions = rivals.map((r) => r.position);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
});

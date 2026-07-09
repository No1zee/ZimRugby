import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getVideos } from './videos';

describe('getVideos (mock fallback)', () => {
  beforeEach(() => vi.stubEnv('NEXT_PUBLIC_DIRECTUS_URL', ''));
  afterEach(() => vi.unstubAllEnvs());

  it('returns the mock video list when Directus is not configured', async () => {
    const videos = await getVideos();
    expect(videos.length).toBeGreaterThan(0);
    expect(videos[0].id).toBe('vid-sables-namibia-2025');
    for (const v of videos) {
      expect(typeof v.title).toBe('string');
      expect(v.embedUrl).toMatch(/^https:\/\//);
      expect(v.thumbnail.startsWith('/')).toBe(true);
    }
  });

  it('returns entries with unique ids', async () => {
    const videos = await getVideos();
    const ids = videos.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

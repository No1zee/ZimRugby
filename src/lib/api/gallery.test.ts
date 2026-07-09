import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getPhotos } from './gallery';

describe('getPhotos (mock fallback)', () => {
  beforeEach(() => vi.stubEnv('NEXT_PUBLIC_DIRECTUS_URL', ''));
  afterEach(() => vi.unstubAllEnvs());

  it('returns the mock photo list when Directus is not configured', async () => {
    const photos = await getPhotos();
    expect(photos.length).toBeGreaterThan(0);
    for (const p of photos) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.image.startsWith('/')).toBe(true);
    }
  });

  it('uses only known album categories', async () => {
    const albums = new Set(
      ['Match Day', 'Historical Collections', 'Community Rugby', 'Training Camps']
    );
    for (const p of await getPhotos()) {
      expect(albums.has(p.album)).toBe(true);
    }
  });
});

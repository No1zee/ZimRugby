import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getHeroSlides } from './hero';

describe('getHeroSlides (mock fallback)', () => {
  beforeEach(() => vi.stubEnv('NEXT_PUBLIC_DIRECTUS_URL', ''));
  afterEach(() => vi.unstubAllEnvs());

  it('returns hero slides with required headline and CTA structure', async () => {
    const slides = await getHeroSlides();
    expect(slides.length).toBeGreaterThan(0);
    for (const s of slides) {
      expect(typeof s.id).toBe('number');
      expect(s.headline.line1).toBeTruthy();
      expect(s.headline.line2).toBeTruthy();
      expect(s.image).toBeTruthy();
      expect(s.ctas.primary.label).toBeTruthy();
      expect(s.ctas.primary.href.startsWith('/')).toBe(true);
    }
  });

  it('uses unique slide ids', async () => {
    const ids = (await getHeroSlides()).map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('provides a match card only on fixture-driven slides', async () => {
    const slides = await getHeroSlides();
    const withCard = slides.filter((s) => s.matchCard);
    expect(withCard.length).toBeGreaterThan(0);
    for (const s of withCard) {
      expect(s.matchCard?.opponent).toBeTruthy();
      expect(s.matchCard?.venue).toBeTruthy();
    }
  });
});

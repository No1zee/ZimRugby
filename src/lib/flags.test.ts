import { describe, it, expect } from 'vitest';
import { COUNTRY_ISO_MAP, getFlagUrl } from './flags';

describe('getFlagUrl', () => {
  it('returns a flagcdn URL for a known country', () => {
    expect(getFlagUrl('Zimbabwe')).toBe('https://flagcdn.com/w160/zw.png');
  });

  it('maps every entry in COUNTRY_ISO_MAP to its ISO code URL', () => {
    for (const [country, iso] of Object.entries(COUNTRY_ISO_MAP)) {
      expect(getFlagUrl(country)).toBe(`https://flagcdn.com/w160/${iso}.png`);
    }
  });

  it('returns an empty string for an unknown country', () => {
    expect(getFlagUrl('Atlantis')).toBe('');
  });

  it('is case-sensitive and does not match lowercased names', () => {
    expect(getFlagUrl('zimbabwe')).toBe('');
  });

  it('returns empty string for an empty input', () => {
    expect(getFlagUrl('')).toBe('');
  });

  it('handles alternate labels that share an ISO code', () => {
    expect(getFlagUrl("South Africa 'A'")).toBe('https://flagcdn.com/w160/za.png');
    expect(getFlagUrl('South Africa')).toBe('https://flagcdn.com/w160/za.png');
  });
});

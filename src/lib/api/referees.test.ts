import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getRefereeResources,
  getRefereeCourses,
  getRefereeNotices,
} from './referees';

describe('referees API (mock fallback)', () => {
  beforeEach(() => vi.stubEnv('NEXT_PUBLIC_DIRECTUS_URL', ''));
  afterEach(() => vi.unstubAllEnvs());

  it('getRefereeResources returns resources with valid categories', async () => {
    const resources = await getRefereeResources();
    expect(resources.length).toBeGreaterThan(0);
    const valid = new Set(['laws', 'guides', 'forms']);
    for (const r of resources) {
      expect(valid.has(r.category)).toBe(true);
      expect(r.title).toBeTruthy();
    }
  });

  it('getRefereeCourses returns courses with open/closed status', async () => {
    const courses = await getRefereeCourses();
    expect(courses.length).toBeGreaterThan(0);
    for (const c of courses) {
      expect(['open', 'closed']).toContain(c.status);
      expect(c.venue).toBeTruthy();
    }
  });

  it('getRefereeNotices returns notices with excerpt and content', async () => {
    const notices = await getRefereeNotices();
    expect(notices.length).toBeGreaterThan(0);
    for (const n of notices) {
      expect(n.id).toBeTruthy();
      expect(n.excerpt).toBeTruthy();
      expect(n.content).toBeTruthy();
    }
  });
});

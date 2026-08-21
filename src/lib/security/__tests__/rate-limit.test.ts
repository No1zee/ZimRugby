import { describe, it, expect, beforeEach } from 'vitest';
import { SlidingWindowRateLimiter } from '../rate-limit';

describe('SlidingWindowRateLimiter', () => {
  let limiter: SlidingWindowRateLimiter;

  beforeEach(() => {
    limiter = new SlidingWindowRateLimiter({
      windowMs: 1000,
      maxRequests: 5
    });
  });

  it('allows requests within threshold', () => {
    for (let i = 0; i < 5; i++) {
      const res = limiter.check('test-ip');
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(4 - i);
    }
  });

  it('blocks requests exceeding maximum allowance', () => {
    for (let i = 0; i < 5; i++) {
      limiter.check('test-ip');
    }

    const blocked = limiter.check('test-ip');
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetMs).toBeGreaterThan(0);
  });

  it('tracks distinct IP keys independently', () => {
    for (let i = 0; i < 5; i++) {
      limiter.check('ip-1');
    }

    expect(limiter.check('ip-1').success).toBe(false);
    expect(limiter.check('ip-2').success).toBe(true);
  });
});

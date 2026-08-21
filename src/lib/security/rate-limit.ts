/**
 * In-memory sliding window rate limiter for API endpoints
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitRecord {
  timestamps: number[];
}

export class SlidingWindowRateLimiter {
  private tracker = new Map<string, RateLimitRecord>();
  private windowMs: number;
  private maxRequests: number;

  constructor(config: RateLimitConfig) {
    this.windowMs = config.windowMs;
    this.maxRequests = config.maxRequests;
  }

  /**
   * Evaluate if a key (e.g. client IP or user ID) is rate-limited
   */
  public check(key: string): { success: boolean; limit: number; remaining: number; resetMs: number } {
    const now = Date.now();
    const record = this.tracker.get(key) || { timestamps: [] };

    // Clean up timestamps outside current sliding window
    const validTimestamps = record.timestamps.filter(ts => now - ts < this.windowMs);

    if (validTimestamps.length >= this.maxRequests) {
      const oldest = validTimestamps[0];
      const resetMs = this.windowMs - (now - oldest);
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        resetMs: Math.max(0, resetMs)
      };
    }

    validTimestamps.push(now);
    this.tracker.set(key, { timestamps: validTimestamps });

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - validTimestamps.length,
      resetMs: this.windowMs
    };
  }

  /**
   * Reset specific key or clear all records
   */
  public reset(key?: string): void {
    if (key) {
      this.tracker.delete(key);
    } else {
      this.tracker.clear();
    }
  }
}

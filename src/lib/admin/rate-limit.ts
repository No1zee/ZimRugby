// In-memory failed-attempt limiter (NIST AC-7 / ISO 27001).
// NOTE: in-memory — resets on server restart / scales per instance on serverless.
const FAILED_ATTEMPTS: Record<string, { count: number; lockUntil: number }> = {};

export const MAX_ATTEMPTS = 5;
export const LOCKOUT_MS = 15 * 60 * 1000; // 15 min lock

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const record = FAILED_ATTEMPTS[ip];

  if (!record) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (record.lockUntil > now) {
    const retryAfter = Math.ceil((record.lockUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  if (record.lockUntil <= now && record.count >= MAX_ATTEMPTS) {
    delete FAILED_ATTEMPTS[ip];
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

export function registerFailedAttempt(ip: string) {
  const now = Date.now();
  const record = FAILED_ATTEMPTS[ip] || { count: 0, lockUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_MS;
  }
  FAILED_ATTEMPTS[ip] = record;
}

export function clearFailedAttempts(ip: string) {
  delete FAILED_ATTEMPTS[ip];
}

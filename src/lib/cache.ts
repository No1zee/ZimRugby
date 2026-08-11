import { Redis } from "@upstash/redis";

/**
 * Persistent KV cache (Upstash Redis) — the "memory" layer.
 *
 * Sits in front of the Directus failure path: successful Directus reads are
 * written here (TTL 1h); when Directus is unreachable, reads fall back to
 * the last-known-good payload instead of an empty array. Graceful no-op
 * when UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set, so
 * local dev and pre-provision deploys are unaffected.
 */

let client: Redis | null | undefined;

function getClient(): Redis | null {
  if (client !== undefined) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  client = url && token ? new Redis({ url, token }) : null;
  return client;
}

const TIMEOUT_MS = 1500;

async function withTimeout<T>(op: Promise<T>): Promise<T | null> {
  return Promise.race([
    op.catch(() => null),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS)),
  ]);
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const c = getClient();
  if (!c) return null;
  return withTimeout(c.get<T>(key));
}

export async function kvSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const c = getClient();
  if (!c) return;
  await withTimeout(c.set(key, value, { ex: ttlSeconds }));
}

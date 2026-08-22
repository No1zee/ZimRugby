import { Redis } from "@upstash/redis";

/**
 * Dual-tier Persistent & In-Memory KV cache — the "resilience" layer.
 *
 * Sits in front of the Directus failure path: successful Directus reads are
 * written here (TTL default 1h); when Directus is unreachable, reads fall back to
 * the last-known-good payload instead of an empty array.
 *
 * Tier 1: In-memory cache (zero-cost, zero-config, immediate instant access)
 * Tier 2: Upstash Redis (distributed persistent cache across serverless instances)
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const MAX_MEMORY_ITEMS = 500;

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

/**
 * Retrieve a cached value by key.
 * Checks fast in-memory store first, then falls back to Upstash Redis.
 */
export async function kvGet<T>(key: string): Promise<T | null> {
  const now = Date.now();
  
  // 1. Check in-memory cache
  const mem = memoryCache.get(key);
  if (mem) {
    if (mem.expiresAt > now) {
      return mem.value as T;
    }
    memoryCache.delete(key);
  }

  // 2. Check Upstash Redis
  const c = getClient();
  if (!c) return null;
  
  const redisVal = await withTimeout(c.get<T>(key));
  if (redisVal !== null && redisVal !== undefined) {
    // Populate in-memory cache for fast subsequent reads
    memoryCache.set(key, { value: redisVal, expiresAt: now + 300_000 }); // 5 min memory cache
    return redisVal;
  }

  return null;
}

/**
 * Set a cached value with TTL in seconds.
 * Writes to both in-memory store and Upstash Redis (if configured).
 */
export async function kvSet(key: string, value: unknown, ttlSeconds: number = 3600): Promise<void> {
  const now = Date.now();

  // 1. Evict oldest item if memory cache exceeds limit
  if (memoryCache.size >= MAX_MEMORY_ITEMS) {
    const firstKey = memoryCache.keys().next().value;
    if (firstKey) memoryCache.delete(firstKey);
  }

  // 2. Set in-memory cache
  memoryCache.set(key, {
    value,
    expiresAt: now + ttlSeconds * 1000,
  });

  // 3. Set Upstash Redis (if configured)
  const c = getClient();
  if (!c) return;
  await withTimeout(c.set(key, value, { ex: ttlSeconds }));
}

/**
 * Invalidate a key or all keys matching a prefix.
 */
export async function kvPurge(prefix?: string): Promise<void> {
  if (!prefix) {
    memoryCache.clear();
  } else {
    for (const key of Array.from(memoryCache.keys())) {
      if (key.startsWith(prefix)) {
        memoryCache.delete(key);
      }
    }
  }

  const c = getClient();
  if (c && prefix) {
    try {
      const keys = await withTimeout(c.keys(`${prefix}*`));
      if (keys && keys.length > 0) {
        await withTimeout(c.del(...keys));
      }
    } catch {
      // Ignore cleanup timeout/error
    }
  }
}


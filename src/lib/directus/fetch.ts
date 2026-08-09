/**
 * Reusable plain-REST fetch helper to interact with Directus collections.
 * Uses native fetch with ISR revalidation for server-cached reads.
 */

interface FetchParams {
  fields?: string[];
  filter?: Record<string, unknown>;
  sort?: string[];
  limit?: number;
  page?: number;
  search?: string;
  aggregate?: Record<string, unknown>;
  groupBy?: string[];
}

export async function directusFetch<T>(
  collection: string,
  params: FetchParams = {},
  revalidateSeconds: number = 60
): Promise<T[]> {
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const token = process.env.DIRECTUS_READ_TOKEN || process.env.DIRECTUS_TOKEN;

  if (!baseUrl) {
    console.error(`[directusFetch] NEXT_PUBLIC_DIRECTUS_URL is not set`);
    return [] as T[];
  }

  const url = new URL(`${baseUrl}/items/${collection}`);

  if (params.fields) {
    url.searchParams.append("fields", params.fields.join(","));
  }
  if (params.filter) {
    url.searchParams.append("filter", JSON.stringify(params.filter));
  }
  if (params.sort) {
    url.searchParams.append("sort", params.sort.join(","));
  }
  if (params.limit !== undefined) {
    url.searchParams.append("limit", String(params.limit));
  }
  if (params.page !== undefined) {
    url.searchParams.append("page", String(params.page));
  }
  if (params.search) {
    url.searchParams.append("search", params.search);
  }
  if (params.aggregate) {
    url.searchParams.append("aggregate", JSON.stringify(params.aggregate));
  }
  if (params.groupBy?.length) {
    url.searchParams.append("groupBy", params.groupBy.join(","));
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(url.toString(), {
      next: { revalidate: revalidateSeconds },
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[directusFetch] Directus returned status ${res.status} for collection "${collection}". URL: ${url.toString()}. Body: ${errText}. Falling back to local data.`);
      return [] as T[];
    }

    const json = await res.json();
    return (json.data || []) as T[];
  } catch (error) {
    console.error(`Failed to fetch from Directus collection "${collection}":`, error);
    return [] as T[];
  }
}

/**
 * Count total items in a Directus collection using the aggregate endpoint.
 * Unaffected by the item limit cap — returns the real total.
 */
export async function directusCount(
  collection: string,
  filter?: Record<string, unknown>,
  revalidateSeconds: number = 0
): Promise<number> {
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const token = process.env.DIRECTUS_READ_TOKEN || process.env.DIRECTUS_TOKEN;

  if (!baseUrl) {
    return 0;
  }

  const url = new URL(`${baseUrl}/items/${collection}`);
  url.searchParams.append("aggregate", JSON.stringify({ count: "*" }));
  if (filter) {
    url.searchParams.append("filter", JSON.stringify(filter));
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: revalidateSeconds },
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!res.ok) return 0;
    const json = await res.json();
    const row = json?.data?.[0]?.count;
    if (row && typeof row === "object") {
      const value = Object.values(row)[0];
      return typeof value === "number" ? value : 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Write a single item to a Directus collection (server-side only).
 * Uses DIRECTUS_TOKEN for authentication.
 */
export async function directusWrite<T>(
  collection: string,
  data: Record<string, unknown>
): Promise<T | null> {
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const token = process.env.DIRECTUS_TOKEN;

  if (!baseUrl || !token) {
    console.error(`[directusWrite] NEXT_PUBLIC_DIRECTUS_URL or DIRECTUS_TOKEN is not set`);
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/items/${collection}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Directus write failed (${res.status}): ${errBody}`);
    }

    const json = await res.json();
    return json.data as T;
  } catch (error) {
    console.error(`Failed to write to Directus collection "${collection}":`, error);
    return null;
  }
}

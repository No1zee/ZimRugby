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
}

export async function directusFetch<T>(
  collection: string,
  params: FetchParams = {},
  revalidateSeconds: number = 60
): Promise<T[]> {
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const token = process.env.DIRECTUS_TOKEN;

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

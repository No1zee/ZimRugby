/**
 * Reusable plain-REST fetch helper to interact with Directus collections.
 * Uses native fetch with ISR revalidation — no SDK generics.
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

  if (!baseUrl) {
    console.warn(`Directus URL not configured — returning empty fallback for collection "${collection}".`);
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

    const res = await fetch(url.toString(), {
      next: { revalidate: revalidateSeconds },
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Directus returned status ${res.status} for collection ${collection}`);
    }

    const json = await res.json();
    return (json.data || []) as T[];
  } catch (error) {
    console.error(`Failed to fetch from Directus collection "${collection}":`, error);
    throw error;
  }
}

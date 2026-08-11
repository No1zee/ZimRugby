import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Directus webhook target for on-demand ISR revalidation.
 *
 * Directus fires POST /api/revalidate whenever an item is created, updated
 * or deleted; we invalidate the fetch cache for that collection so pages
 * re-render on the next request instead of waiting for the revalidate
 * window (60–300s). Authorized with a shared secret (REVALIDATE_SECRET,
 * sent by Directus as an Authorization: Bearer header).
 */
const SECRET = process.env.REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  const expected = `Bearer ${SECRET}`;
  const auth = req.headers.get("authorization") || "";

  if (!SECRET || auth !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const collection = body?.collection || body?.payload?.collection || body?.key;

  if (!collection) {
    return NextResponse.json({ error: "missing collection" }, { status: 400 });
  }

  // Next 16 requires a cache-life profile; "minutes" keeps the revalidated
  // data cached with stale-while-revalidate semantics after the purge.
  revalidateTag(`directus:${collection}`, "minutes");
  return NextResponse.json({ revalidated: true, collection });
}

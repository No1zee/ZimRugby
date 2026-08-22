import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { kvPurge } from "@/lib/cache";

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

  if (collection === "*" || collection === "all") {
    const allCollections = [
      "news",
      "matches",
      "teams",
      "players",
      "opponents",
      "competitions",
      "venues",
      "events",
      "hero_slides",
      "announcements",
      "partners",
      "campaigns",
      "grassroots_initiatives",
      "pages",
      "faqs",
      "footer_navigation",
    ];
    for (const c of allCollections) {
      revalidateTag(`directus:${c}`, "minutes");
    }
    await kvPurge();
    return NextResponse.json({ revalidated: true, collections: allCollections });
  }

  // Next 16 requires a cache-life profile; "minutes" keeps the revalidated
  // data cached with stale-while-revalidate semantics after the purge.
  revalidateTag(`directus:${collection}`, "minutes");
  await kvPurge(`directus:${collection}`);

  // If news or hero_slides changed, co-revalidate both to ensure instant homepage synchronization
  if (collection === "news") {
    revalidateTag("directus:hero_slides", "minutes");
    await kvPurge("directus:hero_slides");
  } else if (collection === "hero_slides") {
    revalidateTag("directus:news", "minutes");
    await kvPurge("directus:news");
  }

  return NextResponse.json({ revalidated: true, collection });
}

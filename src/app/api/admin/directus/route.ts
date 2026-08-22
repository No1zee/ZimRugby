import { NextRequest, NextResponse } from "next/server";
import { requireCollectionAction, requireSuperAdmin, type AdminSession } from "@/lib/admin/auth";
import { persistAuditEvent } from "@/lib/supabase/admin";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://zru-directus-cms-production.up.railway.app";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

// Collections whose primary key is a text/uuid field without a DB default —
// Directus will not auto-generate an id for these, so creates must supply one.
const TEXT_ID_COLLECTIONS = new Set([
  "announcements",
  "matches",
  "pages",
  "teams",
  "opponents",
  "competitions",
  "venues",
]);

// Fields clients may never set directly — they are owned by soft-delete, audit, or authorship.
const SERVER_ONLY_FIELDS = ["deleted_at", "deleted_by", "created_by_email"];

function stripServerOnly(data: Record<string, unknown>): Record<string, unknown> {
  const out = { ...data };
  for (const f of SERVER_ONLY_FIELDS) delete out[f];
  return out;
}

async function audit(
  session: AdminSession,
  action: string,
  resource: string,
  details?: string,
  ipAddress?: string
): Promise<void> {
  try {
    await persistAuditEvent({
      actorEmail: session.email,
      actorRole: session.role,
      action,
      resource,
      details: details ? details.slice(0, 4000) : undefined,
      ipAddress,
    });
  } catch (e) {
    console.warn(`[audit] failed to persist ${action} for ${resource}:`, e);
  }
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Fire-and-forget Next.js fetch-cache purge so admin writes (create/patch/delete)
// show up in the CMS immediately instead of waiting on the Directus flow round-trip.
async function revalidateCollection(request: NextRequest, collection: string) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return;
  try {
    await fetch(`${request.nextUrl.origin}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify({ collection }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Best-effort only; the Directus revalidation flow is the fallback.
  }
}

async function syncHeroSlideFromNews(
  newsId: string | number,
  newsData: Record<string, unknown>,
  action: "upsert" | "remove"
) {
  try {
    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) return;

    const slug = newsData.slug || `news-${newsId}`;
    const targetHref = `/media/${slug}`;

    const currentSlidesRes = await directusJson(`/items/hero_slides?sort=sort&limit=50`);
    const existingSlides = (currentSlidesRes.body?.data || []) as Record<string, unknown>[];

    const existingSlide = existingSlides.find(
      (s) =>
        String(s.linked_news_id || "") === String(newsId) ||
        String(s.cta1_href || "").includes(String(slug)) ||
        String(s.cta1_href || "").includes(`news-${newsId}`)
    );

    if (action === "remove") {
      if (existingSlide) {
        await directusJson(`/items/hero_slides/${existingSlide.id}`, {
          method: "PATCH",
          body: JSON.stringify({ is_active: false, status: "draft" }),
        });
      }
      return;
    }

    const title = String(newsData.title || "Latest Rugby News");
    const excerpt = String(newsData.excerpt || newsData.summary || "");
    const image = String(newsData.image || "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp");
    const category = String(newsData.category || "National Teams").toUpperCase();

    // Shift older slides down
    for (const slide of existingSlides) {
      if (existingSlide && String(slide.id) === String(existingSlide.id)) continue;
      const currentSort = Number(slide.sort) || 1;
      await directusJson(`/items/hero_slides/${slide.id}`, {
        method: "PATCH",
        body: JSON.stringify({ sort: currentSort + 1 }),
      });
    }

    const slidePayload = {
      headline_line1: title.length > 35 ? title.slice(0, 35) : title,
      headline_line2: title.length > 35 ? title.slice(35).trim() : "",
      subtext: excerpt.slice(0, 200),
      tag: category,
      context_pill: "OFFICIAL MATCH & NEWS DESK",
      image,
      cta1_label: "READ FULL STORY",
      cta1_href: targetHref,
      sort: 1,
      is_active: true,
      status: "published",
      linked_news_id: String(newsId),
    };

    if (existingSlide) {
      await directusJson(`/items/hero_slides/${existingSlide.id}`, {
        method: "PATCH",
        body: JSON.stringify(slidePayload),
      });
    } else {
      await directusJson(`/items/hero_slides`, {
        method: "POST",
        body: JSON.stringify(slidePayload),
      });
    }
  } catch (err) {
    console.warn("[syncHeroSlideFromNews] Warning during hero slide sync:", err);
  }
}

async function syncFlashBannerFromNews(
  newsId: string | number,
  newsData: Record<string, unknown>,
  action: "upsert" | "remove"
) {
  try {
    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) return;

    const slug = newsData.slug || `news-${newsId}`;
    const targetHref = `/media/${slug}`;

    const currentAnnRes = await directusJson(`/items/announcements?limit=50`);
    const existingAnns = (currentAnnRes.body?.data || []) as Record<string, unknown>[];

    const existingAnn = existingAnns.find(
      (a) =>
        String(a.related_article || "") === String(newsId) ||
        String(a.cta_url || "").includes(String(slug)) ||
        String(a.cta_url || "").includes(`news-${newsId}`)
    );

    if (action === "remove") {
      if (existingAnn) {
        await directusJson(`/items/announcements/${existingAnn.id}`, {
          method: "PATCH",
          body: JSON.stringify({ is_enabled: false, status: "draft" }),
        });
      }
      return;
    }

    const title = String(newsData.title || "Breaking Rugby Update");
    const expiryHours = Number(newsData.breaking_expiry_hours) || 48;
    const now = new Date();
    const endsAt = new Date(now.getTime() + expiryHours * 3600 * 1000).toISOString();

    const bannerPayload = {
      title,
      body: String(newsData.excerpt || "").slice(0, 140),
      design_variant: "banner",
      badge: "BREAKING NEWS",
      priority: "30",
      starts_at: now.toISOString(),
      ends_at: endsAt,
      segment: "general",
      scope: ["global", "homepage", "media"],
      cta_label: "READ STORY",
      cta_url: targetHref,
      is_sticky: true,
      is_enabled: true,
      status: "published",
      related_article: String(newsId),
    };

    if (existingAnn) {
      await directusJson(`/items/announcements/${existingAnn.id}`, {
        method: "PATCH",
        body: JSON.stringify(bannerPayload),
      });
    } else {
      await directusJson(`/items/announcements`, {
        method: "POST",
        body: JSON.stringify({
          id: crypto.randomUUID(),
          ...bannerPayload,
        }),
      });
    }
  } catch (err) {
    console.warn("[syncFlashBannerFromNews] Warning during flash banner sync:", err);
  }
}

async function directusJson(path: string, init: RequestInit = {}): Promise<{ ok: boolean; status: number; body: any }> {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { ok: res.ok, status: res.status, body };
}

// Compact before/after diff of scalar fields only (no blobs, no relations).
function diffScalars(before: Record<string, unknown>, after: Record<string, unknown>): Record<string, unknown> {
  const diff: Record<string, unknown> = {};
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  for (const k of keys) {
    if (SERVER_ONLY_FIELDS.includes(k)) continue;
    const b = before?.[k];
    const a = after?.[k];
    if (typeof b === "object" || typeof a === "object") continue;
    if (String(b ?? "") !== String(a ?? "")) diff[k] = { from: b ?? null, to: a ?? null };
  }
  return diff;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection");

  try {
    await requireCollectionAction(collection || "", "read");
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return NextResponse.json({ error: "Directus not configured" }, { status: 500 });
  }

  if (!collection) {
    return NextResponse.json({ error: "Missing collection" }, { status: 400 });
  }

  // Forward only allowed read query params (limit capped so a single panel
  // request can never pull the entire CMS into the browser).
  const allowed = new Set(["sort", "limit", "fields", "offset", "search", "filter", "deep"]);
  const forward = new URLSearchParams();
  for (const [key, value] of url.searchParams.entries()) {
    if (allowed.has(key)) forward.set(key, value);
  }
  if (!forward.has("limit")) forward.set("limit", "250");

  // Trashed rows are excluded by default; only explicit includeDeleted=true
  // (trash UI / snapshots) sees them.
  const includeDeleted = url.searchParams.get("includeDeleted") === "true";
  if (!includeDeleted) {
    let filter: Record<string, unknown>;
    try {
      filter = JSON.parse(url.searchParams.get("filter") || "{}");
    } catch {
      return NextResponse.json({ error: "Invalid filter JSON" }, { status: 400 });
    }
    filter = { deleted_at: { _null: true }, ...filter };
    forward.set("filter", JSON.stringify(filter));
  }

  const result = await directusJson(`/items/${collection}?${forward.toString()}`);
  if (!result.ok) {
    return NextResponse.json(
      { error: typeof result.body === "string" ? result.body : "Directus error" },
      { status: result.status }
    );
  }
  return NextResponse.json(result.body);
}

export async function POST(request: NextRequest) {
  const { collection, data } = await request.json();
  let session: AdminSession;
  try {
    session = await requireCollectionAction(collection, "create");
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return NextResponse.json({ error: "Directus not configured" }, { status: 500 });
  }

  if (!collection || !data) {
    return NextResponse.json({ error: "Missing collection or data" }, { status: 400 });
  }

  const payload = stripServerOnly({ ...data });
  if (!payload.id && TEXT_ID_COLLECTIONS.has(collection)) {
    payload.id = crypto.randomUUID();
  }
  if (collection === "news" || collection === "campaigns") {
    payload.created_by_email = session.email;
  }

  const result = await directusJson(`/items/${collection}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: typeof result.body === "string" ? result.body : "Directus error" },
      { status: result.status }
    );
  }

  const created = result.body?.data;
  await audit(session, "CREATE", `${collection}:${created?.id ?? "?"}`, JSON.stringify(payload).slice(0, 2000), clientIp(request));
  void revalidateCollection(request, collection);

  if (collection === "news" && created?.id) {
    if (payload.is_featured_hero === true && payload.status === "published") {
      await syncHeroSlideFromNews(created.id, { ...payload, id: created.id }, "upsert");
      void revalidateCollection(request, "hero_slides");
    }
    if (payload.is_breaking_banner === true && payload.status === "published") {
      await syncFlashBannerFromNews(created.id, { ...payload, id: created.id }, "upsert");
      void revalidateCollection(request, "announcements");
    }
  }

  return NextResponse.json(result.body);
}

export async function PATCH(request: NextRequest) {
  const { collection, id, ids, data } = await request.json();
  let session: AdminSession;
  try {
    session = await requireCollectionAction(collection, "update");
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return NextResponse.json({ error: "Directus not configured" }, { status: 500 });
  }

  if (!collection || !data || (ids === undefined && id === undefined)) {
    return NextResponse.json({ error: "Missing collection, id/ids, or data" }, { status: 400 });
  }

  const cleanData = stripServerOnly(data);

  try {
    if (ids && Array.isArray(ids) && ids.length > 0) {
      // Bulk update: capture before-state for all ids, then patch.
      const beforeRes = await directusJson(
        `/items/${collection}?filter=${encodeURIComponent(JSON.stringify({ id: { _in: ids } }))}&limit=500`
      );
      const beforeRows = (beforeRes.body?.data || []) as Record<string, unknown>[];

      const result = await directusJson(`/items/${collection}`, {
        method: "PATCH",
        body: JSON.stringify({ keys: ids, data: cleanData }),
      });

      if (!result.ok) {
        return NextResponse.json(
          { error: typeof result.body === "string" ? result.body : "Directus error" },
          { status: result.status }
        );
      }

      const afterRows = (result.body?.data || []) as Record<string, unknown>[];
      const diffs = afterRows.map((row) => {
        const before = beforeRows.find((b) => String(b.id) === String(row.id)) || {};
        return { id: row.id, changes: diffScalars(before as Record<string, unknown>, row) };
      });
      await audit(session, "UPDATE", `${collection}:${ids.join(",")}`, JSON.stringify(diffs).slice(0, 3000), clientIp(request));
      void revalidateCollection(request, collection);
      return NextResponse.json(result.body);
    }

    if (!id) {
      return NextResponse.json({ error: "Missing id or ids" }, { status: 400 });
    }

    const beforeRes = await directusJson(`/items/${collection}/${id}?fields=*`);
    const before = beforeRes.body?.data as Record<string, unknown> | null;

    const result = await directusJson(`/items/${collection}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(cleanData),
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: typeof result.body === "string" ? result.body : "Directus error" },
        { status: result.status }
      );
    }

    const after = result.body?.data as Record<string, unknown> | null;
    const diff = diffScalars(before || {}, after || {});
    await audit(session, "UPDATE", `${collection}:${id}`, JSON.stringify(diff).slice(0, 3000), clientIp(request));
    void revalidateCollection(request, collection);

    if (collection === "news" && id) {
      const merged = { ...before, ...after, ...cleanData };
      if (cleanData.is_featured_hero === true && (merged.status === "published" || cleanData.status === "published")) {
        await syncHeroSlideFromNews(id, merged, "upsert");
        void revalidateCollection(request, "hero_slides");
      } else if (cleanData.is_featured_hero === false || cleanData.status === "draft") {
        await syncHeroSlideFromNews(id, merged, "remove");
        void revalidateCollection(request, "hero_slides");
      }

      if (cleanData.is_breaking_banner === true && (merged.status === "published" || cleanData.status === "published")) {
        await syncFlashBannerFromNews(id, merged, "upsert");
        void revalidateCollection(request, "announcements");
      } else if (cleanData.is_breaking_banner === false || cleanData.status === "draft") {
        await syncFlashBannerFromNews(id, merged, "remove");
        void revalidateCollection(request, "announcements");
      }
    }

    return NextResponse.json(result.body);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { collection, id, ids, hard } = await request.json();
  let session: AdminSession;
  try {
    session = await requireCollectionAction(collection, "delete");
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return NextResponse.json({ error: "Directus not configured" }, { status: 500 });
  }

  if (!collection || (!id && !(ids && Array.isArray(ids) && ids.length > 0))) {
    return NextResponse.json({ error: "Missing collection or id" }, { status: 400 });
  }

  try {
    // Hard delete: permanent removal, super_admin-gated server-side.
    if (hard === true) {
      const session2 = await requireSuperAdmin().catch(() => null);
      if (!session2) {
        return NextResponse.json({ error: "Forbidden: hard delete requires super admin" }, { status: 403 });
      }
      if (ids && Array.isArray(ids) && ids.length > 0) {
        const result = await directusJson(`/items/${collection}`, {
          method: "DELETE",
          body: JSON.stringify({ keys: ids }),
        });
        if (!result.ok) {
          return NextResponse.json({ error: result.body?.errors?.[0]?.message || "Directus error" }, { status: result.status });
        }
        await audit(session2, "PURGE", `${collection}:${ids.join(",")}`, `hard-deleted ${ids.length} items`, clientIp(request));
        void revalidateCollection(request, collection);
        return NextResponse.json({ success: true });
      }
      const result = await directusJson(`/items/${collection}/${id}`, { method: "DELETE" });
      if (!result.ok) {
        return NextResponse.json({ error: "Directus error" }, { status: result.status });
      }
      await audit(session2, "PURGE", `${collection}:${id}`, "hard-deleted item", clientIp(request));
      if (collection === "news" && id) {
        await syncHeroSlideFromNews(id, {}, "remove");
        void revalidateCollection(request, "hero_slides");
      }
      void revalidateCollection(request, collection);
      return NextResponse.json({ success: true });
    }

    // Default: soft delete (trash). Row keeps its id, so undo restores the
    // SAME row and every link/reference survives.
    const now = new Date().toISOString();
    const marker = { deleted_at: now, deleted_by: session.email };

    let result;
    if (ids && Array.isArray(ids) && ids.length > 0) {
      result = await directusJson(`/items/${collection}`, {
        method: "PATCH",
        body: JSON.stringify({ keys: ids, data: marker }),
      });
      if (result.ok) {
        await audit(session, "DELETE", `${collection}:${ids.join(",")}`, `trashed ${ids.length} items`, clientIp(request));
      }
    } else {
      const beforeRes = await directusJson(`/items/${collection}/${id}`);
      const before = beforeRes.body?.data as Record<string, unknown> | null;
      result = await directusJson(`/items/${collection}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(marker),
      });
      if (result.ok) {
        const summary = JSON.stringify({ title: before?.title ?? before?.name ?? null, id: before?.id ?? id }).slice(0, 1000);
        await audit(session, "DELETE", `${collection}:${id}`, `trashed: ${summary}`, clientIp(request));
      }
    }

    if (!result.ok) {
      return NextResponse.json(
        { error: typeof result.body === "string" ? result.body : "Directus error" },
        { status: result.status }
      );
    }
    if (collection === "news" && id) {
      await syncHeroSlideFromNews(id, {}, "remove");
      await syncFlashBannerFromNews(id, {}, "remove");
      void revalidateCollection(request, "hero_slides");
      void revalidateCollection(request, "announcements");
    }
    void revalidateCollection(request, collection);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
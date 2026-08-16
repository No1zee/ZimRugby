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

// Fields clients may never set directly — they are owned by soft-delete + audit.
const SERVER_ONLY_FIELDS = ["deleted_at", "deleted_by"];

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
        return NextResponse.json({ success: true });
      }
      const result = await directusJson(`/items/${collection}/${id}`, { method: "DELETE" });
      if (!result.ok) {
        return NextResponse.json({ error: "Directus error" }, { status: result.status });
      }
      await audit(session2, "PURGE", `${collection}:${id}`, "hard-deleted item", clientIp(request));
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
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
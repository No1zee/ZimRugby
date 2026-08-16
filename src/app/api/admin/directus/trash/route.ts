import { NextRequest, NextResponse } from "next/server";
import { requireCollectionAction, requireSuperAdmin, type AdminSession } from "@/lib/admin/auth";
import { persistAuditEvent } from "@/lib/supabase/admin";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://zru-directus-cms-production.up.railway.app";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

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

async function audit(session: AdminSession, action: string, resource: string, details?: string, ipAddress?: string) {
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
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

// Fire-and-forget Next.js fetch-cache purge so trash restore/purge is visible
// in the CMS immediately (Directus revalidation flow is the async fallback).
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

// List trashed rows: GET /api/admin/directus/trash?collection=news
export async function GET(request: NextRequest) {
  const collection = request.nextUrl.searchParams.get("collection");
  try {
    await requireCollectionAction(collection || "", "read");
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message === "Forbidden" ? "Forbidden" : "Unauthorized" },
      { status: e.message === "Forbidden" ? 403 : 401 }
    );
  }
  if (!collection) {
    return NextResponse.json({ error: "Missing collection" }, { status: 400 });
  }

  const filter = JSON.stringify({ deleted_at: { _nnull: true } });
  const result = await directusJson(`/items/${collection}?filter=${encodeURIComponent(filter)}&sort=-deleted_at&limit=250&fields=*`);
  if (!result.ok) {
    return NextResponse.json({ error: "Directus error" }, { status: result.status });
  }
  return NextResponse.json(result.body);
}

// POST { collection, action: "restore" | "purge" | "purge-all", id? | ids? }
export async function POST(request: NextRequest) {
  const { collection, action, id, ids } = await request.json();
  const ip = clientIp(request);

  if (!collection) {
    return NextResponse.json({ error: "Missing collection" }, { status: 400 });
  }

  if (action === "restore") {
    let session: AdminSession;
    try {
      session = await requireCollectionAction(collection, "update");
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message === "Forbidden" ? "Forbidden" : "Unauthorized" },
        { status: e.message === "Forbidden" ? 403 : 401 }
      );
    }
    const keys = id !== undefined && id !== null ? [id] : Array.isArray(ids) ? ids : [];
    if (keys.length === 0) {
      return NextResponse.json({ error: "Missing id or ids" }, { status: 400 });
    }
    const result = await directusJson(`/items/${collection}`, {
      method: "PATCH",
      body: JSON.stringify({ keys, data: { deleted_at: null, deleted_by: null } }),
    });
    if (!result.ok) {
      return NextResponse.json({ error: "Directus error" }, { status: result.status });
    }
    await audit(session, "RESTORE", `${collection}:${keys.join(",")}`, `restored ${keys.length} item(s) from trash`, ip);
    void revalidateCollection(request, collection);
    return NextResponse.json({ success: true, count: keys.length });
  }

  if (action === "purge" || action === "purge-all") {
    let session: AdminSession;
    try {
      session = await requireSuperAdmin();
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message === "Forbidden" ? "Forbidden: purge requires super admin" : "Unauthorized" },
        { status: e.message === "Forbidden" ? 403 : 401 }
      );
    }

    let keys: any[] = [];
    if (action === "purge-all") {
      const list = await directusJson(`/items/${collection}?filter=${encodeURIComponent(JSON.stringify({ deleted_at: { _nnull: true } }))}&limit=250&fields=id`);
      keys = (list.body?.data || []).map((r: any) => r.id);
    } else {
      keys = id !== undefined && id !== null ? [id] : Array.isArray(ids) ? ids : [];
    }
    if (keys.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    let result;
    if (keys.length === 1) {
      result = await directusJson(`/items/${collection}/${keys[0]}`, { method: "DELETE" });
    } else {
      result = await directusJson(`/items/${collection}`, { method: "DELETE", body: JSON.stringify({ keys }) });
    }
    if (!result.ok) {
      return NextResponse.json({ error: "Directus error" }, { status: result.status });
    }
    await audit(session, "PURGE", `${collection}:${keys.join(",")}`, `permanently deleted ${keys.length} item(s)`, ip);
    void revalidateCollection(request, collection);
    return NextResponse.json({ success: true, count: keys.length });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
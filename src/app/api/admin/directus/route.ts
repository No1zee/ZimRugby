import { NextRequest, NextResponse } from "next/server";
import { requireCollectionAction } from "@/lib/admin/auth";

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

  try {
    const res = await fetch(`${DIRECTUS_URL}/items/${collection}?${forward.toString()}`, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
    });

    if (!res.ok) {
      const errBody = await res.text();
      return NextResponse.json({ error: errBody }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { collection, data } = await request.json();

  try {
    await requireCollectionAction(collection, "create");
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

  const payload = { ...data };
  if (!payload.id && TEXT_ID_COLLECTIONS.has(collection)) {
    payload.id = crypto.randomUUID();
  }

  try {
    const res = await fetch(`${DIRECTUS_URL}/items/${collection}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return NextResponse.json({ error: errBody }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { collection, id, ids, data } = await request.json();

  try {
    await requireCollectionAction(collection, "update");
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

  try {
    // Bulk update: PATCH /items/{collection} with { keys, data }
    if (ids && Array.isArray(ids) && ids.length > 0) {
      const res = await fetch(`${DIRECTUS_URL}/items/${collection}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        },
        body: JSON.stringify({ keys: ids, data }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        return NextResponse.json({ error: errBody }, { status: res.status });
      }

      const text = await res.text();
      const json = text ? JSON.parse(text) : { success: true };
      return NextResponse.json(json);
    }

    if (!id) {
      return NextResponse.json({ error: "Missing id or ids" }, { status: 400 });
    }

    const res = await fetch(`${DIRECTUS_URL}/items/${collection}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return NextResponse.json({ error: errBody }, { status: res.status });
    }

    const text = await res.text();
    const json = text ? JSON.parse(text) : { success: true };
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { collection, id, ids } = await request.json();

  try {
    await requireCollectionAction(collection, "delete");
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
    // Bulk delete: DELETE /items/{collection} with { keys }
    if (ids && Array.isArray(ids) && ids.length > 0) {
      const res = await fetch(`${DIRECTUS_URL}/items/${collection}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        },
        body: JSON.stringify({ keys: ids }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        return NextResponse.json({ error: errBody }, { status: res.status });
      }

      return NextResponse.json({ success: true });
    }

    const res = await fetch(`${DIRECTUS_URL}/items/${collection}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
    });

    if (!res.ok) {
      const errBody = await res.text();
      return NextResponse.json({ error: errBody }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

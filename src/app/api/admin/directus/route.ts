import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin/auth";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://zru-directus-cms-production.up.railway.app";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

export async function POST(request: NextRequest) {
  try {
    await requirePermission("EDIT");
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return NextResponse.json({ error: "Directus not configured" }, { status: 500 });
  }

  const { collection, data } = await request.json();

  if (!collection || !data) {
    return NextResponse.json({ error: "Missing collection or data" }, { status: 400 });
  }

  try {
    const res = await fetch(`${DIRECTUS_URL}/items/${collection}`, {
      method: "POST",
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

    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requirePermission("EDIT");
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return NextResponse.json({ error: "Directus not configured" }, { status: 500 });
  }

  const { collection, id, data } = await request.json();

  if (!collection || !id || !data) {
    return NextResponse.json({ error: "Missing collection, id or data" }, { status: 400 });
  }

  try {
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
  try {
    await requirePermission("EDIT");
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return NextResponse.json({ error: "Directus not configured" }, { status: 500 });
  }

  const { collection, id } = await request.json();

  if (!collection || !id) {
    return NextResponse.json({ error: "Missing collection or id" }, { status: 400 });
  }

  try {
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

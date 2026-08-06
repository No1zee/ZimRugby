import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return new NextResponse("Missing asset ID", { status: 400 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const targetUrl = new URL(`${DIRECTUS_URL}/assets/${id}`);
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    const headers: HeadersInit = {};
    if (DIRECTUS_TOKEN) {
      headers["Authorization"] = `Bearer ${DIRECTUS_TOKEN}`;
    }

    const res = await fetch(targetUrl.toString(), { headers });

    if (!res.ok) {
      console.warn(`[assets proxy] Directus returned ${res.status} for asset ${id}`);
      return new NextResponse("Not found", { status: 404 });
    }

    const blob = await res.blob();
    const contentType = res.headers.get("content-type") || "image/webp";
    const cacheControl = res.headers.get("cache-control") || "public, max-age=31536000, immutable";

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": cacheControl,
      },
    });
  } catch (error) {
    console.error(`[assets proxy] Failed to proxy asset ${id}:`, error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

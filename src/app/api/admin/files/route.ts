import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://zru-directus-cms-production.up.railway.app";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
      return NextResponse.json({ error: "Directus not configured" }, { status: 500 });
    }

    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") || "40";
    const search = url.searchParams.get("search") || "";
    const page = url.searchParams.get("page") || "1";

    const searchParams = new URLSearchParams({
      limit,
      page,
      sort: "-uploaded_on",
      fields: "id,title,filename_download,type,filesize,width,height,uploaded_on",
    });

    if (search) {
      searchParams.set("search", search);
    }

    const res = await fetch(`${DIRECTUS_URL}/files?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Failed to fetch files: ${errText}` }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (e: any) {
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

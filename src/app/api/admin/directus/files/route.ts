import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

const DIRECTUS_URL = (
  process.env.NEXT_PUBLIC_DIRECTUS_URL ||
  process.env.DIRECTUS_URL ||
  "https://zru-directus-cms-production.up.railway.app"
).replace(/\/$/, "");

const DIRECTUS_TOKEN =
  process.env.DIRECTUS_TOKEN ||
  process.env.DIRECTUS_ADMIN_TOKEN ||
  "";

/**
 * GET /api/admin/directus/files
 * Fetch list of uploaded files from Directus durable storage.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "24";
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";

  try {
    const url = new URL(`${DIRECTUS_URL}/files`);
    url.searchParams.set("limit", limit);
    url.searchParams.set("page", page);
    url.searchParams.set("sort", "-uploaded_on");
    url.searchParams.set("fields", "id,title,filename_download,type,filesize,width,height,uploaded_on,description");
    if (search) {
      url.searchParams.set("search", search);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Directus files fetch failed: ${errText}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/directus/files
 * Direct multipart file upload to Directus /files endpoint.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
    }

    const directusFormData = new FormData();
    directusFormData.append("file", file);
    
    const title = formData.get("title");
    if (title && typeof title === "string") {
      directusFormData.append("title", title);
    }

    const res = await fetch(`${DIRECTUS_URL}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
      body: directusFormData,
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Directus file upload failed: ${errText}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    // Return standard file details + direct public URL
    const fileData = json.data;
    const fileUrl = `${DIRECTUS_URL}/assets/${fileData.id}`;
    
    return NextResponse.json({
      data: {
        ...fileData,
        url: fileUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

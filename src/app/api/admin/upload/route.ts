import { NextRequest, NextResponse } from "next/server";
import { requireFeature } from "@/lib/admin/auth";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN!;

// POST /api/admin/upload — upload image to Directus media library
export async function POST(req: NextRequest) {
  try {
    await requireFeature("media_upload");

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Directus
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const res = await fetch(`${DIRECTUS_URL}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
      body: uploadFormData,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Upload failed: ${res.status} ${err}`);
    }

    const result = await res.json();
    const fileId = result.data?.id;

    if (!fileId) {
      throw new Error("No file ID returned from Directus");
    }

    // Construct the public URL
    const url = `${DIRECTUS_URL}/assets/${fileId}`;

    return NextResponse.json({ url, id: fileId });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (e.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

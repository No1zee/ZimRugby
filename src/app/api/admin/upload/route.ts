import { NextRequest, NextResponse } from "next/server";
import { requireFeature } from "@/lib/admin/auth";
import sharp from "sharp";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN!;

// POST /api/admin/upload — upload image to Directus media library with auto-WebP optimization
export async function POST(req: NextRequest) {
  try {
    await requireFeature("media_upload");

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    let fileToUpload: Blob | File = file;
    let fileName = file.name;

    // Transcode raster images (JPEG, PNG, WebP) to high-efficiency WebP
    if (file.type.startsWith("image/") && !file.type.includes("svg") && !file.type.includes("gif")) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const inputBuffer = Buffer.from(arrayBuffer);

        const optimizedBuffer = await sharp(inputBuffer)
          .webp({ quality: 85, effort: 4 })
          .toBuffer();

        const baseName = file.name.replace(/\.[^/.]+$/, "");
        fileName = `${baseName}.webp`;

        fileToUpload = new Blob([new Uint8Array(optimizedBuffer)], { type: "image/webp" });
      } catch (err) {
        console.warn("[MediaUpload] Sharp optimization failed, falling back to original file:", err);
        fileToUpload = file;
      }
    }

    // Upload to Directus
    const uploadFormData = new FormData();
    uploadFormData.append("file", fileToUpload, fileName);

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

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { directusUpdate, directusDelete } from "@/lib/directus/admin-write";

// PUT /api/admin/pages/[slug]/sections/[id] — update section
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const allowedFields = [
      "section_key", "eyebrow", "title", "body", "content",
      "cta_label", "cta_url", "display_variant", "items",
      "image", "status", "sort",
    ];

    const updateData: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    await directusUpdate("page_sections", id, updateData);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/admin/pages/[slug]/sections/[id] — delete section
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await directusDelete("page_sections", id);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

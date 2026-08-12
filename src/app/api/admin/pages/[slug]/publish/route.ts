import { NextRequest, NextResponse } from "next/server";
import { requireFeature } from "@/lib/admin/auth";
import { directusFetch } from "@/lib/directus/fetch";
import { directusUpdate } from "@/lib/directus/admin-write";
import { revalidateTag } from "next/cache";

// POST /api/admin/pages/[slug]/publish — publish page + all sections
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireFeature("pages_builder");
    const { slug } = await params;

    const pages = await directusFetch<any>("pages", {
      filter: { slug: { _eq: slug } },
      limit: 1,
    });

    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const page = pages[0];

    // Publish page
    await directusUpdate("pages", page.id, { status: "published" });

    // Publish all sections for this page
    const sections = await directusFetch<any>("page_sections", {
      filter: { page_id: { _eq: page.id } },
    });

    await Promise.all(
      sections.map((s: any) =>
        directusUpdate("page_sections", s.id, { status: "published" })
      )
    );

    try {
      revalidateTag("directus:pages", "minutes");
      revalidateTag("directus:page_sections", "minutes");
    } catch {}

    return NextResponse.json({ success: true, published: sections.length + 1 });
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

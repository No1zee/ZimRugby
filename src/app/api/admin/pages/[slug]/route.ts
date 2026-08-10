import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireFeature } from "@/lib/admin/auth";
import { directusFetch } from "@/lib/directus/fetch";
import { directusUpdate } from "@/lib/directus/admin-write";

// GET /api/admin/pages/[slug] — fetch page + sections
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin();
    const { slug } = await params;

    const pages = await directusFetch<any>("pages", {
      filter: { slug: { _eq: slug } },
      limit: 1,
    });

    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const page = pages[0];

    const sections = await directusFetch<any>("page_sections", {
      filter: { page_id: { _eq: page.id } },
      sort: ["sort"],
    });

    return NextResponse.json({ page, sections });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/admin/pages/[slug] — update page fields
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireFeature("pages_builder");
    const { slug } = await params;
    const body = await req.json();

    const pages = await directusFetch<any>("pages", {
      filter: { slug: { _eq: slug } },
      limit: 1,
    });

    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const page = pages[0];
    const { title, hero_kicker, hero_title, hero_intro, hero_image, seo_title, seo_description, status } = body;

    await directusUpdate("pages", page.id, {
      ...(title !== undefined && { title }),
      ...(hero_kicker !== undefined && { hero_kicker }),
      ...(hero_title !== undefined && { hero_title }),
      ...(hero_intro !== undefined && { hero_intro }),
      ...(hero_image !== undefined && { hero_image }),
      ...(seo_title !== undefined && { seo_title }),
      ...(seo_description !== undefined && { seo_description }),
      ...(status !== undefined && { status }),
    });

    return NextResponse.json({ success: true });
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

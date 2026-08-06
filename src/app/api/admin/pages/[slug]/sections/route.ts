import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { directusFetch } from "@/lib/directus/fetch";
import { directusCreate, directusUpdate } from "@/lib/directus/admin-write";

// GET /api/admin/pages/[slug]/sections — fetch all sections for page
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

    const sections = await directusFetch<any>("page_sections", {
      filter: { page_id: { _eq: pages[0].id } },
      sort: ["sort"],
    });

    return NextResponse.json({ sections });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/admin/pages/[slug]/sections — create new section
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin();
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

    // Get current max sort value
    const existingSections = await directusFetch<any>("page_sections", {
      filter: { page_id: { _eq: page.id } },
      sort: ["-sort"],
      limit: 1,
    });
    const maxSort = existingSections.length > 0 ? (existingSections[0].sort || 0) + 1 : 0;

    const result = await directusCreate("page_sections", {
      page_id: page.id,
      section_key: body.section_key || `section_${Date.now()}`,
      title: body.title || "New Section",
      body: body.body || "",
      content: body.content || "",
      items: body.items || [],
      sort: maxSort,
      status: "draft",
    });

    return NextResponse.json({ section: result.data });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/admin/pages/[slug]/sections — reorder sections (accepts sorted array of IDs)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin();
    const { slug } = await params;
    const { sectionIds } = await req.json();

    if (!Array.isArray(sectionIds)) {
      return NextResponse.json({ error: "sectionIds must be an array" }, { status: 400 });
    }

    const pages = await directusFetch<any>("pages", {
      filter: { slug: { _eq: slug } },
      limit: 1,
    });

    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Update sort order for each section
    await Promise.all(
      sectionIds.map((id: string, index: number) =>
        directusUpdate("page_sections", id, { sort: index })
      )
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

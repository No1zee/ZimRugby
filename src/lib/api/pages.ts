import { directusFetch } from "@/lib/directus/fetch";
import { assetUrl } from "@/lib/directus/assets";
import { draftMode } from "next/headers";

export interface PageSection {
  id: string;
  section_key: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  content?: string;
  cta_label?: string;
  cta_url?: string;
  display_variant?: string;
  image?: string;
  image_url?: string;
  items?: Record<string, unknown>[];
  sort?: number;
  status?: string;
}

export interface PageData {
  id: string;
  slug: string;
  title: string;
  route?: string;
  page_type?: string;
  breadcrumb_label?: string;
  hero_kicker?: string;
  hero_title?: string;
  hero_intro?: string;
  hero_image?: string;
  hero_image_url?: string;
  seo_title?: string;
  seo_description?: string;
  status?: string;
  sections: PageSection[];
}

export async function getPageBySlug(slug: string): Promise<PageData | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return null;

    let isDraft = false;
    try {
      const dm: any = await draftMode();
      isDraft = !!dm.enabled;
    } catch {
      // draftMode() throws outside of server component context (e.g. API routes)
    }

    const pages = await directusFetch<any>("pages", {
      filter: isDraft
        ? { slug: { _eq: slug }, status: { _in: ["published", "draft"] } }
        : { slug: { _eq: slug }, status: { _eq: "published" } },
      sort: ["-status"],
      limit: 1,
    });

    if (!pages || pages.length === 0) return null;

    const page = pages[0];

    const sections = await directusFetch<PageSection>("page_sections", {
      filter: isDraft
        ? { page_id: { _eq: page.id }, status: { _in: ["published", "draft"] } }
        : { page_id: { _eq: page.id }, status: { _eq: "published" } },
      sort: ["sort"],
    });

    return {
      ...page,
      hero_image: assetUrl(page.hero_image) || page.hero_image_url,
      sections: (sections || []).map((s) => ({
        ...s,
        image: assetUrl(s.image) || s.image_url,
      })),
    };
  } catch (error) {
    console.warn(`Directus fetch failed for page "${slug}":`, error);
    return null;
  }
}

export async function getPageSections(
  slug: string
): Promise<PageSection[]> {
  const page = await getPageBySlug(slug);
  return page?.sections || [];
}

export async function getSectionByKey(
  slug: string,
  sectionKey: string
): Promise<PageSection | null> {
  const sections = await getPageSections(slug);
  return sections.find((s) => s.section_key === sectionKey) || null;
}

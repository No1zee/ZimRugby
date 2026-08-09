import { notFound, redirect } from "next/navigation";
import { directusFetch } from "@/lib/directus/fetch";
import { assetUrl } from "@/lib/directus/assets";
import { requireAdmin } from "@/lib/admin/auth";
import PageBuilderClient from "./PageBuilderClient";

export const dynamic = "force-dynamic";

interface PageSection {
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
  items?: any;
  sort?: number;
  status?: string;
  is_enabled?: boolean;
  date_created?: string;
  date_updated?: string;
}

interface PageData {
  id: string;
  slug: string;
  title: string;
  hero_kicker?: string;
  hero_title?: string;
  hero_intro?: string;
  hero_image?: string;
  hero_image_url?: string;
  seo_title?: string;
  seo_description?: string;
  status?: string;
}

export default async function PageBuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    await requireAdmin();
  } catch {
    redirect("/admin-login");
  }

  const pages = await directusFetch<PageData>("pages", {
    filter: { slug: { _eq: slug } },
    limit: 1,
  }, 0);

  if (!pages || pages.length === 0) {
    notFound();
  }

  const page = pages[0];

  const sections = await directusFetch<PageSection>("page_sections", {
    filter: { page_id: { _eq: page.id } },
    sort: ["sort"],
  }, 0);

  // Resolve image URLs
  const resolvedPage = {
    ...page,
    hero_image: assetUrl(page.hero_image) || page.hero_image_url,
  };

  const resolvedSections = (sections || []).map((s) => ({
    ...s,
    image: assetUrl(s.image) || s.image_url,
  }));

  return (
    <PageBuilderClient
      page={resolvedPage}
      initialSections={resolvedSections}
    />
  );
}

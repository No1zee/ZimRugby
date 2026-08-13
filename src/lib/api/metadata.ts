import { Metadata } from "next";
import { getPageBySlug } from "./pages";

export async function buildPageMetadata(
  slug: string,
  fallbackTitle: string,
  fallbackDescription: string
): Promise<Metadata> {
  const page = await getPageBySlug(slug);
  return {
    title: page?.seo_title || page?.hero_title || fallbackTitle,
    description: page?.seo_description || fallbackDescription,
  };
}

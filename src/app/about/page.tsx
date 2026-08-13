import { Metadata } from "next";
import { getPageBySlug } from "@/lib/api/pages";
import AboutClient from "./AboutClient";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about");
  return {
    title: page?.seo_title || page?.hero_title || "About | Zimbabwe Rugby Union",
    description:
      page?.seo_description ||
      "Learn about the Zimbabwe Rugby Union — our mission, history, and commitment to growing rugby across Zimbabwe.",
  };
}

export const dynamic = "force-dynamic";

export default async function AboutOverviewPage() {
  const cmsPage = await getPageBySlug("about");

  return <AboutClient cmsPage={cmsPage} />;
}

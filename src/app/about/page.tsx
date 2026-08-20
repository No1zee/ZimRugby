import { Metadata } from "next";
import { getPageBySlug } from "@/lib/api/pages";
import AboutClient from "./AboutClient";
import { buildPageMetadata } from "@/lib/api/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(
    "about",
    "About | Zimbabwe Rugby Union",
    "Learn about the Zimbabwe Rugby Union — our mission, history, and commitment to growing rugby across Zimbabwe."
  );
}

export const revalidate = 3600;

export default async function AboutOverviewPage() {
  const cmsPage = await getPageBySlug("about");

  return <AboutClient cmsPage={cmsPage} />;
}

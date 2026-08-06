import { Metadata } from "next";
import { getPageBySlug } from "@/lib/api/pages";
import { getSchoolInitiatives } from "@/lib/api/schools";
import SchoolsClient from "./SchoolsClient";

export const metadata: Metadata = {
  title: "Schools Rugby | Zimbabwe Rugby Union",
  description: "Explore Zimbabwe school rugby structures, the Super 8 League, youth pathways, and tag rugby initiatives.",
};

export default async function SchoolsPage() {
  const [cmsPage, initiatives] = await Promise.all([
    getPageBySlug("schools"),
    getSchoolInitiatives(),
  ]);

  return <SchoolsClient cmsPage={cmsPage} initiatives={initiatives} />;
}

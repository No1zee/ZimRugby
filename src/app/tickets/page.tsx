import { Metadata } from "next";
import { getPageBySlug } from "@/lib/api/pages";
import { getFixtures } from "@/lib/api/tickets";
import { getFaqs } from "@/lib/api/faqs";
import TicketsClient from "./TicketsClient";

export const metadata: Metadata = {
  title: "Tickets | Zimbabwe Rugby Union",
  description: "Buy official tickets for Zimbabwe Sables, Lady Sables, and domestic rugby fixtures.",
};

export default async function TicketsPage() {
  const [cmsPage, fixtures, faqs] = await Promise.all([
    getPageBySlug("tickets"),
    getFixtures(),
    getFaqs(),
  ]);
  return <TicketsClient cmsPage={cmsPage} fixtures={fixtures} faqs={faqs} />;
}

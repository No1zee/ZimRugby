import { Metadata } from "next";
import { getPageBySlug } from "@/lib/api/pages";
import { getClubs } from "@/lib/api/clubs";
import ClubsClient from "./ClubsClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Clubs | Zimbabwe Rugby Union",
  description: "Browse official registered rugby clubs across Zimbabwe. Find teams, training schedules, and local leagues.",
};

export default async function ClubsPage() {
  const [cmsPage, clubs] = await Promise.all([
    getPageBySlug("clubs"),
    getClubs(),
  ]);

  return <ClubsClient cmsPage={cmsPage} clubs={clubs} />;
}

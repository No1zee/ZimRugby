import { Metadata } from "next";
import { Suspense } from "react";
import TeamBentoGrid from "@/components/teams/TeamBentoGrid";
import HomeNewsletterBanner from "@/components/home/HomeNewsletterBanner";
import { getPageBySlug } from "@/lib/api/pages";
import { getTeamsList } from "@/lib/api/teams";
import { draftMode } from "next/headers";
import TeamsClient from "./TeamsClient";
import type { Team } from "@/types/team";

export const metadata: Metadata = {
  title: "National Teams | Zimbabwe Rugby Union",
  description:
    "Official representative teams of the Zimbabwe Rugby Union. Sables, Lady Sables, Cheetahs 7s, and Junior Sables.",
};

export default async function TeamsPage() {
  const [cmsPage, teams] = await Promise.all([
    getPageBySlug("teams"),
    getTeamsList(),
  ]);

  return (
    <main className="bg-milk-white min-h-screen pb-12">
      <TeamsClient cmsPage={cmsPage} />

      {/* Bento Grid */}
      <div className="pt-10 md:pt-12">
        <Suspense>
          <TeamBentoGrid teams={teams} />
        </Suspense>
      </div>

      {/* Fan Zone Signup — Centralized single point of truth */}
      <HomeNewsletterBanner />

      {/* CMS sections after the bento grid (e.g. development_pathways) */}
      {cmsPage?.sections && cmsPage.sections.length > 0 && (
        <TeamsSections sections={cmsPage.sections} />
      )}
    </main>
  );
}

function TeamsSections({ sections }: { sections: any[] }) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const SectionRenderer = require("@/components/cms/SectionRenderer").default;
  const filtered = sections.filter(
    (s: any) => !["hero_image", "mission", "vision"].includes(s.section_key)
  );

  if (filtered.length === 0) return null;

  return <SectionRenderer sections={filtered} />;
}

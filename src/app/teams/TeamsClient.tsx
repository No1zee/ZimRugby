"use client";

import CmsHero from "@/components/cms/CmsHero";
import type { PageData } from "@/lib/api/pages";

interface TeamsClientProps {
  cmsPage: PageData | null;
}

export default function TeamsClient({ cmsPage }: TeamsClientProps) {
  return (
    <CmsHero
      kicker={cmsPage?.hero_kicker || "2026 Season"}
      title={cmsPage?.hero_title || "National Teams"}
      intro={cmsPage?.hero_intro || "Four squads representing Zimbabwe on the world rugby stage — from the flagship Sables to the next-generation Junior Sables."}
      image={cmsPage?.hero_image || "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp"}
      breadcrumb={[{ label: "Teams", href: "/teams" }]}
      pageId={cmsPage?.id}
    />
  );
}

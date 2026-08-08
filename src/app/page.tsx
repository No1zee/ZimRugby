import { Suspense } from "react";
import { Metadata } from "next";
import HeroCarousel from "@/components/home/HeroCarousel";

export const metadata: Metadata = {
  title: "Zimbabwe Rugby Union | Official Home of the Sables",
  description: "Official website of the Zimbabwe Rugby Union. Follow the Sables, Lady Sables, and all Zimbabwe rugby teams. Fixtures, results, news, and tickets.",
};

export const revalidate = 300;
import UnifiedHubGrid from "@/components/home/UnifiedHubGrid";
import JoinFanZoneSection from "@/components/home/JoinFanZoneSection";
import CampaignCardsRow from "@/components/campaigns/CampaignCardsRow";
import RoadToWorldCup from "@/components/home/RoadToWorldCup";
import GrassrootsInitiativeSection from "@/components/home/GrassrootsInitiativeSection";
import SponsorGrid from "@/components/home/SponsorGrid";
import PinnedAnnouncements from "@/components/home/PinnedAnnouncements";
import PlayRugbyDevelopment from "@/components/home/PlayRugbyDevelopment";

import { getHeroSlides } from "@/lib/api/hero";
import { getPartners } from "@/lib/api/partners";
import { getPageBySlug } from "@/lib/api/pages";
import { getPrimaryCampaign } from "@/lib/api/campaigns";
import { getFeaturedPlayers } from "@/lib/api/players";
import { getSiteSettings } from "@/lib/api/site-settings";
import { getGrassrootsInitiatives } from "@/lib/api/initiatives";
import { directusFetch } from "@/lib/directus/fetch";
import { getLatestReports, getSocialPosts, type Report } from "@/lib/data-fetcher";
import { getNewsArticles } from "@/lib/api/news";
import { getDirectusMatches } from "@/lib/match-centre/api";
import type { AnnouncementItem } from "@/components/home/PinnedAnnouncements";
import SectionRenderer from "@/components/cms/SectionRenderer";

async function HeroSection() {
  const heroSlides = await getHeroSlides();
  return <HeroCarousel slides={heroSlides} />;
}

function HeroSkeleton() {
  return (
    <section className="relative w-full h-[100dvh] bg-rich-black overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#003822] via-[#002B19] to-[#001D11]" />
      <div className="relative z-20 space-y-6 max-w-3xl px-4">
        <div className="space-y-3">
          <div className="h-12 w-80 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-12 w-64 bg-white/10 rounded-lg animate-pulse" />
        </div>
        <div className="h-5 w-72 bg-white/5 rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-12 w-48 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-12 w-48 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const [heroSlides, partners, featuredPlayers, cmsPage, campaign, siteSettings, initiatives] = await Promise.all([
    getHeroSlides(),
    getPartners(),
    getFeaturedPlayers(),
    getPageBySlug("home"),
    getPrimaryCampaign(),
    getSiteSettings(),
    getGrassrootsInitiatives(),
  ]);

  const rawAnnouncements = await directusFetch<any>("announcements", { filter: { is_enabled: { _eq: true } }, sort: ["-priority"] }, 60);
  const announcementItems: AnnouncementItem[] = rawAnnouncements.length > 0
    ? rawAnnouncements.map(a => ({ id: String(a.id), tag: a.category || (a.urgent ? "URGENT" : "ANNOUNCEMENT"), title: a.title, href: a.cta_url || "/match-centre", iconType: a.urgent ? "calendar" as const : "megaphone" as const }))
    : [];

  const [cmsNews, socialPosts, reports, allMatches] = await Promise.all([
    getNewsArticles(4).catch(() => [] as Report[]),
    getSocialPosts().catch(() => [] as Report[]),
    getLatestReports().catch(() => [] as Report[]),
    getDirectusMatches().catch(() => []),
  ]);
  const hubNews = [...cmsNews, ...socialPosts, ...reports]
    .filter((r, i, arr) => arr.findIndex(x => x.id === r.id) === i)
    .slice(0, 4);
  const hubNextMatch = allMatches.filter(m => m.status === "upcoming" || m.status === "live")
    .sort((a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime())[0] || null;

  const mappedFeaturedPlayers = featuredPlayers.map(p => ({
    name: p.name,
    position: p.position || "",
    team: p.team || "Sables",
    caps: p.caps || 0,
    age: p.age || 0,
    photo: p.photo || "",
    slug: p.slug,
  }));

  /* Check if the CMS has homepage-specific dynamic sections configured */
  const homepageSectionKeys = ["hero_carousel", "announcements", "hub_grid", "campaign_highlight", "grassroots", "newsletter_cta", "sponsors_grid"];
  const hasDynamicHomeSections = cmsPage?.sections?.some(s => homepageSectionKeys.includes(s.section_key));

  return (
    <main className="min-h-screen relative bg-[#FDFBF0]">
      
      {hasDynamicHomeSections ? (
        /* ═══ CMS-Driven Mode ═══ All sections rendered dynamically from CMS order */
        <>
          <SectionRenderer
            sections={cmsPage!.sections}
            missionSection={cmsPage!.sections.find(s => s.section_key === "mission")}
            visionSection={cmsPage!.sections.find(s => s.section_key === "vision")}
            heroSlides={heroSlides}
            partners={partners}
            featuredPlayers={mappedFeaturedPlayers}
            campaign={campaign}
            initiatives={initiatives}
            announcementItems={announcementItems}
            hubNews={hubNews}
            hubNextMatch={hubNextMatch}
          />
        </>
      ) : (
        /* ═══ Legacy Hardcoded Mode ═══ Preserved for backwards compatibility */
        <>
          {/* 1. Hero Carousel — streamed via Suspense so the rest of the page renders immediately */}
          <Suspense fallback={<HeroSkeleton />}>
            <HeroSection />
          </Suspense>

          <div className="relative z-10">

            {/* 1b. Pinned Announcements — media-managed event/announcement strip */}
            <PinnedAnnouncements items={announcementItems} />

            {/* 1c. Campaign Cards Row — active ZRU campaigns */}
            <CampaignCardsRow />

            {/* 2. Unified 4-Column Hub Grid (Next Match + News + Shop + Tickets) */}
            <UnifiedHubGrid news={hubNews} nextMatch={hubNextMatch} />

            {/* 3. Road to World Cup — frame with countdown + Nations Cup video + Featured Players */}
            <RoadToWorldCup featuredPlayers={mappedFeaturedPlayers} campaign={campaign} />

            {/* 4. Grassroots & Growing the Sport Section */}
            <GrassrootsInitiativeSection initiatives={initiatives} />

            {/* 4b. Rugby Pathways & Community Development */}
            <PlayRugbyDevelopment />

            {/* 5. Join the Fan Zone — animated micro-interaction section */}
            <JoinFanZoneSection />

            {/* Dynamic CMS Sections (non-homepage-specific) */}
            {cmsPage?.sections && cmsPage.sections.length > 0 && (
              <div className="bg-milk-white">
                <SectionRenderer
                  sections={cmsPage.sections.filter(s => s.section_key !== "vision")}
                  missionSection={cmsPage.sections.find(s => s.section_key === "mission")}
                  visionSection={cmsPage.sections.find(s => s.section_key === "vision")}
                  hubNews={hubNews}
                  hubNextMatch={hubNextMatch}
                />
              </div>
            )}

            {/* 6. Commercial Partners & Sponsors Logo Grid */}
            <SponsorGrid partners={partners} />

          </div>
        </>
      )}
    </main>
  );
}

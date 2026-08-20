import { Suspense } from "react";
import { Metadata } from "next";
import HeroCarousel from "@/components/home/HeroCarousel";
import HomeLatestNews from "@/components/home/HomeLatestNews";
import HomeUpcomingMatches from "@/components/home/HomeUpcomingMatches";
import PlayRugbyDevelopment from "@/components/home/PlayRugbyDevelopment";
import JoinFanZoneSection from "@/components/home/JoinFanZoneSection";
import SponsorGrid from "@/components/home/SponsorGrid";
import PinnedAnnouncements from "@/components/home/PinnedAnnouncements";

import { getHeroSlides } from "@/lib/api/hero";
import { getPartners } from "@/lib/api/partners";
import { getPageBySlug } from "@/lib/api/pages";
import { getPrimaryCampaign } from "@/lib/api/campaigns";
import { getGrassrootsInitiatives } from "@/lib/api/initiatives";
import { directusFetch } from "@/lib/directus/fetch";
import { getNewsArticles } from "@/lib/api/news";
import { getDirectusMatches } from "@/lib/match-centre/api";
import type { AnnouncementItem } from "@/components/home/PinnedAnnouncements";
import SectionRenderer from "@/components/cms/SectionRenderer";

export const metadata: Metadata = {
  title: "Zimbabwe Rugby Union | Official Home of the Sables",
  description: "Official website of the Zimbabwe Rugby Union. Follow the Sables, Lady Sables, and all Zimbabwe rugby teams. Fixtures, results, news, and tickets.",
};

export const revalidate = 3600;

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
  const [heroSlides, partners, cmsPage, campaign, initiatives] = await Promise.all([
    getHeroSlides(),
    getPartners(),
    getPageBySlug("home"),
    getPrimaryCampaign(),
    getGrassrootsInitiatives(),
  ]);

  const rawAnnouncements = await directusFetch<any>("announcements", { filter: { is_enabled: { _eq: true }, deleted_at: { _null: true } }, sort: ["-priority"] }, 60);
  const announcementItems: AnnouncementItem[] = (rawAnnouncements || []).map((a: any) => ({
    id: String(a.id),
    tag: a.badge || "ANNOUNCEMENT",
    title: a.title,
    href: a.link_url || "/media",
    iconType: a.priority >= 20 ? "calendar" : "megaphone",
  }));

  const [cmsNews, allMatches] = await Promise.all([
    getNewsArticles(6).catch(() => []),
    getDirectusMatches().catch(() => []),
  ]);

  // Find next upcoming match for match centre feature
  const hubNextMatch = allMatches.find(m => m.status === 'upcoming') || allMatches[0] || null;

  /* Check if the CMS has homepage-specific dynamic sections configured */
  const homepageSectionKeys = ["hero_carousel", "announcements", "hub_grid", "campaign_highlight", "grassroots", "newsletter_cta", "sponsors_grid"];
  const hasDynamicHomeSections = cmsPage?.sections?.some(s => homepageSectionKeys.includes(s.section_key));

  return (
    <main className="min-h-screen relative bg-milk-white">
      {hasDynamicHomeSections ? (
        /* CMS-driven dynamic homepage */
        <>
          <SectionRenderer
            sections={cmsPage!.sections!}
            heroSlides={heroSlides}
            campaign={campaign}
            partners={partners}
            initiatives={initiatives}
            hubNews={cmsNews}
            hubNextMatch={hubNextMatch}
            announcementItems={announcementItems}
          />
        </>
      ) : (
        /* Standard Approved Homepage Hierarchy */
        <>
          {/* 1. Hero Carousel (Untouched) */}
          <Suspense fallback={<HeroSkeleton />}>
            <HeroSection />
          </Suspense>

          <div className="relative z-10">
            {/* Pinned Announcements */}
            {announcementItems.length > 0 && (
              <PinnedAnnouncements items={announcementItems} />
            )}

            {/* 2. Latest News (Elevated immediately below hero) */}
            <HomeLatestNews news={cmsNews} />

            {/* 3. Upcoming Matches */}
            <HomeUpcomingMatches nextMatch={hubNextMatch} upcomingMatches={allMatches} />


            {/* 4. Rugby For Good & Grassroots */}
            <PlayRugbyDevelopment />

            {/* 6. Fan Zone (Preserved as-is) */}
            <JoinFanZoneSection />

            {/* Dynamic CMS Sections (if any) */}
            {cmsPage?.sections && cmsPage.sections.length > 0 && (
              <div className="bg-milk-white">
                <SectionRenderer
                  sections={cmsPage.sections}
                  heroSlides={heroSlides}
                  campaign={campaign}
                  partners={partners}
                  initiatives={initiatives}
                />
              </div>
            )}

            {/* 7. Official Sponsors & Partners */}
            <SponsorGrid partners={partners} />
          </div>
        </>
      )}
    </main>
  );
}

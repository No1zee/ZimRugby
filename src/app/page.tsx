import { Suspense } from "react";
import { Metadata } from "next";
import HeroCarousel from "@/components/home/HeroCarousel";

export const metadata: Metadata = {
  title: "Zimbabwe Rugby Union | Official Home of the Sables",
  description: "Official website of the Zimbabwe Rugby Union. Follow the Sables, Lady Sables, and all Zimbabwe rugby teams. Fixtures, results, news, and tickets.",
};

export const revalidate = 300;
import UnifiedHubGrid from "@/components/home/UnifiedHubGrid";
import HomeNewsletterBanner from "@/components/home/HomeNewsletterBanner";
import CleanCountdownBanner from "@/components/home/CleanCountdownBanner";
import FeaturedPlayersGrid from "@/components/teams/FeaturedPlayersGrid";
import GrassrootsInitiativeSection from "@/components/home/GrassrootsInitiativeSection";
import SponsorGrid from "@/components/home/SponsorGrid";
import PinnedAnnouncements from "@/components/home/PinnedAnnouncements";

import { getHeroSlides } from "@/lib/api/hero";
import type { FeaturedPlayer } from "@/types";

const featuredPlayers: FeaturedPlayer[] = [
  { name: "Bornwell Gwinji", position: "Prop", team: "Sables", caps: 42, age: 28, photo: "/images/teams/headshots/Bornwell Gwinji.jpg", slug: "bornwell-gwinji" },
  { name: "Brandan Mudzekenyedzi", position: "Lock", team: "Sables", caps: 35, age: 27, photo: "/images/teams/headshots/Brandan Mudzekenyedzi.jpg", slug: "brandan-mudzekenyedzi" },
  { name: "Brendon Marume", position: "Scrumhalf", team: "Sables", caps: 28, age: 26, photo: "/images/teams/headshots/Brendon Marume.jpg", slug: "brendon-marume" },
];

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
  return (
    <main className="min-h-screen relative bg-[#FDFBF0]">
      
      {/* 1. Hero Carousel — streamed via Suspense so the rest of the page renders immediately */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <div className="relative z-10">

        {/* 1b. Pinned Announcements — media-managed event/announcement strip */}
        <PinnedAnnouncements />

        {/* 2. Unified 4-Column Hub Grid (News Stack + Match Tickets + Official Shop + Nations Cup Videos) */}
        <UnifiedHubGrid />

        {/* 3. Full-Width ZRU Green Newsletter Banner (Matching Stitch Reference Layout) */}
        <HomeNewsletterBanner />

        {/* 4. Road to Australia 2027 Minimal Countdown Banner */}
        <CleanCountdownBanner />

        {/* 5. Featured Players — CometCard 3D tilt on desktop */}
        <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-rich-black not-italic">
              FEATURED{" "}
              <span className="text-accent-teal">PLAYERS</span>
            </h2>
          </div>
          <FeaturedPlayersGrid players={featuredPlayers} />
        </section>

        {/* 6. Grassroots & Growing the Sport Section */}
        <GrassrootsInitiativeSection />

        {/* 7. Commercial Partners & Sponsors Logo Grid */}
        <SponsorGrid />

      </div>
    </main>
  );
}

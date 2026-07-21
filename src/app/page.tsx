import HeroCarousel from "@/components/home/HeroCarousel";
import LatestNewsBlock from "@/components/home/LatestNewsBlock";
import CleanCountdownBanner from "@/components/home/CleanCountdownBanner";
import FixtureAndTicketsBlock from "@/components/home/FixtureAndTicketsBlock";
import GearUpStoreSection from "@/components/home/GearUpStoreSection";
import SponsorGrid from "@/components/home/SponsorGrid";

import { getHeroSlides } from "@/lib/api/hero";

export default async function Home() {
  // Fetch hero slides for full-screen hero
  const heroSlides = await getHeroSlides();

  return (
    <main className="min-h-screen relative bg-[#F6F5EF]">
      
      {/* 1. Hero Carousel (Preserved 100% full-screen presence) */}
      <HeroCarousel slides={heroSlides} />

      <div className="relative z-10">

        {/* 2. Bento Latest News Section */}
        <LatestNewsBlock />

        {/* 3. Road to Australia 2027 Countdown Banner */}
        <CleanCountdownBanner />

        {/* 4. Upcoming Fixtures & Match Tickets Split Section */}
        <FixtureAndTicketsBlock />

        {/* 5. Gear Up Store Teaser */}
        <GearUpStoreSection />

        {/* 6. Commercial Partners & Sponsors Logo Grid */}
        <SponsorGrid />

      </div>
    </main>
  );
}

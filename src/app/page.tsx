import HeroCarousel from "@/components/home/HeroCarousel";
import UnifiedHubGrid from "@/components/home/UnifiedHubGrid";
import HomeNewsletterBanner from "@/components/home/HomeNewsletterBanner";
import CleanCountdownBanner from "@/components/home/CleanCountdownBanner";
import GrassrootsInitiativeSection from "@/components/home/GrassrootsInitiativeSection";
import SponsorGrid from "@/components/home/SponsorGrid";

import { getHeroSlides } from "@/lib/api/hero";

export default async function Home() {
  // Fetch hero slides for full-screen hero
  const heroSlides = await getHeroSlides();

  return (
    <main className="min-h-screen relative bg-[#FDFBF0]">
      
      {/* 1. Hero Carousel (Preserved 100% full-screen presence) */}
      <HeroCarousel slides={heroSlides} />

      <div className="relative z-10">

        {/* 2. Unified 4-Column Hub Grid (News Stack + Match Tickets + Official Shop + Nations Cup Videos) */}
        <UnifiedHubGrid />

        {/* 3. Full-Width ZRU Green Newsletter Banner (Matching Stitch Reference Layout) */}
        <HomeNewsletterBanner />

        {/* 4. Road to Australia 2027 Minimal Countdown Banner */}
        <CleanCountdownBanner />

        {/* 5. Grassroots & Growing the Sport Section */}
        <GrassrootsInitiativeSection />

        {/* 6. Commercial Partners & Sponsors Logo Grid */}
        <SponsorGrid />

      </div>
    </main>
  );
}

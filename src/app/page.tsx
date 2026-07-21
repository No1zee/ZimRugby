import HeroCarousel from "@/components/home/HeroCarousel";
import UnifiedHubGrid from "@/components/home/UnifiedHubGrid";
import CleanCountdownBanner from "@/components/home/CleanCountdownBanner";
import HomeNewsletterBanner from "@/components/home/HomeNewsletterBanner";
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

        {/* 2. Unified 4-Column Hub Grid (News Stack + Match Tickets + Official Shop) */}
        <UnifiedHubGrid />

        {/* 3. Road to Australia 2027 Minimal Countdown Banner */}
        <CleanCountdownBanner />

        {/* 4. Full-Width ZRU Green Newsletter Banner */}
        <HomeNewsletterBanner />

        {/* 5. Commercial Partners & Sponsors Logo Grid */}
        <SponsorGrid />

      </div>
    </main>
  );
}

import HeroCarousel from "@/components/home/HeroCarousel";
import MatchCentreStrip from "@/components/home/MatchCentreStrip";
import SpecBentoGrid from "@/components/home/SpecBentoGrid";
import { CountdownPromo } from "@/components/ui/CountdownPromo";
import GrassrootsDevelopment from "@/components/home/GrassrootsDevelopment";
import SponsorGrid from "@/components/home/SponsorGrid";

import { getLiveMatches, getLatestReports } from "@/lib/data-fetcher";
import { getHeroSlides } from "@/lib/api/hero";
import { getFixtureTwinData } from "@/lib/api/fixtures";
import { getRankingsData } from "@/lib/api/rankings";

export default async function Home() {
  // Fetch data on the server
  const [matches, reports, heroSlides, twinData, rankingsData] = await Promise.all([
    getLiveMatches(),
    getLatestReports(),
    getHeroSlides(),
    getFixtureTwinData(),
    getRankingsData()
  ]);

  return (
    <main className="min-h-screen relative bg-milk-white">
      
      {/* 1. Hero Carousel (Preserved 100% full-screen presence) */}
      <HeroCarousel slides={heroSlides} />

      <div className="relative z-10 overflow-hidden">

        {/* 2. New Bento Grid (Latest News, Upcoming Fixture, Tickets, Official Shop) */}
        <SpecBentoGrid />

        {/* 3. Match Centre Strip */}
        <MatchCentreStrip initialMatches={matches} twinData={twinData} rankingsData={rankingsData} />

        {/* 4. Rugby World Cup Countdown */}
        <CountdownPromo
          title="RUGBY WORLD CUP 2027"
          subtitle="ROAD TO AUSTRALIA"
          description="The Zimbabwe Sables are on a historic quest to qualify and compete on rugby's grandest stage. Follow the matches, support the squad, and join the national campaign to power our Sables to Australia."
          targetDate="2027-10-01T20:00:00"
          countdownLabel="COUNTDOWN TO KICK OFF IN AUSTRALIA:"
          location="Australia"
          image="/images/hero/zim-u20s.webp"
          ctas={[
            { label: "Support Campaign", href: "/world-cup-campaign", variant: "primary" },
            { label: "Qualification Path", href: "/match-centre", variant: "outline" },
          ]}
        />

        {/* 5. Grassroots & Pathways */}
        <GrassrootsDevelopment />

        {/* 6. Commercial Partners & Sponsors */}
        <SponsorGrid />

      </div>
    </main>
  );
}


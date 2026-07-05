import HeroCarousel from "@/components/home/HeroCarousel";
import MatchCentreStrip from "@/components/home/MatchCentreStrip";
import StorePreviewStrip from "@/components/home/StorePreviewStrip";
import NewsMediaBlock from "@/components/home/NewsMediaBlock";
import EventsBlock from "@/components/home/EventsBlock";
import { CountdownPromo } from "@/components/ui/CountdownPromo";
import EdgyGradient from "@/components/ui/EdgyGradient";
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
    <main className="bg-rich-black min-h-screen relative">
      
      {/* 1. Hero Carousel */}
      <HeroCarousel slides={heroSlides} />

      <div className="relative z-10 bg-rich-black overflow-hidden">
        
        {/* Ambient Edgy Background Glows */}
        <EdgyGradient opacity={0.65} />

        {/* 2. Match Centre Strip (Horizontal List) */}
        <MatchCentreStrip initialMatches={matches} twinData={twinData} rankingsData={rankingsData} />

        {/* 3. Featured Match Countdown (HK Rugby style) */}
        <CountdownPromo
          title="BATTLE OF THE ZAMBEZI"
          subtitle="ZIMBABWE vs ZAMBIA"
          description="The Sables return to action to defend their pride in the historic Battle of the Zambezi. Witness the African Champions in their first major test of 2026."
          targetDate="2026-11-21T15:00:00"
          countdownLabel="COUNTDOWN TO KICK OFF:"
          location="Harare Sports Club"
          image="/images/events/africa-cup.jpg"
          ctas={[
            { label: "Book Tickets", href: "/tickets", variant: "primary" },
            { label: "Fixture News", href: "/news/sables-vs-zambia", variant: "outline" },
          ]}
        />

        {/* 4. What's On / Events */}
        <EventsBlock />

        {/* 5. Latest News */}
        <NewsMediaBlock initialReports={reports} />

        {/* 6. Store Preview Strip (Interaction Portal / Clubhouse) */}
        <StorePreviewStrip />

      </div>
    </main>
  );
}


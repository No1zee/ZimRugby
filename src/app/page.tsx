import HeroCarousel from "@/components/home/HeroCarousel";
import MatchCentreStrip from "@/components/home/MatchCentreStrip";
import StorePreviewStrip from "@/components/home/StorePreviewStrip";
import NewsMediaBlock from "@/components/home/NewsMediaBlock";
import EventsBlock from "@/components/home/EventsBlock";
import { CountdownPromo } from "@/components/ui/CountdownPromo";
import { getLiveMatches, getLatestReports } from "@/lib/data-fetcher";

export default async function Home() {
  // Fetch data on the server
  const [matches, reports] = await Promise.all([
    getLiveMatches(),
    getLatestReports()
  ]);

  return (
    <main className="bg-rich-black min-h-screen relative">
      
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      <div className="relative z-10 bg-rich-black overflow-hidden">
        
        {/* Ambient Background Splashes */}
        <div className="pointer-events-none absolute top-[5%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#006039] opacity-[0.15] blur-[120px] mix-blend-screen" />
        <div className="pointer-events-none absolute top-[45%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-[#006039] opacity-[0.12] blur-[140px] mix-blend-screen" />
        <div className="pointer-events-none absolute bottom-[15%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#006039] opacity-[0.15] blur-[120px] mix-blend-screen" />

        {/* 2. Match Centre Strip (Horizontal List) */}
        <MatchCentreStrip initialMatches={matches} />

        {/* 2.5 Store Preview Strip (Interaction Portal) */}
        <StorePreviewStrip />

        {/* 3. Featured Match Countdown (HK Rugby style) */}
        <CountdownPromo
          title="BATTLE OF THE ZAMBEZI"
          subtitle="ZIMBABWE vs ZAMBIA"
          description="The Sables return to action to defend their pride in the historic Battle of the Zambezi. Witness the African Champions in their first major test of 2026."
          targetDate="2026-04-25T15:00:00"
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

      </div>
    </main>
  );
}


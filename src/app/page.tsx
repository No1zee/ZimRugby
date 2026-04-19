import HeroCarousel from "@/components/home/HeroCarousel";
import MatchCentreStrip from "@/components/home/MatchCentreStrip";
import StorePreviewStrip from "@/components/home/StorePreviewStrip";
import NewsMediaBlock from "@/components/home/NewsMediaBlock";
import PlayRugbyDevelopment from "@/components/home/PlayRugbyDevelopment";
import EventsBlock from "@/components/home/EventsBlock";
import PartnersSection from "@/components/home/PartnersSection";
import { CountdownPromo } from "@/components/ui/CountdownPromo";
import JournalStrip from "@/components/home/JournalStrip";

export default function Home() {
  return (
    <main className="bg-rich-black min-h-screen">
      
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      <div className="relative z-10 bg-rich-black">
        {/* 2. Match Centre Strip (Horizontal List) */}
        <MatchCentreStrip />

        {/* 2.5 Store Preview Strip (Interaction Portal) */}
        <StorePreviewStrip />

        {/* 3. Featured Match Countdown (HK Rugby style) */}
        <CountdownPromo
          title="MATCH"
          subtitle="ZAMBIA vs ZIMBABWE"
          description="The Sables return to action against Zambia in Bulawayo. Be there to support the boys as they kick off their 2026 international campaign."
          targetDate="2026-04-25T15:00:00"
          countdownLabel="COUNTDOWN TO KICK OFF:"
          location="Hartsfield, Bulawayo"
          image="/images/events/africa-cup.jpg"
          ctas={[
            { label: "Match Tickets", href: "/tickets", variant: "primary" },
            { label: "Fixture News", href: "/news/sables-vs-zambia", variant: "outline" },
          ]}
        />

        {/* 3.5 The Sables Journal (Directorial Narrative) */}
        <JournalStrip />

        {/* 4. What's On / Events */}
        <EventsBlock />

        {/* 4. Latest News */}
        <NewsMediaBlock />

        {/* 5. Community / Rugby For Good (Placeholder for now, using PlayRugbyDevelopment) */}
        <PlayRugbyDevelopment />

        {/* 6. Partners */}
        <PartnersSection />

      </div>
    </main>
  );
}

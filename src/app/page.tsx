import Navigation from "@/components/layout/Navigation";
import HeroCarousel from "@/components/home/HeroCarousel";
import MatchCentreStrip from "@/components/home/MatchCentreStrip";
import NewsMediaBlock from "@/components/home/NewsMediaBlock";
import PlayRugbyDevelopment from "@/components/home/PlayRugbyDevelopment";
import EventsBlock from "@/components/home/EventsBlock";
import PartnersSection from "@/components/home/PartnersSection";
import Footer from "@/components/layout/Footer";
import { CountdownPromo } from "@/components/ui/CountdownPromo";

export default function Home() {
  return (
    <main className="bg-rich-black min-h-screen">
      <Navigation />
      
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      <div className="relative z-10 bg-rich-black">
        {/* 2. Match Centre Strip (Horizontal List) */}
        <MatchCentreStrip />

        {/* 3. Featured Match Countdown (HK Rugby style) */}
        <CountdownPromo
          title="TONGA"
          subtitle="VS ZIM SABLES"
          description="The Sables take on Tonga in the upcoming Nations Cup clash. Don't miss this historic match as Zimbabwe faces international competition in the USA."
          targetDate="2026-07-04T15:00:00"
          countdownLabel="COUNTDOWN TO KICK OFF:"
          location="USA"
          image="/images/events/africa-cup.jpg"
          ctas={[
            { label: "Get Tickets", href: "/tickets", variant: "primary" },
            { label: "Match Info", href: "/matches/tonga", variant: "outline" },
          ]}
        />

        {/* 4. What's On / Events */}
        <EventsBlock />

        {/* 4. Latest News */}
        <NewsMediaBlock />

        {/* 5. Community / Rugby For Good (Placeholder for now, using PlayRugbyDevelopment) */}
        <PlayRugbyDevelopment />

        {/* 6. Partners */}
        <PartnersSection />

      </div>
      <Footer />
    </main>
  );
}

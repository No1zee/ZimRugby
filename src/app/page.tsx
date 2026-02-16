import Navigation from "@/components/layout/Navigation";
import HeroVideoHub from "@/components/home/HeroVideoHub";
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
      
      {/* 1. Hero with Video & Overlay */}
      <HeroVideoHub />

      <div className="relative z-10 bg-rich-black">
        {/* 2. Match Centre Strip (Horizontal List) */}
        <MatchCentreStrip />

        {/* 3. Featured Match Countdown (HK Rugby style) */}
        <CountdownPromo
          title="SABLES"
          subtitle="VS KENYA SIMBAS"
          description="The Sables take on rivals Kenya in a crucial Africa Cup qualifier. Don't miss this historic clash as Zimbabwe defends their continental crown on home soil."
          targetDate="2025-03-22T16:00:00"
          countdownLabel="COUNTDOWN TO KICK OFF:"
          location="National Sports Stadium, Harare"
          image="/images/events/africa-cup.jpg"
          ctas={[
            { label: "Get Tickets", href: "/tickets", variant: "primary" },
            { label: "Match Info", href: "/matches/africa-cup-kenya", variant: "outline" },
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

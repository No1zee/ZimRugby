import Navigation from "@/components/layout/Navigation";
import HeroVideoHub from "@/components/home/HeroVideoHub";
import CoreHubTiles from "@/components/home/CoreHubTiles";
import MatchCentreStrip from "@/components/home/MatchCentreStrip";
import NewsMediaBlock from "@/components/home/NewsMediaBlock";
import PlayRugbyDevelopment from "@/components/home/PlayRugbyDevelopment";
import EventsBlock from "@/components/home/EventsBlock";
import PartnersSection from "@/components/home/PartnersSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="bg-rich-black min-h-screen">
      <Navigation />
      
      {/* 1. Hero with Video & Overlay */}
      <HeroVideoHub />

      {/* 2. Core Hub Navigation Tiles (Overlapping Hero) */}
      <CoreHubTiles />

      {/* 3. Match Centre Strip (Next Match + List) */}
      <MatchCentreStrip />

      {/* 4. News & Media Hub */}
      <NewsMediaBlock />

      {/* 5. Play Rugby / Development Pathways */}
      <PlayRugbyDevelopment />

      {/* 6. What's On / Events */}
      <EventsBlock />

      {/* 7. Partners */}
      <PartnersSection />

      <Footer />
    </main>
  );
}

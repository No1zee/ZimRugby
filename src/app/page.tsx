import HeroSection from "@/components/home/HeroSection";
import MatchCentre from "@/components/home/MatchCentre";
import NewsSection from "@/components/home/NewsSection";
import EventsCalendar from "@/components/home/EventsCalendar";
import VideoHub from "@/components/home/VideoHub";
import TeamsShowcase from "@/components/home/TeamsShowcase";
import PartnersSection from "@/components/home/PartnersSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-rich-black text-white">
      <HeroSection />
      <MatchCentre />
      <NewsSection />
      <EventsCalendar />
      <VideoHub />
      <TeamsShowcase />
      <PartnersSection />
    </main>
  );
}

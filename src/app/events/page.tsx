import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getPageBySlug } from "@/lib/api/pages";
import { getEvents, getCompetitions, getGeneralEvents } from "@/lib/api/events";

const EventsClient = dynamic(() => import("./EventsClient"), {
  loading: () => (
    <div className="min-h-screen bg-milk-white flex items-center justify-center text-rich-black">
      <div className="animate-pulse space-y-4 text-center">
        <div className="h-6 w-48 bg-black/5 rounded mx-auto" />
        <div className="h-4 w-80 bg-black/5 rounded mx-auto" />
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Master Calendar & Events | Zimbabwe Rugby Union",
  description: "Browse domestic rugby competitions, tournaments, fixtures, and official Zimbabwe Rugby Union events.",
};

export default async function EventsPage() {
  const [cmsPage, allEvents] = await Promise.all([
    getPageBySlug("events"),
    getEvents()
  ]);

  const competitions = allEvents.filter(e => e.tags?.some(t => ["National", "Clubs", "Schools", "Super 6", "Competition", "Gold Cup", "Barthes", "Sevens", "Youth", "Women"].some(k => t.toLowerCase().includes(k.toLowerCase()))));
  const generalEvents = allEvents.filter(e => !competitions.some(c => c.id === e.id));

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-milk-white flex items-center justify-center text-rich-black">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-6 w-48 bg-black/5 rounded mx-auto" />
          <div className="h-4 w-80 bg-black/5 rounded mx-auto" />
        </div>
      </div>
    }>
      <EventsClient cmsPage={cmsPage} competitions={competitions} generalEvents={generalEvents} />
    </Suspense>
  );
}

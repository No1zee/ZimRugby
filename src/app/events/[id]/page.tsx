import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Clock, Tag, Ticket } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { getEventById } from "@/lib/api/events";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) return { title: "Event Not Found | Zimbabwe Rugby Union" };
  return {
    title: `${event.title} | Zimbabwe Rugby Union`,
    description: (event.description || event.subtitle || "").slice(0, 160),
  };
}

const STATUS_STYLES: Record<string, string> = {
  UPCOMING: "bg-black/10 text-black border border-black/20",
  ONGOING: "bg-zru-green text-white border border-zru-green",
  COMPLETED: "bg-black/5 text-black/40 border border-black/10",
  CANCELLED: "bg-red-700 text-white border border-red-700",
};

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const statusKey = event.cancelled
    ? "CANCELLED"
    : (event.status === "ongoing" ? "ONGOING" : event.status === "completed" ? "COMPLETED" : "UPCOMING");
  const dateLabel = event.date
    ? new Date(`${event.date}T00:00:00`).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : event.date;
  const timeLabel = event.isAllDay ? "All day" : event.time || "Time TBC";
  const categoryTag = event.tags?.[0] || (event.homeTeam ? "FIXTURE" : "EVENT");
  const score = event.score
    ? event.score
    : event.homeTeam && event.awayTeam && event.status === "completed"
      ? `${event.homeTeam} vs ${event.awayTeam} — Full Time`
      : undefined;

  return (
    <main className="bg-milk-white min-h-screen pb-16 text-rich-black">
      <PageHero
        title={event.title}
        subtitle={event.subtitle || (event.homeTeam && event.awayTeam ? `${event.homeTeam} vs ${event.awayTeam}` : "Zimbabwe Rugby Union")}
        tag={categoryTag}
        backgroundImage={event.image}
        breadcrumb={[
          { label: "Events", href: "/events" },
          { label: event.title, href: `/events/${event.id}` },
        ]}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 pb-8 border-b border-black/10">
          <span className={`px-2.5 py-1 rounded-none border text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[statusKey]}`}>
            {statusKey}
          </span>
          <span className="flex items-center gap-1.5 text-black/60 text-xs sm:text-sm font-bold">
            <Calendar className="w-4 h-4 text-zru-green shrink-0" /> {dateLabel}
          </span>
          <span className="flex items-center gap-1.5 text-black/60 text-xs sm:text-sm font-bold">
            <Clock className="w-4 h-4 text-zru-green shrink-0" /> {timeLabel}
          </span>
          {event.location ? (
            <span className="flex items-center gap-1.5 text-black/60 text-xs sm:text-sm font-bold">
              <MapPin className="w-4 h-4 text-zru-green shrink-0" /> {event.location}
            </span>
          ) : null}
          <span className="flex items-center gap-1.5 text-black/60 text-xs sm:text-sm font-bold">
            <Tag className="w-4 h-4 text-zru-green shrink-0" /> {categoryTag}
          </span>
        </div>

        {/* Description & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight italic text-rich-black">
              Event Briefing
            </h2>
            {score ? (
              <div className="inline-block bg-zru-green/10 border border-zru-green/30 text-zru-green font-heading font-black text-sm uppercase tracking-wider rounded-xl px-4 py-2">
                {score}
              </div>
            ) : null}
            <p className="text-black/80 text-base sm:text-lg leading-relaxed font-normal">
              {event.description || event.subtitle || "Details for this event will be announced shortly."}
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-heading font-black uppercase tracking-[0.25em] text-black/40 mb-3">Official Venue</h3>
              <p className="font-heading font-black text-rich-black text-lg">{event.location || "Venue TBC"}</p>
              <p className="text-black/60 text-xs sm:text-sm font-normal mt-1">{event.location ? event.location : "To be confirmed"}</p>
            </div>
            <div className="bg-zru-green text-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-heading font-black uppercase tracking-[0.25em] text-white/70 mb-3">Schedule</h3>
              <p className="font-heading font-black text-xl">{dateLabel}</p>
              <p className="text-white/80 text-xs sm:text-sm font-normal mt-1">{timeLabel}</p>
            </div>
            {event.ticketUrl ? (
              <Link
                href={event.ticketUrl}
                className="flex items-center justify-center gap-2 bg-black text-white rounded-2xl px-6 py-4 font-heading font-black text-xs uppercase tracking-widest hover:bg-zru-green transition-colors"
              >
                <Ticket className="w-4 h-4" /> Get Tickets
              </Link>
            ) : null}
          </div>
        </div>

        {/* Back nav */}
        <div className="mt-16 pt-8 border-t border-black/10">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-zru-green font-heading font-black text-xs uppercase tracking-widest hover:gap-3 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Events & Tournaments
          </Link>
        </div>
      </div>
    </main>
  );
}
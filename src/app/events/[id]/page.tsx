import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Clock, Tag } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

// Static event data matching homepage & events catalog
const EVENTS: Record<string, {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  category: string;
  description: string;
  image: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
}> = {
  "1": {
    id: "1",
    title: "Super Six Rugby League",
    subtitle: "National Club Championship",
    date: "APR — AUG 2026",
    time: "Saturdays & Sundays",
    venue: "Harare Sports Club",
    location: "Harare, Zimbabwe",
    category: "CLUBS",
    description:
      "The Super Six Rugby League is Zimbabwe's premier domestic club competition, featuring the country's top six provincial club sides battling for national supremacy. The competition spans the full winter season with home and away fixtures across Harare, Bulawayo, and Mutare.",
    image: "/images/events/super-league.jpg",
    status: "ONGOING",
  },
  "2": {
    id: "2",
    title: "Sable Lager Grid Cup",
    subtitle: "Annual Sevens Invitational",
    date: "SEP 2026",
    time: "09:00 — 18:00",
    venue: "Hartsfield Rugby Ground",
    location: "Bulawayo, Zimbabwe",
    category: "SEVENS",
    description:
      "The Sable Lager Grid Cup is Zimbabwe's marquee sevens invitational, drawing provincial and international sides to Bulawayo for a weekend of fast-paced rugby. The tournament serves as a key selection event for the national sevens programme.",
    image: "/images/events/africa-cup.jpg",
    status: "UPCOMING",
  },
  "3": {
    id: "3",
    title: "Nedbank Challenge Cup",
    subtitle: "Knockout Trophy Competition",
    date: "OCT 2026",
    time: "10:00 — 17:00",
    venue: "Harare Sports Club",
    location: "Harare, Zimbabwe",
    category: "CLUBS",
    description:
      "The Nedbank Challenge Cup is Zimbabwe's premier knockout cup competition. Any affiliated club side can enter, making it the most democratic and unpredictable tournament in the domestic calendar — where a provincial underdog can topple a Super Six title holder.",
    image: "/images/gallery/zimbabwe-sables-0350.webp",
    status: "UPCOMING",
  },
  "4": {
    id: "4",
    title: "Harare Under-20 League",
    subtitle: "Age-Grade Development Competition",
    date: "MAY — AUG 2026",
    time: "Saturdays",
    venue: "Various Harare Grounds",
    location: "Harare, Zimbabwe",
    category: "YOUTH",
    description:
      "The Harare Under-20 League is the primary development competition for the next generation of Zimbabwean rugby talent. All Harare-based clubs field U20 XVs across a full home-and-away season, with standout performers monitored by the Junior Sables national coaching team.",
    image: "/images/events/super-league.jpg",
    status: "ONGOING",
  },
};

const STATUS_STYLES: Record<string, string> = {
  UPCOMING: "bg-black/10 text-black border border-black/20",
  ONGOING: "bg-zru-green text-white border border-zru-green",
  COMPLETED: "bg-black/5 text-black/40 border border-black/10",
};

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = EVENTS[id];

  if (!event) {
    return (
      <main className="min-h-screen bg-milk-white flex flex-col items-center justify-center gap-6 px-6 text-center text-rich-black">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zru-green">Not Found</span>
        <h1 className="text-4xl sm:text-5xl font-heading font-black uppercase tracking-tight italic">Event Not Found</h1>
        <p className="text-black/60 max-w-md text-sm">This event schedule or tournament detail is unavailable or may have been updated.</p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-zru-green font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Competitions & Events
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-milk-white min-h-screen pb-24 text-rich-black">
      {/* Hero */}
      <div className="pt-20 sm:pt-24">
        <PageHero
          title={event.title}
          subtitle={event.subtitle}
          tag={event.category}
          backgroundImage={event.image}
          breadcrumb={[
            { label: "Events", href: "/events" },
            { label: event.title, href: `/events/${event.id}` },
          ]}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 pb-8 border-b border-black/10">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[event.status]}`}>
            {event.status}
          </span>
          <span className="flex items-center gap-1.5 text-black/60 text-xs sm:text-sm font-bold">
            <Calendar className="w-4 h-4 text-zru-green shrink-0" /> {event.date}
          </span>
          <span className="flex items-center gap-1.5 text-black/60 text-xs sm:text-sm font-bold">
            <Clock className="w-4 h-4 text-zru-green shrink-0" /> {event.time}
          </span>
          <span className="flex items-center gap-1.5 text-black/60 text-xs sm:text-sm font-bold">
            <MapPin className="w-4 h-4 text-zru-green shrink-0" /> {event.venue}, {event.location}
          </span>
          <span className="flex items-center gap-1.5 text-black/60 text-xs sm:text-sm font-bold">
            <Tag className="w-4 h-4 text-zru-green shrink-0" /> {event.category}
          </span>
        </div>

        {/* Description & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight italic text-rich-black">
              Tournament Briefing
            </h2>
            <p className="text-black/80 text-base sm:text-lg leading-relaxed font-normal">
              {event.description}
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-heading font-black uppercase tracking-[0.25em] text-black/40 mb-3">Official Venue</h3>
              <p className="font-heading font-black text-rich-black text-lg">{event.venue}</p>
              <p className="text-black/60 text-xs sm:text-sm font-normal mt-1">{event.location}</p>
            </div>
            <div className="bg-zru-green text-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-heading font-black uppercase tracking-[0.25em] text-white/70 mb-3">Schedule Window</h3>
              <p className="font-heading font-black text-xl">{event.date}</p>
              <p className="text-white/80 text-xs sm:text-sm font-normal mt-1">{event.time}</p>
            </div>
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
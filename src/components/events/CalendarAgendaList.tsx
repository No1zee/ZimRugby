"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Share2, Ticket, ExternalLink, Trophy } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";
import type { EventItem } from "@/types";

interface CalendarAgendaListProps {
  events: EventItem[];
  getTagBadge: (tags: string[]) => { label: string; bg: string; text: string };
  onSelectEvent?: (event: EventItem) => void;
}

export default function CalendarAgendaList({
  events,
  getTagBadge,
  onSelectEvent,
}: CalendarAgendaListProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-black/10 p-12 text-center text-black/50 space-y-3">
        <Calendar className="w-12 h-12 mx-auto text-black/30" />
        <h4 className="text-lg font-heading font-black uppercase text-rich-black">No Events Match Your Search</h4>
        <p className="text-sm">Try broadening your search term or clearing active category filters.</p>
      </div>
    );
  }

  // Group events by date
  const grouped = new Map<string, EventItem[]>();
  for (const ev of events) {
    const d = ev.date || "TBD";
    const list = grouped.get(d) || [];
    list.push(ev);
    grouped.set(d, list);
  }

  const handleShare = (ev: EventItem) => {
    if (navigator.share) {
      navigator.share({
        title: ev.title,
        text: `Check out ${ev.title} on Zimbabwe Rugby Master Calendar`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Fixture link copied to clipboard!");
    }
  };

  const generateGoogleCalUrl = (ev: EventItem) => {
    const title = encodeURIComponent(ev.title);
    const details = encodeURIComponent(ev.description || ev.subtitle || "Zimbabwe Rugby Union Event");
    const location = encodeURIComponent(ev.location || "Zimbabwe");
    const dateStr = (ev.date || "").replace(/-/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStr}/${dateStr}`;
  };

  return (
    <div className="space-y-8">
      {Array.from(grouped.entries()).map(([dateStr, dayEvents]) => (
        <div key={dateStr} className="space-y-4">
          {/* Date Group Header */}
          <div className="flex items-center gap-3 border-b border-black/10 pb-2">
            <Calendar className="w-4 h-4 text-zru-green" />
            <h3 className="text-lg font-heading font-black uppercase text-rich-black tracking-tight">
              {dateStr}
            </h3>
            <span className="text-xs font-mono font-bold bg-black/5 text-black/60 px-2.5 py-0.5 rounded-full">
              {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
            </span>
          </div>

          {/* Cards List for Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dayEvents.map((ev) => {
              const badge = getTagBadge(ev.tags);
              const googleCalUrl = generateGoogleCalUrl(ev);

              return (
                <motion.div
                  key={ev.id}
                  onClick={() => onSelectEvent?.(ev)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-black/10 p-5 space-y-4 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full ${badge.bg}`}>
                      {badge.label} {badge.text}
                    </span>
                    {ev.score && (
                      <span className="text-xs font-mono font-black text-zru-green bg-zru-green/10 px-2.5 py-0.5 rounded-full border border-zru-green/20">
                        FINAL: {ev.score}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-heading font-black uppercase text-rich-black leading-snug">
                      {ev.title}
                    </h4>
                    {ev.subtitle && (
                      <p className="text-xs font-mono font-bold text-black/60 mt-0.5">{ev.subtitle}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold text-black/70 bg-milk-white p-3 rounded-xl border border-black/5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zru-green shrink-0" />
                      <span>{ev.location || "Venue TBD"}</span>
                    </div>
                    {ev.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zru-green shrink-0" />
                        <span>{ev.time} Kickoff</span>
                      </div>
                    )}
                  </div>

                  {ev.description && (
                    <p className="text-xs text-black/70 line-clamp-2 leading-relaxed">
                      {ev.description}
                    </p>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-black/5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={googleCalUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 bg-milk-white hover:bg-black/5 border border-black/10 rounded-lg text-[11px] font-bold text-rich-black flex items-center gap-1 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-zru-green" />
                        <span>+ Cal</span>
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(ev);
                        }}
                        className="p-1.5 bg-milk-white hover:bg-black/5 border border-black/10 rounded-lg text-rich-black transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {ev.ticketUrl && (
                      <a
                        href={ev.ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3.5 py-1.5 bg-zru-green text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-zru-green/90 transition-colors flex items-center gap-1.5"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Tickets</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

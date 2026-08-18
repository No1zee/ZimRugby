"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Share2, ExternalLink, Ticket, Download, Sparkles, CheckCircle2 } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";
import type { EventItem } from "@/types";

interface SelectedDatePanelProps {
  selectedDateStr: string | null;
  events: EventItem[];
  getTagBadge: (tags: string[]) => { label: string; bg: string; text: string };
  onClose?: () => void;
}

export default function SelectedDatePanel({
  selectedDateStr,
  events,
  getTagBadge,
}: SelectedDatePanelProps) {
  const handleShare = (event: EventItem) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} on Zimbabwe Rugby Master Calendar`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Fixture link copied to clipboard!");
    }
  };

  const generateGoogleCalUrl = (event: EventItem) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || event.subtitle || "Zimbabwe Rugby Union Event");
    const location = encodeURIComponent(event.location || "Zimbabwe");
    const dateStr = (event.date || "").replace(/-/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStr}/${dateStr}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-black/10 shadow-sm p-6 space-y-6 sticky top-24">
      {/* Panel Header */}
      <div className="border-b border-black/5 pb-4 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-mono font-black uppercase tracking-widest text-black/40">
            SELECTED DAY SCHEDULE
          </span>
          <h3 className="text-xl font-heading font-black uppercase text-rich-black">
            {selectedDateStr ? selectedDateStr : "Upcoming Events"}
          </h3>
        </div>
        <span className="text-xs font-mono font-bold bg-zru-green/10 text-zru-green px-3 py-1 rounded-full">
          {events.length} {events.length === 1 ? "Event" : "Events"}
        </span>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="py-12 text-center text-black/40 space-y-3">
          <Calendar className="w-10 h-10 mx-auto opacity-30" />
          <p className="text-sm font-bold">No events scheduled for this day.</p>
          <p className="text-xs text-black/50">Pick another date on the calendar grid to inspect schedules.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {events.map((ev) => {
            const badge = getTagBadge(ev.tags);
            const googleCalUrl = generateGoogleCalUrl(ev);

            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-milk-white border border-black/10 space-y-4 hover:shadow-md transition-all"
              >
                {/* Category & Status */}
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

                {/* Title & Subtitle */}
                <div>
                  <h4 className="text-base font-heading font-black uppercase text-rich-black leading-snug">
                    {ev.title}
                  </h4>
                  {ev.subtitle && (
                    <p className="text-xs font-mono font-bold text-black/60 mt-0.5">{ev.subtitle}</p>
                  )}
                </div>

                {/* Metadata: Location & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono font-bold text-black/70 bg-white p-3 rounded-xl border border-black/5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zru-green shrink-0" />
                    <span className="truncate">{ev.location || "Venue TBD"}</span>
                  </div>
                  {ev.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zru-green shrink-0" />
                      <span>{ev.time} Kickoff</span>
                    </div>
                  )}
                </div>

                {ev.description && (
                  <p className="text-xs text-black/70 line-clamp-3 leading-relaxed">
                    {ev.description}
                  </p>
                )}

                {/* Utility Actions Bar */}
                <div className="pt-2 border-t border-black/5 flex flex-wrap items-center gap-2">
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-black/5 border border-black/10 rounded-xl text-xs font-bold text-rich-black transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-zru-green" />
                    <span>Google Cal</span>
                  </a>

                  {ev.location && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(ev.location)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-black/5 border border-black/10 rounded-xl text-xs font-bold text-rich-black transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-zru-green" />
                      <span>Map</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleShare(ev)}
                    className="p-2 bg-white hover:bg-black/5 border border-black/10 rounded-xl text-rich-black transition-colors"
                    title="Share Fixture"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {ev.ticketUrl && (
                    <a
                      href={ev.ticketUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zru-green text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-zru-green/90 transition-colors"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Buy Tickets</span>
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

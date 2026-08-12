"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, MapPin, Clock, Ticket, Trophy, Shield, ExternalLink } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";
import type { EventItem } from "@/types";

interface DayTimelineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  events: EventItem[];
}

export default function DayTimelineDrawer({ isOpen, onClose, dateStr, events }: DayTimelineDrawerProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-screen max-w-md bg-milk-white shadow-2xl border-l border-black/10 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-black/5 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zru-green/10 border border-zru-green/20 flex items-center justify-center text-zru-green font-black">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zru-green block">
                    Day Schedule
                  </span>
                  <h2 className="text-xl font-heading font-black text-rich-black uppercase tracking-tight">
                    {dateStr}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 hover:text-black transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Events Timeline Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {events.length === 0 ? (
                <div className="text-center py-16 text-black/40">
                  <p className="font-bold uppercase tracking-widest text-xs">No scheduled events on this date</p>
                </div>
              ) : (
                events.map((event, idx) => (
                  <div
                    key={event.id || idx}
                    className="relative pl-6 border-l-2 border-zru-green/30 space-y-3 bg-white p-5 rounded-xl border border-black/5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Typographic Tag Badge (No Dots!) */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zru-green/10 text-zru-green border border-zru-green/20">
                        {event.tags?.[0] || "EVENT"}
                      </span>
                      {event.status === "completed" && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/5 text-black/50 border border-black/10">
                          COMPLETED
                        </span>
                      )}
                      {event.status === "ongoing" && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          LIVE TODAY
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-heading text-rich-black font-black leading-snug">
                      {event.title}
                    </h3>

                    {/* Score display if completed */}
                    {event.score && (
                      <div className="bg-rich-black text-white px-3 py-2 rounded-lg font-heading font-black text-center text-sm tracking-widest uppercase border border-zru-green/40">
                        FINAL: {event.score}
                      </div>
                    )}

                    {event.subtitle && (
                      <p className="text-xs text-black/60 font-body">
                        {event.subtitle}
                      </p>
                    )}

                    <div className="space-y-1.5 pt-2 text-xs font-bold text-black/70">
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-zru-green shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-xs text-black/50 font-body leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    {event.ticketUrl && (
                      <div className="pt-2">
                        <SlantedButton href={event.ticketUrl} variant="primary" size="sm" className="w-full justify-center">
                          <Ticket className="w-3.5 h-3.5 mr-1" /> GET TICKETS
                        </SlantedButton>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-black/5 text-center text-[10px] font-black uppercase tracking-widest text-black/40">
              Zimbabwe Rugby Union Official Calendar
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

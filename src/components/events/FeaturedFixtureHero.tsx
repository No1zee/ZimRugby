"use client";

import { motion } from "framer-motion";
import { Shield, MapPin, Clock, Calendar, Ticket, ExternalLink, ArrowRight, Trophy, Flame } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";
import type { EventItem } from "@/types";

interface FeaturedFixtureHeroProps {
  event?: EventItem | null;
}

export default function FeaturedFixtureHero({ event }: FeaturedFixtureHeroProps) {
  if (!event) return null;

  const hasVs = / vs /i.test(event.title);
  const parts = hasVs ? event.title.split(/ vs /i) : [];
  const home = event.homeTeam || (parts[0] ? parts[0].trim() : "Zimbabwe Sables");
  const away = event.awayTeam || (parts[1] ? parts[1].trim() : "");
  const comp = event.competition || event.subtitle || "International Rugby";
  const venue = event.location || "Harare Sports Club";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-rich-black text-white p-6 sm:p-8 md:p-10 mb-8 border border-zru-green/30 shadow-2xl">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-zru-green/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-zru-green text-white shadow-md">
            <Flame className="w-3.5 h-3.5" />
            FEATURED FIXTURE
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
            {comp}
          </span>
        </div>

        {event.date && (
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            <Calendar className="w-3.5 h-3.5 text-zru-green" />
            <span>{event.date}</span>
            {event.time && <span>• {event.time}</span>}
          </div>
        )}
      </div>

      {/* Matchup Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Teams Display */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-white leading-tight uppercase">
            {away ? (
              <>
                <span className="text-zru-green">{home}</span>
                <span className="text-white/40 font-mono text-xl sm:text-2xl mx-3 font-normal">VS</span>
                <span>{away}</span>
              </>
            ) : (
              <span className="text-white">{event.title}</span>
            )}
          </h2>

          <p className="text-white/70 text-sm sm:text-base font-body leading-relaxed max-w-2xl">
            {event.description || (away ? `Official test fixture: ${home} face ${away} in a crucial ${comp} clash.` : comp)}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-white/80 font-mono">
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <MapPin className="w-4 h-4 text-zru-green" />
              <span>{venue}</span>
            </div>
            {event.city && (
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Trophy className="w-4 h-4 text-zru-green" />
                <span>{event.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
          {event.ticketUrl && (
            <SlantedButton href={event.ticketUrl} variant="primary" size="lg" className="w-full justify-center text-sm shadow-xl">
              <Ticket className="w-4 h-4 mr-2" /> GET TICKETS NOW
            </SlantedButton>
          )}
          <SlantedButton href="/match-centre" variant="outline" size="lg" className="w-full justify-center text-sm border-white/20 text-white hover:bg-white/10">
            MATCH CENTRE <ArrowRight className="w-4 h-4 ml-2" />
          </SlantedButton>
        </div>
      </div>
    </div>
  );
}

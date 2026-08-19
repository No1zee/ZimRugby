"use client";

import { ArrowRight, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { MatchCardViewModel } from "@/lib/match-centre/types";

interface HomeUpcomingMatchesProps {
  nextMatch?: MatchCardViewModel | null;
  upcomingMatches?: MatchCardViewModel[];
}

export default function HomeUpcomingMatches({
  nextMatch,
  upcomingMatches = [],
}: HomeUpcomingMatchesProps) {
  const matchDate = nextMatch?.dateIso
    ? new Date(nextMatch.dateIso).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase()
    : "UPCOMING FIXTURE";

  const homeTeamName = nextMatch?.homeTeam?.name || "ZIMBABWE SABLES";
  const awayTeamName = nextMatch?.awayTeam?.name || "NAMIBIA";
  const venue = nextMatch?.venue || "HARARE SPORTS CLUB";
  const competition = nextMatch?.competition || "AFRICA CUP 2026";
  const time = nextMatch?.time ? `${nextMatch.time} KICKOFF` : "15:30 CAT KICKOFF";

  return (
    <section className="py-12 sm:py-16 bg-[#002B19] text-white relative select-none overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,103,71,0.3)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-teal animate-pulse" />
              <span className="text-[11px] font-black tracking-[0.25em] text-accent-teal uppercase font-heading">
                MATCH CENTRE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase text-white tracking-tight leading-none">
              UPCOMING <span className="text-accent-teal">FIXTURES</span>
            </h2>
          </div>

          <Link
            href="/match-centre"
            className="group inline-flex items-center gap-2 text-xs font-heading font-black tracking-widest uppercase text-accent-teal hover:text-white transition-colors self-start sm:self-auto py-1"
          >
            <span>FULL MATCH SCHEDULE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Feature Grid: Next Match Hero Card + Fixture List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Next Match Card (Span 8) */}
          <div className="lg:col-span-8 bg-black/40 backdrop-blur-md rounded-3xl border border-white/15 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Top Match Banner */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4 mb-6">
              <span className="px-3 py-1 bg-accent-teal text-rich-black text-[10px] font-black uppercase tracking-widest rounded-md shadow">
                {competition}
              </span>
              <span className="text-white/60 text-xs font-heading font-bold tracking-wider uppercase">
                NEXT OFFICIAL FIXTURE
              </span>
            </div>

            {/* Teams Duel Layout */}
            <div className="grid grid-cols-7 items-center py-4 my-auto gap-2 text-center">
              {/* Home Team */}
              <div className="col-span-3 flex flex-col items-center gap-3">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center justify-center shadow-lg">
                  {nextMatch?.homeTeam?.logo ? (
                    <Image
                      src={nextMatch.homeTeam.logo}
                      alt={homeTeamName}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="font-heading font-black text-2xl text-accent-teal">
                      {nextMatch?.homeTeam?.code || "ZIM"}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-black text-base sm:text-xl text-white uppercase tracking-tight leading-tight">
                  {homeTeamName}
                </h3>
              </div>

              {/* VS Pill */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                <span className="font-heading font-black text-lg sm:text-2xl text-accent-teal tracking-widest opacity-80">
                  VS
                </span>
              </div>

              {/* Away Team */}
              <div className="col-span-3 flex flex-col items-center gap-3">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center justify-center shadow-lg">
                  {nextMatch?.awayTeam?.logo ? (
                    <Image
                      src={nextMatch.awayTeam.logo}
                      alt={awayTeamName}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="font-heading font-black text-2xl text-white/60">
                      {nextMatch?.awayTeam?.code || "TBA"}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-black text-base sm:text-xl text-white uppercase tracking-tight leading-tight">
                  {awayTeamName}
                </h3>
              </div>
            </div>

            {/* Match Meta Footer & Action CTAs */}
            <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 font-bold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent-teal" />
                  <span>{matchDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-accent-teal" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-accent-teal" />
                  <span>{venue}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/tickets"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent-teal text-rich-black font-heading font-black text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Match Tickets</span>
                </Link>
                <Link
                  href={nextMatch?.slug ? `/matches/${nextMatch.slug}` : "/match-centre"}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-black text-xs uppercase tracking-wider transition-all"
                >
                  <span>Preview</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Matchday Information Side Box (Span 4) */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-accent-teal tracking-widest font-heading">
                <Ticket className="w-4 h-4" />
                <span>MATCHDAY ADMISSION</span>
              </div>
              <h4 className="font-heading font-black text-xl sm:text-2xl text-white uppercase leading-snug">
                EXPERIENCE SABLES RUGBY LIVE
              </h4>
              <p className="text-white/70 text-xs leading-relaxed">
                Secure your tickets in advance for national tests and domestic championships. Gates open 3 hours prior to kickoff with Fan Village access.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <Link
                href="/tickets"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/10 hover:bg-accent-teal hover:text-rich-black text-white transition-all text-xs font-heading font-black uppercase tracking-wider group"
              >
                <span>Buy Match Tickets</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/match-centre"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-black/20 hover:bg-white/10 text-white/80 transition-all text-xs font-heading font-bold uppercase tracking-wider group"
              >
                <span>Domestic Results & Tables</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

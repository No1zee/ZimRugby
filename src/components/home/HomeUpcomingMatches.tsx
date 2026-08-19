"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Ticket, ArrowRight, Clock } from "lucide-react";
import type { MatchCardViewModel } from "@/lib/match-centre/types";

interface HomeUpcomingMatchesProps {
  nextMatch: MatchCardViewModel | null;
  upcomingMatches?: MatchCardViewModel[];
}

export default function HomeUpcomingMatches({
  nextMatch,
  upcomingMatches = [],
}: HomeUpcomingMatchesProps) {
  const homeTeamName = nextMatch?.homeTeam?.name || "Zimbabwe Sables";
  const awayTeamName = nextMatch?.awayTeam?.name || "Namibia Welwitschias";
  const competition = nextMatch?.competition || "Rugby Africa Cup 2026";
  const venue = nextMatch?.venue || "Harare Sports Club";
  const matchDate = nextMatch?.dateIso
    ? new Date(nextMatch.dateIso).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Saturday, 22 August 2026";
  const time = nextMatch?.time || "15:30 CAT";

  return (
    <section
      aria-label="Match Centre & Upcoming Fixtures"
      className="py-12 sm:py-16 bg-[#002D1A] relative overflow-hidden"
    >
      {/* Dynamic Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-zru-green/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-teal" />
              <span className="text-accent-teal font-heading font-black text-xs sm:text-sm uppercase tracking-[0.25em]">
                MATCH CENTRE
              </span>
            </div>
            <div className="heading-plate heading-plate-light">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase text-white tracking-tight leading-[1.05]">
                UPCOMING <span className="text-accent-teal">FIXTURES</span>
              </h2>
            </div>
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
          <div className="lg:col-span-8 bg-[#002214]/60 backdrop-blur-xl rounded-[24px] border border-[#006747]/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Top Match Banner */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4 mb-6">
              <span className="px-3.5 py-1 bg-white text-zru-green text-[10px] font-black uppercase tracking-widest rounded-md shadow">
                {competition}
              </span>
              <span className="text-white/70 text-xs font-heading font-black tracking-widest uppercase">
                NEXT OFFICIAL TEST
              </span>
            </div>

            {/* Teams Duel Layout */}
            <div className="grid grid-cols-7 items-center py-6 my-auto gap-2 text-center">
              {/* Home Team */}
              <div className="col-span-3 flex flex-col items-center gap-3">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white/10 border border-white/15 p-3 flex items-center justify-center shadow-lg">
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

              {/* VS Separator */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                <span className="font-heading font-black text-xl sm:text-3xl text-accent-teal tracking-widest">
                  VS
                </span>
              </div>

              {/* Away Team */}
              <div className="col-span-3 flex flex-col items-center gap-3">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white/10 border border-white/15 p-3 flex items-center justify-center shadow-lg">
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
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-zru-green hover:bg-[#00875A] text-white font-heading font-black text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Match Tickets</span>
                </Link>
                <Link
                  href={nextMatch?.slug ? `/matches/${nextMatch.slug}` : "/match-centre"}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-heading font-black text-xs uppercase tracking-wider transition-all"
                >
                  <span>Preview</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Matchday Information Side Box (Span 4) */}
          <div className="lg:col-span-4 bg-[#002214]/40 border border-[#006747]/20 rounded-[24px] p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-xl backdrop-blur-md">
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
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/10 hover:bg-zru-green hover:text-white text-white transition-all text-xs font-heading font-black uppercase tracking-wider group"
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

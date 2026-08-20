"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getFlagUrl, COUNTRY_ISO_MAP } from "@/lib/flags";

interface MatchCardProps {
  id: string | number;
  competition: string;
  round: string;
  date: string;
  time: string;
  venue: string;
  homeTeam: {
    name: string;
    score?: number;
    logo?: string;
  };
  awayTeam: {
    name: string;
    score?: number;
    logo?: string;
  };
  status?: "upcoming" | "live" | "completed";
  teamCategory?: string;
  opponentCategory?: string;
}

function resolveTeamFlag(teamName: string, customLogo?: string): string {
  if (customLogo) return customLogo;
  if (!teamName) return "";
  const direct = getFlagUrl(teamName);
  if (direct) return direct;
  const match = Object.keys(COUNTRY_ISO_MAP).find((c) =>
    teamName.toLowerCase().includes(c.toLowerCase())
  );
  if (match) return getFlagUrl(match);
  return "";
}

function getTeamCode(name: string): string {
  if (!name) return "ZRU";
  const clean = name.replace(/\b(U\d+|Women|Men|Sevens|XV)\b/gi, "").trim();
  if (clean.length >= 3) {
    return clean.substring(0, 3).toUpperCase();
  }
  return name.substring(0, 3).toUpperCase();
}

export default function MatchCard({
  id,
  competition,
  round,
  date,
  time,
  venue,
  homeTeam,
  awayTeam,
  status = "upcoming",
  teamCategory,
  opponentCategory,
}: MatchCardProps) {
  const [imgError, setImgError] = useState<{ home: boolean; away: boolean }>({
    home: false,
    away: false,
  });

  const homeLogo = !imgError.home ? resolveTeamFlag(homeTeam.name, homeTeam.logo) : "";
  const awayLogo = !imgError.away ? resolveTeamFlag(awayTeam.name, awayTeam.logo) : "";

  const isLive = status === "live";
  const isCompleted = status === "completed";

  // Check winner for subtle visual hierarchy if score is present
  const homeScore = typeof homeTeam.score === "number" ? homeTeam.score : null;
  const awayScore = typeof awayTeam.score === "number" ? awayTeam.score : null;

  return (
    <Link href={`/matches/${id}`} className="block h-full group focus:outline-none">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative h-full flex flex-col bg-white border border-stone-200/90 group-hover:border-zru-green/50 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_24px_rgba(0,107,63,0.08)] transition-all duration-300"
      >
        {/* Header: Dual-zone Competition & Status Bar */}
        <div className="bg-[#FAF9F5] px-4 sm:px-5 py-3 flex flex-wrap justify-between items-center gap-2 border-b border-stone-200/80">
          {/* Left Zone: Category Badge & Competition Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {teamCategory && (
              <span className="bg-zru-green text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shrink-0 shadow-xs">
                {teamCategory}
              </span>
            )}
            {opponentCategory && opponentCategory.toLowerCase() !== "international" && (
              <span className="bg-stone-200 text-stone-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider shrink-0">
                {opponentCategory}
              </span>
            )}
            <span className="text-stone-900 font-heading font-black text-xs sm:text-sm tracking-wider uppercase truncate" title={competition}>
              {competition}
            </span>
          </div>

          {/* Right Zone: Stage Tag & Match Status Pill */}
          <div className="flex items-center gap-2 shrink-0">
            {round && (
              <span className="text-stone-500 text-[11px] font-bold uppercase tracking-wider hidden sm:inline-block">
                {round}
              </span>
            )}
            {isLive ? (
              <span className="bg-zru-green text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            ) : isCompleted ? (
              <span className="bg-stone-900 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md shadow-xs">
                FULL TIME
              </span>
            ) : (
              <span className="bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                UPCOMING
              </span>
            )}
          </div>
        </div>

        {/* Main Content: Matchup Scoreboard */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 my-auto py-2">
            {/* Home Team */}
            <div className="flex flex-col items-center text-center gap-2 min-w-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#FAF9F5] border border-stone-200/90 flex items-center justify-center p-2 relative shadow-xs group-hover:border-zru-green/40 group-hover:bg-white transition-all">
                {homeLogo ? (
                  <Image
                    src={homeLogo}
                    alt={homeTeam.name}
                    fill
                    sizes="72px"
                    className="object-contain p-2 rounded-full"
                    onError={() => setImgError((prev) => ({ ...prev, home: true }))}
                  />
                ) : (
                  <span className="text-stone-900 font-heading font-black text-lg sm:text-xl tracking-wider">
                    {getTeamCode(homeTeam.name)}
                  </span>
                )}
              </div>
              <span className="text-stone-900 font-heading text-xs sm:text-sm font-black uppercase leading-tight tracking-wide line-clamp-2 px-1">
                {homeTeam.name}
              </span>
            </div>

            {/* Score / VS Display (Flat Digital Minimalist) */}
            <div className="flex flex-col items-center justify-center px-2">
              {isCompleted || isLive ? (
                <div className="flex items-center gap-2 sm:gap-3 text-stone-900 font-heading font-black text-3xl sm:text-4xl tracking-tight">
                  <span className={homeScore !== null && awayScore !== null && homeScore > awayScore ? "text-stone-900" : "text-stone-800"}>
                    {homeScore ?? 0}
                  </span>
                  <span className="text-stone-400 font-light text-2xl sm:text-3xl">-</span>
                  <span className={homeScore !== null && awayScore !== null && awayScore > homeScore ? "text-stone-900" : "text-stone-800"}>
                    {awayScore ?? 0}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-heading font-black text-stone-300 tracking-wider">
                    VS
                  </span>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center text-center gap-2 min-w-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#FAF9F5] border border-stone-200/90 flex items-center justify-center p-2 relative shadow-xs group-hover:border-zru-green/40 group-hover:bg-white transition-all">
                {awayLogo ? (
                  <Image
                    src={awayLogo}
                    alt={awayTeam.name}
                    fill
                    sizes="72px"
                    className="object-contain p-2 rounded-full"
                    onError={() => setImgError((prev) => ({ ...prev, away: true }))}
                  />
                ) : (
                  <span className="text-stone-900 font-heading font-black text-lg sm:text-xl tracking-wider">
                    {getTeamCode(awayTeam.name)}
                  </span>
                )}
              </div>
              <span className="text-stone-900 font-heading text-xs sm:text-sm font-black uppercase leading-tight tracking-wide line-clamp-2 px-1">
                {awayTeam.name}
              </span>
            </div>
          </div>

          {/* Footer Metadata & CTA Row */}
          <div className="border-t border-stone-100 pt-3.5 mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-2 flex-wrap font-bold uppercase tracking-wider text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Calendar className="w-3.5 h-3.5 text-zru-green shrink-0" />
                  <span>{date}</span>
                </div>
                {time && (
                  <>
                    <span className="text-stone-300">•</span>
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <Clock className="w-3.5 h-3.5 text-zru-green shrink-0" />
                      <span>{time.includes("CAT") ? time : `${time} CAT`}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Subtle hover arrow indicator */}
              <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-stone-400 group-hover:text-zru-green transition-colors">
                <span className="hidden sm:inline">Details</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {venue && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-wider truncate">
                <MapPin className="w-3.5 h-3.5 text-zru-green shrink-0" />
                <span className="truncate">{venue}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

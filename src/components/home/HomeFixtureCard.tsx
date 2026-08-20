import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Trophy, Radio } from "lucide-react";
import { MatchCardViewModel } from "@/lib/match-centre/types";
import { Match, TeamDetails } from "@/types";

export type UniversalMatch = MatchCardViewModel | Match;

interface HomeFixtureCardProps {
  match: UniversalMatch;
  variant?: "primary" | "companion";
  isCompleted?: boolean;
}

function extractTeamName(team: string | TeamDetails | { name: string } | undefined, fallback: string): string {
  if (!team) return fallback;
  if (typeof team === "string") return team;
  if (typeof team === "object" && "name" in team && team.name) return team.name;
  return fallback;
}

function extractTeamLogo(team: string | TeamDetails | { logo?: string } | undefined): string | undefined {
  if (typeof team === "object" && team !== null && "logo" in team && team.logo) {
    return team.logo;
  }
  return undefined;
}

function extractScore(team: string | TeamDetails | { score?: number } | undefined): number | undefined {
  if (typeof team === "object" && team !== null && "score" in team && team.score !== null && team.score !== undefined) {
    return Number(team.score);
  }
  return undefined;
}

export function HomeFixtureCard({
  match,
  variant = "companion",
  isCompleted = false,
}: HomeFixtureCardProps) {
  const homeTeamName = extractTeamName(match.homeTeam, "Zimbabwe Sables");
  const awayTeamName = extractTeamName(match.awayTeam, "Opponent");

  const homeLogo = extractTeamLogo(match.homeTeam);
  const awayLogo = extractTeamLogo(match.awayTeam);

  const homeScore = extractScore(match.homeTeam);
  const awayScore = extractScore(match.awayTeam);

  const venueName: string = match.venue || "National Sports Stadium";
  const competitionName: string = match.competition || "International Fixture";
  const matchSlug: string = ("slug" in match && match.slug) ? match.slug : String(match.id || "");
  const matchUrl = matchSlug ? `/match-centre#match-${matchSlug}` : "/match-centre";

  const isLive = "status" in match && match.status === "live";
  const effectiveCompleted = isCompleted || ("status" in match && (match.status as string === "completed" || match.status as string === "finished"));
  const hasScores = homeScore != null && awayScore != null;

  // Format date and time
  let formattedDate = "";
  let formattedTime = "";

  const isVm = "dateIso" in match && typeof (match as MatchCardViewModel).dateIso === "string";

  if (isVm && (match as MatchCardViewModel).dateIso) {
    try {
      const d = new Date((match as MatchCardViewModel).dateIso);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
    } catch {
      formattedDate = (match as MatchCardViewModel).dateIso;
    }
    formattedTime = (match as MatchCardViewModel).time || "";
  } else {
    const rawDate = (match as Match).date || "";
    if (rawDate) {
      try {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          formattedTime = (match as Match).time || d.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });
        } else {
          formattedDate = rawDate;
          formattedTime = (match as Match).time || "";
        }
      } catch {
        formattedDate = rawDate;
        formattedTime = (match as Match).time || "";
      }
    }
  }

  // Primary Featured Variant (Editorial Split Hero)
  if (variant === "primary") {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/95 via-rich-black to-black p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:border-zru-green/50 hover:shadow-[0_20px_50px_rgba(0,107,63,0.18)] group flex flex-col justify-between h-full min-h-[420px]">
        {/* Editorial Background Texture Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-zru-green/60 to-transparent group-hover:via-zru-green transition-all duration-500" />

        <div className="relative z-10 space-y-8">
          {/* Header Strip: Competition + Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-heading font-black uppercase tracking-wider bg-white/5 border border-white/10 text-white/90 group-hover:border-zru-green/40 transition-colors">
              <Trophy className="w-3.5 h-3.5 text-zru-green" />
              <span>{competitionName}</span>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border ${
                isLive
                  ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse inline-flex items-center gap-1.5"
                  : effectiveCompleted
                  ? "bg-white/5 text-white/60 border-white/10"
                  : "bg-zru-green/20 text-emerald-300 border-zru-green/40"
              }`}
            >
              {isLive ? (
                <>
                  <Radio className="w-3 h-3" />
                  <span>Live Match</span>
                </>
              ) : effectiveCompleted ? (
                "Full Time"
              ) : (
                "Next Fixture"
              )}
            </span>
          </div>

          {/* Teams Faceoff Grid */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 my-4">
            {/* Home Team */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3.5 group-hover:border-zru-green/40 transition-all duration-300 relative shadow-inner">
                {homeLogo ? (
                  <Image
                    src={homeLogo}
                    alt={homeTeamName}
                    width={64}
                    height={64}
                    className="object-contain max-h-full"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-heading font-black tracking-wider text-white">
                    {homeTeamName.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-base sm:text-lg font-heading font-black uppercase tracking-tight text-white leading-tight line-clamp-2">
                {homeTeamName}
              </span>
            </div>

            {/* Versus / Score Central Pillar */}
            <div className="flex flex-col items-center justify-center px-2">
              {hasScores ? (
                <div className="flex items-center gap-2 sm:gap-3.5 bg-black/60 border border-white/15 px-4 sm:px-5 py-2.5 rounded-2xl shadow-xl">
                  <span className="text-2xl sm:text-4xl font-heading font-black text-white tabular-nums">
                    {homeScore}
                  </span>
                  <span className="text-white/40 font-heading font-black text-xl">-</span>
                  <span className="text-2xl sm:text-4xl font-heading font-black text-white tabular-nums">
                    {awayScore}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-heading font-black text-zru-green tracking-widest uppercase bg-zru-green/15 border border-zru-green/30 px-3.5 py-1 rounded-full">
                    VS
                  </span>
                  {formattedTime && (
                    <span className="text-[11px] font-mono font-bold text-white/70 tracking-wider">
                      {formattedTime} CAT
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3.5 group-hover:border-zru-green/40 transition-all duration-300 relative shadow-inner">
                {awayLogo ? (
                  <Image
                    src={awayLogo}
                    alt={awayTeamName}
                    width={64}
                    height={64}
                    className="object-contain max-h-full"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-heading font-black tracking-wider text-white">
                    {awayTeamName.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-base sm:text-lg font-heading font-black uppercase tracking-tight text-white leading-tight line-clamp-2">
                {awayTeamName}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Info & Action Controls */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/70">
            {formattedDate && (
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-zru-green" />
                <span>{formattedDate}</span>
              </span>
            )}
            {venueName && (
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-zru-green" />
                <span>{venueName}</span>
              </span>
            )}
          </div>

          <Link
            href={matchUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zru-green hover:bg-[#004D2C] text-white text-xs font-heading font-black uppercase tracking-wider transition-colors shadow-sm ml-auto"
          >
            <span>{effectiveCompleted ? "Match Report" : "Match Centre"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Companion Card Variant (Editorial Stack Ribbon)
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c140f]/80 backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 hover:border-zru-green/40 hover:bg-[#0c140f]/95 hover:shadow-[0_10px_30px_rgba(0,107,63,0.12)] group flex flex-col justify-between h-full">
      {/* Top hairline brand glow */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-zru-green/30 to-transparent group-hover:via-zru-green/80 transition-all duration-500" />

      <div>
        {/* Header Strip */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[10px] font-heading font-black uppercase tracking-wider text-white/70 truncate max-w-[200px]">
            {competitionName}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest border shrink-0 ${
              isLive
                ? "bg-red-500/20 text-red-400 border-red-500/40"
                : effectiveCompleted
                ? "bg-white/5 text-white/50 border-white/10"
                : "bg-zru-green/10 text-emerald-300 border-zru-green/20"
            }`}
          >
            {isLive ? "Live" : effectiveCompleted ? "FT" : "Upcoming"}
          </span>
        </div>

        {/* Teams List */}
        <div className="space-y-3 my-3">
          {/* Home Team Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 p-1">
                {homeLogo ? (
                  <Image src={homeLogo} alt={homeTeamName} width={24} height={24} className="object-contain" />
                ) : (
                  <span className="text-[10px] font-heading font-black text-white">
                    {homeTeamName.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-heading font-bold uppercase text-white truncate">{homeTeamName}</span>
            </div>
            {hasScores ? (
              <span className="text-sm font-heading font-black text-white tabular-nums">{homeScore}</span>
            ) : formattedTime ? (
              <span className="text-[11px] font-mono text-white/50 tabular-nums">{formattedTime}</span>
            ) : null}
          </div>

          {/* Away Team Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 p-1">
                {awayLogo ? (
                  <Image src={awayLogo} alt={awayTeamName} width={24} height={24} className="object-contain" />
                ) : (
                  <span className="text-[10px] font-heading font-black text-white">
                    {awayTeamName.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-heading font-bold uppercase text-white truncate">{awayTeamName}</span>
            </div>
            {hasScores ? (
              <span className="text-sm font-heading font-black text-white tabular-nums">{awayScore}</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-2 text-[11px] text-white/60">
        <span className="truncate flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-zru-green shrink-0" />
          <span>{formattedDate}</span>
        </span>

        <Link
          href={matchUrl}
          className="inline-flex items-center gap-1 font-heading font-bold text-xs uppercase text-white group-hover:text-zru-green transition-colors shrink-0"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

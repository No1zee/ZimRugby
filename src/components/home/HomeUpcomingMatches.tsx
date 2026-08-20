import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { MatchCardViewModel } from "@/lib/match-centre/types";
import { Match } from "@/types";
import { HomeFixtureCard, UniversalMatch } from "./HomeFixtureCard";

export interface HomeUpcomingMatchesProps {
  nextMatch?: UniversalMatch | null;
  upcomingMatches?: UniversalMatch[];
  matches?: UniversalMatch[];
  completedMatches?: UniversalMatch[];
}

function getMatchKey(m: UniversalMatch): string {
  if ("slug" in m && m.slug) return m.slug;
  return String(m.id || "");
}

export default function HomeUpcomingMatches({
  nextMatch,
  upcomingMatches = [],
  matches = [],
  completedMatches = [],
}: HomeUpcomingMatchesProps) {
  // Aggregate all matches
  const allInputMatches: UniversalMatch[] = [
    ...(nextMatch ? [nextMatch] : []),
    ...upcomingMatches,
    ...matches,
  ];

  const now = new Date().getTime();

  const isMatchUpcoming = (m: UniversalMatch): boolean => {
    if ("status" in m && m.status) {
      if (m.status === "upcoming" || m.status === "live") return true;
      if (m.status === "completed") return false;
    }
    // Check date
    let dateStr = "";
    if ("dateIso" in m && (m as MatchCardViewModel).dateIso) {
      dateStr = (m as MatchCardViewModel).dateIso;
    } else if ("date" in m && (m as Match).date) {
      dateStr = (m as Match).date || "";
    }

    if (!dateStr) return true;
    const matchTime = new Date(dateStr).getTime();
    return !isNaN(matchTime) ? matchTime >= now - 2 * 60 * 60 * 1000 : true;
  };

  const upcomingList: UniversalMatch[] = [];
  const rawCompleted: UniversalMatch[] = [...completedMatches];

  for (const m of allInputMatches) {
    if (isMatchUpcoming(m)) {
      upcomingList.push(m);
    } else {
      rawCompleted.push(m);
    }
  }

  const getMatchTime = (m: UniversalMatch): number => {
    if ("dateIso" in m && (m as MatchCardViewModel).dateIso) {
      return new Date((m as MatchCardViewModel).dateIso).getTime() || 0;
    }
    const raw = (m as Match).date || "";
    return raw ? new Date(raw).getTime() || 0 : 0;
  };

  // Sort upcoming chronologically ascending
  upcomingList.sort((a, b) => getMatchTime(a) - getMatchTime(b));

  // Sort completed chronologically descending
  rawCompleted.sort((a, b) => getMatchTime(b) - getMatchTime(a));

  // Deduplicate
  const dedupe = (list: UniversalMatch[]): UniversalMatch[] => {
    const seen = new Set<string>();
    const result: UniversalMatch[] = [];
    for (const m of list) {
      const key = getMatchKey(m);
      if (key && !seen.has(key)) {
        seen.add(key);
        result.push(m);
      } else if (!key) {
        result.push(m);
      }
    }
    return result;
  };

  const dedupedUpcoming = dedupe(upcomingList);
  const dedupedCompleted = dedupe(rawCompleted);

  // Determine Primary Match and Companions
  let primaryMatch: UniversalMatch | null = nextMatch || null;
  let isPrimaryCompleted = false;
  const companionSlots: { match: UniversalMatch; isCompleted: boolean }[] = [];

  if (primaryMatch && isMatchUpcoming(primaryMatch)) {
    isPrimaryCompleted = false;
    const primaryKey = getMatchKey(primaryMatch);
    const nextUpcoming = dedupedUpcoming.filter(
      (m) => getMatchKey(m) !== primaryKey
    ).slice(0, 2);

    nextUpcoming.forEach((m) => companionSlots.push({ match: m, isCompleted: false }));

    if (companionSlots.length < 2) {
      const needed = 2 - companionSlots.length;
      const backfill = dedupedCompleted.slice(0, needed);
      backfill.forEach((m) => companionSlots.push({ match: m, isCompleted: true }));
    }
  } else if (dedupedUpcoming.length > 0) {
    primaryMatch = dedupedUpcoming[0];
    isPrimaryCompleted = false;
    const nextUpcoming = dedupedUpcoming.slice(1, 3);
    nextUpcoming.forEach((m) => companionSlots.push({ match: m, isCompleted: false }));

    if (companionSlots.length < 2) {
      const needed = 2 - companionSlots.length;
      const backfill = dedupedCompleted.slice(0, needed);
      backfill.forEach((m) => companionSlots.push({ match: m, isCompleted: true }));
    }
  } else if (dedupedCompleted.length > 0) {
    primaryMatch = dedupedCompleted[0];
    isPrimaryCompleted = true;
    const backfill = dedupedCompleted.slice(1, 3);
    backfill.forEach((m) => companionSlots.push({ match: m, isCompleted: true }));
  }

  // If completely empty
  if (!primaryMatch) {
    return (
      <section className="py-12 bg-[#060a08] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c140f]/60 backdrop-blur-md p-8 text-center">
            <CalendarDays className="w-10 h-10 text-zru-green mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              Season Fixtures Being Finalised
            </h3>
            <p className="text-xs text-white/60 max-w-md mx-auto mb-4">
              Upcoming international and domestic fixtures are being updated. Check the Match Centre for complete schedules and archives.
            </p>
            <Link
              href="/match-centre"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zru-green text-white text-xs font-bold hover:bg-zru-green/90 transition-colors"
            >
              <span>Visit Match Centre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-[#060a08] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-zru-green/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4 mb-8 sm:mb-12">
          <div>
            <div className="heading-plate heading-plate-light">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase text-white tracking-tight leading-[1.05]">
                UPCOMING <span className="text-zru-green">FIXTURES</span>
              </h2>
            </div>
          </div>

          <Link
            href="/match-centre"
            className="group inline-flex items-center gap-2 text-xs font-heading font-black tracking-widest uppercase text-zru-green hover:text-white transition-colors self-start sm:self-auto py-1"
          >
            <span>VIEW ALL FIXTURES</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Responsive Grid: Primary Match (Left/Large) + Companion Cards (Right/Stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Primary Featured Card */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col">
            <HomeFixtureCard
              match={primaryMatch}
              variant="primary"
              isCompleted={isPrimaryCompleted}
            />
          </div>

          {/* Companion Cards Stack */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between gap-4 sm:gap-6">
            {companionSlots.length > 0 ? (
              companionSlots.map((slot, index) => (
                <div key={getMatchKey(slot.match) || index} className="flex-1">
                  <HomeFixtureCard
                    match={slot.match}
                    variant="companion"
                    isCompleted={slot.isCompleted}
                  />
                </div>
              ))
            ) : (
              <div className="h-full min-h-[180px] rounded-2xl border border-white/10 bg-[#0c140f]/60 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center">
                <p className="text-xs text-white/50 mb-3">
                  More fixtures will be announced shortly.
                </p>
                <Link
                  href="/match-centre"
                  className="text-xs font-heading font-bold uppercase tracking-wider text-zru-green hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore Match Centre</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export { HomeUpcomingMatches };

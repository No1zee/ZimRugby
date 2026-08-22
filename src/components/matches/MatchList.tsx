"use client";

import React, { useState, useMemo } from "react";
import MatchCard from "./MatchCard";
import { motion, AnimatePresence } from "framer-motion";
import { CardSkeleton } from "../ui/Skeleton";
import ListControlToolbar, { SortOption, GroupOption } from "../ui/ListControlToolbar";
import type { Match } from "@/types";
import { Trophy, Calendar, Users, ShieldAlert, Search } from "lucide-react";


interface MatchListProps {
  matches: Match[];
  defaultGroupBy?: "none" | "competition" | "season" | "squad";
  defaultSortBy?: "date_desc" | "date_asc" | "opponent_asc" | "score_diff";
  showToolbar?: boolean;
}

type SortKey = "date_desc" | "date_asc" | "opponent_asc" | "score_diff";
type GroupKey = "none" | "competition" | "season" | "squad";

const sortOptions: SortOption<SortKey>[] = [
  { label: "Newest First", value: "date_desc" },
  { label: "Oldest First", value: "date_asc" },
  { label: "Opponent (A–Z)", value: "opponent_asc" },
  { label: "Margin / Biggest Wins", value: "score_diff" },
];

const groupOptions: GroupOption<GroupKey>[] = [
  { label: "No Grouping", value: "none" },
  { label: "By Tournament", value: "competition" },
  { label: "By Season", value: "season" },
  { label: "By Squad", value: "squad" },
];

export function MatchListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function MatchList({
  matches,
  defaultGroupBy = "competition",
  defaultSortBy = "date_desc",
  showToolbar = true,
}: MatchListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>(defaultSortBy);
  const [groupBy, setGroupBy] = useState<GroupKey>(defaultGroupBy);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Helper to extract clean date string or year
  const getMatchDate = (m: Match) => new Date(m.date || "1970-01-01").getTime();
  const getMatchYear = (m: Match) => {
    if (m.date) {
      const parsed = new Date(m.date);
      if (!isNaN(parsed.getFullYear())) return parsed.getFullYear().toString();
    }
    return "All Time";
  };

  // Helper to extract the opponent name
  const getOpponentName = (m: Match) => {
    const isHomeZim = (m.homeTeam?.name || "").toLowerCase().includes("zimbabwe");
    return isHomeZim ? m.awayTeam?.name || "Opponent" : m.homeTeam?.name || "Opponent";
  };

  // Helper to calculate score margin (Zim score - Opp score)
  const getScoreMargin = (m: Match) => {
    const isHomeZim = (m.homeTeam?.name || "").toLowerCase().includes("zimbabwe");
    const zimScore = (isHomeZim ? m.homeTeam?.score : m.awayTeam?.score) ?? 0;
    const oppScore = (isHomeZim ? m.awayTeam?.score : m.homeTeam?.score) ?? 0;
    return zimScore - oppScore;
  };

  // 1. Filter matches based on search query
  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return matches;
    const q = searchQuery.toLowerCase().trim();

    return matches.filter((m) => {
      const opp = getOpponentName(m).toLowerCase();
      const comp = (m.competition || "").toLowerCase();
      const venue = (m.venue || "").toLowerCase();
      const home = (m.homeTeam?.name || "").toLowerCase();
      const away = (m.awayTeam?.name || "").toLowerCase();
      const date = (m.date || "").toLowerCase();

      return (
        opp.includes(q) ||
        comp.includes(q) ||
        venue.includes(q) ||
        home.includes(q) ||
        away.includes(q) ||
        date.includes(q)
      );
    });
  }, [matches, searchQuery]);

  // 2. Sort matches
  const sortedMatches = useMemo(() => {
    const list = [...filteredMatches];

    return list.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return getMatchDate(b) - getMatchDate(a);
        case "date_asc":
          return getMatchDate(a) - getMatchDate(b);
        case "opponent_asc":
          return getOpponentName(a).localeCompare(getOpponentName(b));
        case "score_diff":
          return getScoreMargin(b) - getScoreMargin(a);
        default:
          return 0;
      }
    });
  }, [filteredMatches, sortBy]);

  // 3. Group matches
  const groupedMatches = useMemo(() => {
    if (groupBy === "none") {
      return [{ key: "all", label: "All Fixtures & Results", icon: Trophy, items: sortedMatches }];
    }

    const map = new Map<string, { label: string; icon: React.ElementType; items: Match[] }>();

    sortedMatches.forEach((m) => {
      let groupKey = "Other";
      let groupLabel = "Other";
      let icon = Trophy;

      if (groupBy === "competition") {
        groupKey = m.competition || "International Test Match";
        groupLabel = m.competition || "International Test Matches";
        icon = Trophy;
      } else if (groupBy === "season") {
        const year = getMatchYear(m);
        groupKey = year;
        groupLabel = `${year} Season`;
        icon = Calendar;
      } else if (groupBy === "squad") {
        const homeNorm = (m.homeTeam?.name || "").toLowerCase();
        const awayNorm = (m.awayTeam?.name || "").toLowerCase();
        const combined = `${homeNorm} ${awayNorm}`;

        if (combined.includes("lady") || combined.includes("women")) {
          groupKey = "lady-sables";
          groupLabel = "Zimbabwe Lady Sables (Women's XVs)";
        } else if (combined.includes("7s") || combined.includes("cheetahs") || combined.includes("sevens")) {
          groupKey = "cheetahs";
          groupLabel = "Zimbabwe Cheetahs (Men's Sevens)";
        } else if (combined.includes("u20") || combined.includes("junior")) {
          groupKey = "junior-sables";
          groupLabel = "Zimbabwe Junior Sables (U20s)";
        } else {
          groupKey = "sables";
          groupLabel = "Zimbabwe Sables (Senior Men's XVs)";
        }
        icon = Users;
      }

      if (!map.has(groupKey)) {
        map.set(groupKey, { label: groupLabel, icon, items: [] });
      }
      map.get(groupKey)!.items.push(m);
    });

    return Array.from(map.entries()).map(([key, val]) => ({
      key,
      label: val.label,
      icon: val.icon,
      items: val.items,
    }));
  }, [sortedMatches, groupBy]);

  if (matches.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-black/5 p-8">
        <ShieldAlert className="w-10 h-10 text-charcoal-gray/30 mx-auto mb-3" />
        <h3 className="text-lg font-black uppercase tracking-wider text-rich-black">No matches found</h3>
        <p className="text-sm text-charcoal-gray mt-1">Check back later for newly scheduled fixtures and results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Control Toolbar */}
      {showToolbar && (
        <ListControlToolbar<SortKey, GroupKey>
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search opponent, tournament, venue, or year..."
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOptions={sortOptions}
          groupBy={groupBy}
          onGroupChange={setGroupBy}
          groupOptions={groupOptions}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={matches.length}
          filteredCount={filteredMatches.length}
        />
      )}

      {/* Render Matches (Grouped or Flat) */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-black/5 p-8">
          <Search className="w-8 h-8 text-charcoal-gray/30 mx-auto mb-3" />
          <h3 className="text-base font-black uppercase tracking-wider text-rich-black">No matching fixtures</h3>
          <p className="text-sm text-charcoal-gray mt-1">
            No fixtures match &ldquo;{searchQuery}&rdquo;. Try another search term or clear the filter.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 px-4 py-2 bg-zru-green text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-forest-green transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {groupedMatches.map((group) => {
            const GroupIcon = group.icon;
            return (
              <section key={group.key} className="space-y-6">
                {groupBy !== "none" && (
                  <div className="flex items-center justify-between pb-3 border-b border-black/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-zru-green/10 text-zru-green flex items-center justify-center">
                        <GroupIcon className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-rich-black">
                        {group.label}
                      </h3>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider bg-milk-white px-2.5 py-1 rounded-lg border border-black/5 text-charcoal-gray">
                      {group.items.length} {group.items.length === 1 ? "match" : "matches"}
                    </span>
                  </div>
                )}

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "grid grid-cols-1 gap-4"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {group.items.map((match, index) => (
                      <motion.div
                        key={match.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
                      >
                        <MatchCard {...match} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

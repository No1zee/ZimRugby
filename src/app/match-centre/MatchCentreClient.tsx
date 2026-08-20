"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, History } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SlantedButton from "@/components/ui/SlantedButton";
import MatchList from "@/components/matches/MatchList";
import LeagueTable from "@/components/matches/LeagueTable";
import NextUnionMatchHero from "@/components/match-centre/NextUnionMatchHero";
import type {
  MatchCentrePageConfig,
  MatchCentreSettingsConfig,
  FanBulletinSection,
  TeamEntity,
  MatchCardViewModel,
  StandingsTableViewModel,
  LiveAnnouncementStripViewModel,
} from "@/lib/match-centre/types";
import type { Match } from "@/types";
import type { Campaign } from "@/lib/api/campaigns";

interface MatchCentreClientProps {
  pageConfig: MatchCentrePageConfig;
  settings: MatchCentreSettingsConfig;
  bulletin: FanBulletinSection | null;
  teams: TeamEntity[];
  initialFixtures: MatchCardViewModel[];
  initialResults: MatchCardViewModel[];
  standingsTables: StandingsTableViewModel[];
  nextUnionMatch: MatchCardViewModel | null;
  announcementStrip: LiveAnnouncementStripViewModel | null;
  campaigns: Campaign[];
}

// Convert MatchCardViewModel into Legacy Match shape for MatchList compatibility
function viewModelToMatch(vm: MatchCardViewModel): Match {
  return {
    id: vm.id,
    competition: vm.competition,
    round: vm.round || "Sables",
    date: new Date(vm.dateIso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    time: vm.time,
    venue: vm.venue,
    homeTeam: { name: vm.homeTeam.name, score: vm.homeTeam.score },
    awayTeam: { name: vm.awayTeam.name, score: vm.awayTeam.score },
    status: vm.status,
    teamCategory: vm.teamCategory,
    opponentCategory: vm.opponentCategory,
  };
}


export default function MatchCentreClient({
  pageConfig,
  settings,
  bulletin,
  teams,
  initialFixtures,
  initialResults,
  standingsTables,
  nextUnionMatch,
  announcementStrip,
  campaigns,
}: MatchCentreClientProps) {
  const [activeTab, setActiveTab] = useState<"fixtures" | "results" | "standings">(
    settings.defaultTab || "fixtures"
  );
  const [selectedTeam, setSelectedTeam] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("All");

  const legacyFixtures = initialFixtures.map(viewModelToMatch);
  const legacyResults = initialResults.map(viewModelToMatch);

  const filterList = ["All", ...teams.map((t) => t.filterLabel)];

  // Only surface campaign filters that have matches associated with available fixtures/results
  const allMatchIds = new Set([...legacyFixtures, ...legacyResults].map((m) => String(m.id)));
  const campaignsWithMatches = campaigns.filter(
    (c) => c.matches && c.matches.length > 0 && c.matches.some((m) => allMatchIds.has(String(m.match_id)))
  );

  const campaignMatchIds = new Set(
    campaignsWithMatches
      .filter((c) => selectedCampaign === "All" || c.slug === selectedCampaign)
      .flatMap((c) => (c.matches || []).map((m) => m.match_id))
  );

  const filteredFixtures = legacyFixtures.filter((match) => {
    const matchesTeam = selectedTeam === "All" || match.teamCategory === selectedTeam;
    const matchesCampaign =
      selectedCampaign === "All" ||
      (campaignsWithMatches.length > 0 && campaignMatchIds.has(String(match.id)));
    const matchesSearch =
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.competition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch && matchesCampaign;
  });

  const filteredResults = legacyResults.filter((match) => {
    const matchesTeam = selectedTeam === "All" || match.teamCategory === selectedTeam;
    const matchesCampaign =
      selectedCampaign === "All" ||
      (campaignsWithMatches.length > 0 && campaignMatchIds.has(String(match.id)));
    const matchesSearch =
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.competition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch && matchesCampaign;
  });

  const recentResults = legacyResults.slice(0, 3);
  const activeStandingsTable = standingsTables[0];

  return (
    <main className="bg-milk-white min-h-screen pb-12">
      {/* Dynamic PageHero header from Directus */}
      <PageHero
        title={pageConfig.title}
        subtitle={pageConfig.subtitle}
        tag={pageConfig.tag}
        backgroundImage="/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp"
        breadcrumb={pageConfig.breadcrumb}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative">
        <div className="relative z-10">
          {/* Live Announcement Strip (Directus) */}
          {settings.showLiveStrip && announcementStrip && (
            <div className="mb-6 bg-zru-green/10 border border-zru-green/30 rounded-xl p-4 flex items-center justify-between text-rich-black">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-zru-green text-white text-[10px] font-black uppercase tracking-wider rounded">
                  {announcementStrip.urgent ? "URGENT" : "NOTICE"}
                </span>
                <span className="font-heading text-sm font-bold">{announcementStrip.title}</span>
              </div>
              {announcementStrip.body && (
                <span className="text-xs text-black/60 hidden md:inline">{announcementStrip.body}</span>
              )}
            </div>
          )}

          {/* Fan Info / Union Bulletin Block (Directus) */}
          {settings.showFanBulletin && bulletin && (
            <div className="mb-6 p-5 bg-milk-white border border-black/10 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black text-zru-green uppercase tracking-widest block mb-1">
                  {bulletin.eyebrow}
                </span>
                <h3 className="font-heading text-lg font-black text-rich-black uppercase">{bulletin.title}</h3>
                <p className="text-sm text-black/70 mt-1">{bulletin.body}</p>
              </div>
              {bulletin.ctaLabel && bulletin.ctaUrl && (
                <SlantedButton href={bulletin.ctaUrl} variant="primary" size="sm">
                  {bulletin.ctaLabel}
                </SlantedButton>
              )}
            </div>
          )}

          {/* Next Union Match Hero (Directus) */}
          <NextUnionMatchHero
            match={
              nextUnionMatch
                ? {
                    id: nextUnionMatch.id,
                    homeTeam: nextUnionMatch.homeTeam,
                    awayTeam: nextUnionMatch.awayTeam,
                    venue: nextUnionMatch.venue,
                    competition: nextUnionMatch.competition,
                    teamCategory: nextUnionMatch.teamCategory,
                    dateIso: nextUnionMatch.dateIso,
                    time: nextUnionMatch.time,
                    ticketUrl: nextUnionMatch.ticketUrl,
                  }
                : null
            }
          />

          {/* Filters & Tabs */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-5 mb-8">
            {/* Tabs */}
            <div className="flex p-1 bg-black/5 rounded-xl border border-black/10 relative z-0">
              {(["fixtures", "results"] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-6 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-colors duration-300 select-none z-10 ${
                      isActive ? "text-white" : "text-black/60 hover:text-black"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-zru-green rounded-lg shadow-lg -z-10"
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-4 w-full lg:w-80">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/45" />
                <input
                  type="text"
                  placeholder={settings.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/5 border border-black/10 rounded-lg pl-10 pr-4 py-2 text-rich-black placeholder-black/45 focus:outline-none focus:border-zru-green text-sm"
                />
              </div>
            </div>
          </div>

          {/* Team Category Filter tabs */}
          {settings.showTeamFilters && (
            <div className="flex overflow-x-auto py-1 gap-2 no-scrollbar w-full border-b border-black/5 pb-4">
              {filterList.map((teamName) => (
                <SlantedButton
                  key={teamName}
                  onClick={() => setSelectedTeam(teamName)}
                  variant="chip"
                  active={selectedTeam === teamName}
                >
                  {teamName}
                </SlantedButton>
              ))}
            </div>
          )}

          {/* Campaign Filter chips */}
          {campaignsWithMatches.length > 0 && (
            <div className="flex overflow-x-auto py-1 gap-2 no-scrollbar mb-8 w-full">
              <button
                onClick={() => setSelectedCampaign("All")}
                className={`px-3 py-1.5 rounded-none text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedCampaign === "All"
                    ? "bg-rich-black text-white border-rich-black"
                    : "bg-white text-black/60 border-black/15 hover:border-black/30 hover:text-black"
                }`}
              >
                All Matches
              </button>
              {campaignsWithMatches.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setSelectedCampaign(c.slug === selectedCampaign ? "All" : c.slug)}
                  className={`px-3 py-1.5 rounded-none text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors border cursor-pointer ${
                    selectedCampaign === c.slug
                      ? "bg-zru-green text-white border-zru-green shadow"
                      : "bg-white text-black/60 border-black/15 hover:border-zru-green/40 hover:text-zru-green"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Content Area */}
          <div className="min-h-[500px]">
            {activeTab === "fixtures" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <MatchList matches={filteredFixtures} />
              </motion.div>
            )}

            {activeTab === "results" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <MatchList matches={filteredResults} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

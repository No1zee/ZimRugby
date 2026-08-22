"use client";

import React, { useState, useRef } from "react";
import { Users, Shield, ArrowRight, ChevronDown, LayoutGrid, Flag } from "lucide-react";
import CollectionManager from "@/components/admin/CollectionManager";
import { VisualPitchBuilder } from "./VisualPitchBuilder";
import { getFlagUrl } from "@/lib/flags";

interface VisualTeamsManagerProps {
  teams: Record<string, unknown>[];
  players: Record<string, unknown>[];
  grantsFor: (collection: string) => { create?: boolean; update?: boolean; delete?: boolean };
  canPurge: boolean;
  onDirtyChange: (isDirty: boolean) => void;
}

const TEAM_PRESETS = [
  {
    code: "ZIM",
    label: "Sables (Men 15s)",
    slug: "sables",
    badge: "Senior Men",
    bg: "from-[#002D1A] via-[#00482B] to-[#002214]",
    accent: "text-accent-teal",
  },
  {
    code: "ZIM-W",
    label: "Lady Sables (Women 15s)",
    slug: "lady-sables",
    badge: "Senior Women",
    bg: "from-[#003822] via-[#002214] to-[#120404]",
    accent: "text-white",
  },
  {
    code: "ZIM-U20",
    label: "Junior Sables (U20)",
    slug: "junior-sables",
    badge: "U20 Barthes Trophy",
    bg: "from-[#0A1A12] via-[#003822] to-[#002D1A]",
    accent: "text-accent-teal",
  },
  {
    code: "ZIM-7S",
    label: "Cheetahs (Men 7s)",
    slug: "cheetahs",
    badge: "World Rugby 7s",
    bg: "from-[#1A1204] via-[#003822] to-[#002214]",
    accent: "text-[#F5B800]",
  },
  {
    code: "ZIM-JR",
    label: "Junior Sables (U18 / Dev)",
    slug: "junior-sables-u18",
    badge: "Youth Pathway",
    bg: "from-[#002214] via-[#0A1A12] to-[#002D1A]",
    accent: "text-white/80",
  },
];

export default function VisualTeamsManager({
  teams,
  players,
  grantsFor,
  canPurge,
  onDirtyChange,
}: VisualTeamsManagerProps) {
  const [selectedTeamSlug, setSelectedTeamSlug] = useState<string | null>(null);
  const [squadViewMode, setSquadViewMode] = useState<"roster" | "pitch">("pitch");
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Identify selected team
  const activeTeam = (selectedTeamSlug
    ? teams.find(
        (t) =>
          String(t.slug) === selectedTeamSlug ||
          String(t.code) === selectedTeamSlug ||
          String(t.id) === selectedTeamSlug
      )
    : teams[0]) || teams[0];

  const activeTeamName = (activeTeam?.name as string) || "Zimbabwe Sables";
  const activeTeamShort = (activeTeam?.short_name as string) || (activeTeam?.name as string) || "Sables";
  const activeTeamCode = (activeTeam?.code as string) || "ZIM";

  // Filter players for the active team
  const filteredPlayers = players.filter((p) => {
    const pTeam = String(p.team || "").toLowerCase();
    const pSlug = String(p.team_slug || "").toLowerCase();
    const pTeamId = String(p.team_id || "");

    const activeTerms = [
      activeTeamShort.toLowerCase(),
      activeTeamName.toLowerCase(),
      activeTeamCode.toLowerCase(),
      String(activeTeam?.slug || "").toLowerCase(),
      String(activeTeam?.id || "")
    ].filter(Boolean);

    return activeTerms.some(
      (term) =>
        pTeam.includes(term) ||
        pSlug.includes(term) ||
        (term.length > 2 && term.includes(pTeam)) ||
        (pTeamId && pTeamId === String(activeTeam?.id))
    );
  });

  // Calculate player count for card badge
  const getTeamPlayerCount = (t: Record<string, unknown>) => {
    const terms = [
      String(t.short_name || "").toLowerCase(),
      String(t.name || "").toLowerCase(),
      String(t.code || "").toLowerCase(),
      String(t.slug || "").toLowerCase(),
      String(t.id || "")
    ].filter(Boolean);

    return players.filter((p) => {
      const pTeam = String(p.team || "").toLowerCase();
      const pSlug = String(p.team_slug || "").toLowerCase();
      const pTeamId = String(p.team_id || "");
      return terms.some(
        (term) =>
          pTeam.includes(term) ||
          pSlug.includes(term) ||
          (term.length > 2 && term.includes(pTeam)) ||
          (pTeamId && pTeamId === String(t.id))
      );
    }).length;
  };

  const handleSelectSquad = (slug: string) => {
    setSelectedTeamSlug(slug);
    // Smooth scroll down directly into the team editor
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <div className="space-y-8">
      {/* ── 1. VISUAL SQUAD CARDS GRID ───────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-base font-black uppercase tracking-wider text-rich-black">
              Select National Squad
            </h3>
            <p className="text-xs text-neutral-500 font-normal mt-0.5">
              Click a national team card to jump straight into its players, roster, and team configuration.
            </p>
          </div>
          <span className="text-xs font-bold text-zru-green bg-zru-green/10 px-3 py-1 rounded-full">
            {teams.length} Squads Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {teams.map((t, idx) => {
            const code = String(t.code || "ZIM");
            const slug = String(t.slug || t.id);
            const name = String(t.name || "National Team");
            const isSelected =
              String(activeTeam?.slug) === slug ||
              String(activeTeam?.code) === code ||
              String(activeTeam?.id) === slug;
            const preset =
              TEAM_PRESETS.find((p) => p.code === code || p.slug === slug) ||
              TEAM_PRESETS[idx % TEAM_PRESETS.length];
            const playerCount = getTeamPlayerCount(t);

            return (
              <button
                key={String(t.id || idx)}
                type="button"
                onClick={() => handleSelectSquad(slug)}
                className={`relative flex flex-col justify-between p-5 rounded-2xl text-left transition-all duration-300 overflow-hidden group cursor-pointer border ${
                  isSelected
                    ? "ring-2 ring-zru-green border-transparent shadow-xl scale-[1.02]"
                    : "border-black/10 hover:border-zru-green/50 bg-white hover:shadow-md"
                }`}
              >
                {/* Background gradient if selected */}
                {isSelected && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${preset.bg} opacity-95 pointer-events-none`} />
                )}

                <div className="relative z-10 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border overflow-hidden shadow-xs ${
                        isSelected ? "bg-white/10 border-white/20" : "bg-white border-black/10"
                      }`}
                    >
                      <img
                        src={getFlagUrl(name)}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-white text-zru-green" : "bg-black/5 text-black/60"
                      }`}
                    >
                      {code}
                    </span>
                  </div>

                  <div>
                    <h4
                      className={`font-heading font-black text-sm uppercase leading-tight line-clamp-2 ${
                        isSelected ? "text-white" : "text-rich-black group-hover:text-zru-green"
                      }`}
                    >
                      {name}
                    </h4>
                    <p
                      className={`text-[11px] font-medium mt-0.5 ${
                        isSelected ? "text-white/70" : "text-black/50"
                      }`}
                    >
                      {preset.badge}
                    </p>
                  </div>
                </div>

                <div
                  className={`relative z-10 pt-4 mt-3 border-t flex items-center justify-between text-xs font-bold ${
                    isSelected ? "border-white/15 text-white/90" : "border-black/5 text-black/60"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-accent-teal" />
                    <span>{playerCount} Players</span>
                  </span>
                  <span
                    className={`text-[10px] uppercase font-black tracking-wider flex items-center gap-1 ${
                      isSelected ? "text-accent-teal" : "text-zru-green"
                    }`}
                  >
                    <span>{isSelected ? "Active" : "Open"}</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. ACTIVE SELECTED SQUAD MANAGEMENT ───────────────────────────────────────────── */}
      <div ref={editorRef} className="space-y-6 pt-4 scroll-mt-24">
        {/* Squad Header with View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-black/10 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-zru-green/10 border border-zru-green/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-zru-green" />
            </div>
            <div>
              <span className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-zru-green block">
                ACTIVE SQUAD ({filteredPlayers.length} PLAYERS)
              </span>
              <h3 className="font-heading text-xl font-black uppercase text-rich-black">
                {activeTeamName}
              </h3>
            </div>
          </div>

          {/* View Switcher: 2D Pitch vs Roster List */}
          <div className="flex items-center bg-black/5 p-1 rounded-xl border border-black/10">
            <button
              type="button"
              onClick={() => setSquadViewMode("pitch")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                squadViewMode === "pitch"
                  ? "bg-zru-green text-white shadow-xs"
                  : "text-black/60 hover:text-black"
              }`}
            >
              <Flag className="w-3.5 h-3.5" /> 2D Pitch Lineup
            </button>
            <button
              type="button"
              onClick={() => setSquadViewMode("roster")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                squadViewMode === "roster"
                  ? "bg-zru-green text-white shadow-xs"
                  : "text-black/60 hover:text-black"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Player Roster Table
            </button>
          </div>
        </div>

        {/* 2D Pitch View */}
        {squadViewMode === "pitch" ? (
          <VisualPitchBuilder
            teamName={activeTeamName}
            players={filteredPlayers.length > 0 ? filteredPlayers : players}
          />
        ) : (
          /* Squad Players Roster Table */
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <CollectionManager
              key={`players-${activeTeam?.id || activeTeam?.slug}`}
              collection="players"
              title={`${activeTeamName} Players`}
              description={`Roster and player profiles for ${activeTeamName}.`}
              grants={grantsFor("players")}
              canPurge={canPurge}
              initialValues={{
                team: activeTeamShort,
              }}
              fields={[
                { key: "name", label: "Full Name", type: "text", placeholder: "e.g. Hilton Mudariki", required: true },
                { key: "slug", label: "Slug", type: "text", placeholder: "e.g. hilton-mudariki" },
                { key: "team", label: "Team / Squad", type: "text", placeholder: "e.g. Sables, Lady Sables, Junior Sables" },
                { key: "position", label: "Position", type: "text", placeholder: "e.g. Scrum-half, Fullback, Prop" },
                { key: "caps", label: "Test Caps", type: "number", placeholder: "e.g. 34" },
                { key: "age", label: "Age", type: "number", placeholder: "e.g. 28" },
                { key: "photo", label: "Player Photo (Cutout/Headshot)", type: "image" },
                { key: "bio", label: "Player Bio / Honours", type: "textarea", colSpan: "full", placeholder: "Career background, test debut..." },
                { key: "featured", label: "Featured Player (Spotlight Card)", type: "boolean" },
                { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
              ]}
              items={filteredPlayers}
              displayField="name"
              subtitleField="position"
              badgeField="team"
              statusField="status"
              searchable={["name", "position", "team"]}
              singularLabel="player"
              onDirtyChange={onDirtyChange}
            />
          </div>
        )}

        {/* Team Configuration / Metadata */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="pb-4 mb-5 border-b border-black/10">
            <span className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-zru-green block">
              SQUAD CONFIGURATION
            </span>
            <h3 className="font-heading text-lg font-black uppercase text-rich-black">
              Edit {activeTeamName} Settings & Colors
            </h3>
          </div>

          <CollectionManager
            key={`teams-config-${activeTeam?.id || activeTeam?.slug}`}
            collection="teams"
            title="National Teams"
            description="Edit team details, crests, brand colors, and filter labels."
            grants={grantsFor("teams")}
            canPurge={canPurge}
            fields={[
              { key: "name", label: "Name", type: "text", placeholder: "e.g. Zimbabwe Sables", required: true },
              { key: "short_name", label: "Short Name", type: "text", placeholder: "e.g. Sables" },
              { key: "code", label: "Code", type: "text", placeholder: "e.g. ZIM" },
              { key: "slug", label: "Slug", type: "text", placeholder: "e.g. sables" },
              { key: "team_type", label: "Team Type", type: "select", options: ["mens_15s", "womens_15s", "mens_7s", "womens_7s", "u20", "u18", "development", "club"] },
              { key: "gender", label: "Gender", type: "select", options: ["men", "women"] },
              { key: "filter_label", label: "Filter Label", type: "text", placeholder: "e.g. Sables" },
              { key: "crest", label: "Crest Image", type: "image" },
              { key: "primary_color", label: "Primary Colour", type: "text", placeholder: "e.g. #006B3F" },
              { key: "secondary_color", label: "Secondary Colour", type: "text", placeholder: "e.g. #F5B800" },
              { key: "is_national_team", label: "National Team", type: "boolean" },
              { key: "is_active", label: "Active (Shown in Filters)", type: "boolean" },
              { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
            ]}
            items={[activeTeam]}
            displayField="name"
            subtitleField="team_type"
            badgeField="code"
            statusField="is_active"
            searchable={["name", "short_name", "code", "filter_label"]}
            singularLabel="team"
            onDirtyChange={onDirtyChange}
          />
        </div>
      </div>
    </div>
  );
}

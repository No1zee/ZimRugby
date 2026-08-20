"use client";

import React, { useState, useMemo } from "react";
import {
  Trophy,
  Users,
  Star,
  Download,
  RotateCcw,
  Plus,
  X,
  Check,
  Search,
  Share2,
} from "lucide-react";
import { useToast } from "@/components/admin/ui/ToastProvider";

export interface PitchPosition {
  number: number;
  name: string;
  category: "forward" | "back" | "reserve";
  topPercent: number; // percentage from top of pitch SVG
  leftPercent: number; // percentage from left
}

const RUGBY_15S_POSITIONS: PitchPosition[] = [
  // Front Row
  { number: 1, name: "Loosehead Prop", category: "forward", topPercent: 12, leftPercent: 28 },
  { number: 2, name: "Hooker", category: "forward", topPercent: 12, leftPercent: 50 },
  { number: 3, name: "Tighthead Prop", category: "forward", topPercent: 12, leftPercent: 72 },
  // Second Row / Locks
  { number: 4, name: "Lock (4)", category: "forward", topPercent: 24, leftPercent: 38 },
  { number: 5, name: "Lock (5)", category: "forward", topPercent: 24, leftPercent: 62 },
  // Back Row
  { number: 6, name: "Blindside Flanker", category: "forward", topPercent: 36, leftPercent: 25 },
  { number: 8, name: "Number Eight", category: "forward", topPercent: 38, leftPercent: 50 },
  { number: 7, name: "Openside Flanker", category: "forward", topPercent: 36, leftPercent: 75 },
  // Halfbacks
  { number: 9, name: "Scrumhalf", category: "back", topPercent: 50, leftPercent: 42 },
  { number: 10, name: "Flyhalf", category: "back", topPercent: 58, leftPercent: 58 },
  // Midfield & Wings
  { number: 11, name: "Left Wing", category: "back", topPercent: 68, leftPercent: 18 },
  { number: 12, name: "Inside Centre", category: "back", topPercent: 70, leftPercent: 44 },
  { number: 13, name: "Outside Centre", category: "back", topPercent: 72, leftPercent: 66 },
  { number: 14, name: "Right Wing", category: "back", topPercent: 68, leftPercent: 82 },
  // Fullback
  { number: 15, name: "Fullback", category: "back", topPercent: 86, leftPercent: 50 },
];

const RUGBY_7S_POSITIONS: PitchPosition[] = [
  // Forwards
  { number: 1, name: "Prop (1)", category: "forward", topPercent: 18, leftPercent: 30 },
  { number: 2, name: "Hooker", category: "forward", topPercent: 18, leftPercent: 50 },
  { number: 3, name: "Prop (2)", category: "forward", topPercent: 18, leftPercent: 70 },
  // Halfbacks
  { number: 4, name: "Halfback / Scrumhalf", category: "back", topPercent: 40, leftPercent: 38 },
  { number: 5, name: "Flyhalf / Playmaker", category: "back", topPercent: 45, leftPercent: 62 },
  // Outside Backs
  { number: 6, name: "Centre", category: "back", topPercent: 65, leftPercent: 42 },
  { number: 7, name: "Sweeper / Wing", category: "back", topPercent: 75, leftPercent: 60 },
];

interface PlayerOption {
  id: string | number;
  name: string;
  position?: string;
  jersey_number?: number;
  image?: string;
}

interface AssignedPlayer {
  playerId: string | number;
  name: string;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
}

interface VisualPitchBuilderProps {
  teamName: string;
  players: Record<string, unknown>[];
  onSaveLineup?: (lineup: Record<number, AssignedPlayer>) => void;
}

export function VisualPitchBuilder({
  teamName,
  players,
  onSaveLineup,
}: VisualPitchBuilderProps) {
  const { toast } = useToast();
  const [formationType, setFormationType] = useState<"15s" | "7s">("15s");
  const [assignments, setAssignments] = useState<Record<number, AssignedPlayer>>({});
  const [activeSlotModal, setActiveSlotModal] = useState<number | null>(null);
  const [playerSearch, setPlayerSearch] = useState("");

  const positions = formationType === "15s" ? RUGBY_15S_POSITIONS : RUGBY_7S_POSITIONS;
  const reserveNumbers =
    formationType === "15s" ? [16, 17, 18, 19, 20, 21, 22, 23] : [8, 9, 10, 11, 12];

  // Normalized squad players
  const squadPlayers: PlayerOption[] = useMemo(() => {
    return players.map((p) => ({
      id: (p.id as string | number) || Math.random(),
      name: String(p.name || p.full_name || p.title || "Player"),
      position: String(p.position || p.role || ""),
      jersey_number: typeof p.jersey_number === "number" ? p.jersey_number : undefined,
      image: p.image || p.headshot ? String(p.image || p.headshot) : undefined,
    }));
  }, [players]);

  const assignedPlayerIds = new Set(Object.values(assignments).map((a) => String(a.playerId)));

  const filteredSquad = squadPlayers.filter(
    (p) =>
      p.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
      p.position?.toLowerCase().includes(playerSearch.toLowerCase())
  );

  // Assign player to slot
  const handleAssign = (number: number, player: PlayerOption) => {
    setAssignments((prev) => ({
      ...prev,
      [number]: {
        playerId: player.id,
        name: player.name,
        isCaptain: prev[number]?.isCaptain,
        isViceCaptain: prev[number]?.isViceCaptain,
      },
    }));
    setActiveSlotModal(null);
    toast(`Assigned #${number} to ${player.name}`);
  };

  // Remove player from slot
  const handleUnassign = (number: number) => {
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[number];
      return next;
    });
  };

  // Toggle leadership badge
  const toggleCaptain = (number: number, type: "C" | "VC") => {
    setAssignments((prev) => {
      const cur = prev[number];
      if (!cur) return prev;
      return {
        ...prev,
        [number]: {
          ...cur,
          isCaptain: type === "C" ? !cur.isCaptain : false,
          isViceCaptain: type === "VC" ? !cur.isViceCaptain : false,
        },
      };
    });
  };

  // Clear all
  const handleReset = () => {
    setAssignments({});
    toast("Lineup cleared");
  };

  // Save Lineup
  const handleSave = () => {
    onSaveLineup?.(assignments);
    toast("Matchday lineup saved successfully", "success");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-black/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#006B3F]" />
            <h3 className="font-heading text-lg font-black uppercase text-rich-black">
              {teamName} ?" 2D Pitch Lineup Builder
            </h3>
          </div>
          <p className="text-xs text-black/50 mt-0.5">
            Click positions or drag players onto the pitch. Set starters (1?"{formationType === "15s" ? 15 : 7}) and finishers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 15s vs 7s Toggle */}
          <div className="flex items-center bg-black/5 p-1 rounded-xl border border-black/10">
            <button
              type="button"
              onClick={() => {
                setFormationType("15s");
                setAssignments({});
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                formationType === "15s"
                  ? "bg-[#006B3F] text-white shadow-xs"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Rugby 15s
            </button>
            <button
              type="button"
              onClick={() => {
                setFormationType("7s");
                setAssignments({});
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                formationType === "7s"
                  ? "bg-[#006B3F] text-white shadow-xs"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Rugby 7s
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-black/15 text-xs font-bold text-black/70 hover:bg-black/5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006B3F] text-xs font-black uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm cursor-pointer"
          >
            <Check className="w-4 h-4" /> Save Lineup
          </button>
        </div>
      </div>

      {/* Main Pitch and Squad Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pitch Area (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-[#0a1f16] border-4 border-[#006B3F]/40 shadow-2xl p-4 flex flex-col justify-between select-none">
            {/* SVG Rugby Pitch Field Markings */}
            <svg
              className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer boundary */}
              <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" />
              {/* Try Line Top */}
              <line x1="5%" y1="8%" x2="95%" y2="8%" stroke="#fff" strokeWidth="3" />
              {/* 22m Line Top */}
              <line x1="5%" y1="28%" x2="95%" y2="28%" stroke="#fff" strokeWidth="2" />
              {/* 10m Line Top */}
              <line x1="5%" y1="40%" x2="95%" y2="40%" stroke="#fff" strokeWidth="1.5" strokeDasharray="6 6" />
              {/* Halfway Line */}
              <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#fff" strokeWidth="3" />
              {/* 10m Line Bottom */}
              <line x1="5%" y1="60%" x2="95%" y2="60%" stroke="#fff" strokeWidth="1.5" strokeDasharray="6 6" />
              {/* 22m Line Bottom */}
              <line x1="5%" y1="72%" x2="95%" y2="72%" stroke="#fff" strokeWidth="2" />
              {/* Try Line Bottom */}
              <line x1="5%" y1="92%" x2="95%" y2="92%" stroke="#fff" strokeWidth="3" />
            </svg>

            {/* Field Direction Watermark */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 pointer-events-none">
              OPPONENT TRY LINE
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 pointer-events-none">
              ZIMBABWE TRY LINE
            </div>

            {/* Position Jersey Circles */}
            <div className="relative w-full h-full">
              {positions.map((pos) => {
                const assigned = assignments[pos.number];
                return (
                  <div
                    key={pos.number}
                    style={{
                      top: `${pos.topPercent}%`,
                      left: `${pos.leftPercent}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                    onClick={() => setActiveSlotModal(pos.number)}
                  >
                    {/* Jersey Token */}
                    <div
                      className={`relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full font-black text-xs transition-all duration-150 shadow-lg ${
                        assigned
                          ? "bg-gradient-to-b from-[#00875A] to-[#005230] text-white ring-2 ring-white scale-105"
                          : "bg-black/50 text-white/60 border border-white/30 hover:border-white hover:text-white hover:scale-110 backdrop-blur-xs"
                      }`}
                    >
                      {pos.number}

                      {/* Captain Badges */}
                      {assigned?.isCaptain && (
                        <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-black px-1 rounded-full shadow-md">
                          C
                        </span>
                      )}
                      {assigned?.isViceCaptain && (
                        <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[8px] font-black px-1 rounded-full shadow-md">
                          VC
                        </span>
                      )}
                    </div>

                    {/* Name Pill */}
                    <div className="mt-1 flex flex-col items-center">
                      <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] sm:text-[11px] font-bold text-white max-w-[90px] truncate text-center shadow-xs">
                        {assigned ? assigned.name : pos.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bench / Finishers Dock */}
          <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs">
            <h4 className="font-heading text-xs font-black uppercase tracking-wider text-rich-black mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#006B3F]" />
              Matchday Finishers / Reserves ({reserveNumbers[0]}?"{reserveNumbers[reserveNumbers.length - 1]})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {reserveNumbers.map((num) => {
                const assigned = assignments[num];
                return (
                  <div
                    key={num}
                    onClick={() => setActiveSlotModal(num)}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                      assigned
                        ? "bg-[#006B3F]/10 border-[#006B3F] text-[#006B3F]"
                        : "bg-black/[0.02] border-black/10 hover:border-black/30 text-black/60"
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center font-black text-xs shrink-0">
                      {num}
                    </span>
                    <span className="text-[11px] font-bold truncate">
                      {assigned ? assigned.name : "Unassigned"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Squad Sidebar (1 col) */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white border border-black/10 shadow-xs">
          <div>
            <h4 className="font-heading text-sm font-black uppercase tracking-wide text-rich-black">
              Squad Players ({squadPlayers.length})
            </h4>
            <p className="text-[11px] text-black/40">Select or assign players to positions.</p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40" />
            <input
              type="text"
              placeholder="Search squad..."
              value={playerSearch}
              onChange={(e) => setPlayerSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/[0.03] border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
            />
          </div>

          {/* Roster List */}
          <div className="flex-1 overflow-y-auto max-h-[500px] space-y-1.5 pr-1">
            {filteredSquad.map((player) => {
              const isAssigned = assignedPlayerIds.has(String(player.id));
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
                    isAssigned
                      ? "bg-[#006B3F]/5 border-[#006B3F]/30 text-black/80"
                      : "bg-white border-black/5 hover:border-black/20 text-black"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-bold truncate">{player.name}</p>
                    <p className="text-[10px] text-black/40">{player.position || "Squad Member"}</p>
                  </div>
                  {isAssigned ? (
                    <span className="text-[10px] font-black uppercase text-[#006B3F] bg-[#006B3F]/10 px-1.5 py-0.5 rounded">
                      In Lineup
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {activeSlotModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="flex flex-col bg-white rounded-2xl border border-black/10 shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
              <div>
                <h4 className="font-heading text-sm font-black uppercase text-black">
                  Assign Jersey #{activeSlotModal}
                </h4>
                <p className="text-xs text-black/50">
                  {positions.find((p) => p.number === activeSlotModal)?.name || `Reserve #${activeSlotModal}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSlotModal(null)}
                className="p-1 rounded-lg text-black/40 hover:text-black hover:bg-black/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Player Selection */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {assignments[activeSlotModal] && (
                <div className="flex items-center justify-between p-3 mb-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900">
                  <div>
                    <p className="text-xs font-bold">Currently: {assignments[activeSlotModal].name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => toggleCaptain(activeSlotModal, "C")}
                        className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          assignments[activeSlotModal].isCaptain ? "bg-amber-600 text-white" : "bg-black/10 text-black"
                        }`}
                      >
                        Captain (C)
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCaptain(activeSlotModal, "VC")}
                        className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          assignments[activeSlotModal].isViceCaptain ? "bg-blue-600 text-white" : "bg-black/10 text-black"
                        }`}
                      >
                        Vice-Captain (VC)
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleUnassign(activeSlotModal);
                      setActiveSlotModal(null);
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}

              <p className="text-[10px] font-black uppercase tracking-wider text-black/40 mb-1">
                Select from Squad
              </p>

              {squadPlayers.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => handleAssign(activeSlotModal, player)}
                  className="flex items-center justify-between w-full p-2.5 rounded-xl border border-black/10 hover:border-[#006B3F] hover:bg-[#006B3F]/5 text-left transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-black">{player.name}</p>
                    <p className="text-[10px] text-black/50">{player.position || "Squad Member"}</p>
                  </div>
                  <span className="text-xs text-[#006B3F] font-bold">Assign +'</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Shield, Award, User } from "lucide-react";

export interface Player {
  name: string;
  position: string;
  group: "Forwards" | "Backs";
  club: string;
  caps: number;
  isCaptain?: boolean;
  image?: string;
}

const SAMPLE_ROSTER: Player[] = [
  { name: "Hilton Mudariki", position: "Scrumhalf", group: "Backs", club: "Harare Sports Club", caps: 32, isCaptain: true },
  { name: "Cleopas Kundiona", position: "Tighthead Prop", group: "Forwards", club: "Old Hararians", caps: 18 },
  { name: "Takudzwa Chieza", position: "Center", group: "Backs", club: "Old Georgians", caps: 22 },
  { name: "Godfrey Muzanargwo", position: "Flanker", group: "Forwards", club: "Old Hararians", caps: 15 },
  { name: "Edward Sigauke", position: "Wing", group: "Backs", club: "Junior Sables Academy", caps: 8 },
  { name: "Aiden Burnett", position: "Number 8", group: "Forwards", club: "Old Georgians", caps: 25 },
];

export default function SquadRosterGrid({ players = SAMPLE_ROSTER }: { players?: Player[] }) {
  const [filter, setFilter] = useState<"All" | "Forwards" | "Backs">("All");

  const filtered = players.filter(p => filter === "All" || p.group === filter);

  return (
    <div className="space-y-8">
      {/* Position Filter Tabs */}
      <div className="flex justify-between items-center border-b border-black/10 pb-4">
        <h3 className="font-heading text-2xl text-rich-black font-black uppercase tracking-wide">
          Senior Squad Roster
        </h3>
        <div className="flex gap-2 bg-black/5 p-1 rounded-xl">
          {(["All", "Forwards", "Backs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filter === tab 
                  ? "bg-zru-green text-white shadow-md" 
                  : "text-rich-black/60 hover:text-rich-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((player) => (
          <div 
            key={player.name}
            className="group p-6 bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-md hover:border-zru-green/30 transition-all duration-300 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-zru-green/10 flex items-center justify-center text-zru-green">
                <User className="w-5 h-5" />
              </div>
              {player.isCaptain && (
                <span className="px-3 py-1 bg-zru-green text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                  Team Captain
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-zru-green uppercase tracking-widest block">
                {player.position}
              </span>
              <h4 className="font-heading text-xl text-rich-black font-black uppercase tracking-wide">
                {player.name}
              </h4>
            </div>

            <div className="pt-4 border-t border-black/5 flex justify-between items-center text-xs font-body text-rich-black/60">
              <span>{player.club}</span>
              <span className="font-bold text-rich-black">{player.caps} Caps</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

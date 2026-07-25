"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, Shield } from "lucide-react";
import { Player } from "@/types";

interface PlayerCardGridProps {
  squad: Player[];
  teamName: string;
}

type PositionFilter = "ALL" | "FORWARDS" | "BACKS";

const FORWARDS = ["Prop", "Hooker", "Lock", "Flanker", "Number 8", "Loose Forward", "Tighthead", "Loosehead"];

function isForward(position: string): boolean {
  return FORWARDS.some(f => position.toLowerCase().includes(f.toLowerCase()));
}

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

export default function PlayerCardGrid({ squad, teamName }: PlayerCardGridProps) {
  const [filter, setFilter] = useState<PositionFilter>("ALL");

  const forwards = squad.filter(p => isForward(p.position));
  const backs = squad.filter(p => !isForward(p.position));

  const filtered = filter === "ALL"
    ? squad
    : filter === "FORWARDS"
    ? forwards
    : backs;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="border-l-4 border-zru-green pl-4">
          <h2 className="text-2xl font-black uppercase tracking-wider text-rich-black">ACTIVE SQUAD</h2>
          <p className="text-sm text-black/50 mt-1">
            {squad.length} players representing {teamName} on the international stage.
          </p>
        </div>

        <div className="flex gap-2">
          {(["ALL", "FORWARDS", "BACKS"] as PositionFilter[]).map(f => {
            const count = f === "ALL" ? squad.length : f === "FORWARDS" ? forwards.length : backs.length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  filter === f
                    ? "bg-zru-green text-white shadow-md shadow-zru-green/20"
                    : "bg-white border border-black/10 text-black/50 hover:border-zru-green/40 hover:text-zru-green"
                }`}
              >
                {f === "FORWARDS" && <Shield className="w-3 h-3" />}
                {f === "BACKS" && <Users className="w-3 h-3" />}
                <span>{f}</span>
                <span className="text-[9px] opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((player, idx) => (
          <div
            key={`${player.name}-${idx}`}
            className="bg-white border border-black/5 rounded-xl p-5 flex flex-col items-center text-center hover:-translate-y-1 shadow-sm hover:shadow-lg transition-all group"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center border border-black/5 relative overflow-hidden mb-4 group-hover:border-zru-green/50 transition-colors bg-gradient-to-br from-zru-green/10 to-zru-green/5">
              {player.image && player.image !== "/images/teams/player-placeholder.webp" ? (
                <Image
                  src={player.image}
                  alt={player.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <span className="text-2xl font-black text-zru-green/70 tracking-tight">
                  {getInitials(player.name)}
                </span>
              )}
            </div>

            <h3 className="font-black text-base uppercase tracking-tight text-rich-black leading-tight">
              {player.name}
            </h3>
            <span className="text-zru-green text-[10px] font-bold uppercase tracking-wider mt-1.5">
              {player.position}
            </span>

            <div className="mt-4 pt-3 border-t border-black/5 w-full flex justify-between text-[10px] text-black/40 font-bold uppercase tracking-wide">
              <span>
                Club:{" "}
                <strong className="text-black/80 font-bold normal-case tracking-normal">
                  {player.club}
                </strong>
              </span>
              <span>
                Caps:{" "}
                <strong className="text-black/80 font-bold">{player.caps}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-black/30">
          <Users className="w-10 h-10 mx-auto mb-3" />
          <p className="text-sm font-bold uppercase tracking-widest">No players in this category</p>
        </div>
      )}
    </div>
  );
}

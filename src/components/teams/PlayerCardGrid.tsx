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
        <div>
          <h2 className="font-heading not-italic text-2xl font-black uppercase tracking-wider text-rich-black">ACTIVE SQUAD</h2>
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
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-[background-color,color,border-color,box-shadow] duration-300 ${
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((player, idx) => (
          <div
            key={`${player.name}-${idx}`}
            className="group"
          >
            {/* Card */}
            <div className="relative rounded-2xl bg-white border border-black/5 overflow-hidden shadow-sm group-hover:shadow-lg group-hover:border-zru-green/20 transition-shadow duration-300">
              {/* Image area with shield clip-path */}
              <div className="relative">
                <div
                  className="relative h-[320px] bg-gradient-to-b from-zru-green to-[#003822]"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)" }}
                >
                  {/* Watermark name */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                    <span
                      className="font-heading text-[5rem] leading-[0.85] font-black uppercase not-italic text-white/[0.08] text-center select-none break-all"
                      style={{ writingMode: "vertical-lr" }}
                    >
                      {player.name}
                    </span>
                  </div>

                  {/* Player image */}
                  {player.image && player.image !== "/images/teams/player-placeholder.webp" ? (
                    <Image
                      src={player.image}
                      alt={player.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-top group-hover:brightness-110 transition-[filter] duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-heading font-black text-white/20 tracking-tight">
                        {player.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Position badge — overlaps the shield clip edge */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
                  <div className="clip-slanted-sm bg-zru-green text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 shadow-lg shadow-zru-green/30">
                    {player.position}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="pt-8 pb-4 px-4 text-center">
                <h3 className="font-heading text-lg font-black uppercase tracking-tight text-rich-black leading-tight">
                  {player.name}
                </h3>
              </div>

              {/* Stats row */}
              <div className="mx-auto grid w-fit grid-cols-3 divide-x divide-black/5 py-4 border-t border-black/5">
                <div className="px-5 text-center">
                  <div className="text-sm font-bold text-rich-black">{player.caps}</div>
                  <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-0.5">Caps</div>
                </div>
                <div className="px-5 text-center">
                  <div className="text-sm font-bold text-rich-black">{player.club.split(" ")[0]}</div>
                  <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-0.5">Club</div>
                </div>
                <div className="px-5 text-center">
                  <div className="text-sm font-bold text-rich-black">{player.position.split(" ")[0].substring(0, 3).toUpperCase()}</div>
                  <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-0.5">Role</div>
                </div>
              </div>
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

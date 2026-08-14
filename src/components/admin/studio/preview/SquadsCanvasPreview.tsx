"use client";

import React from "react";
import { Users, Shield, Award, Sparkles, ChevronRight } from "lucide-react";
import { useStudioLive } from "@/lib/admin/studio-context";

export default function SquadsCanvasPreview() {
  const { selectedSection, setSelectedSection } = useStudioLive();
  const isSelected = selectedSection === "squads";

  const startingXV = [
    { num: 1, name: "Cleopas Kundiona", pos: "Loosehead Prop", club: "US Oyonnax (FR)" },
    { num: 2, name: "Liam Larkan", pos: "Hooker", club: "Old Hararians (ZW)" },
    { num: 3, name: "Bornwell Gwinji", pos: "Tighthead Prop", club: "Harare Sports Club" },
    { num: 4, name: "Kudakwashe Nyakufaringwa", pos: "Lock", club: "Valke (SA)" },
    { num: 5, name: "Simba Siraha", pos: "Lock", club: "Pitbulls RFC" },
    { num: 6, name: "Tinotenda Mavesere", pos: "Blindside Flanker", club: "Sharks (URC)" },
    { num: 7, name: "Aiden Burnett", pos: "Openside Flanker", club: "Old Georgians" },
    { num: 8, name: "Nyasha Tarusenga", pos: "Number Eight", club: "Univ of Western Cape" },
    { num: 9, name: "Hilton Mudariki (C)", pos: "Scrumhalf", club: "Old Georgians" },
    { num: 10, name: "Ian Prior", pos: "Flyhalf", club: "Western Force (AU)" },
    { num: 11, name: "Edward Sigauke", pos: "Left Wing", club: "Harare Sports Club" },
    { num: 12, name: "Kudzai Mashawi", pos: "Inside Centre", club: "Old Hararians" },
    { num: 13, name: "Brandon Mudzekenyedzi", pos: "Outside Centre", club: "Manawatu (NZ)" },
    { num: 14, name: "Takudzwa Musingwini", pos: "Right Wing", club: "Old Georgians" },
    { num: 15, name: "Tapiwa Mafura", pos: "Fullback", club: "Cheetahs / Lions (SA)" },
  ];

  return (
    <section
      onClick={() => setSelectedSection("squads")}
      className={`space-y-4 rounded-3xl p-6 bg-[#0D1117] border transition-all cursor-pointer ${
        isSelected
          ? "border-[#C5A059] ring-2 ring-[#C5A059]/50 shadow-2xl"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            07 SQUAD & ROSTER
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider font-heading text-white">
            Zimbabwe Sables Official Matchday 23 Roster
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#C5A059]">Click player to swap position</span>
      </div>

      {/* Starting XV Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {startingXV.map((p) => (
          <div
            key={p.num}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#161B22] to-[#0D1117] border border-white/10 hover:border-[#C5A059]/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#006B3F] text-white font-mono font-black text-xs flex items-center justify-center border border-emerald-400/30">
                {p.num}
              </span>
              <div>
                <p className="text-xs font-bold text-white font-heading">{p.name}</p>
                <p className="text-[10px] font-mono text-[#C5A059]">{p.pos}</p>
              </div>
            </div>
            <span className="text-[9px] font-mono text-white/40">{p.club}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

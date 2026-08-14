"use client";

import React from "react";
import { Trophy, Calendar, MapPin, ArrowRight } from "lucide-react";
import { useStudioLive } from "@/lib/admin/studio-context";

export default function MatchesCanvasPreview() {
  const { matches, selectedSection, setSelectedSection } = useStudioLive();
  const upcomingMatches = matches.slice(0, 3);
  const isSelected = selectedSection === "fixtures";

  return (
    <section
      onClick={() => setSelectedSection("fixtures")}
      className={`space-y-3 rounded-3xl p-5 bg-[#0D1117] border transition-all cursor-pointer ${
        isSelected
          ? "border-[#C5A059] ring-2 ring-[#C5A059]/50 shadow-2xl"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            03 MATCH CENTRE
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider font-heading text-white">
            Upcoming Fixtures & Live Scores
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#C5A059]">Click match to edit scores</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {upcomingMatches.map((m, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#161B22] to-[#0A0D12] p-4 border border-white/10 hover:border-[#C5A059]/40 transition-colors"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-2">
              <span className="text-[#C5A059] font-bold">{m.competition || "Rugby Africa Cup"}</span>
              <span className="uppercase px-1.5 py-0.5 rounded bg-white/10 font-bold">{m.status || "Upcoming"}</span>
            </div>

            <div className="my-2 space-y-1">
              <div className="flex items-center justify-between font-bold text-xs text-white">
                <span>{m.homeTeam.name}</span>
                <span className="font-mono font-black text-sm text-[#C5A059]">{m.homeTeam.score ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-xs text-white">
                <span>{m.awayTeam.name}</span>
                <span className="font-mono font-black text-sm text-[#C5A059]">{m.awayTeam.score ?? "-"}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-white/40 flex items-center justify-between">
              <span>📍 {m.venue || "Harare Sports Club"}</span>
              <span>{m.time || "15:00 CAT"}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

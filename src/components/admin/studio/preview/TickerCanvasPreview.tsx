"use client";

import React from "react";
import { Megaphone, Radio } from "lucide-react";
import { useStudioLive } from "@/lib/admin/studio-context";

export default function TickerCanvasPreview() {
  const { announcements, selectedSection, setSelectedSection } = useStudioLive();
  const activeAnnouncement = announcements[0] || {
    title: "Sables vs Uganda • Harare Sports Club • Kickoff 15:00 CAT • Gates open 11:00",
    tag: "LIVE MATCH",
  };

  const isSelected = selectedSection === "ticker";

  return (
    <div
      onClick={() => setSelectedSection("ticker", activeAnnouncement.id)}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A1A1B] via-[#0d141d] to-[#031812] border p-3.5 transition-all cursor-pointer ${
        isSelected
          ? "border-[#C5A059] ring-2 ring-[#C5A059]/50 shadow-xl"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            02 TICKER
          </div>
          <span className="rounded bg-[#006B3F] px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider text-white">
            {activeAnnouncement.tag || "BREAKING"}
          </span>
        </div>

        {/* Marquee ticker text */}
        <div className="overflow-hidden flex-1">
          <p className="text-xs font-bold text-white truncate font-sans">
            {activeAnnouncement.title}
          </p>
        </div>

        <span className="text-[10px] font-mono text-white/40 hidden sm:inline shrink-0">
          Click to broadcast
        </span>
      </div>
    </div>
  );
}

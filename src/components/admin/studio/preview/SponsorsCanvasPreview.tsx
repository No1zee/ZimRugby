"use client";

import React from "react";
import { Award, ShieldCheck } from "lucide-react";
import { useStudioLive } from "@/lib/admin/studio-context";

export default function SponsorsCanvasPreview() {
  const { sponsors, selectedSection, setSelectedSection } = useStudioLive();
  const isSelected = selectedSection === "sponsors";

  return (
    <section
      onClick={() => setSelectedSection("sponsors")}
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
            05 OFFICIAL PARTNERS
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider font-heading text-white">
            Union Commercial Partners & Sponsors
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#C5A059]">Click to edit tiers</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sponsors.map((sp, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#161B22] to-[#0A0D12] p-3.5 border border-white/10"
          >
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] font-bold text-xs">
              {sp.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{sp.name}</p>
              <p className="text-[10px] font-mono text-white/50">{sp.tier}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

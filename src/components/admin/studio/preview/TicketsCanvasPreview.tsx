"use client";

import React from "react";
import { Ticket, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { useStudioLive } from "@/lib/admin/studio-context";

export default function TicketsCanvasPreview() {
  const { selectedSection, setSelectedSection } = useStudioLive();
  const isSelected = selectedSection === "tickets";

  const tiers = [
    {
      name: "VIP Presidential Lounge",
      price: "$50",
      perks: ["Complimentary bar & buffet", "Reserved shaded suite", "VIP Gate 1 parking pass", "Post-match player lounge access"],
      claimed: "88%",
      badge: "High Demand",
      color: "from-[#C5A059]/20 to-[#1A1A1B]",
      borderColor: "border-[#C5A059]/50",
      accent: "text-[#C5A059]",
    },
    {
      name: "Grandstand Reserved",
      price: "$15",
      perks: ["Covered central stand view", "Numbered seat assignment", "Express bar queues"],
      claimed: "64%",
      badge: "Popular",
      color: "from-[#006B3F]/20 to-[#1A1A1B]",
      borderColor: "border-[#006B3F]/50",
      accent: "text-emerald-400",
    },
    {
      name: "Open Embankment & Fan Zone",
      price: "$5",
      perks: ["General admission", "Live festival sound system", "Castle Corner access"],
      claimed: "42%",
      badge: "Available",
      color: "from-white/5 to-[#1A1A1B]",
      borderColor: "border-white/15",
      accent: "text-white",
    },
  ];

  return (
    <section
      onClick={() => setSelectedSection("tickets")}
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
            06 TICKETS & HOSPITALITY
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider font-heading text-white">
            Official Matchday Passes & Tier Allocation
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#C5A059]">Click to edit tiers & prices</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className={`flex flex-col justify-between rounded-2xl bg-gradient-to-br ${t.color} p-5 border ${t.borderColor} space-y-4`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10 ${t.accent}`}>
                  {t.badge}
                </span>
                <span className="font-heading text-xl font-black text-white">{t.price}</span>
              </div>
              <h4 className="text-sm font-black font-heading text-white uppercase">{t.name}</h4>

              {/* Progress bar */}
              <div className="my-3 space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-white/50">
                  <span>Capacity</span>
                  <span className="text-white font-bold">{t.claimed} booked</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#006B3F] to-[#C5A059]" style={{ width: t.claimed }} />
                </div>
              </div>

              <ul className="space-y-1.5 text-[11px] text-white/70">
                {t.perks.map((p, pIdx) => (
                  <li key={pIdx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#C5A059] shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span>Edit Pass Configuration</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

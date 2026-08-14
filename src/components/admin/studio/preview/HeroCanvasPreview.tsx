"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Play } from "lucide-react";
import { useStudioLive } from "@/lib/admin/studio-context";

export default function HeroCanvasPreview() {
  const { heroSlides, selectedSection, setSelectedSection } = useStudioLive();
  const slide = heroSlides[0] || {
    title: "Zimbabwe Sables • The Road to Australia 2027",
    subtitle: "Africa Men's Cup Champions & World Cup Qualifiers Campaign",
    cta_text: "Match Centre & Tickets",
    cta_url: "/matches",
    image_url: "/images/sables-hero.jpg",
  };

  const isSelected = selectedSection === "hero";

  return (
    <section
      onClick={() => setSelectedSection("hero", slide.id)}
      className={`relative overflow-hidden rounded-3xl transition-all cursor-pointer group ${
        isSelected
          ? "ring-2 ring-[#C5A059] shadow-2xl scale-[1.002]"
          : "hover:ring-1 hover:ring-white/30"
      }`}
    >
      {/* Section Indicator Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#1A1A1B]/90 backdrop-blur-md border border-[#C5A059]/40 px-3 py-1 rounded-full shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C5A059]">
          01 HERO SLIDER • CLICK TO EDIT
        </span>
      </div>

      {/* Hero Background Backdrop with Neo-Ancient Gradients */}
      <div className="relative min-h-[360px] sm:min-h-[420px] bg-gradient-to-br from-[#031812] via-[#0D1812] to-[#1A1A1B] flex flex-col justify-end p-6 sm:p-10 text-white">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#006B3F]/30 border border-[#006B3F]/50 text-emerald-300 text-xs font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Official Union Campaign
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none drop-shadow-md">
            {slide.title}
          </h1>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-w-xl">
            {slide.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-[#006B3F] hover:bg-[#005230] border border-emerald-400/40 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform group-hover:scale-105">
              <span>{slide.cta_text || "Match Centre & Tickets"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              <Play className="w-3 h-3 fill-white" />
              <span>Watch Highlights</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

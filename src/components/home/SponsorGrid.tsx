"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";

const SPONSORS = [
  {
    id: "nedbank",
    name: "Nedbank Zimbabwe",
    role: "HEADLINE SPONSOR",
    logo: "/images/sponsors/nedbank.svg",
    blurb: "Official headline sponsor powering the Sables national team, domestic competitions, and grassroots rugby nationwide.",
    href: "https://www.nedbank.co.zw",
    badge: "PRIMARY PARTNER",
  },
  {
    id: "cfao",
    name: "CFAO Mobility Zimbabwe",
    role: "OFFICIAL AUTOMOTIVE PARTNER",
    logo: "/images/sponsors/cfao.svg",
    blurb: "Official mobility provider supporting national team logistics and transport across Southern Africa.",
    href: "https://www.cfaogroup.com",
    badge: "AUTOMOTIVE",
  },
  {
    id: "gilbert",
    name: "Gilbert Rugby",
    role: "OFFICIAL BALL & EQUIPMENT",
    logo: "/images/sponsors/gilbert.png",
    blurb: "Official technical supplier providing world-class match balls and training gear for all ZRU tests.",
    href: "https://www.gilbertrugby.com",
    badge: "EQUIPMENT",
  },
  {
    id: "seedco",
    name: "Seed Co Zimbabwe",
    role: "OFFICIAL SEED PARTNER",
    logo: "/images/sponsors/seedco.svg",
    blurb: "Supporting community sports fields and youth development programs across Zimbabwe.",
    href: "https://www.seedcogroup.com",
    badge: "COMMUNITY",
  },
  {
    id: "blk",
    name: "BLK Sport",
    role: "OFFICIAL APPAREL PARTNER",
    logo: "/images/sponsors/blk.svg",
    blurb: "Official apparel partner engineering high-performance matchday kits for the Sables.",
    href: "http://blksport.me",
    badge: "APPAREL",
  },
];

export default function SponsorGrid() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);
  const inViewRef = React.useRef(false);
  const hiddenRef = React.useRef(false);

  React.useEffect(() => {
    const el = sectionRef.current;
    const observer = el
      ? new IntersectionObserver(([entry]) => {
          inViewRef.current = entry.isIntersecting;
        }, { threshold: 0 })
      : null;
    if (el && observer) observer.observe(el);

    function handleVisibility() {
      hiddenRef.current = document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Auto-rotation every 4 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      if (inViewRef.current && !hiddenRef.current) {
        setActiveIdx((prev) => (prev + 1) % SPONSORS.length);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const activeSponsor = SPONSORS[activeIdx];

  return (
    <section ref={sectionRef} id="partners" className="bg-[#FDFBF0] border-t border-black/5 pt-12 sm:pt-16 pb-0 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto space-y-10">
        
        {/* ── 1. Centered Header Narrative ── */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase text-rich-black tracking-tight leading-tight">
            POWERING ZIMBABWE <span className="text-accent-teal">RUGBY</span>
          </h2>
          <p className="text-xs sm:text-sm text-rich-black/70 font-normal max-w-lg mx-auto">
            Proudly supported by world-class commercial partners driving national team excellence and grassroots growth.
          </p>
          <div className="w-16 h-1 bg-[#006747] rounded-full mx-auto opacity-90 mt-2" />
        </div>

        {/* ── 2. Unified Commercial Hub (Logo Dock + Active Spotlight) ── */}
        <div
          className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-lg space-y-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Logo Dock — Clean White Cards with High-Contrast Green Border Highlight */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {SPONSORS.map((s, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`group relative bg-white rounded-2xl p-4 h-[90px] flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "border-[#006747] ring-2 ring-[#006747]/30 shadow-md scale-[1.02]"
                      : "border-black/5 hover:border-[#006747]/40 shadow-xs hover:shadow-sm"
                  }`}
                >
                  <div className="relative w-full h-11 transition-[filter] duration-300">
                    <Image
                      src={s.logo}
                      alt={s.name}
                      fill
                      className={`object-contain transition-all duration-300 ${
                        isActive ? "opacity-100 scale-105" : "opacity-50 group-hover:opacity-100"
                      }`}
                    />
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#006747] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Partner Spotlight Card */}
          <div className="bg-[#002B19] text-white rounded-2xl p-6 sm:p-8 border border-emerald-500/20 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10 space-y-2 text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-md">
                  {activeSponsor.role}
                </span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                {activeSponsor.name}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl font-normal">
                {activeSponsor.blurb}
              </p>
            </div>

            <SlantedButton
              href={activeSponsor.href}
              variant="primary"
              size="sm"
              rightIcon={<ExternalLink size={14} />}
              className="relative z-10 shrink-0"
            >
              VISIT SITE
            </SlantedButton>
          </div>
        </div>

      </div>

      {/* ── 4. Straddled Green & White Bottom Banner with SlantedButton ── */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mt-12">
        {/* Green top half strip */}
        <div className="bg-[#006747] h-20 sm:h-24 flex items-center justify-center">
          <span className="text-white/40 text-[10px] font-extrabold tracking-[0.3em] uppercase hidden sm:block">
            COMMERCIAL OPPORTUNITIES • ROAD TO AUSTRALIA 2027
          </span>
        </div>
        
        {/* White bottom half strip */}
        <div className="bg-white h-20 sm:h-24" />

        {/* SlantedButton — straddled 50% on green & 50% on white */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20">
          <SlantedButton
            href="/partners"
            variant="primary"
            size="md"
            rightIcon={<ArrowRight size={18} />}
          >
            BECOME AN OFFICIAL PARTNER
          </SlantedButton>
        </div>
      </div>
    </section>
  );
}

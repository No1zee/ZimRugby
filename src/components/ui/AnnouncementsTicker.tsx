"use client";

import React, { useEffect, useState } from "react";
import { Volume2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Announcement } from "@/types";

export default function AnnouncementsTicker() {
  const [tickerItems, setTickerItems] = useState<Announcement[]>([]);

  useEffect(() => {
    async function fetchTicker() {
      try {
        const res = await fetch("/api/announcements");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Announcement[] = await res.json();
        
        // Filter for ticker announcements
        const tickers = data.filter((ann) => ann.designVariant === "ticker");
        setTickerItems(tickers);
      } catch (error) {
        console.error("Failed to load ticker announcements:", error);
      }
    }

    fetchTicker();
  }, []);

  if (tickerItems.length === 0) return null;

  // Duplicate items to ensure seamless loop
  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-linear-to-r from-neutral-950 via-zru-green/10 to-neutral-950 border-y border-white/5 py-2.5 overflow-hidden relative z-20 group/ticker-container">
      {/* CSS Keyframes for Marquee */}
      <style>{`
        @keyframes zruMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .zru-marquee-content {
          display: flex;
          gap: 4rem;
          width: max-content;
          animation: zruMarquee 35s linear infinite;
        }
        .zru-marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-6 flex items-center gap-4">
        {/* Fixed Title Label */}
        <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 px-3 py-1 rounded-sm shrink-0 z-10 font-subheading text-[9px] font-black uppercase tracking-widest text-zru-green select-none">
          <Volume2 className="w-3.5 h-3.5 text-zru-green animate-pulse" />
          <span>UNION WIRE</span>
        </div>

        {/* Scrolling Content Wrapper */}
        <div className="flex-1 overflow-hidden relative select-none">
          {/* Gradient masks for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />

          <div className="zru-marquee-content">
            {duplicatedItems.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`}
                className="flex items-center gap-2 text-white/80 font-body text-[11px] font-medium tracking-wide"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-zru-green" />
                <span>{item.title}</span>
                {item.ctaUrl && (
                  <Link 
                    href={item.ctaUrl}
                    className="inline-flex items-center gap-0.5 text-zru-green hover:text-white transition-colors ml-1 font-bold"
                  >
                    <span>{item.ctaLabel || "View"}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

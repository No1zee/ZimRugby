"use client";

import React, { useEffect, useState } from "react";
import { Megaphone, AlertTriangle, Bell, ArrowRight } from "lucide-react";
import { Announcement } from "@/types";
import SlantedButton from "./SlantedButton";

interface PageAnnouncementsProps {
  scope: "tickets" | "match-centre" | "events" | "media" | "clubhouse";
  className?: string;
}

export default function PageAnnouncements({ scope, className = "" }: PageAnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    async function fetchPageAnnouncements() {
      try {
        const res = await fetch("/api/announcements");
        if (!res.ok) throw new Error("Failed to fetch announcements");
        const data: Announcement[] = await res.json();
        
        // Filter announcements for the requested page scope
        const filtered = data.filter(
          (ann) => ann.scope.includes(scope) && ann.designVariant !== "ticker"
        );
        setAnnouncements(filtered);
      } catch (error) {
        console.error(`Failed to load announcements for scope "${scope}":`, error);
      }
    }

    fetchPageAnnouncements();
  }, [scope]);

  if (announcements.length === 0) return null;

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {announcements.map((ann) => {
        const isCritical = ann.priority === "critical";
        const isHigh = ann.priority === "high";

        return (
          <div 
            key={ann.id}
            className={`relative w-full rounded-2xl p-5 md:p-6 overflow-hidden backdrop-blur-md border transition-all duration-300 ${
              isCritical
                ? "bg-gradient-to-br from-red-950/20 via-red-950/5 to-transparent border-red-500/30 shadow-[0_4px_25px_rgba(239,68,68,0.06)]"
                : isHigh
                  ? "bg-gradient-to-br from-zru-green/12 via-zru-green/2 to-transparent border-zru-green/35 shadow-[0_4px_20px_rgba(0,107,63,0.05)]"
                  : "bg-white/2 border-white/10"
            }`}
          >
            {/* Background Accent glow */}
            <div className={`absolute -right-24 -top-24 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none ${
              isCritical ? "bg-red-500" : "bg-zru-green"
            }`} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                {/* Icon wrapper */}
                <div className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center ${
                  isCritical 
                    ? "bg-red-500/20 text-red-400" 
                    : isHigh 
                      ? "bg-zru-green/20 text-zru-green" 
                      : "bg-white/10 text-white/60"
                }`}>
                  {isCritical ? (
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  ) : isHigh ? (
                    <Bell className="w-5 h-5" />
                  ) : (
                    <Megaphone className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {ann.badge && (
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                        isCritical
                          ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                          : "bg-zru-green/15 text-zru-green border-zru-green/30"
                      }`}>
                        {ann.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      Union Bulletin
                    </span>
                  </div>
                  <h4 className="text-base md:text-lg font-heading font-black text-white uppercase tracking-wide">
                    {ann.title}
                  </h4>
                  <p className="text-xs md:text-sm text-white/70 font-body font-medium leading-relaxed max-w-3xl">
                    {ann.body}
                  </p>
                </div>
              </div>

              {/* Call-to-action button */}
              {ann.ctaUrl && (
                <div className="shrink-0 self-start md:self-center">
                  <SlantedButton 
                    href={ann.ctaUrl}
                    variant={isCritical ? "primary" : "secondary"}
                    size="md"
                    className="w-full md:w-auto gap-2"
                  >
                    <span>{ann.ctaLabel || "Learn More"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </SlantedButton>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

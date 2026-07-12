"use client";

import React, { useEffect, useState } from "react";
import { Megaphone, X, ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { Announcement } from "@/types";

export default function GlobalAnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch("/api/announcements");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Announcement[] = await res.ok ? await res.json() : [];
        
        // Filter for global banner announcements
        const globalBanners = data.filter(
          (ann) => ann.scope.includes("global") && ann.designVariant === "banner"
        );

        if (globalBanners.length === 0) return;

        // Sort: Sticky first, then priority (critical > high > normal), then endsAt (closest to expiry first)
        const priorityWeight = { critical: 3, high: 2, normal: 1 };
        globalBanners.sort((a, b) => {
          if (a.isSticky !== b.isSticky) return a.isSticky ? -1 : 1;
          const aWeight = priorityWeight[a.priority] || 1;
          const bWeight = priorityWeight[b.priority] || 1;
          if (aWeight !== bWeight) return bWeight - aWeight;
          return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
        });

        const activeBanner = globalBanners[0];
        
        // Check localStorage to see if user has dismissed this specific announcement
        const isDismissed = localStorage.getItem(`zru_dismissed_ann_${activeBanner.id}`);
        if (!isDismissed) {
          setAnnouncement(activeBanner);
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Failed to load global announcements:", error);
      }
    }

    fetchAnnouncements();
  }, []);

  const handleDismiss = () => {
    if (announcement) {
      localStorage.setItem(`zru_dismissed_ann_${announcement.id}`, "true");
      setIsVisible(false);
    }
  };

  if (!isVisible || !announcement) return null;

  const isCritical = announcement.priority === "critical";
  const isHigh = announcement.priority === "high";

  return (
    <div 
      className={`w-full text-white relative z-50 border-b transition-all duration-300 ${
        isCritical 
          ? "bg-linear-to-r from-red-950/95 via-zru-green/95 to-red-950/95 border-red-500/30 shadow-[0_4px_20px_rgba(239,68,68,0.15)]"
          : isHigh
            ? "bg-linear-to-r from-zru-green via-neutral-900 to-zru-green border-zru-green/30"
            : "bg-linear-to-r from-neutral-950 via-zru-green/35 to-neutral-950 border-white/5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-3">
          {/* Pulsing indicator icon */}
          <div className="relative flex items-center justify-center shrink-0">
            {isCritical && (
              <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping opacity-75" />
            )}
            {isCritical ? (
              <Bell className="w-4 h-4 text-red-400 relative z-10 animate-bounce" />
            ) : (
              <Megaphone className="w-4 h-4 text-zru-green relative z-10" />
            )}
          </div>

          <p className="text-[10px] sm:text-xs font-medium tracking-wide leading-tight text-center md:text-left flex flex-wrap items-center justify-center gap-x-2">
            {announcement.badge && (
              <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm shrink-0 ${
                isCritical 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-zru-green/20 text-zru-green border border-zru-green/30"
              }`}>
                {announcement.badge}
              </span>
            )}
            <span className="font-heading font-bold text-white">{announcement.title}</span>
            <span className="hidden md:inline opacity-70">— {announcement.body}</span>
          </p>

          {/* Action CTA Link */}
          {announcement.ctaUrl && (
            <Link 
              href={announcement.ctaUrl}
              className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shrink-0 transition-all duration-300 ${
                isCritical
                  ? "bg-white text-red-950 hover:bg-zru-green hover:text-white"
                  : "bg-zru-green text-white hover:bg-white hover:text-rich-black shadow-lg shadow-zru-green/20"
              }`}
            >
              <span>{announcement.ctaLabel || "Learn More"}</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          )}
        </div>

        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white shrink-0"
          aria-label="Dismiss Announcement"
          title="Dismiss Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

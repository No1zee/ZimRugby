"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Announcement } from "@/types";

const DISMISS_PREFIX = "zru_dismissed_ann_";

type FeedItem = {
  key: string;
  badge: string | null;
  title: string;
  body?: string;
  href?: string;
  cta?: string;
  isCritical?: boolean;
};

export default function GlobalAnnouncementBar() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const mutedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let alive = true;

    const dismissed = new Set<string>();
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(DISMISS_PREFIX)) dismissed.add(key.slice(DISMISS_PREFIX.length));
      }
    } catch {
      /* ignore */
    }
    mutedRef.current = dismissed;

    async function load() {
      try {
        const annsRes = await fetch("/api/announcements");
        const anns: Announcement[] = annsRes.ok ? await annsRes.json() : [];
        if (!alive) return;

        const feed: FeedItem[] = (anns || [])
          .filter((a) => !dismissed.has(`ann-${a.id}`))
          .map<FeedItem>((a) => ({
            key: `ann-${a.id}`,
            badge: a.badge || (a.priority === "critical" ? "BREAKING NEWS" : "OFFICIAL UPDATE"),
            title: a.title,
            body: a.body,
            href: a.ctaUrl || undefined,
            cta: a.ctaLabel || "READ STORY",
            isCritical: a.priority === "critical" || a.badge?.toLowerCase().includes("breaking"),
          }));

        if (!alive) return;
        setItems(feed.filter(Boolean));
        setIndex(0);

        if (feed.length > 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        console.error("Failed to load global announcements:", error);
      }
    }
    load();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (!isVisible || items.length === 0) return null;

  const current = items[Math.min(index, items.length - 1)];

  const handleDismiss = (key: string) => {
    mutedRef.current.add(key);
    try {
      localStorage.setItem(`${DISMISS_PREFIX}${key}`, "true");
    } catch {
      /* ignore */
    }
    const next = items.filter((item) => item.key !== key);
    setItems(next);
    if (next.length === 0) setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          key="global-announcement-ribbon"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="w-full text-white relative z-50 select-none overflow-hidden block shrink-0 border-0 m-0 p-0 shadow-none"
          aria-label="Breaking news & official announcements"
        >
          {/* ═══ 1. BASE LAYER: Red Sides, Green Center (Default Rest State) ═══ */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #5B0B0B 0%, #8B0000 18%, #004D2C 38%, #006B3F 50%, #004D2C 62%, #8B0000 82%, #5B0B0B 100%)",
            }}
          />

          {/* ═══ 2. ALTERNATING LAYER: Green Sides, Red Center (Fades in during Shimmer) ═══ */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #004D2C 0%, #006B3F 18%, #8B0000 38%, #B91C1C 50%, #8B0000 62%, #006B3F 82%, #004D2C 100%)",
            }}
            animate={{
              opacity: [0, 0, 0.95, 0.95, 0, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              times: [0, 0.2, 0.45, 0.65, 0.85, 1],
              ease: "easeInOut",
            }}
          />

          {/* ═══ 3. SPECULAR SHIMMER LIGHT WAVE (Synchronized with Color Alternation) ═══ */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ x: "-120%" }}
              animate={{ x: ["-120%", "280%", "280%"] }}
              transition={{
                repeat: Infinity,
                duration: 5,
                times: [0.2, 0.7, 1],
                ease: [0.4, 0.0, 0.2, 1],
              }}
              className="absolute inset-y-0 w-2/5 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
            />
          </div>

          {/* ═══ 4. TOP SPECULAR EDGE LINE ═══ */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-red-500/50 via-emerald-400/80 to-red-500/50" />

          {/* ═══ 5. CONTENT BAR CONTAINER ═══ */}
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 relative z-10">
            {/* Left Beacon & Live Desk Indicator */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-sm shadow-red-900" />
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">
                <Bell className="w-3.5 h-3.5 text-red-300 animate-pulse" />
                Breaking Desk
              </span>
            </div>

            {/* Middle Notification Content */}
            <div className="flex-1 flex items-center justify-center overflow-hidden min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-wrap items-center justify-center gap-2 text-center text-xs"
                >
                  {/* High-Visibility Red Badge */}
                  {current.badge && (
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-red-600 text-white shadow-md shadow-red-950/70 border border-red-400/30 shrink-0">
                      {current.badge}
                    </span>
                  )}

                  {/* Headline */}
                  <span className="font-heading font-black uppercase tracking-wide text-white text-xs sm:text-[13px] truncate max-w-[260px] sm:max-w-[500px] md:max-w-none drop-shadow-md">
                    {current.title}
                  </span>

                  {/* Subtext Body */}
                  {current.body && (
                    <span className="text-white/90 font-normal text-xs hidden lg:inline truncate max-w-sm drop-shadow-sm">
                      — {current.body}
                    </span>
                  )}

                  {/* Action CTA Button */}
                  {current.href && (
                    <Link
                      href={current.href}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white text-[#5B0B0B] hover:bg-[#006B3F] hover:text-white text-[10px] font-black uppercase tracking-wider transition-all duration-200 ml-1 cursor-pointer shadow-lg font-bold shrink-0"
                    >
                      <span>{current.cta}</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Pagination & Dismiss */}
            <div className="flex items-center gap-2.5 shrink-0">
              {items.length > 1 && (
                <span className="text-[10px] font-mono font-bold text-white/70 tracking-wider">
                  {Math.min(index, items.length - 1) + 1}/{items.length}
                </span>
              )}
              <button
                onClick={() => handleDismiss(current.key)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white cursor-pointer"
                aria-label="Dismiss Announcement"
                title="Dismiss Announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ArrowRight, Bell, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Announcement } from "@/types";
import { Campaign } from "@/lib/api/campaigns";

const DISMISS_PREFIX = "zru_dismissed_ann_";

type FeedItem = {
  key: string;
  badge: string | null;
  title: string;
  body?: string;
  href?: string;
  cta?: string;
  isCritical: boolean;
  isHigh: boolean;
};

export default function GlobalAnnouncementBar() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [paused, setPaused] = useState(false);
  const mutedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

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
        const [annsRes, campsRes] = await Promise.all([
          fetch("/api/announcements"),
          fetch("/api/campaigns"),
        ]);
        const [anns, camps]: [Announcement[], Campaign[]] = await Promise.all([
          annsRes.ok ? annsRes.json() : [],
          campsRes.ok ? campsRes.json() : [],
        ]);
        if (!alive) return;

        const feed: FeedItem[] = [
          ...anns
            .filter((a) => a.scope.includes("global"))
            .filter((a) => !dismissed.has(`ann-${a.id}`))
            .map<FeedItem>((a) => ({
              key: `ann-${a.id}`,
              badge: a.badge ?? null,
              title: a.title,
              body: a.body,
              href: a.ctaUrl || undefined,
              cta: a.ctaLabel || "Learn More",
              isCritical: a.priority === "critical" || a.badge === "BREAKING",
              isHigh: a.priority === "high",
            })),
          ...camps
            .filter((c) => (c.start_date || c.end_date) || Number(c.priority) > 0)
            .filter((c) => !dismissed.has(`camp-${c.id}`))
            .map<FeedItem>((c) => ({
              key: `camp-${c.id}`,
              badge: "CAMPAIGN",
              title: c.name,
              body: c.subtitle,
              href: c.cta_url || `/campaigns/${c.slug}`,
              cta: c.cta_label || "View",
              isCritical: false,
              isHigh: false,
            })),
        ];

        if (!alive) return;
        setItems(feed.filter(Boolean));
        setIndex(0);

        if (feed.length === 0) return;

        timers.push(setTimeout(() => setIsVisible(true), 800));
        timers.push(setTimeout(() => setShowGlow(true), 1600));
        timers.push(setTimeout(() => setShowGlow(false), 3400));
      } catch (error) {
        console.error("Failed to load global announcements:", error);
      }
    }
    load();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (items.length === 0) return null;

  const current = items[Math.min(index, items.length - 1)];

  const handleDismiss = (key: string) => {
    mutedRef.current.add(key);
    localStorage.setItem(`${DISMISS_PREFIX}${key}`, "true");
    const next = items.filter((item) => item.key !== key);
    setItems(next);
    if (next.length === 0) setIsVisible(false);
  };

  const isCritical = current.isCritical;
  const isHigh = current.isHigh;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="global-announcement-ribbon"
          initial={{ y: "-100%", opacity: 0, scaleY: 0.8 }}
          animate={{ y: 0, opacity: 1, scaleY: 1 }}
          exit={{ y: "-100%", opacity: 0, transition: { duration: 0.3 } }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 20,
            mass: 0.8,
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className={`w-full text-white relative z-50 border-b transition-all duration-500 overflow-hidden ${
            showGlow
              ? "shadow-[0_4px_35px_rgba(0,255,135,0.45)] ring-2 ring-[#006747]/40"
              : ""
          } ${
            isCritical
              ? "bg-gradient-to-r from-red-950/95 via-zru-green/95 to-red-950/95 border-red-500/30 shadow-[0_4px_20px_rgba(239,68,68,0.15)]"
              : isHigh
                ? "bg-gradient-to-r from-zru-green via-neutral-900 to-zru-green border-zru-green/30"
                : "bg-gradient-to-r from-neutral-950 via-zru-green/40 to-neutral-950 border-white/10"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 relative z-10">
            <div className="flex-1 flex items-center justify-center gap-3">
              <span className="relative inline-flex items-center justify-center shrink-0">
                {isCritical && (
                  <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping opacity-75" />
                )}
                {isCritical ? (
                  <Bell className="w-4 h-4 text-red-400 relative z-10 animate-bounce" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#006747] relative z-10 animate-pulse" />
                )}
              </span>

              <AnimatePresence mode="wait">
                <motion.p
                  key={current.key}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25 }}
                  className="text-[10px] sm:text-xs font-normal tracking-wide leading-tight text-center md:text-left flex flex-wrap items-center justify-center gap-x-2"
                >
                  {current.badge && (
                    <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm shrink-0 ${
                      isCritical
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-[#006747]/20 text-[#006747] border border-[#006747]/30"
                    }`}>
                      {current.badge}
                    </span>
                  )}
                  <span className="font-heading font-bold text-white uppercase tracking-wide">{current.title}</span>
                  {current.body && (
                    <span className="hidden md:inline opacity-80 font-normal">— {current.body}</span>
                  )}
                  {current.href && current.cta && (
                    <Link
                      href={current.href}
                      className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md shrink-0 transition-all duration-300 ${
                        isCritical
                          ? "bg-white text-red-950 hover:bg-[#006747] hover:text-black"
                          : "bg-[#006747] text-[#002D1A] hover:bg-white hover:text-black shadow-lg shadow-[#006747]/20"
                      }`}
                    >
                      <span>{current.cta}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {items.length > 1 && (
                <span className="hidden sm:inline text-[9px] font-mono text-white/50 uppercase tracking-wider">
                  {Math.min(index, items.length - 1) + 1}/{items.length}
                </span>
              )}
              <button
                onClick={() => handleDismiss(current.key)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                aria-label="Dismiss Announcement"
                title="Dismiss Announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

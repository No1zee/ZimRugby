"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ArrowRight, Bell } from "lucide-react";
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
          ...(anns || [])
            .filter((a) => !dismissed.has(`ann-${a.id}`))
            .map<FeedItem>((a) => ({
              key: `ann-${a.id}`,
              badge: a.badge || (a.priority === "critical" ? "TICKET ALERT" : "ANNOUNCEMENT"),
              title: a.title,
              body: a.body,
              href: a.ctaUrl || undefined,
              cta: a.ctaLabel || "BOOK TICKETS",
            })),
          ...(camps || [])
            .filter((c) => (c.start_date || c.end_date) || Number(c.priority) > 0)
            .filter((c) => !dismissed.has(`camp-${c.id}`))
            .map<FeedItem>((c) => ({
              key: `camp-${c.id}`,
              badge: "CAMPAIGN",
              title: c.name,
              body: c.subtitle,
              href: c.cta_url || `/campaigns/${c.slug}`,
              cta: c.cta_label || "EXPLORE",
            })),
        ];

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
        <motion.div
          key="global-announcement-ribbon"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="w-full text-white relative z-50 border-b border-red-500/20 bg-gradient-to-r from-[#4A0808] via-[#004D2C] to-[#4A0808] shadow-[0_4px_25px_rgba(239,68,68,0.25)] transition-all duration-500 select-none overflow-hidden"
        >
          {/* Ambient Lighting & Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_4s_infinite] pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 relative z-10">
            {/* Left Notification Icon */}
            <div className="flex items-center shrink-0">
              <div className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              </div>
            </div>

            {/* Middle Notification Text & CTA */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-wrap items-center justify-center gap-2.5 text-center text-xs"
                >
                  {/* Red Ticket/Alert Pill */}
                  {current.badge && (
                    <span className="bg-[#EF4444] text-white text-[9px] font-heading font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm shadow-red-500/40">
                      {current.badge}
                    </span>
                  )}

                  {/* Title */}
                  <span className="font-heading font-black uppercase tracking-wide text-white text-xs sm:text-[13px]">
                    {current.title}
                  </span>

                  {/* Body Subtext */}
                  {current.body && (
                    <span className="text-white/85 font-normal text-xs hidden md:inline">
                      — {current.body}
                    </span>
                  )}

                  {/* Solid White CTA Button */}
                  {current.href && (
                    <Link
                      href={current.href}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-md bg-white text-[#4A0808] hover:bg-accent-teal hover:text-rich-black text-[10px] font-heading font-black uppercase tracking-wider transition-all duration-200 shadow-md font-bold"
                    >
                      <span>{current.cta}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Pagination & Dismiss */}
            <div className="flex items-center gap-3 shrink-0">
              {items.length > 1 && (
                <span className="text-[10px] font-mono font-bold text-white/60 tracking-wider">
                  {Math.min(index, items.length - 1) + 1}/{items.length}
                </span>
              )}
              <button
                onClick={() => handleDismiss(current.key)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                aria-label="Dismiss Announcement"
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

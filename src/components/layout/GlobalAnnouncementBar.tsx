"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ArrowRight, Bell, Megaphone, Ticket } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Announcement } from "@/types";
import { Campaign } from "@/lib/api/campaigns";

const DISMISS_PREFIX = "zru_dismissed_ann_";

type NotificationTheme = "ticket" | "critical" | "match" | "general";

type FeedItem = {
  key: string;
  badge: string | null;
  title: string;
  body?: string;
  href?: string;
  cta?: string;
  theme: NotificationTheme;
};

function resolveNotificationTheme(badge: string | null, priority?: string): NotificationTheme {
  const normalized = (badge || "").toUpperCase();
  if (normalized.includes("TICKET") || normalized.includes("PASS")) return "ticket";
  if (priority === "critical" || normalized.includes("BREAKING") || normalized.includes("URGENT")) return "critical";
  if (normalized.includes("MATCH") || normalized.includes("SABLES") || normalized.includes("LIVE")) return "match";
  return "general";
}

const THEME_STYLES: Record<
  NotificationTheme,
  {
    gradient: string;
    badgeStyle: string;
    buttonStyle: string;
    icon: typeof Bell;
    glow: string;
  }
> = {
  ticket: {
    gradient: "from-[#2A0505] via-[#052114] to-[#2A0505] border-red-500/30",
    badgeStyle: "bg-[#EF4444] text-white shadow-sm shadow-red-500/30",
    buttonStyle: "bg-white text-[#002D1A] hover:bg-accent-teal hover:text-rich-black",
    icon: Ticket,
    glow: "shadow-[0_4px_25px_rgba(239,68,68,0.2)]",
  },
  critical: {
    gradient: "from-[#350808] via-[#1A0404] to-[#350808] border-red-500/40",
    badgeStyle: "bg-[#DC2626] text-white shadow-sm shadow-red-600/40 animate-pulse",
    buttonStyle: "bg-white text-red-950 hover:bg-red-500 hover:text-white",
    icon: Bell,
    glow: "shadow-[0_4px_30px_rgba(220,38,38,0.25)]",
  },
  match: {
    gradient: "from-[#002D1A] via-[#00482B] to-[#002D1A] border-accent-teal/30",
    badgeStyle: "bg-white text-[#006747] shadow-sm",
    buttonStyle: "bg-accent-teal text-rich-black hover:bg-white hover:text-rich-black",
    icon: Megaphone,
    glow: "shadow-[0_4px_25px_rgba(0,200,140,0.15)]",
  },
  general: {
    gradient: "from-[#0A1A12] via-[#002817] to-[#0A1A12] border-white/10",
    badgeStyle: "bg-accent-teal text-rich-black font-black",
    buttonStyle: "bg-white text-[#002D1A] hover:bg-accent-teal hover:text-rich-black",
    icon: Bell,
    glow: "shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
  },
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
              badge: a.badge ?? (a.priority === "critical" ? "URGENT" : "ANNOUNCEMENT"),
              title: a.title,
              body: a.body,
              href: a.ctaUrl || undefined,
              cta: a.ctaLabel || "Book Tickets",
              theme: resolveNotificationTheme(a.badge || null, a.priority),
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
              cta: c.cta_label || "Explore",
              theme: "general" as NotificationTheme,
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
  const theme = THEME_STYLES[current.theme] || THEME_STYLES.general;
  const IconComponent = theme.icon;

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
          className={`w-full text-white relative z-50 border-b bg-gradient-to-r ${theme.gradient} ${theme.glow} transition-all duration-700 select-none overflow-hidden`}
        >
          {/* Shimmer line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_4s_infinite] pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 relative z-10">
            {/* Left Notification Icon */}
            <div className="flex items-center shrink-0">
              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                <IconComponent className="w-3.5 h-3.5 text-accent-teal" />
              </div>
            </div>

            {/* Middle Notification Text & CTA */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap items-center justify-center gap-2.5 text-center text-xs"
                >
                  {/* Badge */}
                  {current.badge && (
                    <span
                      className={`text-[9px] font-heading font-black uppercase tracking-wider px-2 py-0.5 rounded ${theme.badgeStyle}`}
                    >
                      {current.badge}
                    </span>
                  )}

                  {/* Title */}
                  <span className="font-heading font-black uppercase tracking-wide text-white text-xs sm:text-[13px]">
                    {current.title}
                  </span>

                  {/* Body Subtext */}
                  {current.body && (
                    <span className="text-white/80 font-normal text-xs hidden md:inline">
                      — {current.body}
                    </span>
                  )}

                  {/* CTA Button */}
                  {current.href && (
                    <Link
                      href={current.href}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-md text-[10px] font-heading font-black uppercase tracking-wider transition-all duration-200 shadow-md ${theme.buttonStyle}`}
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

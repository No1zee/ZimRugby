"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Siren, ArrowRight } from "lucide-react";
import { Announcement } from "@/types";
import { Campaign } from "@/lib/api/campaigns";

type BarItem = {
  key: string;
  mood: "breaking" | "campaign" | "notice";
  rank: number;
  tag: string;
  text: string;
  sub?: string;
  href?: string;
  cta?: string;
};

const ANN_PRIORITY: Record<string, number> = { critical: 30, high: 20, normal: 10 };

function announcementItems(anns: Announcement[]): BarItem[] {
  return anns.map((a) => {
    const priority = ANN_PRIORITY[a.priority] ?? 10;
    const isBreaking = a.priority === "critical" || a.badge === "BREAKING";
    const sticky = a.isSticky ? 5 : 0;
    return {
      key: `ann-${a.id}`,
      mood: isBreaking ? "breaking" : "notice",
      rank: priority + sticky,
      tag: a.badge || (a.priority === "critical" ? "BREAKING" : "ANNOUNCEMENT"),
      text: a.title,
      href: a.ctaUrl || undefined,
      cta: a.ctaLabel || "View",
    };
  });
}

function campaignItems(campaigns: Campaign[]): BarItem[] {
  return campaigns
    .filter((c) => (c.start_date || c.end_date) || Number(c.priority) > 0)
    .map((c) => ({
      key: `camp-${c.id}`,
      mood: "campaign" as const,
      rank: Number(c.priority) || 0,
      tag: "CAMPAIGN",
      text: c.name,
      sub: c.subtitle,
      href: c.cta_url || `/campaigns/${c.slug}`,
      cta: c.cta_label || "View",
    }));
}

export default function BreakingNewsBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Announcement[]) => alive && setAnnouncements(d))
      .catch(() => undefined);
    fetch("/api/campaigns")
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Campaign[]) => alive && setCampaigns(d))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const items = useMemo(() => {
    const all = [...announcementItems(announcements), ...campaignItems(campaigns)];
    return all.sort((x, y) => y.rank - x.rank);
  }, [announcements, campaigns]);

  useEffect(() => {
    setIdx(0);
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/admin-login") ||
    pathname === "/fan-zone"
  ) {
    return null;
  }

  if (items.length === 0) return null;

  const current = items[Math.min(idx, items.length - 1)];

  const moodClass =
    current.mood === "breaking"
      ? "from-red-700 via-red-600 to-red-700"
      : current.mood === "campaign"
        ? "from-zru-green via-emerald-700 to-zru-green"
        : "from-neutral-950 via-zru-green/10 to-neutral-950";

  const tagClass =
    current.mood === "breaking"
      ? "bg-red-950/40 text-red-100"
      : current.mood === "campaign"
        ? "bg-white/20 text-white"
        : "bg-neutral-800 text-zru-green";

  const inner = (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-3">
      <Siren
        className={`w-3.5 h-3.5 shrink-0 ${current.mood === "breaking" ? "text-white animate-pulse" : "text-white/80"}`}
      />
      <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0 ${tagClass}`}>
        {current.tag}
      </span>
      <span
        key={current.key}
        className="text-xs font-bold tracking-wide truncate"
        title={current.text}
      >
        {current.text}
      </span>
      {current.sub && (
        <span className="hidden md:inline text-xs text-white/80 truncate">{current.sub}</span>
      )}
      {current.href && current.cta && (
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 shrink-0">
          {current.cta}
          <ArrowRight className="w-2.5 h-2.5" />
        </span>
      )}
      {items.length > 1 && (
        <span className="hidden sm:inline ml-auto shrink-0 text-[9px] font-mono text-white/50 uppercase tracking-wider">
          {Math.min(idx, items.length - 1) + 1}/{items.length}
        </span>
      )}
    </div>
  );

  return (
    <div
      className={`w-full bg-gradient-to-r ${moodClass} text-white transition-all duration-300`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {current.href ? (
        <Link href={current.href} className="block hover:opacity-95">
          {inner}
        </Link>
      ) : (
        <span className="block cursor-default">{inner}</span>
      )}
    </div>
  );
}

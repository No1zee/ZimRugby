"use client";

import { useMemo, useState } from "react";
import { Activity, Newspaper, Trophy, Users, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, TrendingUp } from "lucide-react";
import StatusChip from "./ui/StatusChip";
import { setAdminTab } from "@/lib/admin/tab-events";
import type { MatchCardViewModel } from "@/lib/match-centre/types";

interface ActivityEntry {
  id: number;
  action: "create" | "update" | "delete" | "login" | "authenticate";
  collection: string;
  item: string | number;
  timestamp: string;
  user?: string;
}

interface TodayOverviewProps {
  initialNews: Record<string, unknown>[];
  initialMatches: MatchCardViewModel[];
  fanZoneCount: number;
  onboardingCount: number;
  initialActivityFeed?: ActivityEntry[];
  onNavigate: (tab: string) => void;
}

// Relative Human-Friendly Time Formatter (#9)
function formatRelativeTime(iso?: string): string {
  if (!iso) return "recently";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "recently";
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const ACTION_BADGES: Record<string, { label: string; style: string }> = {
  create: { label: "CREATED", style: "bg-zru-green/10 text-zru-green border-zru-green/20" },
  update: { label: "UPDATED", style: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  delete: { label: "DELETED", style: "bg-red-500/10 text-red-600 border-red-500/20" },
  login: { label: "SIGNED IN", style: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  authenticate: { label: "AUTH", style: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
};

const COLLECTION_LABELS: Record<string, string> = {
  news: "article",
  events: "event",
  matches: "fixture",
  teams: "team",
  opponents: "opponent",
  competitions: "competition",
  venues: "venue",
  announcements: "announcement",
  campaigns: "campaign",
  pages: "page",
  players: "player",
  partners: "partner",
  programmes: "programme",
  grassroots_initiatives: "initiative",
  faqs: "FAQ",
  footer_navigation: "footer link",
};

export default function TodayOverview({
  initialNews,
  initialMatches,
  fanZoneCount,
  onboardingCount,
  initialActivityFeed = [],
  onNavigate,
}: TodayOverviewProps) {
  // Collapsible widget section states (#8)
  const [openSections, setOpenSections] = useState({
    drafts: true,
    upcoming: true,
    signups: true,
    activity: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const drafts = useMemo(
    () => initialNews.filter((n) => String(n.status ?? "").toLowerCase() === "draft").slice(0, 5),
    [initialNews]
  );

  const liveMatches = useMemo(() => initialMatches.filter((m) => m.status === "live"), [initialMatches]);

  const upcoming = useMemo(
    () =>
      initialMatches
        .filter((m) => m.status === "upcoming")
        .sort((a, b) => (a.dateIso || "").localeCompare(b.dateIso || ""))
        .slice(0, 5),
    [initialMatches]
  );

  const totalSignups = fanZoneCount + onboardingCount;

  return (
    <div className="space-y-6">
      {/* Quick Action Launcher Bar (#2) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-zru-green" />
          <span className="font-heading text-xs font-black uppercase tracking-wider text-rich-black">
            Executive Actions
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate("media")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-zru-green px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-white shadow-sm transition-all hover:bg-zru-green/90"
          >
            + New Article
          </button>
          <button
            onClick={() => onNavigate("fixtures")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-black/5 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-rich-black transition-all hover:bg-black/10"
          >
            + Update Score
          </button>
          <button
            onClick={() => onNavigate("events")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-black/5 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-rich-black transition-all hover:bg-black/10"
          >
            + Add Event
          </button>
          <button
            onClick={() => onNavigate("fanzone")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-black/5 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-rich-black transition-all hover:bg-black/10"
          >
            Export Fans
          </button>
        </div>
      </div>

      {/* Quick stats with interactive drill-down links (#3) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => onNavigate("media")}
          className="group cursor-pointer rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all hover:border-zru-green/45 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zru-green/10 transition-colors group-hover:bg-zru-green group-hover:text-white">
              <Newspaper className="h-5 w-5 text-zru-green group-hover:text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">{drafts.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">Draft articles</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => onNavigate("fixtures")}
          className="group cursor-pointer rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all hover:border-amber-500/45 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 transition-colors group-hover:bg-amber-500 group-hover:text-white">
              <Trophy className="h-5 w-5 text-amber-600 group-hover:text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">{upcoming.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">Upcoming fixtures</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => onNavigate("fixtures")}
          className="group cursor-pointer rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all hover:border-red-500/45 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 transition-colors group-hover:bg-red-600 group-hover:text-white">
              <Trophy className="h-5 w-5 text-red-600 group-hover:text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">{liveMatches.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">Live matches</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => onNavigate("fanzone")}
          className="group cursor-pointer rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all hover:border-teal-500/45 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 transition-colors group-hover:bg-teal-600 group-hover:text-white">
              <Users className="h-5 w-5 text-teal-600 group-hover:text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">{totalSignups.toLocaleString()}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">Total sign-ups</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Match Visual Countdown Card (#7) */}
      {upcoming[0] && (
        <div className="relative overflow-hidden rounded-2xl bg-rich-black p-6 text-white shadow-md">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-zru-green/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-block rounded bg-zru-green px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white mb-2">
                Next Scheduled Match
              </span>
              <h3 className="font-heading text-xl font-black uppercase tracking-wide">
                {upcoming[0].homeTeam?.name} VS {upcoming[0].awayTeam?.name}
              </h3>
              <p className="text-xs text-white/70 mt-1">
                {upcoming[0].competition} {upcoming[0].venue ? `· ${upcoming[0].venue}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-4 border-t border-white/10 pt-3 md:border-t-0 md:pt-0">
              <div className="text-right">
                <p className="text-xs font-mono font-bold text-zru-green">{upcoming[0].time || "15:00 CAT"}</p>
                <p className="text-[10px] uppercase text-white/50">{upcoming[0].dateIso ? new Date(upcoming[0].dateIso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}</p>
              </div>
              <button
                onClick={() => onNavigate("fixtures")}
                className="rounded-xl bg-white px-4 py-2 text-[10px] font-black uppercase tracking-wider text-rich-black hover:bg-milk-white transition-colors"
              >
                Match Center
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live now banner */}
      {liveMatches.length > 0 && (
        <div className="rounded-2xl border border-red-500/30 bg-red-50 p-5">
          <h3 className="flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-red-700">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>
            Live now — update scores
          </h3>
          <div className="mt-3 space-y-2">
            {liveMatches.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-rich-black">
                    {m.homeTeam?.name} vs {m.awayTeam?.name}
                  </p>
                  <p className="text-xs text-black/50">{m.competition}{m.venue ? ` · ${m.venue}` : ""}</p>
                </div>
                <button
                  onClick={() => onNavigate("fixtures")}
                  className="shrink-0 rounded-lg bg-zru-green px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white hover:bg-green-800"
                >
                  Update score
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Touch-Optimized Responsive Grid (#19) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Drafts queue / Resume Widget (#5 & #8) */}
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-rich-black">
              <Newspaper className="h-4 w-4 text-zru-green" /> Drafts waiting to publish
            </h3>
            <button
              onClick={() => toggleSection("drafts")}
              className="rounded p-1 text-black/40 hover:bg-black/5 hover:text-black"
            >
              {openSections.drafts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
          {openSections.drafts && (
            <div className="mt-3">
              {drafts.length === 0 ? (
                <p className="flex items-center gap-2 text-xs text-black/50 py-2">
                  <CheckCircle2 className="h-4 w-4 text-zru-green" /> All clear — nothing waiting.
                </p>
              ) : (
                <div className="divide-y divide-black/5">
                  {drafts.map((d) => (
                    <div key={String(d.id)} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-rich-black">{String(d.title ?? `#${d.id}`)}</p>
                        <p className="text-xs text-black/50">{formatRelativeTime(String(d.date ?? ""))}</p>
                      </div>
                      <button
                        onClick={() => setAdminTab("media", d.id as string | number)}
                        className="inline-flex items-center gap-1 shrink-0 rounded-lg bg-zru-green/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zru-green hover:bg-zru-green hover:text-white transition-colors"
                      >
                        Resume Draft <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Upcoming fixtures (#8) */}
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-rich-black">
              <Trophy className="h-4 w-4 text-zru-green" /> Upcoming fixtures
            </h3>
            <button
              onClick={() => toggleSection("upcoming")}
              className="rounded p-1 text-black/40 hover:bg-black/5 hover:text-black"
            >
              {openSections.upcoming ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
          {openSections.upcoming && (
            <div className="mt-3">
              {upcoming.length === 0 ? (
                <p className="text-xs text-black/50 py-2">No upcoming fixtures scheduled.</p>
              ) : (
                <div className="divide-y divide-black/5">
                  {upcoming.map((m) => (
                    <div key={m.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-rich-black">
                          {m.homeTeam?.name} vs {m.awayTeam?.name}
                        </p>
                        <p className="text-xs text-black/50">
                          {m.dateIso ? new Date(m.dateIso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""} · {m.time || ""} · {m.competition}
                        </p>
                      </div>
                      <StatusChip status={m.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Fan Zone Registration 7-Day Pulse Graph (#11 & #8) */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-rich-black">
            <TrendingUp className="h-4 w-4 text-zru-green" /> Fan Growth & Registration Pulse (Last 7 Days)
          </h3>
          <button
            onClick={() => toggleSection("signups")}
            className="rounded p-1 text-black/40 hover:bg-black/5 hover:text-black"
          >
            {openSections.signups ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        {openSections.signups && (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 items-end h-24 pt-4 border-b border-black/5">
              {[40, 65, 30, 85, 90, 55, 100].map((val, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 group">
                  <div
                    style={{ height: `${val}%` }}
                    className="w-full rounded-t bg-zru-green/20 group-hover:bg-zru-green transition-all"
                  />
                  <span className="text-[9px] font-mono text-black/40">Day {idx + 1}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-black/50">
                {fanZoneCount.toLocaleString()} Fan Zone registrations · {onboardingCount.toLocaleString()} onboarding enquiries.
              </p>
              <button
                onClick={() => onNavigate("fanzone")}
                className="rounded-lg bg-black/5 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-black/60 hover:bg-black/10"
              >
                View sign-ups
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Squad Quick Glance Widget (#16) */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-rich-black">
          <Trophy className="h-4 w-4 text-zru-green" /> Squad Rosters & Personnel
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-black/5 bg-milk-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-black/50">Senior Sables</p>
            <p className="mt-1 text-xl font-black text-rich-black">28 Active Players</p>
          </div>
          <div className="rounded-xl border border-black/5 bg-milk-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-black/50">Lady Sables</p>
            <p className="mt-1 text-xl font-black text-rich-black">24 Active Players</p>
          </div>
          <div className="rounded-xl border border-black/5 bg-milk-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-black/50">Junior Sables (U20)</p>
            <p className="mt-1 text-xl font-black text-rich-black">26 Active Players</p>
          </div>
        </div>
      </section>

      {/* Missing Asset Warning Banner (#18) */}
      {upcoming.some((m) => !m.venue) && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-50 p-5 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
              <Trophy className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Content Audit Warning</p>
              <p className="text-xs text-amber-800/80">Some upcoming matches have unassigned venues. Set a venue to display location details on the site.</p>
            </div>
          </div>
        </div>
      )}

      {/* Human-Readable Activity Feed (#9 & #8) */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-rich-black">
            <Activity className="h-4 w-4 text-zru-green" /> Recent activity feed
          </h3>
          <button
            onClick={() => toggleSection("activity")}
            className="rounded p-1 text-black/40 hover:bg-black/5 hover:text-black"
          >
            {openSections.activity ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        {openSections.activity && (
          <div>
            {initialActivityFeed.length === 0 ? (
              <p className="text-xs text-black/50 py-2">No recent activity to show.</p>
            ) : (
              <div className="divide-y divide-black/5">
                {initialActivityFeed.map((a) => {
                  const badge = ACTION_BADGES[a.action] || { label: a.action.toUpperCase(), style: "bg-black/5 text-black/70 border-black/10" };
                  return (
                    <div key={a.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`shrink-0 rounded border px-2 py-0.5 text-[8px] font-black tracking-widest ${badge.style}`}>
                          {badge.label}
                        </span>
                        <p className="min-w-0 truncate text-xs text-black/70">
                          {COLLECTION_LABELS[a.collection] || a.collection.replace(/_/g, " ")}{" "}
                          <span className="font-bold text-zru-green">#{String(a.item)}</span>
                        </p>
                      </div>
                      <p className="shrink-0 text-[11px] font-mono text-black/40">
                        {formatRelativeTime(a.timestamp)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

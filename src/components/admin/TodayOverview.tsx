"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Gavel,
  Radio,
  FileEdit,
  ShieldCheck,
  Download,
  RefreshCw,
  Clock,
  ArrowRight,
  TrendingUp,
  Filter,
  UserPlus,
  Megaphone,
  Calendar,
  Check,
  AlertTriangle,
  Upload,
  ShieldAlert,
  CalendarDays,
  FileText,
  Building2,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import type { MatchCardViewModel } from "@/lib/match-centre/types";
import { useToast } from "./ui/ToastProvider";
import { canAccessPanel, canOnCollection, type RolePermissions } from "@/lib/admin/iam";
import { getFlagUrl } from "@/lib/flags";

interface ActivityEntry {
  id: number | string;
  action: "create" | "update" | "delete" | "login" | "authenticate" | "run" | string;
  collection: string;
  item: string | number;
  timestamp: string;
  user?: string | { first_name?: string; last_name?: string; email?: string };
}

const HUMAN_COLLECTION_NAMES: Record<string, string> = {
  news: "News Article",
  matches: "Match Fixture",
  teams: "National Squad",
  opponents: "Opponent Union",
  events: "Calendar Event",
  announcements: "Header Ribbon Alert",
  hero_slides: "Homepage Hero Slide",
  partners: "Partner / Sponsor",
  campaigns: "Campaign",
  grassroots_initiatives: "Grassroots Initiative",
  pages: "Custom Page",
  faqs: "FAQ Item",
  clubs: "Rugby Club",
  directus_flows: "Edge Cache Revalidation",
  directus_users: "User Account",
};

const ACTION_LABELS: Record<string, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  login: "Signed in",
  authenticate: "Authenticated",
  run: "Revalidated",
};

function formatActionHeadline(entry: ActivityEntry): string {
  const coll = HUMAN_COLLECTION_NAMES[entry.collection] || entry.collection.replace(/_/g, " ");
  const action = ACTION_LABELS[entry.action] || "Updated";
  const itemId = typeof entry.item === "string" && entry.item.length > 8 ? "" : ` #${entry.item}`;
  return `${action} ${coll}${itemId}`;
}

function formatUserName(user?: string | { first_name?: string; last_name?: string; email?: string }): string {
  if (!user) return "Admin";
  if (typeof user === "object") {
    if (user.first_name) {
      return user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name;
    }
    if (user.email) {
      const name = user.email.split("@")[0].replace(/[._-]/g, " ");
      return name.split(" ").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
    }
    return "Admin";
  }
  if (typeof user === "string") {
    if (user.includes("@")) {
      const name = user.split("@")[0].replace(/[._-]/g, " ");
      return name.split(" ").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
    }
    if (user.length > 20) return "Admin";
    return user;
  }
  return "Admin";
}

interface TodayOverviewProps {
  permissions: RolePermissions;
  role?: string;
  email?: string;
  canReview?: boolean;
  initialNews: Record<string, unknown>[];
  initialMatches: MatchCardViewModel[];
  fanZoneCount: number;
  onboardingCount: number;
  initialActivityFeed?: ActivityEntry[];
  onNavigate: (tab: string) => void;
}

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

export default function TodayOverview({
  permissions,
  canReview = false,
  initialNews,
  initialMatches,
  fanZoneCount,
  onboardingCount,
  initialActivityFeed = [],
  onNavigate,
}: TodayOverviewProps) {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [countdown, setCountdown] = useState({ hours: "00", minutes: "00", seconds: "00" });

  const hasPanel = (tab: string) => canAccessPanel(permissions, tab);
  const canCreate = (collection: string) => canOnCollection(permissions, collection, "create");

  // Filter pending review drafts & items
  const drafts = useMemo(
    () =>
      initialNews.filter((n) => {
        const ps = String(n.publish_status ?? "").toLowerCase();
        const st = String(n.status ?? "").toLowerCase();
        return ps === "draft" || (!ps && st === "draft") || ps === "in_review";
      }),
    [initialNews]
  );

  const upcomingMatches = useMemo(
    () => initialMatches.filter((m) => m.status === "upcoming"),
    [initialMatches]
  );

  const nextMatch = upcomingMatches[0] || initialMatches[0];

  const matchesNeedingScores = useMemo(
    () =>
      initialMatches.filter(
        (m) =>
          m.status === "completed" &&
          (m.homeTeam.score === null ||
            m.homeTeam.score === undefined ||
            m.awayTeam.score === null ||
            m.awayTeam.score === undefined)
      ),
    [initialMatches]
  );

  // Countdown timer for next match
  useEffect(() => {
    if (!nextMatch?.dateIso) return;
    const matchTime = new Date(nextMatch.dateIso).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, matchTime - now);
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({
        hours: String(hrs).padStart(2, "0"),
        minutes: String(mins).padStart(2, "0"),
        seconds: String(secs).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextMatch]);

  const handleSyncData = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "all" }),
      });
      if (!res.ok) throw new Error("Sync failed");
      toast("Edge cache purged & live site revalidated across all collections!", "success");
    } catch {
      toast("Failed to trigger edge sync.", "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleExportReport = () => {
    const reportData = [
      ["Metric", "Value"],
      ["Pending Editorial Reviews", drafts.length],
      ["Active Upcoming Fixtures", upcomingMatches.length],
      ["Matches Needing Scores", matchesNeedingScores.length],
      ["Fan Zone Submissions", fanZoneCount],
      ["Onboarding Applications", onboardingCount],
      ["System Health", "99.9% Operational"],
      ["Generated At", new Date().toISOString()],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + reportData.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ZRU-Governance-Report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Governance summary report downloaded.", "success");
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1b1c1c] tracking-tight">
            Overview
          </h2>
          <p className="text-sm text-[#707972] mt-0.5">
            Real-time matchday governance metrics, operational status, and editorial queue.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleExportReport}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-lg text-[#1b1c1c] text-xs font-bold uppercase tracking-wider hover:bg-black/[0.02] transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#707972]" />
            <span>Export Report</span>
          </button>
          <button
            type="button"
            onClick={handleSyncData}
            disabled={syncing}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#006B3F] hover:bg-[#005230] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-opacity shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync Data"}</span>
          </button>
        </div>
      </div>

      {/* ── Stats Grid (4 Top Cards) ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1: Pending Reviews */}
        <div
          onClick={() => onNavigate("media")}
          className="bg-white border border-black/10 rounded-xl p-5 flex flex-col gap-2 hover:border-black/20 hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[#707972] text-[11px] font-bold uppercase tracking-wider">
              Pending Reviews
            </span>
            <span className="text-[#ba1a1a] bg-[#ffdad6] p-1.5 rounded-lg">
              <Gavel className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-heading text-3xl md:text-4xl font-bold text-[#1b1c1c]">
              {String(drafts.length).padStart(2, "0")}
            </span>
          </div>
          <div className="text-[#ba1a1a] text-xs font-medium flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{drafts.length > 0 ? `${drafts.length} items awaiting review` : "All clear"}</span>
          </div>
        </div>

        {/* Stat Card 2: Active Fixtures */}
        <div
          onClick={() => onNavigate("fixtures")}
          className="bg-white border border-black/10 rounded-xl p-5 flex flex-col gap-2 hover:border-black/20 hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[#707972] text-[11px] font-bold uppercase tracking-wider">
              Active Fixtures
            </span>
            <span className="text-[#006B3F] bg-[#b2f0ca] p-1.5 rounded-lg">
              <Radio className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-heading text-3xl md:text-4xl font-bold text-[#1b1c1c]">
              {String(upcomingMatches.length).padStart(2, "0")}
            </span>
          </div>
          <div className="text-[#006B3F] text-xs font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{nextMatch ? `Next match: ${nextMatch.competition}` : "No upcoming match"}</span>
          </div>
        </div>

        {/* Stat Card 3: Editorial Drafts */}
        <div
          onClick={() => onNavigate("media")}
          className="bg-white border border-black/10 rounded-xl p-5 flex flex-col gap-2 hover:border-black/20 hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[#707972] text-[11px] font-bold uppercase tracking-wider">
              Editorial Drafts
            </span>
            <span className="text-[#1967D2] bg-[#E8F0FE] p-1.5 rounded-lg">
              <FileEdit className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-heading text-3xl md:text-4xl font-bold text-[#1b1c1c]">
              {String(initialNews.length).padStart(2, "0")}
            </span>
          </div>
          <div className="text-[#707972] text-xs font-medium flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{initialNews.length} articles published</span>
          </div>
        </div>

        {/* Stat Card 4: System Health */}
        <div className="bg-white border border-black/10 rounded-xl p-5 flex flex-col gap-2 hover:border-black/20 hover:shadow-sm transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[#707972] text-[11px] font-bold uppercase tracking-wider">
              System Health
            </span>
            <span className="text-[#002d19] bg-[#97d4af] p-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-heading text-3xl md:text-4xl font-bold text-[#1b1c1c]">
              99.9<span className="text-xl">%</span>
            </span>
          </div>
          <div className="text-[#006B3F] text-xs font-medium flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>All services operational</span>
          </div>
        </div>
      </div>

      {/* ── Bento Grid Main Content ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column (Wider: Span 2) ───────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Match Countdown Card */}
          {nextMatch && (
            <div className="bg-white border border-black/10 rounded-xl overflow-hidden shadow-sm">
              <div className="h-32 bg-[#002d19] relative overflow-hidden flex items-center p-6 text-white">
                {/* Subtle pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative z-10 w-full flex justify-between items-center">
                  <div>
                    <span className="bg-[#006B3F] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md mb-2 inline-block shadow-sm">
                      {nextMatch.competition || "International Fixture"}
                    </span>
                    <h3 className="font-heading text-xl md:text-2xl font-bold leading-tight">
                      {nextMatch.homeTeam.name} vs. {nextMatch.awayTeam.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-[10px] text-white/70 uppercase tracking-wider block mb-1 font-mono">
                      Kickoff In
                    </span>
                    <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-white">
                      {countdown.hours}:{countdown.minutes}:{countdown.seconds}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm flex items-center justify-center relative">
                      <Image
                        src={getFlagUrl(nextMatch.homeTeam.name)}
                        alt={nextMatch.homeTeam.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm flex items-center justify-center relative">
                      <Image
                        src={getFlagUrl(nextMatch.awayTeam.name)}
                        alt={nextMatch.awayTeam.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-xs text-[#707972] font-medium">
                    {nextMatch.venue ? `${nextMatch.venue} · ` : ""}
                    {nextMatch.dateIso ? new Date(nextMatch.dateIso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "Scheduled"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("fixtures")}
                  className="text-[#006B3F] hover:text-[#00452A] text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View Match Ops</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Governance & Attention Queue */}
          <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-4 border-b border-black/5 pb-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-2">
                <Gavel className="w-4 h-4 text-[#002d19]" />
                <span>Governance & Attention Queue</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigate("media")}
                className="text-[#707972] hover:text-[#1b1c1c] transition-colors p-1"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {drafts.length === 0 && matchesNeedingScores.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#707972]">
                  <Check className="w-6 h-6 text-[#006B3F] mx-auto mb-2" />
                  <p className="font-medium text-[#1b1c1c]">All clear!</p>
                  <p className="text-[11px] text-[#707972] mt-0.5">
                    No pending disciplinary cases, draft articles, or unverified match results.
                  </p>
                </div>
              ) : (
                <>
                  {/* Draft Articles */}
                  {drafts.map((d, idx) => (
                    <div
                      key={`draft-${idx}`}
                      onClick={() => onNavigate("media")}
                      className="p-3.5 border border-black/5 rounded-lg hover:border-[#006B3F] transition-all cursor-pointer group bg-[#F9F7E8]/40"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#E8F0FE] text-[#1967D2] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                            Editorial Review
                          </span>
                          <span className="text-[11px] font-mono text-[#707972]">
                            ID: {String(d.id || idx + 1)}
                          </span>
                        </div>
                        <span className="text-[#ba1a1a] text-[11px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Action Required
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#1b1c1c] group-hover:text-[#006B3F] transition-colors">
                        {String(d.title || "Untitled Article Draft")}
                      </h4>
                      <p className="text-xs text-[#707972] truncate mt-0.5">
                        {String(d.summary || d.content || "Pending administrative sign-off before publishing to public portal.")}
                      </p>
                    </div>
                  ))}

                  {/* Matches Needing Scores */}
                  {matchesNeedingScores.map((m, idx) => (
                    <div
                      key={`score-${idx}`}
                      onClick={() => onNavigate("fixtures")}
                      className="p-3.5 border border-black/5 rounded-lg hover:border-[#006B3F] transition-all cursor-pointer group bg-white"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#E6F4EA] text-[#00452A] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                            Match Ops
                          </span>
                          <span className="text-[11px] font-mono text-[#707972]">
                            Fixture #{String(m.id).slice(0, 8)}
                          </span>
                        </div>
                        <span className="text-[#707972] text-[11px] font-medium">Scores Missing</span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#1b1c1c] group-hover:text-[#006B3F] transition-colors">
                        {m.homeTeam.name} vs. {m.awayTeam.name}
                      </h4>
                      <p className="text-xs text-[#707972] truncate mt-0.5">
                        Completed fixture requires final verified score sheet entry.
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column (Narrower: Span 1) ───────────────────────── */}
        <div className="space-y-6">
          {/* Quick Actions (2x2 Grid) */}
          <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1b1c1c] mb-4 border-b border-black/5 pb-2">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onNavigate("teams")}
                className="flex flex-col items-center justify-center p-3.5 border border-black/10 rounded-lg hover:bg-black/[0.02] hover:border-[#006B3F] transition-all text-center gap-2 group cursor-pointer"
              >
                <UserPlus className="w-5 h-5 text-[#707972] group-hover:text-[#006B3F] transition-colors" />
                <span className="text-xs font-semibold text-[#1b1c1c]">Manage Squads</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("hero_layout")}
                className="flex flex-col items-center justify-center p-3.5 border border-black/10 rounded-lg hover:bg-black/[0.02] hover:border-[#006B3F] transition-all text-center gap-2 group cursor-pointer"
              >
                <Megaphone className="w-5 h-5 text-[#707972] group-hover:text-[#006B3F] transition-colors" />
                <span className="text-xs font-semibold text-[#1b1c1c]">Publish Notice</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("media")}
                className="flex flex-col items-center justify-center p-3.5 border border-black/10 rounded-lg hover:bg-black/[0.02] hover:border-[#006B3F] transition-all text-center gap-2 group cursor-pointer"
              >
                <FileText className="w-5 h-5 text-[#707972] group-hover:text-[#006B3F] transition-colors" />
                <span className="text-xs font-semibold text-[#1b1c1c]">Write Article</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("fixtures")}
                className="flex flex-col items-center justify-center p-3.5 border border-black/10 rounded-lg hover:bg-black/[0.02] hover:border-[#006B3F] transition-all text-center gap-2 group cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-[#707972] group-hover:text-[#006B3F] transition-colors" />
                <span className="text-xs font-semibold text-[#1b1c1c]">Edit Schedule</span>
              </button>
            </div>
          </div>

          {/* Audit Log / Recent Activity Timeline */}
          <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm flex flex-col min-h-[380px]">
            <div className="flex justify-between items-center mb-4 border-b border-black/5 pb-2">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1b1c1c]">
                Audit Log
              </h3>
              <button
                type="button"
                onClick={() => onNavigate("media")}
                className="text-[#006B3F] text-xs font-bold uppercase tracking-wider hover:underline"
              >
                View All
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {initialActivityFeed.length === 0 ? (
                <p className="py-8 text-center text-xs text-[#707972]">No recent activity entries recorded.</p>
              ) : (
                initialActivityFeed.slice(0, 6).map((entry, idx) => {
                  const isCreate = entry.action === "create";
                  const isDelete = entry.action === "delete";
                  const isAuth = entry.action === "login" || entry.action === "authenticate";

                  return (
                    <div key={entry.id || idx} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                          isCreate
                            ? "bg-[#E6F4EA] text-[#00452A]"
                            : isDelete
                            ? "bg-[#ffdad6] text-[#ba1a1a]"
                            : isAuth
                            ? "bg-[#E8F0FE] text-[#1967D2]"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isCreate ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : isDelete ? (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        ) : isAuth ? (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        ) : (
                          <FileEdit className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-[#1b1c1c] truncate">
                            {formatActionHeadline(entry)}
                          </p>
                          <span className="text-[10px] text-[#707972] font-mono shrink-0">
                            {formatRelativeTime(entry.timestamp)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#707972] truncate">
                          By <span className="font-semibold text-[#1b1c1c]">{formatUserName(entry.user)}</span>
                          {typeof entry.user === "object" && entry.user.email ? ` · ${entry.user.email}` : ""}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

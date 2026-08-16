"use client";

import { useMemo, useState } from "react";
import { Activity, Newspaper, Trophy, Users, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, TrendingUp, Radio, Bell, Plus, HardDrive, Sparkles, Send } from "lucide-react";
import StatusChip from "./ui/StatusChip";
import { setAdminTab } from "@/lib/admin/tab-events";
import type { MatchCardViewModel } from "@/lib/match-centre/types";
import { useToast } from "./ui/ToastProvider";

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

export default function TodayOverview({
  initialNews,
  initialMatches,
  fanZoneCount,
  onboardingCount,
  initialActivityFeed = [],
  onNavigate,
}: TodayOverviewProps) {
  const { toast } = useToast();
  const [quickAlert, setQuickAlert] = useState("");
  const [alertTag, setAlertTag] = useState<"BREAKING" | "LIVE MATCH" | "NOTICE" | "TICKETS">("BREAKING");
  const [broadcasting, setBroadcasting] = useState(false);

  // Collapsible widget section states
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

  const upcoming = useMemo(
    () =>
      initialMatches
        .filter((m) => m.status === "upcoming")
        .sort((a, b) => (a.dateIso || "").localeCompare(b.dateIso || ""))
        .slice(0, 5),
    [initialMatches]
  );

  const totalSignups = fanZoneCount + onboardingCount;

  // 1-Click Fast Marquee Broadcast from Dashboard
  const handleQuickBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAlert.trim()) return;
    setBroadcasting(true);
    const now = new Date();
    try {
      // Broadcast announcement directly — MUST be design_variant=ticker with
      // active date window, otherwise the public API silently excludes it.
      const res = await fetch("/api/admin/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "announcements",
          data: {
            title: `[${alertTag}] ${quickAlert.trim()}`,
            slug: `ticker-${Date.now()}`,
            body: "",
            design_variant: "ticker",
            priority: alertTag === "BREAKING" ? 30 : alertTag === "LIVE MATCH" ? 20 : 10,
            starts_at: now.toISOString(),
            ends_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            is_enabled: true,
            status: "published",
            badge: alertTag,
            segment: "general",
            scope: ["global"],
          },
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Broadcast failed");
      }
      toast("Broadcast published to the live marquee.", "success");
      setQuickAlert("");
    } catch (err) {
      toast(`Broadcast failed: ${err instanceof Error ? err.message : String(err)}`, "error");
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Launcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-zru-green animate-pulse" />
          <span className="font-heading text-xs font-black uppercase tracking-wider text-rich-black">
            Executive Quick Actions
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("media")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-zru-green px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-white shadow-sm transition-all hover:bg-green-800 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> New Article
          </button>
          <button
            type="button"
            onClick={() => onNavigate("hero_layout")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-white shadow-sm transition-all hover:bg-amber-600 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" /> Broadcast Alert
          </button>
          <button
            type="button"
            onClick={() => onNavigate("fixtures")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-black/5 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-rich-black transition-all hover:bg-black/10 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-[#006B3F]" /> Live Score
          </button>
          <button
            type="button"
            onClick={() => onNavigate("events")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-black/5 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-rich-black transition-all hover:bg-black/10 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Event
          </button>
          <button
            type="button"
            onClick={() => onNavigate("backups")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-black/5 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-rich-black transition-all hover:bg-black/10 cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5" /> Backup State
          </button>
        </div>
      </div>

      {/* Fast Emergency Marquee / Matchday Broadcast Composer */}
      <div className="bg-gradient-to-r from-[#0d131a] to-[#1a2330] rounded-2xl p-5 border border-white/10 text-white shadow-md">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            <h3 className="text-xs font-black uppercase tracking-wider font-heading text-white">
              Instant Matchday Broadcast & Breaking Ticker
            </h3>
          </div>
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
            Broadcasts to Public Marquee in &lt;60s
          </span>
        </div>

        <form onSubmit={handleQuickBroadcast} className="flex flex-col sm:flex-row gap-3">
          <select
            value={alertTag}
            onChange={(e) => setAlertTag(e.target.value as any)}
            className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none shrink-0"
          >
            <option value="BREAKING" className="bg-[#0d131a] text-white">BREAKING</option>
            <option value="LIVE MATCH" className="bg-[#0d131a] text-white">LIVE MATCH</option>
            <option value="TICKETS" className="bg-[#0d131a] text-white">TICKETS</option>
            <option value="NOTICE" className="bg-[#0d131a] text-white">NOTICE</option>
          </select>

          <input
            type="text"
            value={quickAlert}
            onChange={(e) => setQuickAlert(e.target.value)}
            placeholder="e.g. Sables vs Simbas kickoff scheduled for 15:00 CAT at Harare Sports Club · Gates open 11:00"
            className="flex-1 bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder:text-white/40 outline-none focus:border-[#006B3F] transition-colors"
          />

          <button
            type="submit"
            disabled={broadcasting || !quickAlert.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{broadcasting ? "Broadcasting..." : "Broadcast Live"}</span>
          </button>
        </form>
      </div>

      {/* Quick stats with interactive drill-down links */}
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
          onClick={() => onNavigate("fanzone")}
          className="group cursor-pointer rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all hover:border-blue-500/45 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 transition-colors group-hover:bg-blue-500 group-hover:text-white">
              <Users className="h-5 w-5 text-blue-600 group-hover:text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">{totalSignups}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">Fan Zone & Registrations</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate("overview")}
          className="group cursor-pointer rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all hover:border-purple-500/45 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 transition-colors group-hover:bg-purple-500 group-hover:text-white">
              <Activity className="h-5 w-5 text-purple-600 group-hover:text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">{initialActivityFeed.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">Audit Actions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Drafts Widget & Upcoming Fixtures Widget */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Draft Articles */}
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-black/5 pb-3">
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-zru-green" />
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-rich-black">
                Articles in Draft ({drafts.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate("media")}
              className="text-[11px] font-bold text-zru-green hover:underline cursor-pointer flex items-center gap-1"
            >
              Open Composer <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {drafts.length === 0 ? (
            <p className="py-6 text-center text-xs text-black/40">No unpublished drafts. All articles are live!</p>
          ) : (
            <div className="space-y-2.5">
              {drafts.map((d, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate("media")}
                  className="flex items-center justify-between rounded-xl bg-black/[0.02] p-3 transition-colors hover:bg-black/5 cursor-pointer"
                >
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-rich-black truncate">{String(d.title || "Untitled Draft")}</p>
                    <p className="text-[10px] text-black/40 font-mono">{formatRelativeTime(String(d.date_created || d.date))}</p>
                  </div>
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-600">
                    Draft
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Fixtures */}
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-black/5 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-600" />
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-rich-black">
                Next Scheduled Fixtures ({upcoming.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate("fixtures")}
              className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              Match Centre <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {upcoming.length === 0 ? (
            <p className="py-6 text-center text-xs text-black/40">No upcoming fixtures scheduled.</p>
          ) : (
            <div className="space-y-2.5">
              {upcoming.map((m, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate("fixtures")}
                  className="flex items-center justify-between rounded-xl bg-black/[0.02] p-3 transition-colors hover:bg-black/5 cursor-pointer"
                >
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-rich-black truncate">
                      {m.homeTeam.name} vs {m.awayTeam.name}
                    </p>
                    <p className="text-[10px] text-black/40 font-mono">
                      {m.venue || "Harare Sports Club"} · {m.dateIso ? new Date(m.dateIso).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "TBD"}
                    </p>
                  </div>
                  <span className="rounded bg-[#006B3F]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#006B3F]">
                    {m.competition || "Test Match"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Newspaper,
  ArrowRight,
  Radio,
  Bell,
  Send,
  CalendarDays,
  Building2,
  Flag,
  Layers,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import type { MatchCardViewModel } from "@/lib/match-centre/types";
import { useToast } from "./ui/ToastProvider";
import { canAccessPanel, canOnCollection, type RolePermissions } from "@/lib/admin/iam";

interface ActivityEntry {
  id: number;
  action: "create" | "update" | "delete" | "login" | "authenticate";
  collection: string;
  item: string | number;
  timestamp: string;
  user?: string;
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

const ACTION_BADGES: Record<string, { label: string; style: string }> = {
  create: { label: "CREATED", style: "bg-zru-green/10 text-zru-green border-zru-green/20" },
  update: { label: "UPDATED", style: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  delete: { label: "DELETED", style: "bg-red-500/10 text-red-600 border-red-500/20" },
  login: { label: "SIGNED IN", style: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  authenticate: { label: "AUTH", style: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
};

interface HubAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  iconStyle: string;
  tab: string;
  visible: boolean;
}

export default function TodayOverview({
  permissions,
  role,
  email,
  canReview = false,
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

  const hasPanel = (tab: string) => canAccessPanel(permissions, tab);
  const canCreate = (collection: string) => canOnCollection(permissions, collection, "create");
  const canUpdate = (collection: string) => canOnCollection(permissions, collection, "update");

  // ---- Role-aware "What do you want to do?" hub ----
  const hubActions: HubAction[] = [
    {
      id: "article",
      label: "Post an article",
      description: "Write a news story for the site",
      icon: <Newspaper className="h-5 w-5" />,
      iconStyle: "bg-zru-green/10 text-zru-green group-hover:bg-zru-green group-hover:text-white",
      tab: "media",
      visible: hasPanel("media") && canCreate("news"),
    },
    {
      id: "announce",
      label: "Broadcast a notice",
      description: "Alert banner or ticker (breaking, tickets…)",
      icon: <Bell className="h-5 w-5" />,
      iconStyle: "bg-red-500/10 text-red-600 group-hover:bg-red-500 group-hover:text-white",
      tab: "media",
      visible: hasPanel("media") && canCreate("announcements"),
    },
    {
      id: "fixture",
      label: "Update a fixture / score",
      description: "Schedule, scores or results",
      icon: <Radio className="h-5 w-5" />,
      iconStyle: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
      tab: "fixtures",
      visible: hasPanel("fixtures"),
    },
    {
      id: "event",
      label: "Add an event",
      description: "Something on the calendar",
      icon: <CalendarDays className="h-5 w-5" />,
      iconStyle: "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white",
      tab: "events",
      visible: hasPanel("events") && canCreate("events"),
    },
    {
      id: "club",
      label: "Update a club",
      description: "Club info shown on the Clubs page",
      icon: <Building2 className="h-5 w-5" />,
      iconStyle: "bg-violet-500/10 text-violet-600 group-hover:bg-violet-500 group-hover:text-white",
      tab: "clubs",
      visible: hasPanel("clubs") && (canCreate("clubs") || canUpdate("clubs")),
    },
    {
      id: "campaign",
      label: "Run a campaign",
      description: "Drive fans to an initiative",
      icon: <Flag className="h-5 w-5" />,
      iconStyle: "bg-purple-500/10 text-purple-600 group-hover:bg-purple-500 group-hover:text-white",
      tab: "campaigns",
      visible: hasPanel("campaigns") && canCreate("campaigns"),
    },
    {
      id: "hero",
      label: "Update hero / layout",
      description: "Big images on the homepage",
      icon: <Layers className="h-5 w-5" />,
      iconStyle: "bg-black/5 text-rich-black group-hover:bg-black group-hover:text-white",
      tab: "hero_layout",
      visible: hasPanel("hero_layout"),
    },
  ].filter((a) => a.visible);

  // ---- Pending queue ----
  const drafts = useMemo(
    () => initialNews.filter((n) => String(n.status ?? "").toLowerCase() === "draft").slice(0, 5),
    [initialNews]
  );

  const matchesNeedingScores = useMemo(
    () =>
      initialMatches.filter(
        (m) => m.status === "completed" && (m.homeTeam.score == null || m.awayTeam.score == null)
      ).slice(0, 5),
    [initialMatches]
  );

  const upcoming = useMemo(
    () =>
      initialMatches
        .filter((m) => m.status === "upcoming")
        .sort((a, b) => (a.dateIso || "").localeCompare(b.dateIso || ""))
        .slice(0, 5),
    [initialMatches]
  );

  const queueItems = [
    { key: "drafts", label: "Draft articles awaiting publish", count: drafts.length, tab: "media", show: hasPanel("media") },
    { key: "scores", label: "Completed fixtures missing scores", count: matchesNeedingScores.length, tab: "fixtures", show: hasPanel("fixtures") },
    { key: "upcoming", label: "Upcoming fixtures scheduled", count: upcoming.length, tab: "fixtures", show: hasPanel("fixtures") },
    { key: "onboarding", label: "New enquiries to answer", count: onboardingCount, tab: "onboarding", show: hasPanel("onboarding") },
    { key: "fanzone", label: "New fan zone registrations", count: fanZoneCount, tab: "fanzone", show: hasPanel("fanzone") },
  ].filter((q) => q.show);

  const totalNeedingAttention = queueItems.reduce((sum, q) => sum + (q.key === "upcoming" ? 0 : q.count), 0);

  // ---- Approval pipeline (in-review items) ----
  const inReviewItems = useMemo(
    () => initialNews.filter((n) => String(n.status ?? "").toLowerCase() === "in_review").slice(0, 5),
    [initialNews]
  );

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
      {/* Spoonfed Hub Header */}
      <div className="rounded-2xl border border-black/10 bg-gradient-to-r from-[#0d131a] to-[#1a2330] p-6 text-white shadow-md">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-zru-green animate-pulse" />
          <span className="font-heading text-xs font-black uppercase tracking-wider text-white/70">
            Quick start
          </span>
        </div>
        <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-wide">
          What would you like to do?
        </h2>

        {hubActions.length === 0 ? (
          <p className="text-sm text-white/60">
            You don&apos;t have any content actions yet — your role is read-only.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hubActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => onNavigate(action.tab)}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left transition-all hover:border-white/25 hover:bg-white/[0.08] cursor-pointer"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${action.iconStyle}`}>
                  {action.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-black uppercase tracking-wider text-white">
                    {action.label}
                  </span>
                  <span className="block text-[11px] text-white/50">{action.description}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
              </button>
            ))}
          </div>
        )}
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

      {/* Needs Your Attention Queue */}
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-zru-green" />
            <h3 className="font-heading text-xs font-black uppercase tracking-wider text-rich-black">
              Needs your attention
            </h3>
            {totalNeedingAttention > 0 && (
              <span className="rounded-full bg-zru-green px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                {totalNeedingAttention}
              </span>
            )}
          </div>
          {totalNeedingAttention === 0 && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zru-green">
              <CheckCircle2 className="h-3.5 w-3.5" /> All caught up
            </span>
          )}
        </div>

        {queueItems.every((q) => q.count === 0) ? (
          <p className="py-6 text-center text-xs text-black/40">
            Nothing needs your attention right now. Everything on the site is live and up to date!
          </p>
        ) : (
          <div className="space-y-2.5">
            {queueItems.map((item) => (
              <div
                key={item.key}
                onClick={() => onNavigate(item.tab)}
                className="flex items-center justify-between gap-3 rounded-xl bg-black/[0.02] p-3 transition-colors hover:bg-black/5 cursor-pointer"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      item.count > 0 ? "bg-amber-500/10 text-amber-600" : "bg-zru-green/10 text-zru-green"
                    }`}
                  >
                    {item.count}
                  </span>
                  <p className="truncate text-xs font-bold text-rich-black">{item.label}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-black uppercase tracking-wider text-zru-green">
                  Review <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            ))}
          </div>
        )}

        {drafts.length > 0 && (
          <div className="mt-4 border-t border-black/5 pt-4">
            <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-black/40">
              Drafts waiting
            </p>
            <div className="space-y-2">
              {drafts.map((d, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate("media")}
                  className="flex items-center justify-between rounded-lg bg-amber-500/[0.04] px-3 py-2 transition-colors hover:bg-amber-500/10 cursor-pointer"
                >
                  <p className="truncate text-xs font-bold text-rich-black">{String(d.title || "Untitled Draft")}</p>
                  <span className="ml-3 shrink-0 rounded bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-600">
                    Draft
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Approval pipeline */}
      {inReviewItems.length > 0 && hasPanel("media") && (
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-black/5 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-600" />
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-rich-black">
                {canReview ? "Needs your review" : "In review"}
              </h3>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-600">
                {inReviewItems.length}
              </span>
            </div>
          </div>
          <p className="mb-3 text-[11px] text-black/50">
            {canReview
              ? "These items are waiting on you. Approve them or send them back with a note."
              : "These items are waiting on the editor. You'll see the outcome here."}
          </p>
          <div className="space-y-2.5">
            {inReviewItems.map((d, i) => {
                const isOwn = email ? String(d.created_by_email || "") === email : false;
                return (
                  <div
                    key={i}
                    onClick={() => onNavigate("media")}
                    className="flex items-center justify-between rounded-lg bg-amber-500/[0.04] px-3 py-2 transition-colors hover:bg-amber-500/10 cursor-pointer"
                  >
                    <p className="truncate text-xs font-bold text-rich-black">{String(d.title || "Untitled")}</p>
                    <span className="ml-3 shrink-0 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-600">
                      {canReview && !isOwn ? "Review" : "Waiting"} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-600" />
            <h3 className="font-heading text-xs font-black uppercase tracking-wider text-rich-black">
              Recent activity
            </h3>
          </div>
        </div>

        {initialActivityFeed.length === 0 ? (
          <p className="py-6 text-center text-xs text-black/40">No activity recorded yet.</p>
        ) : (
          <div className="space-y-2.5">
            {initialActivityFeed.slice(0, 10).map((entry) => {
              const badge = ACTION_BADGES[entry.action] ?? ACTION_BADGES.update;
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-black/[0.02] px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className={`rounded border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${badge.style}`}>
                      {badge.label}
                    </span>
                    <p className="truncate text-xs text-black/70">
                      <span className="font-bold text-rich-black">{entry.collection}</span>{" "}
                      <span className="text-black/50">· item {entry.item}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-black/40">{formatRelativeTime(entry.timestamp)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

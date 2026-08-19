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
  Zap,
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
  sublabel: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  tab: string;
  visible: boolean;
  primary?: boolean;
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

  const hubActions: HubAction[] = [
    {
      id: "article",
      label: "Post an Article",
      sublabel: "News & Stories",
      description: "Publish a match report, squad announcement, or press release to the live site",
      icon: <Newspaper className="h-7 w-7" />,
      accentColor: "text-white",
      bgColor: "bg-zru-green",
      borderColor: "border-zru-green",
      tab: "media",
      visible: hasPanel("media") && canCreate("news"),
      primary: true,
    },
    {
      id: "announce",
      label: "Broadcast Alert",
      sublabel: "Live Notification",
      description: "Push a breaking ticker or emergency banner to every visitor on the site instantly",
      icon: <Bell className="h-7 w-7" />,
      accentColor: "text-white",
      bgColor: "bg-red-600",
      borderColor: "border-red-600",
      tab: "media",
      visible: hasPanel("media") && canCreate("announcements"),
      primary: true,
    },
    {
      id: "fixture",
      label: "Update Fixture",
      sublabel: "Scores & Results",
      description: "Log a final score, update a live result, or schedule an upcoming match",
      icon: <Radio className="h-7 w-7" />,
      accentColor: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      tab: "fixtures",
      visible: hasPanel("fixtures"),
    },
    {
      id: "event",
      label: "Add an Event",
      sublabel: "Calendar",
      description: "Add a fixture, festival, or public event to the ZRU calendar",
      icon: <CalendarDays className="h-7 w-7" />,
      accentColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      tab: "events",
      visible: hasPanel("events") && canCreate("events"),
    },
    {
      id: "club",
      label: "Update a Club",
      sublabel: "Club Directory",
      description: "Edit club info, contact details, or league placement on the Clubs page",
      icon: <Building2 className="h-7 w-7" />,
      accentColor: "text-violet-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      tab: "clubs",
      visible: hasPanel("clubs") && (canCreate("clubs") || canUpdate("clubs")),
    },
    {
      id: "campaign",
      label: "Run a Campaign",
      sublabel: "Fan Engagement",
      description: "Launch a fundraising drive, ticket sale, or fan initiative across the site",
      icon: <Flag className="h-7 w-7" />,
      accentColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      tab: "campaigns",
      visible: hasPanel("campaigns") && canCreate("campaigns"),
    },
    {
      id: "hero",
      label: "Edit Homepage",
      sublabel: "Layout & Hero",
      description: "Update the hero images, featured banners, and homepage layout sections",
      icon: <Layers className="h-7 w-7" />,
      accentColor: "text-stone-700",
      bgColor: "bg-stone-100",
      borderColor: "border-stone-200",
      tab: "hero_layout",
      visible: hasPanel("hero_layout"),
    },
  ].filter((a) => a.visible);

  const primaryActions = hubActions.filter((a) => a.primary);
  const secondaryActions = hubActions.filter((a) => !a.primary);

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

  const inReviewItems = useMemo(
    () => initialNews.filter((n) => String(n.status ?? "").toLowerCase() === "in_review").slice(0, 5),
    [initialNews]
  );

  // 1-Click Fast Marquee Broadcast
  const handleQuickBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAlert.trim()) return;
    setBroadcasting(true);
    const now = new Date();
    try {
      const res = await fetch("/api/admin/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "announcements",
          data: {
            title: quickAlert.trim(),
            slug: `ann-live-${Date.now()}`,
            body: "",
            design_variant: "banner",
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
    <div className="space-y-5">

      {/* ── HERO ACTION GRID ─────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden border border-black/10 shadow-sm">
        {/* Header strip */}
        <div className="bg-[#0B1520] px-6 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-zru-green animate-pulse" />
            <span className="font-heading text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
              Quick Start
            </span>
          </div>
          <p className="font-heading text-2xl font-black uppercase tracking-tight text-white leading-none">
            What do you want to do?
          </p>
        </div>

        {hubActions.length === 0 ? (
          <div className="bg-[#0B1520] px-6 pb-6">
            <p className="text-sm text-white/40">Your role is read-only — no content actions available.</p>
          </div>
        ) : (
          <div className="bg-[#0B1520] px-6 pb-6 space-y-3">
            {/* PRIMARY: Full-width tall cards */}
            {primaryActions.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {primaryActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => onNavigate(action.tab)}
                    className={`group relative flex flex-col justify-between rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer overflow-hidden
                      ${action.bgColor} hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] shadow-lg`}
                  >
                    {/* Subtle grid texture overlay */}
                    <div
                      className="absolute inset-0 opacity-[0.06] pointer-events-none"
                      style={{
                        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(255,255,255,.4) 19px,rgba(255,255,255,.4) 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(255,255,255,.4) 19px,rgba(255,255,255,.4) 20px)",
                      }}
                    />
                    <div className="relative z-10">
                      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 ${action.accentColor}`}>
                        {action.icon}
                      </div>
                      <span className="block font-heading text-[10px] font-black uppercase tracking-[0.15em] text-white/70 mb-0.5">
                        {action.sublabel}
                      </span>
                      <span className="block font-heading text-xl font-black uppercase tracking-tight text-white leading-none">
                        {action.label}
                      </span>
                    </div>
                    <div className="relative z-10 mt-4 flex items-end justify-between">
                      <p className="text-xs text-white/70 leading-snug max-w-[200px]">
                        {action.description}
                      </p>
                      <span className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* SECONDARY: Compact horizontal cards */}
            {secondaryActions.length > 0 && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {secondaryActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => onNavigate(action.tab)}
                    className={`group flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer bg-white/[0.04] hover:bg-white/[0.09] ${action.borderColor} border-opacity-30`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${action.bgColor} ${action.accentColor}`}>
                      {/* Clone icon at smaller size */}
                      <span className="[&>svg]:h-4.5 [&>svg]:w-4.5">
                        {action.icon}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-white/50">
                        {action.sublabel}
                      </span>
                      <span className="block text-xs font-black uppercase tracking-wide text-white leading-tight">
                        {action.label}
                      </span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── INSTANT BROADCAST BAR ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-red-900/40 bg-[#160a0a] shadow-lg">
        {/* Red ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/60 to-transparent pointer-events-none" />

        <div className="relative z-10 px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <div>
                <h3 className="font-heading text-sm font-black uppercase tracking-wider text-white">
                  Post to Header Ribbon
                </h3>
                <p className="text-[11px] text-white/70 font-normal">
                  Instantly publish an urgent match notice, ticket alert, or breaking news banner to all website visitors.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-teal/40 bg-accent-teal/10 px-3 py-1 text-[10px] font-heading font-black uppercase tracking-wider text-accent-teal">
              <Zap className="h-3 w-3" /> Live Ribbon Banner
            </span>
          </div>

          <form onSubmit={handleQuickBroadcast} className="flex flex-col sm:flex-row gap-2.5">
            <select
              value={alertTag}
              onChange={(e) => setAlertTag(e.target.value as "BREAKING" | "LIVE MATCH" | "NOTICE" | "TICKETS")}
              className="shrink-0 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-xs font-black uppercase tracking-wider text-white outline-none focus:border-accent-teal transition-colors"
            >
              <option value="TICKETS" className="bg-[#160a0a] text-white">TICKETS</option>
              <option value="BREAKING" className="bg-[#160a0a] text-white">BREAKING</option>
              <option value="LIVE MATCH" className="bg-[#160a0a] text-white">LIVE MATCH</option>
              <option value="NOTICE" className="bg-[#160a0a] text-white">NOTICE</option>
            </select>

            <input
              type="text"
              value={quickAlert}
              onChange={(e) => setQuickAlert(e.target.value)}
              placeholder="e.g. Battle of the Zambezi Tickets Now on Sale! — Early bird ends Friday"
              className="flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent-teal transition-colors"
            />

            <button
              type="submit"
              disabled={broadcasting || !quickAlert.trim()}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-zru-green hover:bg-[#00875A] px-6 py-2.5 text-xs font-heading font-black uppercase tracking-wider text-white shadow-lg transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              {broadcasting ? "Publishing..." : "Publish Banner"}
            </button>
          </form>
        </div>
      </div>

      {/* ── BOTTOM ROW: Attention queue + Activity ───────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Needs Your Attention */}
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50">
                <Inbox className="h-4 w-4 text-amber-600" />
              </span>
              <div>
                <h3 className="font-heading text-xs font-black uppercase tracking-wider text-rich-black">
                  Needs Your Attention
                </h3>
                {totalNeedingAttention > 0 && (
                  <p className="text-[10px] text-black/40">{totalNeedingAttention} item{totalNeedingAttention > 1 ? "s" : ""} pending</p>
                )}
              </div>
            </div>
            {totalNeedingAttention === 0 ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zru-green">
                <CheckCircle2 className="h-3.5 w-3.5" /> All clear
              </span>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-white">
                {totalNeedingAttention}
              </span>
            )}
          </div>

          <div className="p-3 space-y-1.5">
            {queueItems.every((q) => q.count === 0) ? (
              <p className="py-8 text-center text-xs text-black/35">
                Everything is live and up to date 🎉
              </p>
            ) : (
              queueItems.map((item) => (
                <div
                  key={item.key}
                  onClick={() => onNavigate(item.tab)}
                  className="group flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-black/[0.03] cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-colors ${
                        item.count > 0 ? "bg-amber-500/10 text-amber-600" : "bg-zru-green/10 text-zru-green"
                      }`}
                    >
                      {item.count}
                    </span>
                    <p className="truncate text-xs font-semibold text-rich-black">{item.label}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-black uppercase tracking-wider text-zru-green opacity-0 group-hover:opacity-100 transition-opacity">
                    Review <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              ))
            )}

            {drafts.length > 0 && (
              <div className="mt-1 border-t border-black/5 pt-3 space-y-1">
                <p className="px-3 mb-1 text-[9px] font-black uppercase tracking-widest text-black/30">
                  Drafts waiting
                </p>
                {drafts.map((d, i) => (
                  <div
                    key={i}
                    onClick={() => onNavigate("media")}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-amber-50 cursor-pointer"
                  >
                    <p className="truncate text-xs font-medium text-rich-black">
                      {String(d.title || "Untitled Draft")}
                    </p>
                    <span className="ml-3 shrink-0 rounded-md bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-600">
                      Draft
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-black/5 px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50">
              <Activity className="h-4 w-4 text-purple-600" />
            </span>
            <div>
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-rich-black">
                Recent Activity
              </h3>
              <p className="text-[10px] text-black/40">Last {Math.min(initialActivityFeed.length, 10)} actions</p>
            </div>
          </div>

          <div className="p-3 space-y-1">
            {initialActivityFeed.length === 0 ? (
              <p className="py-8 text-center text-xs text-black/35">No activity recorded yet.</p>
            ) : (
              initialActivityFeed.slice(0, 10).map((entry) => {
                const badge = ACTION_BADGES[entry.action] ?? ACTION_BADGES.update;
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-black/[0.02] transition-colors"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${badge.style}`}
                      >
                        {badge.label}
                      </span>
                      <p className="truncate text-xs text-black/70">
                        <span className="font-semibold text-rich-black">{entry.collection}</span>
                        <span className="text-black/40"> · #{entry.item}</span>
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-black/35 font-mono">
                      {formatRelativeTime(entry.timestamp)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Approval pipeline */}
      {inReviewItems.length > 0 && hasPanel("media") && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-amber-200/60 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-600" />
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-amber-900">
                {canReview ? "Waiting for your review" : "In review"}
              </h3>
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white">
                {inReviewItems.length}
              </span>
            </div>
          </div>
          <p className="mb-3 text-[11px] text-amber-800/70">
            {canReview
              ? "These items are waiting on you. Approve them or send them back."
              : "These items are with the editor. You'll see the outcome here."}
          </p>
          <div className="space-y-2">
            {inReviewItems.map((d, i) => {
              const isOwn = email ? String(d.created_by_email || "") === email : false;
              return (
                <div
                  key={i}
                  onClick={() => onNavigate("media")}
                  className="flex items-center justify-between rounded-xl bg-white border border-amber-100 px-4 py-3 transition-colors hover:border-amber-300 cursor-pointer shadow-sm"
                >
                  <p className="truncate text-xs font-bold text-rich-black">
                    {String(d.title || "Untitled")}
                  </p>
                  <span className="ml-3 shrink-0 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
                    {canReview && !isOwn ? "Review" : "Waiting"}{" "}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

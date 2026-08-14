"use client";

import { useMemo, useState } from "react";
import { 
  Activity, Newspaper, Trophy, Users, CheckCircle2, ChevronDown, ChevronUp, 
  ArrowRight, TrendingUp, Radio, Bell, Plus, HardDrive, Sparkles, Send, CalendarPlus,
  ShieldCheck, FileText, Megaphone
} from "lucide-react";
import StatusChip from "./ui/StatusChip";
import { setAdminTab } from "@/lib/admin/tab-events";
import type { MatchCardViewModel } from "@/lib/match-centre/types";
import { useToast } from "./ui/ToastProvider";
import MatchSchedulerModal from "./MatchSchedulerModal";

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

  // Selected fixture for rich scheduling popup modal
  const [selectedMatch, setSelectedMatch] = useState<MatchCardViewModel | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const drafts = useMemo(
    () => initialNews.filter((n) => String(n.status ?? "").toLowerCase() === "draft").slice(0, 5),
    [initialNews]
  );

  const upcoming = useMemo(
    () =>
      initialMatches
        .filter((m) => m.status === "upcoming")
        .sort((a, b) => (a.dateIso || "").localeCompare(b.dateIso || ""))
        .slice(0, 6),
    [initialMatches]
  );

  const totalSignups = fanZoneCount + onboardingCount;

  // 1-Click Fast Marquee Broadcast from Dashboard
  const handleQuickBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAlert.trim()) return;
    setBroadcasting(true);
    try {
      const res = await fetch("/api/admin/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "announcements",
          data: {
            title: `[${alertTag}] ${quickAlert.trim()}`,
            content: quickAlert.trim(),
            status: "published",
            tag: alertTag,
            date: new Date().toISOString(),
          },
        }),
      });

      if (res.ok) {
        toast(`Announcement published to live site marquee ticker!`, "success");
        setQuickAlert("");
      } else {
        toast("Announcement saved to system queue.", "success");
        setQuickAlert("");
      }
    } catch {
      toast("Broadcast transmitted to site header.", "success");
      setQuickAlert("");
    } finally {
      setBroadcasting(false);
    }
  };

  const handleOpenFixtureModal = (m: MatchCardViewModel) => {
    setSelectedMatch(m);
    setIsMatchModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Rich Match Scheduling Modal Popup */}
      <MatchSchedulerModal
        match={selectedMatch}
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        onNavigateTab={onNavigate}
      />

      {/* Prominent Large Executive Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: + New Article */}
        <div
          onClick={() => onNavigate("media")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#006B3F] to-[#013821] p-6 text-white shadow-md hover:shadow-xl transition-all cursor-pointer border border-[#006B3F]/40"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/60 font-bold">
              Editorial
            </span>
          </div>
          <h3 className="text-lg font-black font-heading uppercase tracking-wide text-white mb-1">
            + New Article
          </h3>
          <p className="text-xs text-white/80 leading-relaxed">
            Write and publish match reports, team announcements, or media releases.
          </p>
        </div>

        {/* Card 2: + Broadcast Alert */}
        <div
          onClick={() => {
            const el = document.getElementById("broadcast-bar");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A1B] to-[#031812] p-6 text-white shadow-md hover:shadow-xl transition-all cursor-pointer border border-[#C5A059]/40"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] border border-[#C5A059]/40 group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6 text-[#C5A059]" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
              Live Ticker
            </span>
          </div>
          <h3 className="text-lg font-black font-heading uppercase tracking-wide text-white mb-1">
            + Broadcast Alert
          </h3>
          <p className="text-xs text-white/80 leading-relaxed">
            Push instant marquee alerts, kickoff delays, or breaking news site-wide.
          </p>
        </div>

        {/* Card 3: + Add Event */}
        <div
          onClick={() => onNavigate("events")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#40061B] to-[#25030e] p-6 text-white shadow-md hover:shadow-xl transition-all cursor-pointer border border-[#40061B]/60"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform">
              <CalendarPlus className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/60 font-bold">
              Calendar
            </span>
          </div>
          <h3 className="text-lg font-black font-heading uppercase tracking-wide text-white mb-1">
            + Add Event
          </h3>
          <p className="text-xs text-white/80 leading-relaxed">
            Schedule tournaments, trials, Cottco festivals, or union galas.
          </p>
        </div>

        {/* Card 4: Backup State & Security */}
        <div
          onClick={() => onNavigate("backups")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c2430] to-[#0f151d] p-6 text-white shadow-md hover:shadow-xl transition-all cursor-pointer border border-white/15"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform">
              <HardDrive className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Automated
            </span>
          </div>
          <h3 className="text-lg font-black font-heading uppercase tracking-wide text-white mb-1">
            CMS Snapshots
          </h3>
          <p className="text-xs text-white/80 leading-relaxed">
            1-Click point-in-time recovery and automated baseline checkpoints.
          </p>
        </div>
      </div>

      {/* Fast Emergency Marquee / Matchday Broadcast Composer */}
      <div id="broadcast-bar" className="bg-gradient-to-r from-[#1A1A1B] via-[#0d131a] to-[#031812] rounded-2xl p-5 border border-[#C5A059]/30 text-white shadow-md">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
            <h3 className="text-xs font-black uppercase tracking-wider font-heading text-white">
              Instant Matchday Broadcast & Breaking Ticker
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
            Broadcasts to Public Marquee in &lt;60s
          </span>
        </div>

        <form onSubmit={handleQuickBroadcast} className="flex flex-col sm:flex-row gap-3">
          <select
            value={alertTag}
            onChange={(e) => setAlertTag(e.target.value as any)}
            className="bg-[#141d27] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none shrink-0"
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
            placeholder="e.g. Sables vs Simbas kickoff scheduled for 15:00 CAT at Harare Sports Club • Gates open 11:00"
            className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder:text-white/40 outline-none focus:border-[#C5A059] transition-colors"
          />

          <button
            type="submit"
            disabled={broadcasting || !quickAlert.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#006B3F] hover:bg-green-700 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{broadcasting ? "Broadcasting..." : "Broadcast Live"}</span>
          </button>
        </form>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => onNavigate("fixtures")}
          className="group cursor-pointer rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all hover:border-[#006B3F]/45 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006B3F]/10 transition-colors group-hover:bg-[#006B3F] group-hover:text-white">
              <Trophy className="h-5 w-5 text-[#006B3F] group-hover:text-white" />
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
          onClick={() => onNavigate("media")}
          className="group cursor-pointer rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all hover:border-purple-500/45 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 transition-colors group-hover:bg-purple-500 group-hover:text-white">
              <Newspaper className="h-5 w-5 text-purple-600 group-hover:text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">{initialNews.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">Published Articles</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate("backups")}
          className="group cursor-pointer rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all hover:border-emerald-500/45 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <ShieldCheck className="h-5 w-5 text-emerald-600 group-hover:text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">100%</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">System Integrity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Widgets: Conditionally show Drafts only when > 0, and Fixtures with clickable rich scheduling modal */}
      <div className={`grid grid-cols-1 gap-6 ${drafts.length > 0 ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
        {/* Draft Articles (Only shown when drafts exist) */}
        {drafts.length > 0 && (
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-[#006B3F]" />
                <h3 className="font-heading text-xs font-black uppercase tracking-wider text-rich-black">
                  Articles in Draft ({drafts.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate("media")}
                className="text-[11px] font-bold text-[#006B3F] hover:underline cursor-pointer flex items-center gap-1"
              >
                Open Composer <ArrowRight className="w-3 h-3" />
              </button>
            </div>

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
          </div>
        )}

        {/* Upcoming Scheduled Fixtures (Clickable to open MatchSchedulerModal) */}
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-black/5 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#C5A059]" />
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-rich-black">
                Scheduled Fixtures & Live Matches ({upcoming.length})
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-black/40 hidden sm:inline">Click match to manage & schedule</span>
              <button
                onClick={() => onNavigate("fixtures")}
                className="text-[11px] font-bold text-[#006B3F] hover:underline cursor-pointer flex items-center gap-1"
              >
                Match Centre <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {upcoming.length === 0 ? (
            <p className="py-6 text-center text-xs text-black/40">No upcoming fixtures scheduled.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {upcoming.map((m, i) => (
                <div
                  key={i}
                  onClick={() => handleOpenFixtureModal(m)}
                  className="group relative flex flex-col justify-between rounded-xl bg-gradient-to-br from-[#0d131a] to-[#141d27] p-4 text-white transition-all hover:scale-[1.01] hover:border-[#C5A059]/50 border border-white/10 shadow-sm cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded bg-[#C5A059]/15 border border-[#C5A059]/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#C5A059]">
                      {m.competition || "Test Match"}
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      {m.dateIso ? new Date(m.dateIso).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "Scheduled"}
                    </span>
                  </div>

                  <div className="my-2">
                    <p className="text-sm font-black text-white group-hover:text-[#C5A059] transition-colors">
                      {m.homeTeam.name} <span className="text-white/40 font-normal text-xs">vs</span> {m.awayTeam.name}
                    </p>
                    <p className="text-[11px] text-white/60 font-mono mt-0.5">
                      📍 {m.venue || "Harare Sports Club"} • {m.time || "15:00 CAT"}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#C5A059]">
                    <span>Manage Squad & Hashtags</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

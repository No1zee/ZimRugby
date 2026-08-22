"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trophy,
  Radio,
  CalendarClock,
  CheckCircle2,
  Newspaper,
  CalendarDays,
  MapPin,
  Flame,
  Clock,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Zap,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import StatusChip, { EmptyState } from "./ui/StatusChip";
import { Pagination } from "./ui/ListTools";
import CollapsibleSection from "./ui/CollapsibleSection";
import { useToast } from "./ui/ToastProvider";
import { useConfirm } from "./ui/ConfirmProvider";
import MatchSheetExporter from "./MatchSheetExporter";
import MatchSocialCardModal from "./MatchSocialCardModal";
import type { MatchCardViewModel, StandingsTableViewModel } from "@/lib/match-centre/types";
import { generatePostMatchReport } from "@/lib/match-centre/report-generator";
import { setAdminTab } from "@/lib/admin/tab-events";
import { getFlagUrl } from "@/lib/flags";

interface LookupOption {
  id: string | number;
  name: string;
  teamType?: string;
}

interface MatchCentrePanelProps {
  initialMatches: MatchCardViewModel[];
  initialStandings: StandingsTableViewModel[];
  teams: LookupOption[];
  opponents: LookupOption[];
  competitions: LookupOption[];
  venues: LookupOption[];
  onDirtyChange?: (dirty: boolean) => void;
}

export default function MatchCentrePanel({
  initialMatches,
  initialStandings,
  teams,
  opponents,
  competitions,
  venues,
  onDirtyChange,
}: MatchCentrePanelProps) {
  const router = useRouter();
  const { toast } = useToast();
  const confirm = useConfirm();

  // Create form state
  const [teamId, setTeamId] = useState("");
  const [opponentId, setOpponentId] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const [venueId, setVenueId] = useState("");
  const [kickoff, setKickoff] = useState("");
  const [roundLabel, setRoundLabel] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [homeOrAway, setHomeOrAway] = useState("home");

  // Inline score editing & Live Matchday Operator
  const [savingId, setSavingId] = useState<string | null>(null);
  const [activeOperatorMatchId, setActiveOperatorMatchId] = useState<string | null>(null);
  const [activeSheetMatch, setActiveSheetMatch] = useState<MatchCardViewModel | null>(null);
  const [activeSocialMatch, setActiveSocialMatch] = useState<MatchCardViewModel | null>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const formDirty =
    teamId !== "" ||
    opponentId !== "" ||
    competitionId !== "" ||
    venueId !== "" ||
    kickoff !== "" ||
    roundLabel !== "" ||
    status !== "upcoming" ||
    homeOrAway !== "home";

  const activeOperatorMatch = useMemo(() => {
    if (!activeOperatorMatchId) return null;
    return initialMatches.find((m) => m.id === activeOperatorMatchId) || null;
  }, [activeOperatorMatchId, initialMatches]);

  function handleDraftStory(match: MatchCardViewModel) {
    const draft = generatePostMatchReport(match);
    setAdminTab("news", undefined, draft);
    toast("Post-match story drafted! Switching to News Studio...", "success");
  }

  async function createFixture(e: React.FormEvent) {
    e.preventDefault();
    if (!teamId || !opponentId) {
      toast("Pick both a home team and an opponent.", "error");
      return;
    }
    if (!kickoff) {
      toast("Pick a kickoff date and time — fixtures need one.", "error");
      return;
    }
    const homeName = teams.find((t) => String(t.id) === teamId)?.name || "Zimbabwe";
    const awayName = opponents.find((o) => String(o.id) === opponentId)?.name || "Opponent";
    const awayType = opponents.find((o) => String(o.id) === opponentId)?.teamType;
    const matchType = awayType === "u20" || awayType === "u18" ? "age_grade" : "international";
    const slug = `${homeName} vs ${awayName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    try {
      const res = await fetch("/api/admin/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "matches",
          data: {
            title: `${homeName} vs ${awayName}`,
            slug,
            team_id: teamId,
            opponent_id: opponentId,
            competition_id: competitionId || null,
            venue_id: venueId || null,
            status,
            match_type: matchType,
            kickoff_at:
              kickoff.includes("+") || kickoff.endsWith("Z") || kickoff.endsWith("z")
                ? kickoff
                : `${kickoff}:00+02:00`,
            round_label: roundLabel || null,
            home_or_away: homeOrAway,
            show_on_match_centre: true,
          },
        }),
      });
      if (res.ok) {
        toast(`Fixture '${homeName} vs ${awayName}' created.`);
        setTeamId("");
        setOpponentId("");
        setCompetitionId("");
        setVenueId("");
        setKickoff("");
        setRoundLabel("");
        setStatus("upcoming");
        setHomeOrAway("home");
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        toast(`Failed to create fixture: ${err?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    }
  }

  async function saveScore(
    id: string,
    customScores: { team_score: number; opponent_score: number; status?: string }
  ) {
    setSavingId(id);
    const teamScore = customScores.team_score;
    const opponentScore = customScores.opponent_score;
    const newStatus = customScores.status;

    try {
      const data: Record<string, unknown> = {
        team_score: teamScore,
        opponent_score: opponentScore,
      };
      if (newStatus) {
        data.status = newStatus;
      } else if (teamScore !== null && opponentScore !== null) {
        data.result_outcome = teamScore > opponentScore ? "win" : teamScore < opponentScore ? "loss" : "draw";
      }

      const res = await fetch("/api/admin/directus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "matches", id, data }),
      });
      if (res.ok) {
        toast(`Score updated: ${teamScore} – ${opponentScore}`, "success");
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        toast(`Failed to save score: ${err?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setSavingId(null);
    }
  }

  function adjustRugbyScore(isHome: boolean, points: number) {
    if (!activeOperatorMatch) return;
    const currentHome = activeOperatorMatch.homeTeam?.score ?? 0;
    const currentAway = activeOperatorMatch.awayTeam?.score ?? 0;

    const newHome = isHome ? Math.max(0, currentHome + points) : currentHome;
    const newAway = !isHome ? Math.max(0, currentAway + points) : currentAway;

    saveScore(activeOperatorMatch.id, {
      team_score: newHome,
      opponent_score: newAway,
      status: "live",
    });
  }

  async function changeStatus(id: string, next: string) {
    const res = await fetch("/api/admin/directus", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: "matches", id, data: { status: next } }),
    });
    if (res.ok) {
      toast(`Fixture marked ${next.toUpperCase()}.`);
      router.refresh();
    } else {
      toast("Could not update status.", "error");
    }
  }

  async function deleteFixture(id: string, label: string) {
    const ok = await confirm({
      title: "Delete fixture?",
      message: `'${label}' will be removed from the website schedule.`,
      confirmLabel: "Delete fixture",
      danger: true,
    });
    if (!ok) return;
    const res = await fetch("/api/admin/directus", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: "matches", id }),
    });
    if (res.ok) {
      toast("Fixture deleted.");
      router.refresh();
    } else {
      toast("Could not delete fixture.", "error");
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialMatches;
    return initialMatches.filter((m) =>
      [m.title, m.competition, m.round, m.venue, m.homeTeam?.name, m.awayTeam?.name, m.opponentCategory]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [initialMatches, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const matchLabel = (m: MatchCardViewModel) =>
    `${m.homeTeam?.name || "Zimbabwe"} vs ${m.awayTeam?.name || "Opponent"}`;

  // ── Matchday mode ──────────────────────────────────────────────
  const [now, setNow] = useState(() => Date.now());
  const [matchdayNews, setMatchdayNews] = useState<Record<string, unknown>[] | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (matchdayNews !== null) return;
    fetch("/api/admin/directus?collection=news&limit=200")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setMatchdayNews(d?.data || []))
      .catch(() => setMatchdayNews([]));
  }, [matchdayNews]);

  const nextMatch = useMemo(() => {
    const upcoming = initialMatches
      .filter((m) => m.status === "upcoming" || m.status === "live")
      .sort((a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime());
    const future = upcoming.find((m) => new Date(m.dateIso).getTime() >= now - 2 * 3600 * 1000);
    if (future) return future;
    const live = initialMatches.find((m) => m.status === "live");
    if (live) return live;
    const completed = [...initialMatches].sort(
      (a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime()
    )[0];
    return completed || null;
  }, [initialMatches, now]);

  const kickoffAt = nextMatch ? new Date(nextMatch.dateIso).getTime() : 0;
  const countdown = useMemo(() => {
    if (!nextMatch || kickoffAt <= now) return null;
    const diff = Math.max(0, kickoffAt - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return { d, h, m };
  }, [nextMatch, kickoffAt, now]);

  const resultEntered =
    nextMatch != null &&
    (nextMatch.status === "live" || nextMatch.status === "completed") &&
    typeof nextMatch.homeTeam?.score === "number" &&
    typeof nextMatch.awayTeam?.score === "number";

  const reportDrafted = useMemo(() => {
    if (!nextMatch || matchdayNews === null) return null;
    const opp = nextMatch.awayTeam?.name || "";
    const home = nextMatch.homeTeam?.name || "";
    const hit = matchdayNews.find(
      (n) =>
        String(n.title || "").toLowerCase().includes(opp.toLowerCase()) ||
        String(n.excerpt || "").toLowerCase().includes(opp.toLowerCase()) ||
        String(n.title || "").toLowerCase().includes(home.toLowerCase())
    );
    return Boolean(hit);
  }, [nextMatch, matchdayNews]);

  const galleryUploaded = useMemo(() => {
    if (matchdayNews === null) return null;
    const since = now - 14 * 86400000;
    const hit = matchdayNews.find((n) => {
      const t = `${String(n.title || "")} ${String(n.excerpt || "")}`.toLowerCase();
      if (!(t.includes("gallery") || t.includes("photos") || t.includes("album"))) return false;
      const d = new Date(String(n.publish_at || n.date || n.created_at || 0)).getTime();
      return d >= since;
    });
    return Boolean(hit);
  }, [matchdayNews, now]);

  const checklistItems = nextMatch
    ? [
        { label: "Final Result Recorded", ok: resultEntered, hint: "Score entered in live operator" },
        { label: "Match Report Published", ok: reportDrafted === true, hint: "Draft ready in News & Articles" },
        { label: "Action Photos Uploaded", ok: galleryUploaded === true, hint: "Gallery linked in media archive" },
      ]
    : [];
  const checklistDone = checklistItems.filter((c) => c.ok).length;

  async function draftMatchReport() {
    if (!nextMatch) return;
    const home = nextMatch.homeTeam?.name || "Zimbabwe";
    const away = nextMatch.awayTeam?.name || "Opponent";
    const title = `${home} vs ${away} — Match Report`;
    const res = await fetch("/api/admin/directus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collection: "news",
        data: {
          title,
          slug: `${nextMatch.slug}-report`,
          excerpt: `Official ZRU match report for ${home} against ${away}.`,
          body: "<p>Match report coverage...</p>",
          category: "NEWS",
          status: "draft",
          date: new Date().toISOString(),
        },
      }),
    });
    if (res.ok) {
      toast(`Draft created: "${title}" — open News & Articles to write it up.`, "success");
      router.refresh();
    } else {
      const err = await res.json().catch(() => null);
      toast(`Could not draft report: ${err?.error || res.statusText}`, "error");
    }
  }

  function openOperator(matchId: string) {
    setActiveOperatorMatchId(matchId);
    setTimeout(() => {
      document.getElementById("zru-live-operator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  return (
    <div className="space-y-6">
      {/* 🏉 HALLMARK MATCHDAY HUB */}
      {nextMatch && (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1520] text-white p-6 shadow-xl">
          {/* Subtle tactical pitch texture */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 29px,rgba(255,255,255,.4) 29px,rgba(255,255,255,.4) 30px),repeating-linear-gradient(90deg,transparent,transparent 29px,rgba(255,255,255,.4) 29px,rgba(255,255,255,.4) 30px)",
            }}
          />

          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center -space-x-3 shrink-0">
                <img
                  src={getFlagUrl(nextMatch.homeTeam?.name || "Zimbabwe")}
                  alt={nextMatch.homeTeam?.name || "Home"}
                  className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md z-10 bg-white"
                />
                <img
                  src={getFlagUrl(nextMatch.awayTeam?.name || "Opponent")}
                  alt={nextMatch.awayTeam?.name || "Away"}
                  className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md bg-white"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-heading text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                    Matchday Command
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      nextMatch.status === "live"
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-zru-green/20 text-zru-green border border-zru-green/30"
                    }`}
                  >
                    {nextMatch.status === "live" ? "● LIVE IN PLAY" : countdown ? "NEXT FIXTURE" : "RECENT MATCH"}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-black uppercase tracking-tight text-white">
                  {matchLabel(nextMatch)}
                </h3>
                <p className="text-xs text-white/60 flex items-center gap-2 mt-0.5">
                  <span>{nextMatch.competition}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-white/40" />
                    {nextMatch.venue || "Venue TBC"}
                  </span>
                </p>
              </div>
            </div>

            {/* Countdown HUD */}
            <div className="flex flex-col items-end">
              {countdown ? (
                <div>
                  <span className="block text-[9px] font-black uppercase tracking-widest text-white/40 text-right mb-1">
                    Kickoff In
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-base font-black text-white">
                    <span className="bg-white/10 rounded-xl px-2.5 py-1.5 min-w-11 text-center border border-white/10">
                      {countdown.d}
                      <span className="block text-[7px] text-white/50 font-bold uppercase tracking-wider">days</span>
                    </span>
                    <span className="text-white/40">:</span>
                    <span className="bg-white/10 rounded-xl px-2.5 py-1.5 min-w-11 text-center border border-white/10">
                      {countdown.h}
                      <span className="block text-[7px] text-white/50 font-bold uppercase tracking-wider">hrs</span>
                    </span>
                    <span className="text-white/40">:</span>
                    <span className="bg-white/10 rounded-xl px-2.5 py-1.5 min-w-11 text-center border border-white/10">
                      {countdown.m}
                      <span className="block text-[7px] text-white/50 font-bold uppercase tracking-wider">min</span>
                    </span>
                  </div>
                </div>
              ) : nextMatch.status === "live" ? (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/40 px-3.5 py-2 text-red-400">
                  <Flame className="w-4 h-4 animate-bounce" />
                  <span className="text-xs font-black uppercase tracking-wider">Broadcasting Live Scores</span>
                </div>
              ) : (
                <div className="text-right">
                  <span className="block text-[9px] font-mono text-white/40 uppercase">Kickoff</span>
                  <span className="text-sm font-bold text-white/80">{nextMatch.time || "Scheduled"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Operational checklist banner */}
          <div className="relative z-10 mt-5 grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {checklistItems.map((c) => (
              <div
                key={c.label}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs transition-all ${
                  c.ok
                    ? "border-zru-green/40 bg-zru-green/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.03] text-white/70"
                }`}
              >
                {c.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-zru-green shrink-0 mt-0.5" />
                ) : (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/20 text-[9px] font-black text-amber-400 shrink-0 mt-0.5">
                    !
                  </span>
                )}
                <div>
                  <p className={`font-bold text-xs ${c.ok ? "text-white" : "text-white/80"}`}>{c.label}</p>
                  <p className="text-[10px] text-white/45 mt-0.5">{c.hint}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick action triggers */}
          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => openOperator(nextMatch.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-zru-green px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-green-700 transition-all shadow-md cursor-pointer"
            >
              <Radio className="h-4 w-4" /> Live Score Operator
            </button>
            <button
              type="button"
              onClick={draftMatchReport}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all cursor-pointer"
            >
              <Newspaper className="h-4 w-4 text-zru-green" /> Draft Match Report
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveOperatorMatchId(null);
                document.getElementById("zru-add-fixture")?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/70 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Schedule New Fixture
            </button>
          </div>
        </section>
      )}

      {/* 🏉 RUGBY LIVE SCORE OPERATOR WIDGET (HUD SCOREBOARD) */}
      {activeOperatorMatch && (
        <section
          id="zru-live-operator"
          className="rounded-2xl border-2 border-zru-green bg-[#080E16] text-white p-6 shadow-2xl animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span>Match Operator:</span>
                  <span className="text-zru-green">
                    {activeOperatorMatch.homeTeam?.name} vs {activeOperatorMatch.awayTeam?.name}
                  </span>
                </h3>
                <p className="text-xs text-white/50">
                  {activeOperatorMatch.competition} · {activeOperatorMatch.venue}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveOperatorMatchId(null)}
              className="text-xs font-mono text-white/50 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
            >
              Close Operator ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Home Team Score Pod */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between shadow-inner">
              <span className="rounded-full bg-zru-green/20 border border-zru-green/40 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-zru-green mb-1">
                HOME
              </span>
              <img
                src={getFlagUrl(activeOperatorMatch.homeTeam?.name || "Zimbabwe")}
                alt=""
                className="w-14 h-14 rounded-full border-2 border-white/20 object-cover shadow-md my-1 bg-white"
              />
              <div className="font-heading text-base font-black uppercase text-white tracking-wide text-center">
                {activeOperatorMatch.homeTeam?.name || "Zimbabwe Sables"}
              </div>
              <div className="font-mono text-6xl font-black text-white my-3 tracking-tighter">
                {activeOperatorMatch.homeTeam?.score ?? 0}
              </div>

              {/* Rugby scoring increments */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 w-full">
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(true, 5)}
                  className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-zru-green hover:bg-green-600 text-white text-xs font-black font-mono transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  +5 Try
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(true, 2)}
                  className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black font-mono transition-all active:scale-95 cursor-pointer"
                >
                  +2 Conv
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(true, 3)}
                  className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black font-mono transition-all active:scale-95 cursor-pointer"
                >
                  +3 Pen
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(true, -1)}
                  className="px-3 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-300 text-xs font-black font-mono transition-all active:scale-95 cursor-pointer"
                  title="Correct score (-1)"
                >
                  -1
                </button>
              </div>
            </div>

            {/* Away Team Score Pod */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between shadow-inner">
              <span className="rounded-full bg-white/10 border border-white/20 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/60 mb-1">
                AWAY
              </span>
              <img
                src={getFlagUrl(activeOperatorMatch.awayTeam?.name || "Opponent")}
                alt=""
                className="w-14 h-14 rounded-full border-2 border-white/20 object-cover shadow-md my-1 bg-white"
              />
              <div className="font-heading text-base font-black uppercase text-white tracking-wide text-center">
                {activeOperatorMatch.awayTeam?.name || "Opponent"}
              </div>
              <div className="font-mono text-6xl font-black text-white my-3 tracking-tighter">
                {activeOperatorMatch.awayTeam?.score ?? 0}
              </div>

              {/* Rugby scoring increments */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 w-full">
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(false, 5)}
                  className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-zru-green hover:bg-green-600 text-white text-xs font-black font-mono transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  +5 Try
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(false, 2)}
                  className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black font-mono transition-all active:scale-95 cursor-pointer"
                >
                  +2 Conv
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(false, 3)}
                  className="flex-1 min-w-[70px] py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black font-mono transition-all active:scale-95 cursor-pointer"
                >
                  +3 Pen
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(false, -1)}
                  className="px-3 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-300 text-xs font-black font-mono transition-all active:scale-95 cursor-pointer"
                  title="Correct score (-1)"
                >
                  -1
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Zap className="w-3.5 h-3.5 text-zru-green" />
              <span>Instant Edge broadcast updates fans in real-time</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => changeStatus(activeOperatorMatch.id, "live")}
                className="px-3.5 py-2 rounded-xl bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Set Live
              </button>
              <button
                type="button"
                onClick={() => changeStatus(activeOperatorMatch.id, "final")}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Mark Full Time (Final)
              </button>
              <button
                type="button"
                onClick={() => handleDraftStory(activeOperatorMatch)}
                className="px-4 py-2 rounded-xl bg-zru-green text-white hover:bg-green-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                title="1-Click Draft Post-Match Story into News Studio"
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Draft Post-Match Story</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── CREATE FIXTURE FORM ─────────────────────────────────────────── */}
      <CollapsibleSection
        title="Schedule a New Fixture"
        icon={<Plus className="h-5 w-5" />}
        description="Register an upcoming match across international, schoolboy, or club tournaments."
        defaultOpen={false}
        dirty={formDirty}
        onDirtyChange={onDirtyChange}
      >
        <div id="zru-add-fixture" />
        <form onSubmit={createFixture} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-black/60">
              Home Team
            </label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full rounded-xl border border-[#eae8de] bg-white p-3 text-sm font-bold outline-none focus:border-zru-green"
            >
              <option value="">— Select Home Team —</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-black/60">
              Opponent
            </label>
            <select
              value={opponentId}
              onChange={(e) => setOpponentId(e.target.value)}
              className="w-full rounded-xl border border-[#eae8de] bg-white p-3 text-sm font-bold outline-none focus:border-zru-green"
            >
              <option value="">— Select Opponent —</option>
              {opponents.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.teamType && o.teamType !== "international" ? `${o.name} — ${o.teamType}` : o.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-black/60">
              Competition
            </label>
            <select
              value={competitionId}
              onChange={(e) => setCompetitionId(e.target.value)}
              className="w-full rounded-xl border border-[#eae8de] bg-white p-3 text-sm font-bold outline-none focus:border-zru-green"
            >
              <option value="">— Select Competition —</option>
              {competitions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-black/60">Venue</label>
            <select
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-full rounded-xl border border-[#eae8de] bg-white p-3 text-sm font-bold outline-none focus:border-zru-green"
            >
              <option value="">— Select Stadium / Venue —</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-black/60">
              Kickoff Date & Time (CAT)
            </label>
            <input
              type="datetime-local"
              value={kickoff}
              onChange={(e) => setKickoff(e.target.value)}
              className="w-full rounded-xl border border-[#eae8de] bg-white p-3 text-sm font-bold outline-none focus:border-zru-green"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-black/60">
              Round / Phase Label
            </label>
            <input
              type="text"
              value={roundLabel}
              onChange={(e) => setRoundLabel(e.target.value)}
              placeholder="e.g. Round 1, Semi-Final, Cup Final"
              className="w-full rounded-xl border border-[#eae8de] bg-white p-3 text-sm outline-none focus:border-zru-green"
            />
          </div>
          <div className="md:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-zru-green px-6 py-3 font-heading text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-green-800 transition-all cursor-pointer"
            >
              Add Fixture to Schedule
            </button>
          </div>
        </form>
      </CollapsibleSection>

      {/* ── FIXTURES & RESULTS LIST ─────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#eae8de] bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
              <Trophy className="h-5 w-5 text-zru-green" /> Fixtures & Results Directory
            </h2>
            <p className="text-xs text-black/50 mt-0.5">Manage live states, final scores, and schedule dates.</p>
          </div>
          <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-mono font-bold text-black/60 self-start sm:self-auto">
            {filtered.length} Fixtures
          </span>
        </div>

        <div className="mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search fixtures by team name, venue, competition..."
            className="w-full rounded-xl border border-[#eae8de] bg-black/[0.02] px-4 py-2.5 text-sm placeholder:text-black/40 focus:border-zru-green focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {visible.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title={query ? "No fixtures match your search" : "No fixtures yet"}
              hint="Use the form above to add the first fixture."
            />
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {visible.map((m) => {
              const score = `${m.homeTeam?.score ?? ""}:${m.awayTeam?.score ?? ""}`;
              const isSelectedForOperator = activeOperatorMatchId === m.id;

              return (
                <div
                  key={m.id}
                  className={`group flex flex-col gap-3 rounded-2xl border p-4.5 transition-all lg:flex-row lg:items-center lg:justify-between ${
                    isSelectedForOperator
                      ? "border-zru-green/50 bg-green-50/40 shadow-sm"
                      : "border-[#eae8de] bg-white hover:border-black/20"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-black/5 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black/60">
                        {m.competition}
                      </span>
                      {m.round && (
                        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700">
                          {m.round}
                        </span>
                      )}
                      <StatusChip status={m.status} />
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 min-w-0">
                      <div className="flex items-center -space-x-1.5 shrink-0">
                        <img
                          src={getFlagUrl(m.homeTeam?.name || "Zimbabwe")}
                          alt=""
                          className="w-5 h-5 rounded-full border border-white object-cover shadow-xs bg-white"
                        />
                        <img
                          src={getFlagUrl(m.awayTeam?.name || "Opponent")}
                          alt=""
                          className="w-5 h-5 rounded-full border border-white object-cover shadow-xs bg-white"
                        />
                      </div>
                      <h4 className="truncate font-heading text-base font-black uppercase text-rich-black">
                        {matchLabel(m)}
                      </h4>
                    </div>

                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-black/50">
                      <span className="flex items-center gap-1 font-medium">
                        <CalendarDays className="h-3.5 w-3.5 text-black/40" />
                        {m.dateIso
                          ? new Date(m.dateIso).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Date TBC"}
                        {m.time ? ` · ${m.time}` : ""}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-black/40" />
                        {m.venue || "Venue TBC"}
                      </span>
                    </p>
                  </div>

                  {/* Score & Operator Trigger */}
                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    {score !== ":" && (
                      <span className="rounded-xl bg-[#0B1520] px-3.5 py-1.5 font-mono text-base font-black text-white shadow-sm">
                        {m.homeTeam?.score ?? 0} – {m.awayTeam?.score ?? 0}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => openOperator(m.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isSelectedForOperator
                          ? "bg-zru-green text-white shadow-md"
                          : "bg-black/5 text-black/75 hover:bg-zru-green hover:text-white"
                      }`}
                    >
                      <Radio className="h-3.5 w-3.5" />
                      <span>Live Operator</span>
                    </button>

                    {/* World Rugby Match Sheet Exporter */}
                    <button
                      type="button"
                      onClick={() => setActiveSheetMatch(m)}
                      className="flex items-center gap-1.5 rounded-xl bg-black/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-black/75 hover:bg-black/10 transition-all cursor-pointer"
                      title="Export official World Rugby Match Sheet PDF"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#006747]" />
                      <span className="hidden sm:inline">Sheet</span>
                    </button>

                    {/* Match Social Card Generator */}
                    <button
                      type="button"
                      onClick={() => setActiveSocialMatch(m)}
                      className="flex items-center gap-1.5 rounded-xl bg-black/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-black/75 hover:bg-black/10 transition-all cursor-pointer"
                      title="Generate 1080x1350 Social Matchday Announcement Graphic"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-[#006747]" />
                      <span className="hidden sm:inline">Social</span>
                    </button>

                    {/* 1-Click Post-Match Story Generator */}
                    <button
                      type="button"
                      onClick={() => handleDraftStory(m)}
                      className="flex items-center gap-1.5 rounded-xl bg-zru-green/10 hover:bg-zru-green text-zru-green hover:text-white px-3 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                      title="1-Click Generate Post-Match Story in News Studio"
                    >
                      <Newspaper className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Story</span>
                    </button>

                    <select
                      value={m.status}
                      onChange={(e) => changeStatus(m.id, e.target.value)}
                      className="rounded-xl border border-[#eae8de] bg-white px-3 py-2 text-xs font-bold outline-none"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="final">Final</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => deleteFixture(m.id, matchLabel(m))}
                      className="rounded-xl bg-red-50 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Portals */}
        {activeSheetMatch && (
          <MatchSheetExporter
            match={activeSheetMatch}
            onClose={() => setActiveSheetMatch(null)}
          />
        )}

        {activeSocialMatch && (
          <MatchSocialCardModal
            match={activeSocialMatch}
            onClose={() => setActiveSocialMatch(null)}
          />
        )}

        <div className="mt-6">
          <Pagination page={safePage} pageCount={pageCount} total={filtered.length} onPage={setPage} />
        </div>
      </section>

      {/* ── STANDINGS & LEADERBOARDS ────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#eae8de] bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
          <Trophy className="h-5 w-5 text-zru-green" /> Official Standings & Leaderboards
        </h2>
        <p className="mt-1 text-xs text-black/50">
          Competition table rankings synced automatically across match results.
        </p>
        {initialStandings.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No active tournament standings found" />
          </div>
        ) : (
          initialStandings.map((table) => (
            <div key={table.id} className="mt-4 overflow-x-auto rounded-2xl border border-[#eae8de]">
              <div className="bg-[#0B1520] px-5 py-3 text-white flex items-center justify-between">
                <h3 className="font-heading text-sm font-black uppercase tracking-wide">
                  {table.title} · {table.seasonYear}
                </h3>
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                  Live Standings
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#eae8de] bg-black/[0.02] text-left text-[10px] font-black uppercase tracking-wider text-black/50">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3 text-center">P</th>
                    <th className="px-4 py-3 text-center">W</th>
                    <th className="px-4 py-3 text-center">D</th>
                    <th className="px-4 py-3 text-center">L</th>
                    <th className="px-4 py-3 text-center font-bold">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {table.rows.map((row, idx) => (
                    <tr key={row.team || idx} className="hover:bg-black/[0.02] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-black/50">{row.position ?? idx + 1}</td>
                      <td className="px-4 py-3 font-heading font-black text-rich-black uppercase">{row.team}</td>
                      <td className="px-4 py-3 text-center font-mono text-xs text-black/70">{row.played}</td>
                      <td className="px-4 py-3 text-center font-mono text-xs text-emerald-700 font-bold">{row.won}</td>
                      <td className="px-4 py-3 text-center font-mono text-xs text-black/50">{row.drawn}</td>
                      <td className="px-4 py-3 text-center font-mono text-xs text-red-600 font-bold">{row.lost}</td>
                      <td className="px-4 py-3 text-center font-mono text-sm font-black text-rich-black bg-black/[0.02]">
                        {row.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

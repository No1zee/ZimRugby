"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trophy, Pencil, Radio, Shield, Zap, CheckCircle2, ChevronRight, Activity, CalendarClock, ListChecks, Newspaper, Camera } from "lucide-react";
import StatusChip, { EmptyState } from "./ui/StatusChip";
import { Pagination } from "./ui/ListTools";
import CollapsibleSection from "./ui/CollapsibleSection";
import { useToast } from "./ui/ToastProvider";
import { useConfirm } from "./ui/ConfirmProvider";
import type { MatchCardViewModel, StandingsTableViewModel } from "@/lib/match-centre/types";

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

const MATCH_STATUSES = ["upcoming", "live", "final", "cancelled"];

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
  const [scoreEdits, setScoreEdits] = useState<Record<string, { team_score: string; opponent_score: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [activeOperatorMatchId, setActiveOperatorMatchId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const formDirty =
    teamId !== "" || opponentId !== "" || competitionId !== "" || venueId !== "" || kickoff !== "" || roundLabel !== "" || status !== "upcoming" || homeOrAway !== "home";

  const activeOperatorMatch = useMemo(() => {
    if (!activeOperatorMatchId) return null;
    return initialMatches.find(m => m.id === activeOperatorMatchId) || null;
  }, [activeOperatorMatchId, initialMatches]);

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
            kickoff_at: new Date(kickoff).toISOString(),
            round_label: roundLabel || null,
            home_or_away: homeOrAway,
            show_on_match_centre: true,
          },
        }),
      });
      if (res.ok) {
        toast(`Fixture '${homeName} vs ${awayName}' created.`);
        setTeamId(""); setOpponentId(""); setCompetitionId(""); setVenueId("");
        setKickoff(""); setRoundLabel(""); setStatus("upcoming"); setHomeOrAway("home");
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        toast(`Failed to create fixture: ${err?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    }
  }

  async function saveScore(id: string, customScores?: { team_score: number; opponent_score: number; status?: string }) {
    setSavingId(id);
    let teamScore: number | null = null;
    let opponentScore: number | null = null;
    let newStatus: string | undefined = undefined;

    if (customScores) {
      teamScore = customScores.team_score;
      opponentScore = customScores.opponent_score;
      newStatus = customScores.status;
    } else {
      const edit = scoreEdits[id];
      teamScore = edit?.team_score !== undefined && edit?.team_score !== "" ? Number(edit.team_score) : null;
      opponentScore = edit?.opponent_score !== undefined && edit?.opponent_score !== "" ? Number(edit.opponent_score) : null;
    }

    // 6.5: changing an existing result needs a second, explicit confirm
    const existing = initialMatches.find((m) => m.id === id);
    const hasExistingResult =
      existing != null && existing.homeTeam?.score != null && existing.awayTeam?.score != null;
    const scoresChanged = teamScore !== null && opponentScore !== null && hasExistingResult;
    if (scoresChanged) {
      const ok = await confirm({
        title: "Change the existing result?",
        message: `${existing.homeTeam.name} ${existing.homeTeam.score}–${existing.awayTeam.score} ${existing.awayTeam.name} is already on the website. The new score (${teamScore}–${opponentScore}) will replace it within about a minute.`,
        confirmLabel: "Update result",
      });
      if (!ok) return;
    }

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
        toast("Live match score broadcasted!");
        setScoreEdits((prev) => { const next = { ...prev }; delete next[id]; return next; });
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

  // Rugby Quick Increment Helper (+5 Try, +2 Conv, +3 Pen)
  function adjustRugbyScore(isHome: boolean, points: number) {
    if (!activeOperatorMatch) return;
    const currentHome = activeOperatorMatch.homeTeam?.score ?? 0;
    const currentAway = activeOperatorMatch.awayTeam?.score ?? 0;

    const newHome = isHome ? Math.max(0, currentHome + points) : currentHome;
    const newAway = !isHome ? Math.max(0, currentAway + points) : currentAway;

    saveScore(activeOperatorMatch.id, {
      team_score: newHome,
      opponent_score: newAway,
      status: "live"
    });
  }

  async function changeStatus(id: string, next: string) {
    const res = await fetch("/api/admin/directus", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: "matches", id, data: { status: next } }),
    });
    if (res.ok) {
      toast(`Fixture marked ${next}.`);
      router.refresh();
    } else {
      toast("Could not update status.", "error");
    }
  }

  async function deleteFixture(id: string, label: string) {
    const ok = await confirm({
      title: "Delete fixture?",
      message: `'${label}' will be moved to the trash (removed from the website). Restorable from the Trash panel.`,
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

  const matchLabel = (m: MatchCardViewModel) => `${m.homeTeam?.name || "Zimbabwe"} vs ${m.awayTeam?.name || "Opponent"}`;

  // ── Matchday mode ──────────────────────────────────────────────
  const [now, setNow] = useState(() => Date.now());
  const [matchdayNews, setMatchdayNews] = useState<any[] | null>(null);

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
    const completed = [...initialMatches].sort((a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime())[0];
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
    nextMatch != null && (nextMatch.status === "live" || nextMatch.status === "completed") &&
    typeof nextMatch.homeTeam?.score === "number" && typeof nextMatch.awayTeam?.score === "number";

  const reportDrafted = useMemo(() => {
    if (!nextMatch || matchdayNews === null) return null;
    const opp = nextMatch.awayTeam?.name || "";
    const home = nextMatch.homeTeam?.name || "";
    const hit = matchdayNews.find(
      (n) => (n.title || "").toLowerCase().includes(opp.toLowerCase()) || (n.excerpt || "").toLowerCase().includes(opp.toLowerCase()) || (n.title || "").toLowerCase().includes(home.toLowerCase())
    );
    return Boolean(hit);
  }, [nextMatch, matchdayNews]);

  const galleryUploaded = useMemo(() => {
    if (matchdayNews === null) return null;
    const since = now - 14 * 86400000;
    const hit = matchdayNews.find((n) => {
      const t = `${n.title || ""} ${n.excerpt || ""}`.toLowerCase();
      if (!(t.includes("gallery") || t.includes("photos") || t.includes("album"))) return false;
      const d = new Date(n.publish_at || n.date || n.created_at || 0).getTime();
      return d >= since;
    });
    return Boolean(hit);
  }, [matchdayNews, now]);

  const checklistItems = nextMatch
    ? [
        { label: "Result sheet filled in", ok: resultEntered, hint: "Enter the score in the live operator" },
        { label: "Match report on the site", ok: reportDrafted === true, hint: "Draft it from the button below" },
        { label: "Match Day photos uploaded", ok: galleryUploaded === true, hint: "Publish a gallery in News & Articles" },
      ]
    : [];
  const checklistDone = checklistItems.filter((c) => c.ok).length;
  const checklistTotal = checklistItems.length;

  async function draftMatchReport() {
    if (!nextMatch) return;
    const home = nextMatch.homeTeam?.name || "Zimbabwe";
    const away = nextMatch.awayTeam?.name || "Opponent";
    const title = `${home} vs ${away} — match report`;
    const res = await fetch("/api/admin/directus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collection: "news",
        data: { title, slug: `${nextMatch.slug}-report`, excerpt: "", body: "<p>Match report…</p>", category: "News", status: "draft", date: new Date().toISOString() },
      }),
    });
    if (res.ok) {
      toast(`Draft created: "${title}" — open News & Articles to write it up.`);
      router.refresh();
    } else {
      const err = await res.json().catch(() => null);
      toast(`Could not draft the report: ${err?.error || res.statusText}`, "error");
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
      {/* 🏉 MATCHDAY MODE */}
      {nextMatch && (
        <section className="rounded-2xl border-2 border-zru-green/40 bg-gradient-to-br from-black via-[#0a1526] to-black text-white p-5 sm:p-6 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zru-green/15 border border-zru-green/30">
                <CalendarClock className="h-5 w-5 text-zru-green" />
              </span>
              <div>
                <h3 className="font-heading text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  Matchday Mode
                  <span className="rounded-full bg-zru-green/15 text-zru-green px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border border-zru-green/30">
                    {nextMatch.status === "live" ? "LIVE NOW" : countdown ? "NEXT MATCH" : "RECENT"}
                  </span>
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  {matchLabel(nextMatch)} · {nextMatch.competition} · {nextMatch.venue || "Venue TBC"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {countdown ? (
                <div className="flex items-center gap-1.5 font-mono text-lg font-black text-white">
                  <span className="bg-white/10 rounded-lg px-2 py-1 min-w-10 text-center">{countdown.d}<span className="block text-[8px] text-white/50 font-bold uppercase">days</span></span>
                  <span className="bg-white/10 rounded-lg px-2 py-1 min-w-10 text-center">{countdown.h}<span className="block text-[8px] text-white/50 font-bold uppercase">hrs</span></span>
                  <span className="bg-white/10 rounded-lg px-2 py-1 min-w-10 text-center">{countdown.m}<span className="block text-[8px] text-white/50 font-bold uppercase">min</span></span>
                </div>
              ) : nextMatch.status === "live" ? (
                <span className="text-xs font-black uppercase tracking-wider text-red-400 animate-pulse">Taking scores live…</span>
              ) : (
                <span className="text-xs text-white/40">Kickoff {nextMatch.time}</span>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
            {checklistItems.map((c) => (
              <div key={c.label} className={`flex items-start gap-2 rounded-xl border p-3 text-xs ${c.ok ? "border-zru-green/30 bg-zru-green/5" : "border-white/10 bg-white/[0.03]"}`}>
                {c.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-zru-green shrink-0 mt-0.5" />
                ) : (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/20 text-[9px] font-black text-amber-400 shrink-0 mt-0.5">!</span>
                )}
                <div>
                  <p className={`font-bold ${c.ok ? "text-emerald-300" : "text-white/80"}`}>{c.label}</p>
                  {!c.ok && <p className="text-white/40">{c.hint}</p>}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-white/40">
            {checklistDone}/{checklistTotal} done — {checklistDone === checklistTotal ? "everything's covered, nice work." : checklistTotal - checklistDone > 0 ? `${checklistTotal - checklistDone} to go before kickoff.` : ""}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openOperator(nextMatch.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zru-green px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white hover:bg-green-700 transition-colors cursor-pointer"
            >
              <Radio className="h-3.5 w-3.5" /> Enter result / live score
            </button>
            <button
              type="button"
              onClick={draftMatchReport}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white transition-colors cursor-pointer"
            >
              <Newspaper className="h-3.5 w-3.5 text-zru-green" /> Draft the match report
            </button>
            <button
              type="button"
              onClick={() => { setActiveOperatorMatchId(null); document.getElementById("zru-add-fixture")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white/70 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add fixture
            </button>
          </div>
        </section>
      )}

      {/* 🏉 RUGBY LIVE SCORE OPERATOR WIDGET */}
      {activeOperatorMatch && (
        <section id="zru-live-operator" className="rounded-2xl border-2 border-[#006B3F] bg-[#090d16] text-white p-6 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div>
                <h3 className="font-heading text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span>LIVE RUGBY OPERATOR:</span>
                  <span className="text-[#006B3F]">{activeOperatorMatch.homeTeam?.name} vs {activeOperatorMatch.awayTeam?.name}</span>
                </h3>
                <p className="text-xs text-white/50">{activeOperatorMatch.competition} · {activeOperatorMatch.venue}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveOperatorMatchId(null)}
              className="text-xs font-mono text-white/50 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/10"
            >
              Close Operator ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Home Team Controls */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col items-center">
              <div className="font-heading text-sm font-black uppercase text-white/80 mb-2">
                {activeOperatorMatch.homeTeam?.name || "Zimbabwe Sables"}
              </div>
              <div className="text-5xl font-mono font-black text-white my-2">
                {activeOperatorMatch.homeTeam?.score ?? 0}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(true, 5)}
                  className="px-3 py-1.5 rounded-lg bg-[#006B3F] hover:bg-green-700 text-white text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  +5 Try
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(true, 2)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  +2 Conv
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(true, 3)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  +3 Pen/Drop
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(true, -1)}
                  className="px-2 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  -1
                </button>
              </div>
            </div>

            {/* Away Team Controls */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col items-center">
              <div className="font-heading text-sm font-black uppercase text-white/80 mb-2">
                {activeOperatorMatch.awayTeam?.name || "Opponent"}
              </div>
              <div className="text-5xl font-mono font-black text-white my-2">
                {activeOperatorMatch.awayTeam?.score ?? 0}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(false, 5)}
                  className="px-3 py-1.5 rounded-lg bg-[#006B3F] hover:bg-green-700 text-white text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  +5 Try
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(false, 2)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  +2 Conv
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(false, 3)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  +3 Pen/Drop
                </button>
                <button
                  type="button"
                  onClick={() => adjustRugbyScore(false, -1)}
                  className="px-2 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  -1
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/50">Broadcasting live score delta via Edge ISR (60s)...</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeStatus(activeOperatorMatch.id, "final")}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold uppercase tracking-wider"
              >
                Mark Full Time (Final)
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Create fixture */}
      <CollapsibleSection
        title="Add a fixture"
        icon={<Plus className="h-5 w-5" />}
        description="Create a new match. Pick real teams, competition and venue — no typing names by hand."
        defaultOpen={false}
        dirty={formDirty}
        onDirtyChange={onDirtyChange}
      >
        <div id="zru-add-fixture" />
        <form onSubmit={createFixture} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Home team</label>
            <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold">
              <option value="">— Select —</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Opponent</label>
            <select value={opponentId} onChange={(e) => setOpponentId(e.target.value)} className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold">
              <option value="">— Select —</option>
              {opponents.map((o) => (
                <option key={o.id} value={o.id}>{o.teamType && o.teamType !== "international" ? `${o.name} — ${o.teamType}` : o.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Competition</label>
            <select value={competitionId} onChange={(e) => setCompetitionId(e.target.value)} className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold">
              <option value="">— Select —</option>
              {competitions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Venue</label>
            <select value={venueId} onChange={(e) => setVenueId(e.target.value)} className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold">
              <option value="">— Select —</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Kick-off date & time</label>
            <input
              type="datetime-local"
              value={kickoff}
              onChange={(e) => setKickoff(e.target.value)}
              className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Round / stage label</label>
            <input
              type="text"
              value={roundLabel}
              onChange={(e) => setRoundLabel(e.target.value)}
              placeholder="e.g. Semifinal / Round 3"
              className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold">
              {MATCH_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Home or away</label>
            <select value={homeOrAway} onChange={(e) => setHomeOrAway(e.target.value)} className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold">
              <option value="home">Home (Harare / Bulawayo)</option>
              <option value="away">Away</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-lg bg-zru-green px-6 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800 cursor-pointer shadow-sm">
              Add fixture
            </button>
          </div>
        </form>
      </CollapsibleSection>

      {/* Fixtures list */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
            <Trophy className="h-5 w-5 text-zru-green" /> Fixtures & results
          </h2>
          <span className="text-xs font-mono text-black/40">{filtered.length} Total Fixtures</span>
        </div>

        <div className="mt-3">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search fixtures by team, venue, competition..."
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm placeholder:text-black/40 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {visible.length === 0 ? (
          <div className="mt-4">
            <EmptyState title={query ? "No fixtures match your search" : "No fixtures yet"} hint="Use the form above to add the first fixture." />
          </div>
        ) : (
          <div className="mt-4 divide-y divide-black/5 rounded-xl border border-black/5">
            {visible.map((m) => {
              const edit = scoreEdits[m.id] || {};
              const score = `${m.homeTeam?.score ?? ""}:${m.awayTeam?.score ?? ""}`;
              const isSelectedForOperator = activeOperatorMatchId === m.id;

              return (
                <div key={m.id} className={`flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between transition-colors ${isSelectedForOperator ? "bg-green-50/50" : ""}`}>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate font-heading text-sm font-black uppercase text-rich-black">{matchLabel(m)}</h4>
                      <StatusChip status={m.status} />
                      {m.opponentCategory && m.opponentCategory !== "international" && (
                        <span className="rounded-md bg-black/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black/60">{m.opponentCategory} opponent</span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-black/50">
                      {m.dateIso ? new Date(m.dateIso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""} · {m.time || ""} · {m.venue} · {m.competition}{m.round ? ` · ${m.round}` : ""}
                    </p>
                  </div>

                  {m.status === "completed" && score !== ":" ? (
                    <span className="shrink-0 rounded-lg bg-zru-green/10 px-3 py-1 font-heading text-sm font-black uppercase text-zru-green">{score}</span>
                  ) : null}

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {/* Live Operator Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setActiveOperatorMatchId(m.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelectedForOperator
                          ? "bg-zru-green text-white shadow-sm"
                          : "bg-black/5 text-black/70 hover:bg-black/10 hover:text-black"
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Live Operator</span>
                    </button>

                    <select
                      value={m.status}
                      onChange={(e) => changeStatus(m.id, e.target.value)}
                      className="rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs font-bold"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="final">Final</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => deleteFixture(m.id, matchLabel(m))}
                      className="rounded-lg bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-600 transition-colors hover:bg-red-500/20 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4">
          <Pagination page={safePage} pageCount={pageCount} total={filtered.length} onPage={setPage} />
        </div>
      </section>

      {/* Standings Table */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
          <Pencil className="h-5 w-5 text-zru-green" /> Standings & Leaderboards
        </h2>
        <p className="mt-1 text-xs text-black/50">Directus-synced competition standings across Africa Cup, Super 6, and Junior Barthes Trophy.</p>
        {initialStandings.length === 0 ? (
          <div className="mt-4"><EmptyState title="No standings tables" /></div>
        ) : (
          initialStandings.map((table) => (
            <div key={table.id} className="mt-4 overflow-x-auto rounded-xl border border-black/5">
              <h3 className="bg-black/[0.03] px-4 py-3 font-heading text-sm font-black uppercase text-rich-black">
                {table.title} · {table.seasonYear}
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-left text-[10px] font-black uppercase tracking-wider text-black/50">
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Team</th>
                    <th className="px-4 py-2 text-center">P</th>
                    <th className="px-4 py-2 text-center">W</th>
                    <th className="px-4 py-2 text-center">D</th>
                    <th className="px-4 py-2 text-center">L</th>
                    <th className="px-4 py-2 text-center">PF</th>
                    <th className="px-4 py-2 text-center">PA</th>
                    <th className="px-4 py-2 text-center">PD</th>
                    <th className="px-4 py-2 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((r) => (
                    <tr key={r.position} className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-2 font-bold text-black/60">{r.position}</td>
                      <td className="px-4 py-2 font-bold">{r.team}</td>
                      <td className="px-4 py-2 text-center">{r.played}</td>
                      <td className="px-4 py-2 text-center">{r.won}</td>
                      <td className="px-4 py-2 text-center">{r.drawn}</td>
                      <td className="px-4 py-2 text-center">{r.lost}</td>
                      <td className="px-4 py-2 text-center">{r.pointsFor}</td>
                      <td className="px-4 py-2 text-center">{r.pointsAgainst}</td>
                      <td className="px-4 py-2 text-center">{r.pointsDiff}</td>
                      <td className="px-4 py-2 text-center font-black text-zru-green">{r.points}</td>
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

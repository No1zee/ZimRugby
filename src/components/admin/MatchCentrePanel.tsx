"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Plus, Trophy, Pencil } from "lucide-react";
import StatusChip, { EmptyState } from "./ui/StatusChip";
import { Pagination } from "./ui/ListTools";
import type { MatchCardViewModel, StandingsTableViewModel } from "@/lib/match-centre/types";

interface LookupOption {
  id: string | number;
  name: string;
}

interface MatchCentrePanelProps {
  initialMatches: MatchCardViewModel[];
  initialStandings: StandingsTableViewModel[];
  teams: LookupOption[];
  opponents: LookupOption[];
  competitions: LookupOption[];
  venues: LookupOption[];
}

const MATCH_STATUSES = ["upcoming", "live", "final", "cancelled"];

export default function MatchCentrePanel({
  initialMatches,
  initialStandings,
  teams,
  opponents,
  competitions,
  venues,
}: MatchCentrePanelProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  // Create form
  const [teamId, setTeamId] = useState("");
  const [opponentId, setOpponentId] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const [venueId, setVenueId] = useState("");
  const [kickoff, setKickoff] = useState("");
  const [roundLabel, setRoundLabel] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [homeOrAway, setHomeOrAway] = useState("home");

  // Inline score editing
  const [scoreEdits, setScoreEdits] = useState<Record<string, { team_score: string; opponent_score: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  async function createFixture(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!teamId || !opponentId) {
      setMessage({ text: "Pick both a home team and an opponent.", ok: false });
      return;
    }
    const homeName = teams.find((t) => String(t.id) === teamId)?.name || "Zimbabwe";
    const awayName = opponents.find((o) => String(o.id) === opponentId)?.name || "Opponent";
    try {
      const res = await fetch("/api/admin/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "matches",
          data: {
            title: `${homeName} vs ${awayName}`,
            team_id: teamId,
            opponent_id: opponentId,
            competition_id: competitionId || null,
            venue_id: venueId || null,
            status,
            kickoff_at: kickoff ? new Date(kickoff).toISOString() : null,
            round_label: roundLabel || null,
            home_or_away: homeOrAway,
            show_on_match_centre: true,
          },
        }),
      });
      if (res.ok) {
        setMessage({ text: `Fixture '${homeName} vs ${awayName}' created.`, ok: true });
        setTeamId(""); setOpponentId(""); setCompetitionId(""); setVenueId("");
        setKickoff(""); setRoundLabel("");
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        setMessage({ text: `Failed to create fixture: ${err?.error || res.statusText}`, ok: false });
      }
    } catch (err) {
      setMessage({ text: `Error: ${err instanceof Error ? err.message : err}`, ok: false });
    }
  }

  async function saveScore(id: string) {
    setSavingId(id);
    setMessage(null);
    const edit = scoreEdits[id];
    const teamScore = edit?.team_score !== undefined && edit?.team_score !== "" ? Number(edit.team_score) : null;
    const opponentScore = edit?.opponent_score !== undefined && edit?.opponent_score !== "" ? Number(edit.opponent_score) : null;
    try {
      const data: Record<string, unknown> = {
        team_score: teamScore,
        opponent_score: opponentScore,
      };
      if (teamScore !== null && opponentScore !== null) {
        data.result_outcome = teamScore > opponentScore ? "win" : teamScore < opponentScore ? "loss" : "draw";
        data.status = "final";
      }
      const res = await fetch("/api/admin/directus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "matches", id, data }),
      });
      if (res.ok) {
        setMessage({ text: "Score saved.", ok: true });
        setScoreEdits((prev) => { const next = { ...prev }; delete next[id]; return next; });
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        setMessage({ text: `Failed to save score: ${err?.error || res.statusText}`, ok: false });
      }
    } catch (err) {
      setMessage({ text: `Error: ${err instanceof Error ? err.message : err}`, ok: false });
    } finally {
      setSavingId(null);
    }
  }

  async function changeStatus(id: string, next: string) {
    setMessage(null);
    const res = await fetch("/api/admin/directus", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: "matches", id, data: { status: next } }),
    });
    if (res.ok) {
      setMessage({ text: "Fixture status updated.", ok: true });
      router.refresh();
    } else {
      setMessage({ text: "Could not update status.", ok: false });
    }
  }

  async function deleteFixture(id: string, label: string) {
    if (!window.confirm(`Delete fixture '${label}'? This cannot be undone.`)) return;
    const res = await fetch("/api/admin/directus", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: "matches", id }),
    });
    if (res.ok) {
      setMessage({ text: "Fixture deleted.", ok: true });
      router.refresh();
    } else {
      setMessage({ text: "Could not delete fixture.", ok: false });
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialMatches;
    return initialMatches.filter((m) =>
      [m.title, m.competition, m.round, m.venue, m.homeTeam?.name, m.awayTeam?.name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [initialMatches, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const matchLabel = (m: MatchCardViewModel) => `${m.homeTeam?.name || "?"} vs ${m.awayTeam?.name || "?"}`;

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-bold ${
            message.ok
              ? "border-zru-green/40 bg-zru-green/10 text-zru-green"
              : "border-red-400 bg-red-50 text-red-700"
          }`}
        >
          {message.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Create fixture */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
          <Plus className="h-5 w-5 text-zru-green" /> Add a fixture
        </h2>
        <p className="mt-1 text-xs text-black/50">Create a new match. Pick real teams, competition and venue — no typing names by hand.</p>
        <form onSubmit={createFixture} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <option key={o.id} value={o.id}>{o.name}</option>
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
              className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Round / stage label</label>
            <input
              type="text"
              value={roundLabel}
              onChange={(e) => setRoundLabel(e.target.value)}
              placeholder="e.g. Round 3"
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
              <option value="home">Home</option>
              <option value="away">Away</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-lg bg-zru-green px-6 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800">
              Add fixture
            </button>
          </div>
        </form>
      </section>

      {/* Fixtures list */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
          <Trophy className="h-5 w-5 text-zru-green" /> Fixtures & results
        </h2>
        <div className="mt-3">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search fixtures…"
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
              return (
                <div key={m.id} className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate font-heading text-sm font-black uppercase text-rich-black">{matchLabel(m)}</h4>
                      <StatusChip status={m.status} />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-black/50">
                      {m.dateIso ? new Date(m.dateIso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""} · {m.time || ""} · {m.venue} · {m.competition}{m.round ? ` · ${m.round}` : ""}
                    </p>
                  </div>

                  {m.status === "completed" && score !== ":" ? (
                    <span className="shrink-0 rounded-lg bg-zru-green/10 px-3 py-1 font-heading text-sm font-black uppercase text-zru-green">{score}</span>
                  ) : null}

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {(m.status === "upcoming" || m.status === "live") && (
                      <div className="flex items-center gap-1 rounded-lg bg-black/5 p-1">
                        <input
                          type="number"
                          placeholder="ZR"
                          value={edit.team_score ?? (m.homeTeam?.score !== undefined ? m.homeTeam.score : "")}
                          onChange={(e) => setScoreEdits((prev) => ({ ...prev, [m.id]: { team_score: e.target.value, opponent_score: prev[m.id]?.opponent_score ?? "" } }))}
                          className="w-14 rounded border border-black/10 bg-white p-1 text-center text-sm"
                        />
                        <span className="text-xs text-black/40">–</span>
                        <input
                          type="number"
                          placeholder="Opp"
                          value={edit.opponent_score ?? (m.awayTeam?.score !== undefined ? m.awayTeam.score : "")}
                          onChange={(e) => setScoreEdits((prev) => ({ ...prev, [m.id]: { team_score: prev[m.id]?.team_score ?? "", opponent_score: e.target.value } }))}
                          className="w-14 rounded border border-black/10 bg-white p-1 text-center text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => saveScore(m.id)}
                          disabled={savingId === m.id}
                          className="rounded-md bg-zru-green px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white hover:bg-green-800 disabled:opacity-50"
                        >
                          {savingId === m.id ? "Saving…" : "Save score"}
                        </button>
                      </div>
                    )}
                    {m.status === "upcoming" && (
                      <select
                        value={m.status}
                        onChange={(e) => changeStatus(m.id, e.target.value)}
                        className="rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="live">Live</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                    <button
                      onClick={() => deleteFixture(m.id, matchLabel(m))}
                      className="rounded-lg bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-600 transition-colors hover:bg-red-500/20"
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

      {/* Standings (read-only) */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
          <Pencil className="h-5 w-5 text-zru-green" /> Standings
        </h2>
        <p className="mt-1 text-xs text-black/50">Standings are maintained in the CMS data model and shown here read-only.</p>
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

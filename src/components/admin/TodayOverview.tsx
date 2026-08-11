"use client";

import { useMemo } from "react";
import { Newspaper, Trophy, Users, CheckCircle2 } from "lucide-react";
import StatusChip from "./ui/StatusChip";
import type { MatchCardViewModel } from "@/lib/match-centre/types";

interface TodayOverviewProps {
  initialNews: Record<string, unknown>[];
  initialMatches: MatchCardViewModel[];
  fanZoneCount: number;
  onboardingCount: number;
  onNavigate: (tab: string) => void;
}

function fmtDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function TodayOverview({ initialNews, initialMatches, fanZoneCount, onboardingCount, onNavigate }: TodayOverviewProps) {
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
      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zru-green/10">
              <Newspaper className="h-5 w-5 text-zru-green" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">{drafts.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">Draft articles</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Trophy className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">{upcoming.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">Upcoming fixtures</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
              <Trophy className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">{liveMatches.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">Live matches</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
              <Users className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-rich-black">{totalSignups.toLocaleString()}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">Total sign-ups</p>
            </div>
          </div>
        </div>
      </div>

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Drafts queue */}
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-rich-black">
            <Newspaper className="h-4 w-4 text-zru-green" /> Drafts waiting to publish
          </h3>
          {drafts.length === 0 ? (
            <p className="mt-3 flex items-center gap-2 text-xs text-black/50">
              <CheckCircle2 className="h-4 w-4 text-zru-green" /> All clear — nothing waiting.
            </p>
          ) : (
            <div className="mt-3 divide-y divide-black/5">
              {drafts.map((d) => (
                <div key={String(d.id)} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-rich-black">{String(d.title ?? `#${d.id}`)}</p>
                    <p className="text-xs text-black/50">{fmtDate(String(d.date ?? ""))}</p>
                  </div>
                  <button
                    onClick={() => onNavigate("media")}
                    className="shrink-0 rounded-lg bg-black/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black/60 hover:bg-black/10"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming fixtures */}
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-rich-black">
            <Trophy className="h-4 w-4 text-zru-green" /> Upcoming fixtures
          </h3>
          {upcoming.length === 0 ? (
            <p className="mt-3 text-xs text-black/50">No upcoming fixtures scheduled.</p>
          ) : (
            <div className="mt-3 divide-y divide-black/5">
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
        </section>
      </div>

      {/* Signups */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-rich-black">
          <Users className="h-4 w-4 text-zru-green" /> New sign-ups
        </h3>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
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
      </section>
    </div>
  );
}

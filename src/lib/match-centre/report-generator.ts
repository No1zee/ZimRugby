/**
 * ZRU Post-Match Report Generator
 * Converts match telemetry and scorecards into a structured news article draft.
 */

import type { MatchCardViewModel } from "./types";

export interface GeneratedReportDraft {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  date: string;
  status: "draft";
  is_featured_hero?: boolean;
  is_breaking_banner?: boolean;
}

export function generatePostMatchReport(match: MatchCardViewModel): GeneratedReportDraft {
  const homeName = match.homeTeam?.name || "Zimbabwe Sables";
  const awayName = match.awayTeam?.name || "Opponent";
  const homeScore = match.homeTeam?.score ?? 0;
  const awayScore = match.awayTeam?.score ?? 0;
  const competition = match.competition || "International Rugby";
  const venue = match.venue || "Harare Sports Club";

  const isHomeWinner = homeScore > awayScore;
  const isDraw = homeScore === awayScore;

  const winner = isDraw ? null : isHomeWinner ? homeName : awayName;
  const loser = isDraw ? null : isHomeWinner ? awayName : homeName;
  const winningScore = Math.max(homeScore, awayScore);
  const losingScore = Math.min(homeScore, awayScore);

  const matchDate = match.dateIso
    ? new Date(match.dateIso).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Gameday";

  // Headline formulation
  let headline = "";
  let excerpt = "";

  if (isDraw) {
    headline = `MATCH REPORT: ${homeName} and ${awayName} Play Out Thrilling ${homeScore}-${awayScore} Draw in ${competition}`;
    excerpt = `In a pulsating encounter at ${venue}, ${homeName} and ${awayName} shared the spoils in a ${homeScore}-${awayScore} draw in the ${competition} on ${matchDate}.`;
  } else {
    headline = `MATCH REPORT: ${winner} Defeat ${loser} ${winningScore}-${losingScore} in ${competition} Clash`;
    excerpt = `${winner} produced a commanding performance to claim a ${winningScore}-${losingScore} victory over ${loser} at ${venue} in the ${competition} on ${matchDate}.`;
  }

  // URL-safe slug
  const baseSlug = `match-report-${homeName}-vs-${awayName}-${homeScore}-${awayScore}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Formatted Body in clean HTML
  const body = `
<p class="lead font-medium text-lg text-neutral-800 mb-4">
  <strong>${venue.toUpperCase()}</strong> — ${winner ? `${winner} secured a decisive ${winningScore}-${losingScore} result against ${loser}` : `${homeName} and ${awayName} concluded an intense ${homeScore}-${awayScore} contest`} in the ${competition} on ${matchDate}.
</p>

<h3 class="text-xl font-bold uppercase tracking-tight text-neutral-900 mt-6 mb-3">Match Summary & Scoreboard</h3>
<div class="my-4 p-4 rounded-xl bg-neutral-100 border border-neutral-200">
  <div class="grid grid-cols-3 items-center text-center font-bold">
    <div>
      <span class="block text-sm uppercase text-neutral-600">${homeName}</span>
      <span class="text-3xl font-black text-neutral-900">${homeScore}</span>
    </div>
    <div class="text-xs uppercase tracking-widest text-neutral-500 font-black">
      FULL TIME
    </div>
    <div>
      <span class="block text-sm uppercase text-neutral-600">${awayName}</span>
      <span class="text-3xl font-black text-neutral-900">${awayScore}</span>
    </div>
  </div>
  <div class="mt-3 pt-3 border-t border-neutral-200 text-xs text-neutral-600 text-center font-medium">
    Venue: ${venue} | Competition: ${competition}
  </div>
</div>

<h3 class="text-xl font-bold uppercase tracking-tight text-neutral-900 mt-6 mb-3">Key Match Highlights</h3>
<p class="mb-4">
  Both sides contested fiercely at the breakdown throughout the opening 40 minutes before ${winner || "the teams"} took control with disciplined set-piece execution and clinical territorial kicking.
</p>

<h3 class="text-xl font-bold uppercase tracking-tight text-neutral-900 mt-6 mb-3">Post-Match Reaction</h3>
<blockquote class="border-l-4 border-emerald-600 pl-4 py-1 my-4 italic text-neutral-700">
  "The squad executed our game plan under pressure. We prepared rigorously for this test and the players left everything on the field."
  <span class="block font-bold text-xs uppercase not-italic text-neutral-900 mt-1">— ZRU Coaching Staff</span>
</blockquote>

<h3 class="text-xl font-bold uppercase tracking-tight text-neutral-900 mt-6 mb-3">Next Fixtures</h3>
<p class="mb-4">
  Fans can track full tournament standings and upcoming match schedules directly on the official Zimbabwe Rugby Union Match Centre.
</p>
`.trim();

  return {
    title: headline,
    slug: baseSlug,
    excerpt,
    body,
    category: "Match Reports",
    date: new Date().toISOString().split("T")[0],
    status: "draft",
    is_featured_hero: false,
    is_breaking_banner: false,
  };
}

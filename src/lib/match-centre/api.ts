import { directusFetch } from "../directus/fetch";
import { getTeamEmblem } from "../teamLogos";
import type {
  GlobalSettings,
  MatchCentrePageConfig,
  FanBulletinSection,
  MatchCentreSettingsConfig,
  TeamEntity,
  MatchCardViewModel,
  StandingsTableViewModel,
  LiveAnnouncementStripViewModel,
} from "./types";

/**
 * Fetch Global Settings Singleton
 */
export async function getGlobalSettings(): Promise<GlobalSettings> {
  const records = await directusFetch<Record<string, unknown>>("global_settings", { limit: 1 }, 300);
  const item = records[0] || {};
  return {
    siteName: (item.site_name as string) || "Zimbabwe Rugby Union",
    siteTagline: item.site_tagline as string,
    ticketsUrl: (item.tickets_url as string) || "https://tickets.zimrugby.co.zw",
    shopUrl: (item.shop_url as string) || "https://shop.zimrugby.co.zw",
    signInUrl: (item.sign_in_url as string) || "/auth/signin",
    complianceLabel: (item.compliance_label as string) || "CDPA 2021 COMPLIANT",
  };
}

/**
 * Fetch Page Config for /match-centre
 */
export async function getMatchCentrePage(): Promise<MatchCentrePageConfig> {
  const pages = await directusFetch<Record<string, unknown>>(
    "pages",
    { filter: { slug: { _eq: "match-centre" } } },
    300
  );
  const p = pages[0] || {};

  return {
    title: (p.title as string) || "Match Centre",
    subtitle:
      (p.hero_intro as string) ||
      "Follow every tackle, try, and triumph. The official schedule and results for all Zimbabwe Rugby Union teams.",
    tag: (p.hero_kicker as string) || "Fixtures & Results",
    breadcrumb: [{ label: (p.breadcrumb_label as string) || "Match Centre", href: "/match-centre" }],
  };
}

/**
 * Fetch Fan Bulletin Section for Match Centre
 */
export async function getFanBulletin(): Promise<FanBulletinSection | null> {
  const sections = await directusFetch<Record<string, unknown>>(
    "page_sections",
    { filter: { section_key: { _eq: "fan_bulletin" }, is_enabled: { _eq: true } } },
    60
  );
  const sec = sections[0];
  if (!sec) return null;

  return {
    eyebrow: (sec.eyebrow as string) || "FAN INFO / UNION BULLETIN",
    title: (sec.title as string) || "Harare Sports Club Fan Zone Schedule",
    body: (sec.body as string) || "Supporter shuttles running every 15 mins. Gates open at 11:00 AM.",
    ctaLabel: (sec.cta_label as string) || "VIEW SHUTTLE TIMES",
    ctaUrl: (sec.cta_url as string) || "#shuttle-schedule",
    displayVariant: (sec.display_variant as "callout" | "inline" | "notice" | "empty-state") || "callout",
  };
}

/**
 * Fetch Match Centre Settings (Toggles, Default Tab, Placeholder)
 */
export async function getMatchCentreSettings(): Promise<MatchCentreSettingsConfig> {
  const records = await directusFetch<Record<string, unknown>>("match_centre_settings", { limit: 1 }, 300);
  const cfg = records[0] || {};

  return {
    defaultTab: (cfg.default_tab as "fixtures" | "results" | "standings") || "fixtures",
    fixturesEnabled: cfg.fixtures_enabled !== false,
    resultsEnabled: cfg.results_enabled !== false,
    standingsEnabled: cfg.standings_enabled !== false,
    searchPlaceholder: (cfg.search_placeholder as string) || "Search opponent or cup...",
    showLiveStrip: cfg.show_live_strip !== false,
    showFanBulletin: cfg.show_fan_bulletin !== false,
    showTeamFilters: cfg.show_team_filters !== false,
  };
}

/**
 * Fetch Teams for Dynamic Filter Bar
 */
export async function getActiveTeams(): Promise<TeamEntity[]> {
  const teams = await directusFetch<Record<string, unknown>>(
    "teams",
    { filter: { is_active: { _eq: true } }, sort: ["display_order"] },
    300
  );

  return teams.map((t) => ({
    id: String(t.id),
    name: (t.name as string) || "Team",
    shortName: t.short_name as string,
    slug: (t.slug as string) || "team",
    code: t.code as string,
    teamType: (t.team_type as string) || "mens_15s",
    filterLabel: (t.filter_label as string) || (t.name as string) || "Team",
    displayOrder: (t.display_order as number) || 0,
  }));
}

/**
 * Fetch All Normalized Matches from Directus
 */
export async function getDirectusMatches(): Promise<MatchCardViewModel[]> {
  const records = await directusFetch<Record<string, unknown>>(
    "matches",
    { sort: ["kickoff_at"] },
    60
  );

  if (!records.length) return [];

  // Fetch teams, opponents, competitions to join
  const [teams, opponents, comps, venues] = await Promise.all([
    directusFetch<Record<string, unknown>>("teams", {}, 300),
    directusFetch<Record<string, unknown>>("opponents", {}, 300),
    directusFetch<Record<string, unknown>>("competitions", {}, 300),
    directusFetch<Record<string, unknown>>("venues", {}, 300),
  ]);

  const teamMap = new Map(teams.map((t) => [String(t.id), t]));
  const oppMap = new Map(opponents.map((o) => [String(o.id), o]));
  const compMap = new Map(comps.map((c) => [String(c.id), c]));
  const venueMap = new Map(venues.map((v) => [String(v.id), v]));

  return records.map((m) => {
    const teamObj = teamMap.get(String(m.team_id));
    const oppObj = oppMap.get(String(m.opponent_id));
    const compObj = compMap.get(String(m.competition_id));
    const venueObj = venueMap.get(String(m.venue_id));

    const kickoff = m.kickoff_at ? new Date(m.kickoff_at as string) : new Date();
    const isAway = m.home_or_away === "away";
    const teamName = (teamObj?.name as string) || "Zimbabwe Sables";
    const oppName = (oppObj?.name as string) || "Opponent";
    const teamCode = (teamObj?.code as string) || (teamObj?.short_name as string) || "ZIM";
    const oppCode = (oppObj?.code as string) || (oppObj?.short_name as string) || oppName.slice(0, 3).toUpperCase();
    
    // Unassigned venue leaves blank text (no hardcoded fallback)
    const venueName = (m.venue_name_override as string) || (venueObj?.name as string) || (venueObj?.city ? `${venueObj.name}, ${venueObj.city}` : "");

    // Automatic status evaluation based on explicit admin setting or 2.5-hour match window
    const now = Date.now();
    const kickoffTime = !isNaN(kickoff.getTime()) ? kickoff.getTime() : null;
    const matchDurationMs = 2.5 * 3600 * 1000;

    let computedStatus: "upcoming" | "live" | "completed" = "upcoming";
    if (m.status === "final" || m.status === "completed") {
      computedStatus = "completed";
    } else if (m.status === "live") {
      computedStatus = "live";
    } else if (kickoffTime && now > kickoffTime + matchDurationMs) {
      computedStatus = "completed";
    } else if (kickoffTime && now >= kickoffTime && now <= kickoffTime + matchDurationMs) {
      computedStatus = "live";
    }

    return {
      id: String(m.id),
      slug: (m.slug as string) || String(m.id),
      title: (m.title as string) || "Zimbabwe Rugby Match",
      competition: (compObj?.name as string) || "Rugby Africa Cup",
      round: (m.round_label as string) || (teamObj?.filter_label as string) || "Sables",
      dateIso: kickoff.toISOString(),
      time: (m.display_time_label as string) || kickoff.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Harare" }),
      venue: venueName,
      homeTeam: {
        name: isAway ? oppName : teamName,
        code: isAway ? oppCode : teamCode,
        logo: isAway ? getTeamEmblem(oppName, oppObj?.crest as string) : getTeamEmblem(teamName, teamObj?.crest as string),
        score: isAway ? (m.opponent_score !== null && m.opponent_score !== undefined ? Number(m.opponent_score) : undefined) : (m.team_score !== null && m.team_score !== undefined ? Number(m.team_score) : undefined),
      },
      awayTeam: {
        name: isAway ? teamName : oppName,
        code: isAway ? teamCode : oppCode,
        logo: isAway ? getTeamEmblem(teamName, teamObj?.crest as string) : getTeamEmblem(oppName, oppObj?.crest as string),
        score: isAway ? (m.team_score !== null && m.team_score !== undefined ? Number(m.team_score) : undefined) : (m.opponent_score !== null && m.opponent_score !== undefined ? Number(m.opponent_score) : undefined),
      },
      status: computedStatus,
      resultOutcome: (m.result_outcome as "win" | "loss" | "draw" | "na") || "na",
      resultLabel: (m.result_label as string) || (computedStatus === "completed" ? "RESULT" : "UPCOMING"),
      teamCategory: (teamObj?.filter_label as string) || "Sables",
      opponentCategory: (oppObj?.team_type as string) || "",
      ticketUrl: m.ticket_url as string,
    };
  });
}

/**
 * Fetch Standings Tables & Rows
 */
export async function getStandings(): Promise<StandingsTableViewModel[]> {
  const tables = await directusFetch<Record<string, unknown>>("standings_tables", { filter: { is_active: { _eq: true } } }, 300);

  if (!tables.length) {
    return [
      {
        id: "default-table",
        title: "Rugby Africa Cup 2026 Standings",
        slug: "rugby-africa-cup-2026-standings",
        seasonYear: 2026,
        rows: [
          { position: 1, team: "Zimbabwe Sables", played: 3, won: 3, drawn: 0, lost: 0, pointsFor: 95, pointsAgainst: 42, pointsDiff: 53, bonusPoints: 3, points: 15, form: ["W", "W", "W"] },
          { position: 2, team: "Algeria", played: 3, won: 2, drawn: 0, lost: 1, pointsFor: 68, pointsAgainst: 54, pointsDiff: 14, bonusPoints: 1, points: 9, form: ["L", "W", "W"] },
          { position: 3, team: "Namibia", played: 3, won: 1, drawn: 0, lost: 2, pointsFor: 55, pointsAgainst: 60, pointsDiff: -5, bonusPoints: 1, points: 5, form: ["L", "L", "W"] },
          { position: 4, team: "Kenya Simbas", played: 3, won: 0, drawn: 0, lost: 3, pointsFor: 38, pointsAgainst: 100, pointsDiff: -62, bonusPoints: 1, points: 1, form: ["L", "L", "L"] },
        ],
      },
    ];
  }

  return tables.map((t) => {
    const items = t.items as { rows?: Array<Record<string, unknown>> } | undefined;
    const tRows = items?.rows || [];
    return {
      id: String(t.id),
      title: (t.title as string) || "Competition Standings",
      slug: (t.slug as string) || "standings",
      seasonYear: Number(t.season_year) || 2026,
      rows: tRows.map((r) => ({
        position: Number(r.position) || 1,
        team: (r.team_name as string) || "Team",
        played: Number(r.played) || 0,
        won: Number(r.won) || 0,
        drawn: Number(r.drawn) || 0,
        lost: Number(r.lost) || 0,
        pointsFor: Number(r.points_for) || 0,
        pointsAgainst: Number(r.points_against) || 0,
        pointsDiff: Number(r.points_difference) || 0,
        bonusPoints: Number(r.bonus_points) || 0,
        points: Number(r.table_points) || 0,
        form: typeof r.form === "string" ? r.form.split("") : ["W"],
      })),
    };
  });
}

/**
 * Fetch Top Live Announcement Strip
 */
export async function getActiveAnnouncementStrip(): Promise<LiveAnnouncementStripViewModel | null> {
  const records = await directusFetch<Record<string, unknown>>(
    "announcements",
    { filter: { is_enabled: { _eq: true }, status: { _eq: "published" } }, sort: ["-priority"] },
    60
  );

  const item = records[0];
  if (!item) return null;

  return {
    id: String(item.id),
    title: (item.title as string) || "LIVE: ZIMBABWE SABLES",
    body: item.body as string,
    variant: (item.design_variant as string) || (item.badge as string) || "live_score",
    category: (item.badge as string) || "",
    urgent: Number(item.priority) >= 30,
  };
}

/**
 * Fetch Match by Slug for /matches/[slug]
 */
export async function getMatchBySlug(slug: string): Promise<MatchCardViewModel | null> {
  const matches = await getDirectusMatches();
  return matches.find((m) => m.slug === slug || m.id === slug) || null;
}

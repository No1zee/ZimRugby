import { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { directusFetch, directusCount } from "@/lib/directus/fetch";
import { getActiveCampaigns, type Campaign } from "@/lib/api/campaigns";
import { getDirectusMatches, getStandings } from "@/lib/match-centre/api";
import { requireAdmin } from "@/lib/admin/auth";
import { canAccessTab, canUseFeature } from "@/lib/admin/iam";
import type { AdminSession } from "@/lib/admin/auth";
import { listFanZoneMembers, listOnboardingSubmissions } from "@/lib/supabase/admin";
import type { MatchCardViewModel, StandingsTableViewModel } from "@/lib/match-centre/types";
import type { AdminEventRow } from "@/components/admin/EventsPanel";
import AdminAuthGate from "./AdminAuthGate";

const AdminContentManager = nextDynamic(() => import("./AdminClient"), {
  loading: () => (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-10">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 bg-white/10 rounded" />
        <div className="h-4 w-80 bg-white/5 rounded" />
        <div className="h-32 bg-white/5 rounded-lg" />
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Dashboard | ZRU Admin",
  description: "Manage website content for Zimbabwe Rugby Union.",
};

export const dynamic = "force-dynamic";

interface ActivityEntry {
  id: number;
  action: "create" | "update" | "delete" | "login" | "authenticate";
  collection: string;
  item: string | number;
  timestamp: string;
  user?: string;
}

async function fetchActivityFeed(): Promise<ActivityEntry[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const token = process.env.DIRECTUS_TOKEN;
    if (!baseUrl) return [];
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(
      `${baseUrl}/activity?limit=30&sort=-timestamp&fields=id,action,collection,item,timestamp,user.first_name,user.last_name,user.email&filter[collection][_nin]=directus_flows,directus_sessions,directus_presets`,
      { headers, next: { revalidate: 30 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []) as ActivityEntry[];
  } catch {
    return [];
  }
}

async function getAdminAnnouncements(): Promise<Record<string, unknown>[]> {
  try {
    return await directusFetch<Record<string, unknown>>("announcements", { sort: ["-created_at"], limit: 20 }, 60);
  } catch {
    return [];
  }
}

async function getAdminCollection<T>(collection: string, params: Record<string, unknown> = {}): Promise<T[]> {
  try {
    return await directusFetch<T>(collection, { fields: ["*"], limit: 500, ...params }, 60);
  } catch {
    return [];
  }
}

async function getLookups(): Promise<{
  teams: Record<string, unknown>[];
  players: Record<string, unknown>[];
  opponents: Record<string, unknown>[];
  competitions: Record<string, unknown>[];
  venues: Record<string, unknown>[];
  teamOptions: Array<{ id: string | number; name: string }>;
  opponentOptions: Array<{ id: string | number; name: string }>;
  competitionOptions: Array<{ id: string | number; name: string }>;
  venueOptions: Array<{ id: string | number; name: string }>;
}> {
  const map = (rows: Array<{ id?: string | number; name?: string; team_type?: string }>) =>
    rows
      .filter((r) => r.id != null && r.name)
      .map((r) => ({ id: r.id as string | number, name: r.name as string, teamType: (r.team_type as string) || undefined }))
      .sort((a, b) => a.name.localeCompare(b.name));
  const [teams, players, opponents, competitions, venues] = await Promise.all([
    directusFetch<Record<string, unknown>>("teams", { fields: ["*"], limit: 200 }, 60).catch(() => []),
    directusFetch<Record<string, unknown>>("players", { fields: ["*"], limit: 500 }, 60).catch(() => []),
    directusFetch<Record<string, unknown>>("opponents", { fields: ["*"], limit: 200 }, 60).catch(() => []),
    directusFetch<Record<string, unknown>>("competitions", { fields: ["*"], limit: 200 }, 60).catch(() => []),
    directusFetch<Record<string, unknown>>("venues", { fields: ["*"], limit: 200 }, 60).catch(() => []),
  ]);
  return {
    teams,
    players,
    opponents,
    competitions,
    venues,
    teamOptions: map(teams as Array<{ id?: string | number; name?: string }>),
    opponentOptions: map(opponents as Array<{ id?: string | number; name?: string }>),
    competitionOptions: map(competitions as Array<{ id?: string | number; name?: string }>),
    venueOptions: map(venues as Array<{ id?: string | number; name?: string }>),
  };
}

export default async function AdminDashboard() {
  // Server-side authorization gate â€” data is never fetched/serialized for
  // unauthenticated visitors. The client-side AdminAuthGate remains as a
  // defensive UX layer only.
  let session: AdminSession;
  try {
    session = await requireAdmin();
  } catch {
    redirect("/login?redirect=/admin");
  }

  const perms = session.permissions;
  const canTab = (tab: string) => canAccessTab(perms, tab);
  // Role-scoped data loading: each collection is only fetched when the actor's
  // tab grants expose a panel that displays it (least privilege â€” a viewer
  // never receives news/announcements/partners payloads in the HTML).
  const overview = canTab("overview");
  const showNews = canTab("media") || overview;
  const showEvents = canTab("events") || overview;
  const showMatches = canTab("fixtures") || overview;
  const showTeams = canTab("teams") || canTab("fixtures");
  const showGrassroots = canTab("grassroots");
  const showFaqFooter = canTab("faq-footer");
  const showCampaigns = canTab("campaigns") || overview;
  const showHeroLayout = canTab("hero_layout");
  const showSponsors = canTab("sponsors");
  const showResources = canTab("resources");
  const showAnnouncements = canTab("media");
  const showClubs = canTab("clubs");

  const [
    campaigns, announcements,
    news, events, eventOccurrences, grassrootsInitiatives, programmes, faqs, footerNav,
    eventsCount, teamCount, playerCount, matchCount, partnerCount, announcementCount,
    allMatches, standings, heroSlides, sponsors, resources, clubs, lookups,
    fanZoneMembers, onboardingSubmissions,
    activityFeed,
  ] = await Promise.all([
    showCampaigns ? getActiveCampaigns() : Promise.resolve([] as Campaign[]),
    showAnnouncements ? getAdminAnnouncements() : Promise.resolve([] as Record<string, unknown>[]),
    showNews ? getAdminCollection<Record<string, unknown>>("news") : Promise.resolve([] as Record<string, unknown>[]),
    showEvents ? getAdminCollection<Record<string, unknown>>("events") : Promise.resolve([] as Record<string, unknown>[]),
    showEvents ? getAdminCollection<Record<string, unknown>>("event_occurrences", { sort: ["starts_at"] }) : Promise.resolve([] as Record<string, unknown>[]),
    showGrassroots ? getAdminCollection<Record<string, unknown>>("grassroots_initiatives") : Promise.resolve([] as Record<string, unknown>[]),
    showGrassroots ? getAdminCollection<Record<string, unknown>>("programmes") : Promise.resolve([] as Record<string, unknown>[]),
    showFaqFooter ? getAdminCollection<Record<string, unknown>>("faqs") : Promise.resolve([] as Record<string, unknown>[]),
    showFaqFooter ? getAdminCollection<Record<string, unknown>>("footer_navigation") : Promise.resolve([] as Record<string, unknown>[]),
    showEvents ? directusCount("events") : Promise.resolve(0),
    showTeams ? directusCount("teams") : Promise.resolve(0),
    showTeams ? directusCount("players") : Promise.resolve(0),
    showMatches ? directusCount("matches") : Promise.resolve(0),
    showSponsors ? directusCount("partners") : Promise.resolve(0),
    showAnnouncements ? directusCount("announcements") : Promise.resolve(0),
    showMatches ? getDirectusMatches().catch(() => [] as MatchCardViewModel[]) : Promise.resolve([] as MatchCardViewModel[]),
    showMatches ? getStandings().catch(() => [] as StandingsTableViewModel[]) : Promise.resolve([] as StandingsTableViewModel[]),
    showHeroLayout ? getAdminCollection<Record<string, unknown>>("hero_slides") : Promise.resolve([] as Record<string, unknown>[]),
    showSponsors ? getAdminCollection<Record<string, unknown>>("partners") : Promise.resolve([] as Record<string, unknown>[]),
    showResources ? getAdminCollection<Record<string, unknown>>("referee_resources") : Promise.resolve([] as Record<string, unknown>[]),
    showClubs ? getAdminCollection<Record<string, unknown>>("clubs") : Promise.resolve([] as Record<string, unknown>[]),
    showTeams ? getLookups() : Promise.resolve({ teams: [], players: [], opponents: [], competitions: [], venues: [], teamOptions: [], opponentOptions: [], competitionOptions: [], venueOptions: [] } as Awaited<ReturnType<typeof getLookups>>),
    canUseFeature(perms, "fanzone_pii") ? listFanZoneMembers() : Promise.resolve([] as Awaited<ReturnType<typeof listFanZoneMembers>>),
    canUseFeature(perms, "fanzone_pii") ? listOnboardingSubmissions() : Promise.resolve([] as Awaited<ReturnType<typeof listOnboardingSubmissions>>),
    overview ? fetchActivityFeed() : Promise.resolve([] as ActivityEntry[]),
  ]);

  const stats = {
    eventCount: eventsCount,
    teamCount,
    playerCount,
    matchCount,
    partnerCount,
    announcementCount,
    campaignCount: campaigns.length,
    activeCampaignCount: campaigns.filter((c) => c.status === "running" || c.status === "published").length,
  };

  // Merge event occurrences onto their parent events (calendar SSoT).
  const eventsWithOccurrences = events.map((e) => ({
    ...e,
    occurrences: eventOccurrences.filter((o) => o.event_id === e.id),
  }));

  return (
    <AdminAuthGate>
      <AdminContentManager
        permissions={session.permissions}
        role={session.role}
        email={session.email}
        initialMatches={allMatches}
        initialStandings={standings}
        initialAnnouncements={announcements}
        initialFanZoneMembers={fanZoneMembers}
        initialOnboardingSubmissions={onboardingSubmissions}
        initialCampaigns={campaigns}
        initialNews={news}
        initialEvents={eventsWithOccurrences as unknown as AdminEventRow[]}
        initialGrassroots={grassrootsInitiatives}
        initialProgrammes={programmes}
        initialFaqs={faqs}
        initialFooterNav={footerNav}
        initialActivityFeed={activityFeed}
        teams={lookups.teamOptions}
        opponents={lookups.opponentOptions}
        competitions={lookups.competitionOptions}
        venues={lookups.venueOptions}
        initialTeams={lookups.teams}
        initialPlayers={lookups.players}
        initialOpponents={lookups.opponents}
        initialCompetitions={lookups.competitions}
        initialVenues={lookups.venues}
        initialHeroSlides={heroSlides}
        initialSponsors={sponsors}
        initialResources={resources}
        initialClubs={clubs}
        stats={stats}
      />
    </AdminAuthGate>
  );
}




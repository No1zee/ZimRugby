import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { directusFetch } from "@/lib/directus/fetch";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      newsStats,
      matches,
      eventsStats,
      grassrootsStats,
      announcementsStats,
      playersStats,
      partnersStats,
      teamsStats,
    ] = await Promise.all([
      // News - published and drafts
      directusFetch<{ id: number; status: string; date_created?: string; date_updated?: string }>("news", {
        fields: ["id", "status", "date_created", "date_updated"],
        filter: { deleted_at: { _null: true } },
        limit: -1,
      }).catch(() => []),

      // Matches - list to analyze upcoming, live, completed, team distribution
      directusFetch<{
        id: string;
        status: string;
        match_type: string;
        kickoff_at: string;
        team_id: string;
        opponent_id: string;
        home_score?: number | null;
        away_score?: number | null;
      }>("matches", {
        fields: ["id", "status", "match_type", "kickoff_at", "team_id", "opponent_id", "home_score", "away_score"],
        filter: { deleted_at: { _null: true } },
        limit: -1,
      }).catch(() => []),

      // Events
      directusFetch<{ id: number; status: string }>("events", {
        fields: ["id", "status"],
        filter: { deleted_at: { _null: true } },
        limit: -1,
      }).catch(() => []),

      // Grassroots
      directusFetch<{ id: number; status: string }>("grassroots_initiatives", {
        fields: ["id", "status"],
        filter: { deleted_at: { _null: true } },
        limit: -1,
      }).catch(() => []),

      // Announcements
      directusFetch<{ id: string; is_enabled: boolean }>("announcements", {
        fields: ["id", "is_enabled"],
        filter: { deleted_at: { _null: true } },
        limit: -1,
      }).catch(() => []),

      // Players
      directusFetch<{ id: number; squad_category?: string }>("players", {
        fields: ["id", "squad_category"],
        filter: { deleted_at: { _null: true } },
        limit: -1,
      }).catch(() => []),

      // Partners
      directusFetch<{ id: number; tier?: string }>("partners", {
        fields: ["id", "tier"],
        filter: { deleted_at: { _null: true } },
        limit: -1,
      }).catch(() => []),

      // Teams
      directusFetch<{ id: string; name: string }>("teams", {
        fields: ["id", "name"],
        filter: { deleted_at: { _null: true } },
        limit: -1,
      }).catch(() => []),
    ]);

    // Editorial Analytics
    const totalNews = newsStats.length;
    const publishedNews = newsStats.filter((n) => n.status === "published").length;
    const draftNews = newsStats.filter((n) => n.status === "draft" || n.status === "archived").length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentNewsCount = newsStats.filter((n) => {
      const date = n.date_updated || n.date_created;
      return date ? new Date(date) >= oneWeekAgo : false;
    }).length;

    // Fixture Analytics
    const now = new Date();
    const upcomingMatches = matches
      .filter((m) => new Date(m.kickoff_at) >= now && m.status !== "completed" && m.status !== "cancelled")
      .sort((a, b) => new Date(a.kickoff_at).getTime() - new Date(b.kickoff_at).getTime());

    const completedMatches = matches
      .filter((m) => m.status === "completed" || new Date(m.kickoff_at) < now)
      .sort((a, b) => new Date(b.kickoff_at).getTime() - new Date(a.kickoff_at).getTime());

    const liveMatches = matches.filter((m) => m.status === "live");

    const matchTypeCounts: Record<string, number> = {};
    matches.forEach((m) => {
      const type = m.match_type || "Other";
      matchTypeCounts[type] = (matchTypeCounts[type] || 0) + 1;
    });

    const activeAnnouncements = announcementsStats.filter((a) => a.is_enabled).length;

    return NextResponse.json({
      editorial: {
        totalNews,
        publishedNews,
        draftNews,
        recentVelocity7d: recentNewsCount,
        totalEvents: eventsStats.length,
        publishedEvents: eventsStats.filter((e) => e.status === "published").length,
        totalGrassroots: grassrootsStats.length,
        activeAnnouncements,
      },
      fixtures: {
        totalMatches: matches.length,
        upcomingCount: upcomingMatches.length,
        liveCount: liveMatches.length,
        completedCount: completedMatches.length,
        nextMatch: upcomingMatches[0] || null,
        lastResult: completedMatches[0] || null,
        byType: matchTypeCounts,
      },
      squads: {
        totalPlayers: playersStats.length,
        totalTeams: teamsStats.length,
        totalPartners: partnersStats.length,
      },
    });
  } catch (err: unknown) {
    console.error("Directus insights error:", err);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}

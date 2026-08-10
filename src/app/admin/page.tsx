import { Metadata } from "next";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { directusFetch, directusCount } from "@/lib/directus/fetch";
import { getActiveCampaigns } from "@/lib/api/campaigns";
import { getDirectusMatches, getStandings } from "@/lib/match-centre/api";
import { requireAdmin } from "@/lib/admin/auth";
import { canUseFeature } from "@/lib/admin/iam";
import type { AdminSession } from "@/lib/admin/auth";
import { listFanZoneMembers, listOnboardingSubmissions } from "@/lib/supabase/admin";
import type { Campaign } from "@/lib/api/campaigns";
import type { MatchCardViewModel, StandingsTableViewModel } from "@/lib/match-centre/types";
import {
  FileText,
  ArrowRight,
  ArrowUpRight,
  Layers,
  Globe,
  Eye,
  TrendingUp,
  Clock,
  ExternalLink,
  Pencil,
  Flag,
  Radio,
  Activity,
  CalendarDays,
  MapPin,
  Users,
  Image,
} from "lucide-react";
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

interface Page {
  id: string;
  slug: string;
  title: string;
  status: string;
  page_type?: string;
  hero_title?: string;
  updated_at?: string;
  sort?: number;
}

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
    const res = await fetch(`${baseUrl}/activity?limit=15&sort=-timestamp`, { headers, next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []) as ActivityEntry[];
  } catch {
    return [];
  }
}

async function getAdminAnnouncements(): Promise<Record<string, unknown>[]> {
  try {
    return await directusFetch<Record<string, unknown>>("announcements", { sort: ["-date_created"], limit: 20 }, 60);
  } catch {
    return [];
  }
}

async function getAdminCollection<T>(collection: string): Promise<T[]> {
  try {
    return await directusFetch<T>(collection, { fields: ["*"], limit: 100 }, 60);
  } catch {
    return [];
  }
}

async function getPageSectionCounts(): Promise<Record<string, number>> {
  try {
    const rows = await directusFetch<{ count: Record<string, number>; page_id: string }>(
      "page_sections",
      { aggregate: { count: "*" }, groupBy: ["page_id"] },
      0
    );
    const counts: Record<string, number> = {};
    rows.forEach((row) => {
      const value = row.count && typeof row.count === "object" ? Object.values(row.count)[0] : 0;
      counts[row.page_id] = typeof value === "number" ? value : 0;
    });
    return counts;
  } catch {
    return {};
  }
}

export default async function AdminDashboard() {
  // Server-side authorization gate — data is never fetched/serialized for
  // unauthenticated visitors. The client-side AdminAuthGate remains as a
  // defensive UX layer only.
  let session: AdminSession;
  try {
    session = await requireAdmin();
  } catch {
    redirect("/admin-login");
  }

  const [
    pages, sectionCounts,
    eventCount, teamCount, playerCount, matchCount, partnerCount, announcementCount,
    campaigns, allMatches, standings, announcements,
    news, grassrootsInitiatives, programmes, faqs, footerNav,
    fanZoneMembers, onboardingSubmissions,
    activityFeed,
  ] = await Promise.all([
    directusFetch<Page>("pages", { sort: ["sort"] }, 0),
    getPageSectionCounts(),
    directusCount("events"),
    directusCount("teams"),
    directusCount("players"),
    directusCount("matches"),
    directusCount("partners"),
    directusCount("announcements"),
    getActiveCampaigns(),
    getDirectusMatches().catch(() => [] as MatchCardViewModel[]),
    getStandings().catch(() => [] as StandingsTableViewModel[]),
    getAdminAnnouncements(),
    getAdminCollection<Record<string, unknown>>("news"),
    getAdminCollection<Record<string, unknown>>("grassroots_initiatives"),
    getAdminCollection<Record<string, unknown>>("programmes"),
    getAdminCollection<Record<string, unknown>>("faqs"),
    getAdminCollection<Record<string, unknown>>("footer_navigation"),
    canUseFeature(session.permissions, "fanzone_pii") ? listFanZoneMembers() : Promise.resolve([] as Awaited<ReturnType<typeof listFanZoneMembers>>),
    canUseFeature(session.permissions, "fanzone_pii") ? listOnboardingSubmissions() : Promise.resolve([] as Awaited<ReturnType<typeof listOnboardingSubmissions>>),
    fetchActivityFeed(),
  ]);

  const stats = {
    pagesCount: pages.length,
    publishedPages: pages.filter((p) => p.status === "published").length,
    draftPages: pages.length - pages.filter((p) => p.status === "published").length,
    totalSections: Object.values(sectionCounts).reduce((a, b) => a + b, 0),
    eventCount,
    teamCount,
    playerCount,
    matchCount,
    partnerCount,
    announcementCount,
    campaignCount: campaigns.length,
    activeCampaignCount: campaigns.filter((c) => c.status === "active" || c.status === "published").length,
  };

  return (
    <AdminAuthGate>
      <AdminContentManager
        permissions={session.permissions}
        initialMatches={allMatches}
        initialStandings={standings}
        initialAnnouncements={announcements}
        initialFanZoneMembers={fanZoneMembers}
        initialOnboardingSubmissions={onboardingSubmissions}
        initialCampaigns={campaigns}
        initialNews={news}
        initialGrassroots={grassrootsInitiatives}
        initialProgrammes={programmes}
        initialFaqs={faqs}
        initialFooterNav={footerNav}
        initialPages={pages}
        initialSectionCounts={sectionCounts}
        initialActivityFeed={activityFeed}
        stats={stats}
      />
    </AdminAuthGate>
  );
}

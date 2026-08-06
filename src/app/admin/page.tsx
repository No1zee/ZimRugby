import { Metadata } from "next";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import { directusFetch } from "@/lib/directus/fetch";
import { getActiveCampaigns } from "@/lib/api/campaigns";
import { getDirectusMatches, getStandings } from "@/lib/match-centre/api";
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

interface SectionCount {
  page_id: string;
  count: number;
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
    const sections = await directusFetch<{ id: number; page_id: string }>(
      "page_sections",
      { fields: ["id", "page_id"] },
      0
    );
    const counts: Record<string, number> = {};
    sections.forEach((s) => {
      counts[s.page_id] = (counts[s.page_id] || 0) + 1;
    });
    return counts;
  } catch {
    return {};
  }
}

async function getCount(collection: string): Promise<number> {
  try {
    const items = await directusFetch<{ id: string | number }>(collection, { fields: ["id"] }, 0);
    return items.length;
  } catch {
    return 0;
  }
}

export default async function AdminDashboard() {
  const [
    pages, sectionCounts,
    eventCount, teamCount, playerCount, matchCount, partnerCount, announcementCount,
    campaigns, allMatches, standings, announcements,
    news, grassrootsInitiatives, programmes, faqs, footerNav,
    activityFeed,
  ] = await Promise.all([
    directusFetch<Page>("pages", { sort: ["sort"] }, 0),
    getPageSectionCounts(),
    getCount("events"),
    getCount("teams"),
    getCount("players"),
    getCount("matches"),
    getCount("partners"),
    getCount("announcements"),
    getActiveCampaigns(),
    getDirectusMatches().catch(() => [] as MatchCardViewModel[]),
    getStandings().catch(() => [] as StandingsTableViewModel[]),
    getAdminAnnouncements(),
    getAdminCollection<Record<string, unknown>>("news"),
    getAdminCollection<Record<string, unknown>>("grassroots_initiatives"),
    getAdminCollection<Record<string, unknown>>("programmes"),
    getAdminCollection<Record<string, unknown>>("faqs"),
    getAdminCollection<Record<string, unknown>>("footer_navigation"),
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
        initialMatches={allMatches}
        initialStandings={standings}
        initialAnnouncements={announcements}
        initialFanZoneMembers={[]}
        initialOnboardingSubmissions={[]}
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

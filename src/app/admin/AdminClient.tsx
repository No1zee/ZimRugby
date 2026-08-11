"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, FileText, Flag, HelpCircle, LayoutDashboard, Radio, ShieldCheck, Sparkles, Sprout, Users, CalendarDays } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CollectionManager from "@/components/admin/CollectionManager";
import ArticleComposer from "@/components/admin/ArticleComposer";
import MatchCentrePanel from "@/components/admin/MatchCentrePanel";
import SignupsPanel from "@/components/admin/SignupsPanel";
import TodayOverview from "@/components/admin/TodayOverview";
import EventsPanel, { type AdminEventRow } from "@/components/admin/EventsPanel";
import { onAdminTab, setAdminTab } from "@/lib/admin/tab-events";
import { canAccessTab, type RolePermissions } from "@/lib/admin/iam";
import RolesPanel from "./roles/RolesPanel";
import PagesGrid from "./PagesGrid";
import CampaignsPanel from "./CampaignsPanel";
import AiAssistantPanel from "./AiAssistantPanel";
import type { MatchCardViewModel, StandingsTableViewModel } from "@/lib/match-centre/types";
import type { Campaign } from "@/lib/api/campaigns";

export interface LookupOption {
  id: string | number;
  name: string;
}

interface AdminClientProps {
  permissions: RolePermissions;
  initialMatches: MatchCardViewModel[];
  initialStandings: StandingsTableViewModel[];
  initialAnnouncements: Record<string, unknown>[];
  initialFanZoneMembers: Array<{
    id: number;
    name: string;
    email: string;
    favorite_team?: string;
    vip_code?: string;
    cdpa_consent: boolean;
    registered_at?: string;
  }>;
  initialOnboardingSubmissions: Array<{
    id: number;
    full_name: string;
    email: string;
    phone?: string;
    role: string;
    organization?: string;
    submitted_at?: string;
  }>;
  initialCampaigns: Campaign[];
  initialNews: Record<string, unknown>[];
  initialEvents: AdminEventRow[];
  initialGrassroots: Record<string, unknown>[];
  initialProgrammes: Record<string, unknown>[];
  initialFaqs: Record<string, unknown>[];
  initialFooterNav: Record<string, unknown>[];
  initialPages: Array<{
    id: string;
    slug: string;
    title: string;
    status: string;
    page_type?: string;
    hero_title?: string;
    updated_at?: string;
    sort?: number;
  }>;
  initialSectionCounts: Record<string, number>;
  initialActivityFeed: Array<{
    id: number;
    action: "create" | "update" | "delete" | "login" | "authenticate";
    collection: string;
    item: string | number;
    timestamp: string;
    user?: string;
  }>;
  teams: LookupOption[];
  opponents: LookupOption[];
  competitions: LookupOption[];
  venues: LookupOption[];
  stats: {
    pagesCount: number;
    publishedPages: number;
    draftPages: number;
    totalSections: number;
    eventCount: number;
    teamCount: number;
    playerCount: number;
    matchCount: number;
    partnerCount: number;
    announcementCount: number;
    campaignCount: number;
    activeCampaignCount: number;
  };
}

type TabId =
  | "overview"
  | "directus_ai"
  | "pages"
  | "media"
  | "grassroots"
  | "faq-footer"
  | "fixtures"
  | "events"
  | "campaigns"
  | "fanzone"
  | "onboarding"
  | "roles";

interface NavItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
  count: number;
}

export default function AdminClient(props: AdminClientProps) {
  const {
    permissions,
    initialMatches,
    initialStandings,
    initialAnnouncements,
    initialFanZoneMembers,
    initialOnboardingSubmissions,
    initialCampaigns,
    initialNews,
    initialEvents,
    initialGrassroots,
    initialProgrammes,
    initialFaqs,
    initialFooterNav,
    initialPages,
    initialSectionCounts,
    teams,
    opponents,
    competitions,
    venues,
    stats,
  } = props;

  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const NAV_SECTIONS: { id: string; label: string; items: NavItem[] }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      items: [
        { id: "overview", label: "Today", icon: LayoutDashboard, count: stats.activeCampaignCount },
        { id: "directus_ai", label: "AI Writer", icon: Sparkles, count: 0 },
      ],
    },
    {
      id: "content",
      label: "Content",
      items: [
        { id: "media", label: "News & Articles", icon: BookOpen, count: initialNews.length },
        { id: "pages", label: "Pages", icon: FileText, count: stats.pagesCount },
        { id: "events", label: "Events", icon: CalendarDays, count: stats.eventCount },
        { id: "grassroots", label: "Grassroots & Programmes", icon: Sprout, count: initialGrassroots.length + initialProgrammes.length },
        { id: "faq-footer", label: "FAQ & Footer", icon: HelpCircle, count: initialFaqs.length + initialFooterNav.length },
      ],
    },
    {
      id: "matches",
      label: "Matches",
      items: [
        { id: "fixtures", label: "Fixtures & Scores", icon: Radio, count: initialMatches.length },
      ],
    },
    {
      id: "fans",
      label: "Fans",
      items: [
        { id: "campaigns", label: "Campaigns", icon: Flag, count: stats.campaignCount },
        { id: "fanzone", label: "Fan Zone", icon: Users, count: initialFanZoneMembers.length },
        { id: "onboarding", label: "Enquiries", icon: ShieldCheck, count: initialOnboardingSubmissions.length },
      ],
    },
    {
      id: "admin",
      label: "Admin",
      items: [
        { id: "roles", label: "Roles & Permissions", icon: ShieldCheck, count: 0 },
      ],
    },
  ];

  const accessibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => canAccessTab(permissions, item.id)),
  })).filter((section) => section.items.length > 0);

  useEffect(() => {
    const unsubscribe = onAdminTab((tab) => {
      setActiveTab(tab as Parameters<typeof setActiveTab>[0]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!canAccessTab(permissions, activeTab)) {
      setActiveTab("overview");
    }
  }, [permissions, activeTab]);

  useEffect(() => {
    setAdminTab(activeTab);
  }, [activeTab]);

  function navigate(tab: TabId) {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="bg-milk-white min-h-screen pb-16 pt-8">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-zru-green px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                ZRU Content Manager
              </span>
            </div>
            <h1 className="font-heading text-3xl font-black uppercase text-rich-black">
              {NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.id === activeTab)?.label ?? "Dashboard"}
            </h1>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-black/5 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/70 transition-colors hover:bg-black/10"
          >
            View live website <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Section nav */}
        <div className="mb-6 space-y-3">
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-black/10 pb-4">
            {accessibleSections.map((section) => (
              <button
                key={section.id}
                onClick={() => navigate(section.items[0].id)}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
                  section.items.some((i) => i.id === activeTab)
                    ? "bg-zru-green text-white shadow-lg"
                    : "bg-black/5 text-black/70 hover:bg-black/10"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {accessibleSections
              .filter((s) => s.items.some((i) => i.id === activeTab))
              .map((section) =>
                section.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => navigate(tab.id)}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                        isActive ? "bg-black text-white" : "bg-black/5 text-black/70 hover:bg-black/10"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-black/10 text-black/70"}`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
          </div>
        </div>

        {/* Panel body */}
        {activeTab === "overview" && (
          <TodayOverview
            initialNews={initialNews}
            initialMatches={initialMatches}
            fanZoneCount={initialFanZoneMembers.length}
            onboardingCount={initialOnboardingSubmissions.length}
            onNavigate={(tab) => navigate(tab as TabId)}
          />
        )}

        {activeTab === "directus_ai" && <AiAssistantPanel />}

        {activeTab === "media" && (
          <div className="space-y-8">
            <ArticleComposer />
            <CollectionManager
              collection="news"
              title="News articles"
              description="Articles here appear in the homepage Latest News panel and the media archive."
              fields={[
                { key: "title", label: "Headline", type: "text", placeholder: "e.g. Sables squad named for Rugby Africa Cup", required: true, colSpan: "full" },
                { key: "slug", label: "Web address (slug)", type: "text", placeholder: "auto-generated", colSpan: "full" },
                { key: "excerpt", label: "Summary", type: "textarea", placeholder: "One or two sentences shown on cards", colSpan: "full" },
                { key: "body", label: "Body", type: "richtext", colSpan: "full" },
                { key: "category", label: "Category", type: "text", placeholder: "e.g. NEWS" },
                { key: "date", label: "Publish date", type: "date" },
                { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
                { key: "image", label: "Hero image", type: "image" },
              ]}
              items={initialNews}
              displayField="title"
              subtitleField="date"
              badgeField="category"
              statusField="status"
              searchable={["title", "excerpt", "category"]}
              singularLabel="article"
            />
            <CollectionManager
              collection="announcements"
              title="Banners & announcements"
              description="Short alert banners shown on the site (e.g. ticket on-sale notices)."
              fields={[
                { key: "title", label: "Title", type: "text", placeholder: "e.g. Tickets on sale now", required: true, colSpan: "full" },
                { key: "body", label: "Message", type: "textarea", colSpan: "full" },
                { key: "category", label: "Category", type: "text", placeholder: "e.g. Sables" },
                { key: "priority", label: "Priority", type: "select", options: ["normal", "high", "urgent"] },
                { key: "is_enabled", label: "Show on website", type: "boolean" },
                { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
              ]}
              items={initialAnnouncements}
              displayField="title"
              subtitleField="category"
              statusField="is_enabled"
              searchable={["title", "body"]}
              singularLabel="announcement"
            />
          </div>
        )}

        {activeTab === "pages" && (
          <PagesGrid initialPages={initialPages} initialSectionCounts={initialSectionCounts} />
        )}

        {activeTab === "events" && <EventsPanel initialEvents={initialEvents} />}

        {activeTab === "grassroots" && (
          <div className="space-y-8">
            <CollectionManager
              collection="grassroots_initiatives"
              title="Grassroots initiatives"
              description="Cards shown in the homepage Grassroots & Youth Rugby section."
              fields={[
                { key: "title", label: "Title", type: "text", placeholder: "e.g. Schoolboy & Schoolgirl Leagues", required: true },
                { key: "badge", label: "Badge", type: "text", placeholder: "e.g. YOUTH PATHWAYS" },
                { key: "subtitle", label: "Subtitle", type: "text", placeholder: "e.g. PRIMARY & SECONDARY SCHOOLS" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "stat", label: "Stat", type: "text", placeholder: "e.g. 120+" },
                { key: "stat_label", label: "Stat label", type: "text", placeholder: "e.g. Participating Schools" },
                { key: "image", label: "Image", type: "image" },
                { key: "link", label: "Link (route)", type: "text", placeholder: "e.g. /schools" },
                { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
              ]}
              items={initialGrassroots}
              displayField="title"
              subtitleField="subtitle"
              badgeField="badge"
              statusField="status"
            />
            <CollectionManager
              collection="programmes"
              title="Programmes (Play Rugby)"
              description="Programmes displayed on the Play Rugby page."
              fields={[
                { key: "title", label: "Title", type: "text", placeholder: "e.g. Get Into Rugby", required: true },
                { key: "description", label: "Description", type: "textarea" },
                { key: "icon", label: "Icon", type: "text", placeholder: "e.g. rugby-ball, users, trophy" },
                { key: "link", label: "Link (route)", type: "text", placeholder: "e.g. /play-rugby" },
                { key: "stat", label: "Stat", type: "text", placeholder: "e.g. 15,000+" },
                { key: "stat_label", label: "Stat label", type: "text", placeholder: "e.g. Active Children" },
                { key: "color", label: "Colour", type: "text", placeholder: "e.g. #006B3F" },
                { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
              ]}
              items={initialProgrammes}
              displayField="title"
              subtitleField="link"
              statusField="status"
            />
          </div>
        )}

        {activeTab === "faq-footer" && (
          <div className="space-y-8">
            <CollectionManager
              collection="faqs"
              title="Frequently asked questions"
              description="FAQs displayed on the Tickets page."
              fields={[
                { key: "question", label: "Question", type: "text", placeholder: "e.g. How do I buy tickets?", required: true, colSpan: "full" },
                { key: "answer", label: "Answer", type: "richtext", colSpan: "full" },
                { key: "category", label: "Category", type: "text", placeholder: "e.g. Tickets" },
                { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
              ]}
              items={initialFaqs}
              displayField="question"
              subtitleField="category"
              statusField="status"
            />
            <CollectionManager
              collection="footer_navigation"
              title="Footer navigation"
              description="Link columns shown in the website footer."
              fields={[
                { key: "column_title", label: "Column title", type: "text", placeholder: "e.g. About ZRU", required: true },
                { key: "links", label: "Links (JSON array)", type: "textarea", colSpan: "full", placeholder: '[{"label":"Governance","url":"/about/governance"}]' },
                { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
              ]}
              items={initialFooterNav}
              displayField="column_title"
              statusField="status"
            />
          </div>
        )}

        {activeTab === "fixtures" && (
          <MatchCentrePanel
            initialMatches={initialMatches}
            initialStandings={initialStandings}
            teams={teams}
            opponents={opponents}
            competitions={competitions}
            venues={venues}
          />
        )}

        {activeTab === "campaigns" && <CampaignsPanel initialCampaigns={initialCampaigns} />}

        {activeTab === "fanzone" && (
          <SignupsPanel
            mode="fanzone"
            initialFanZoneMembers={initialFanZoneMembers}
            initialOnboardingSubmissions={[]}
          />
        )}

        {activeTab === "onboarding" && (
          <SignupsPanel
            mode="onboarding"
            initialFanZoneMembers={[]}
            initialOnboardingSubmissions={initialOnboardingSubmissions}
          />
        )}

        {activeTab === "roles" && <RolesPanel />}
      </div>
    </main>
  );
}

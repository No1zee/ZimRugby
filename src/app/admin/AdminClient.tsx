"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, FileText, Flag, HelpCircle, LayoutDashboard, Radio, ShieldCheck, Sparkles, Sprout, Users, CalendarDays, Trophy, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CollectionManager from "@/components/admin/CollectionManager";
import ArticleComposer from "@/components/admin/ArticleComposer";
import MatchCentrePanel from "@/components/admin/MatchCentrePanel";
import SignupsPanel from "@/components/admin/SignupsPanel";
import TodayOverview from "@/components/admin/TodayOverview";
import EventsPanel, { type AdminEventRow } from "@/components/admin/EventsPanel";
import CollapsibleSection from "@/components/admin/ui/CollapsibleSection";
import { ToastProvider, useToast } from "@/components/admin/ui/ToastProvider";
import { ConfirmProvider, useConfirm } from "@/components/admin/ui/ConfirmProvider";
import { onAdminTab, setAdminTab } from "@/lib/admin/tab-events";
import { canAccessPanel, canOnCollection, type RolePermissions } from "@/lib/admin/iam";
import RolesPanel from "./roles/RolesPanel";
import PagesGrid from "./PagesGrid";
import CampaignsPanel from "./CampaignsPanel";
import AiAssistantPanel from "./AiAssistantPanel";
import AuditLogsPanel from "@/components/admin/AuditLogsPanel";
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
  initialTeams: Record<string, unknown>[];
  initialOpponents: Record<string, unknown>[];
  initialCompetitions: Record<string, unknown>[];
  initialVenues: Record<string, unknown>[];
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
  | "teams"
  | "events"
  | "campaigns"
  | "fanzone"
  | "onboarding"
  | "roles"
  | "audit_logs";

interface NavItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
  count: number;
}

function AdminClientInner(props: AdminClientProps) {
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
    initialActivityFeed,
    teams,
    opponents,
    competitions,
    venues,
    initialTeams,
    initialOpponents,
    initialCompetitions,
    initialVenues,
    stats,
  } = props;

  const confirm = useConfirm();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [panelDirty, setPanelDirty] = useState<Record<string, boolean>>({});
  const [teamsRemountKey, setTeamsRemountKey] = useState(0);
  const [focusItem, setFocusItem] = useState<{ id: string | number } | null>(null);

  const dirty = Object.values(panelDirty).some(Boolean);

  const registerDirty = (panel: string) => (d: boolean) => {
    setPanelDirty((prev) => (prev[panel] === d ? prev : { ...prev, [panel]: d }));
  };

  const teamsCount = initialTeams.length + initialOpponents.length + initialCompetitions.length + initialVenues.length;

  const grantsFor = (collection: string) => ({
    create: canOnCollection(permissions, collection, "create"),
    update: canOnCollection(permissions, collection, "update"),
    delete: canOnCollection(permissions, collection, "delete"),
  });

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
        { id: "teams", label: "Teams & Squads", icon: Trophy, count: teamsCount },
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
    items: section.items.filter((item) => canAccessPanel(permissions, item.id)),
  })).filter((section) => section.items.length > 0);

  useEffect(() => {
    const unsubscribe = onAdminTab((intent) => {
      setActiveTab(intent.tab as Parameters<typeof setActiveTab>[0]);
      if (intent.openItem !== undefined) setFocusItem({ id: intent.openItem });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!canAccessPanel(permissions, activeTab)) {
      setActiveTab("overview");
    }
  }, [permissions, activeTab]);

  useEffect(() => {
    setAdminTab(activeTab);
  }, [activeTab]);

  // Sync activeTab with URL hash/query parameter on load and tab change (#12)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab") as TabId | null;
    if (tabParam && tabParam !== activeTab && canAccessPanel(permissions, tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Global Keyboard Navigation Shortcuts (#17)
  useEffect(() => {
    let lastKey = "";
    let lastKeyTime = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is typing in inputs or textareas
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;
      const now = Date.now();
      const key = e.key.toLowerCase();

      if ((lastKey === "g" || lastKey === "G") && now - lastKeyTime < 800) {
        if (key === "h") { navigate("overview"); toast("Navigated to Dashboard", "info"); }
        if (key === "m") { navigate("fixtures"); toast("Navigated to Matches", "info"); }
        if (key === "n") { navigate("media"); toast("Navigated to News", "info"); }
        if (key === "s") { navigate("fanzone"); toast("Navigated to Signups", "info"); }
        lastKey = "";
        return;
      }
      lastKey = key;
      lastKeyTime = now;
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  async function navigate(tab: TabId) {
    if (tab === activeTab) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (dirty) {
      const ok = await confirm({
        title: "Discard unsaved changes?",
        message: "You have unsaved changes in a form. Leaving this tab will lose them.",
        confirmLabel: "Discard changes",
        danger: true,
      });
      if (!ok) return;
      setPanelDirty({});
      setTeamsRemountKey((k) => k + 1);
    }
    setActiveTab(tab);
    setFocusItem(null);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // One-Click CDN Purge Handler (#1)
  const [isPurgingCache, setIsPurgingCache] = useState(false);
  const handlePurgeCache = async () => {
    setIsPurgingCache(true);
    try {
      const res = await fetch("/api/revalidate", { method: "POST" });
      if (res.ok) {
        toast("CDN Cache Purged Successfully! Live site updated.", "success");
      } else {
        toast("Failed to purge cache. Please try again.", "error");
      }
    } catch {
      toast("Network error while purging CDN cache.", "error");
    } finally {
      setIsPurgingCache(false);
    }
  };

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

          <div className="flex flex-wrap items-center gap-3">
            {/* One-Click CDN Cache Purge Button (#1) */}
            <button
              onClick={handlePurgeCache}
              disabled={isPurgingCache}
              className="inline-flex items-center gap-2 rounded-xl bg-zru-green px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white shadow-sm transition-all hover:bg-zru-green/90 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isPurgingCache ? "animate-spin" : ""}`} />
              {isPurgingCache ? "Purging..." : "Purge CDN Cache"}
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-black/5 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/70 transition-colors hover:bg-black/10"
            >
              View live website <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
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
            initialActivityFeed={initialActivityFeed}
            onNavigate={(tab) => navigate(tab as TabId)}
          />
        )}

        {activeTab === "directus_ai" && <AiAssistantPanel />}

        {activeTab === "media" && (
          <div className="space-y-8">
            <ArticleComposer onDirtyChange={registerDirty("composer")} />
            <CollectionManager
              collection="news"
              title="News articles"
              description="Articles here appear in the homepage Latest News panel and the media archive."
              grants={grantsFor("news")}
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
              onDirtyChange={registerDirty("news")}
              focusId={activeTab === "media" ? focusItem?.id : null}
              onFocusHandled={() => setFocusItem(null)}
            />
            <CollectionManager
              collection="announcements"
              title="Banners & announcements"
              description="Short alert banners shown on the site (e.g. ticket on-sale notices)."
              grants={grantsFor("announcements")}
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
              onDirtyChange={registerDirty("announcements")}
            />
          </div>
        )}

        {activeTab === "pages" && (
          <PagesGrid initialPages={initialPages} initialSectionCounts={initialSectionCounts} />
        )}

        {activeTab === "events" && <EventsPanel initialEvents={initialEvents} onDirtyChange={registerDirty("events")} />}

        {activeTab === "grassroots" && (
          <div className="space-y-8">
            <CollectionManager
              collection="grassroots_initiatives"
              title="Grassroots initiatives"
              description="Cards shown in the homepage Grassroots & Youth Rugby section."
              grants={grantsFor("grassroots_initiatives")}
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
              grants={grantsFor("programmes")}
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
              grants={grantsFor("faqs")}
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
              grants={grantsFor("footer_navigation")}
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
            onDirtyChange={registerDirty("fixtures")}
          />
        )}

        {activeTab === "teams" && (
          <div className="space-y-6">
            <CollapsibleSection
              key={`teams-${teamsRemountKey}`}
              title="National teams"
              icon={<Trophy className="h-5 w-5" />}
              description="Senior and age-grade national squads (Sables, Lady Sables, U20â€¦)."
              defaultOpen={true}
            >
              <CollectionManager
                collection="teams"
                title="Teams"
                description="National squads shown across the site."
                grants={grantsFor("teams")}
                fields={[
                  { key: "name", label: "Name", type: "text", placeholder: "e.g. Zimbabwe Sables", required: true },
                  { key: "short_name", label: "Short name", type: "text", placeholder: "e.g. Sables" },
                  { key: "code", label: "Code", type: "text", placeholder: "e.g. ZIM" },
                  { key: "slug", label: "Slug", type: "text", placeholder: "e.g. sables" },
                  { key: "team_type", label: "Team type", type: "select", options: ["mens_15s", "womens_15s", "mens_7s", "womens_7s", "age_grade", "club"] },
                  { key: "gender", label: "Gender", type: "select", options: ["men", "women"] },
                  { key: "age_grade", label: "Age grade", type: "text", placeholder: "e.g. U20" },
                  { key: "filter_label", label: "Filter label", type: "text", placeholder: "e.g. Sables" },
                  { key: "display_name", label: "Display name", type: "text", placeholder: "e.g. Zimbabwe Rugby Union Men's National Team" },
                  { key: "crest", label: "Crest image", type: "image" },
                  { key: "primary_color", label: "Primary colour", type: "text", placeholder: "e.g. #006B3F" },
                  { key: "secondary_color", label: "Secondary colour", type: "text", placeholder: "e.g. #F5B800" },
                  { key: "is_national_team", label: "National team", type: "boolean" },
                  { key: "is_active", label: "Active (shown in filters)", type: "boolean" },
                  { key: "display_order", label: "Display order", type: "number" },
                  { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
                ]}
                items={initialTeams}
                displayField="name"
                subtitleField="team_type"
                badgeField="code"
                statusField="is_active"
                searchable={["name", "short_name", "code", "filter_label"]}
                singularLabel="team"
                onDirtyChange={registerDirty("teams")}
              />
            </CollapsibleSection>

            <CollapsibleSection
              key={`opponents-${teamsRemountKey}`}
              title="Opponents"
              icon={<Trophy className="h-5 w-5" />}
              description="International and club sides Zimbabwe plays against."
              defaultOpen={false}
            >
              <CollectionManager
                collection="opponents"
                title="Opponents"
                description="Sides used in the fixtures dropdown."
                grants={grantsFor("opponents")}
                fields={[
                  { key: "name", label: "Name", type: "text", placeholder: "e.g. Namibia", required: true },
                  { key: "short_name", label: "Short name", type: "text", placeholder: "e.g. NAM" },
                  { key: "code", label: "Code", type: "text", placeholder: "e.g. NAM" },
                  { key: "slug", label: "Slug", type: "text", placeholder: "e.g. namibia" },
                  { key: "country", label: "Country", type: "text", placeholder: "e.g. Namibia" },
                  { key: "team_type", label: "Team type", type: "select", options: ["international", "club", "province", "tour"] },
                  { key: "crest", label: "Crest image", type: "image" },
                  { key: "notes", label: "Notes", type: "textarea", colSpan: "full" },
                  { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
                ]}
                items={initialOpponents}
                displayField="name"
                subtitleField="country"
                badgeField="code"
                statusField="status"
                searchable={["name", "short_name", "country"]}
                singularLabel="opponent"
                onDirtyChange={registerDirty("opponents")}
              />
            </CollapsibleSection>

            <CollapsibleSection
              key={`competitions-${teamsRemountKey}`}
              title="Competitions"
              icon={<Trophy className="h-5 w-5" />}
              description="Tournaments and leagues (Rugby Africa Cup, Gold Cupâ€¦)."
              defaultOpen={false}
            >
              <CollectionManager
                collection="competitions"
                title="Competitions"
                description="Competitions used in the fixtures dropdown."
                grants={grantsFor("competitions")}
                fields={[
                  { key: "name", label: "Name", type: "text", placeholder: "e.g. Rugby Africa Cup", required: true },
                  { key: "short_name", label: "Short name", type: "text", placeholder: "e.g. RAC" },
                  { key: "slug", label: "Slug", type: "text", placeholder: "e.g. rugby-africa-cup" },
                  { key: "competition_type", label: "Competition type", type: "select", options: ["international", "domestic", "club", "schools"] },
                  { key: "season_label", label: "Season label", type: "text", placeholder: "e.g. 2026" },
                  { key: "governing_body", label: "Governing body", type: "text", placeholder: "e.g. Rugby Africa" },
                  { key: "logo", label: "Logo image", type: "image" },
                  { key: "description", label: "Description", type: "textarea", colSpan: "full" },
                  { key: "is_standings_enabled", label: "Standings enabled", type: "boolean" },
                  { key: "sort", label: "Sort order", type: "number" },
                  { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
                ]}
                items={initialCompetitions}
                displayField="name"
                subtitleField="season_label"
                badgeField="competition_type"
                statusField="status"
                searchable={["name", "short_name", "governing_body"]}
                singularLabel="competition"
                onDirtyChange={registerDirty("competitions")}
              />
            </CollapsibleSection>

            <CollapsibleSection
              key={`venues-${teamsRemountKey}`}
              title="Venues"
              icon={<Trophy className="h-5 w-5" />}
              description="Stadiums and grounds used for fixtures."
                defaultOpen={false}
                dirty={panelDirty["venues"]}
                onDirtyChange={registerDirty("venues")}
            >
              <CollectionManager
                collection="venues"
                title="Venues"
                description="Venues used in the fixtures dropdown."
                grants={grantsFor("venues")}
                fields={[
                  { key: "name", label: "Name", type: "text", placeholder: "e.g. Hartsfield Grounds", required: true },
                  { key: "slug", label: "Slug", type: "text", placeholder: "e.g. hartsfield-grounds" },
                  { key: "city", label: "City", type: "text", placeholder: "e.g. Bulawayo" },
                  { key: "region", label: "Region", type: "text", placeholder: "e.g. Matabeleland North" },
                  { key: "country", label: "Country", type: "text", placeholder: "e.g. Zimbabwe" },
                  { key: "full_label", label: "Full label", type: "text", placeholder: "e.g. Hartsfield Grounds, Bulawayo" },
                  { key: "address", label: "Address", type: "text", placeholder: "e.g. 12 Park Road" },
                  { key: "google_maps_url", label: "Google Maps URL", type: "text", placeholder: "https://maps.google.com/â€¦" },
                  { key: "timezone", label: "Timezone", type: "text", placeholder: "e.g. Africa/Harare" },
                  { key: "capacity", label: "Capacity", type: "number" },
                  { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
                ]}
                items={initialVenues}
                displayField="name"
                subtitleField="city"
                badgeField="country"
                statusField="status"
                searchable={["name", "city", "region", "full_label"]}
                singularLabel="venue"
                onDirtyChange={registerDirty("venues")}
              />
            </CollapsibleSection>
          </div>
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
        {activeTab === "audit_logs" && <AuditLogsPanel />}
      </div>
    </main>
  );
}

export default function AdminClient(props: AdminClientProps) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AdminClientInner {...props} />
      </ConfirmProvider>
    </ToastProvider>
  );
}

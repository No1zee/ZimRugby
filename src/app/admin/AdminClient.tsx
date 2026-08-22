"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, FileText, Flag, HelpCircle, LayoutDashboard, Radio, ShieldCheck, Sparkles, Sprout, Users, CalendarDays, Trophy, RefreshCw, Layers, Handshake, FolderOpen, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
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
import CampaignsPanel from "./CampaignsPanel";
import PagesGrid from "./PagesGrid";
import AiAssistantPanel from "./AiAssistantPanel";
import AuditLogsPanel from "@/components/admin/AuditLogsPanel";
import HeroLayoutPanel from "@/components/admin/HeroLayoutPanel";
import SponsorsPanel from "@/components/admin/SponsorsPanel";
import ResourcesPanel from "@/components/admin/ResourcesPanel";
import BackupsPanel from "@/components/admin/BackupsPanel";
import VisualTeamsManager from "@/components/admin/VisualTeamsManager";
import NewsMasterDetailPanel from "@/components/admin/panels/NewsMasterDetailPanel";
import AdminInactivityLock from "@/components/admin/ui/AdminInactivityLock";
import type { MatchCardViewModel, StandingsTableViewModel } from "@/lib/match-centre/types";
import type { Campaign } from "@/lib/api/campaigns";

export interface LookupOption {
  id: string | number;
  name: string;
  teamType?: string;
}

interface AdminClientProps {
  permissions: RolePermissions;
  role: string;
  email: string;
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
  initialPages?: Array<{
    id: string;
    slug: string;
    title: string;
    status: string;
    page_type?: string;
    hero_title?: string;
    updated_at?: string;
    sort?: number;
  }>;
  initialSectionCounts?: Record<string, number>;
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
  initialPlayers?: Record<string, unknown>[];
  initialOpponents: Record<string, unknown>[];
  initialCompetitions: Record<string, unknown>[];
  initialVenues: Record<string, unknown>[];
  initialHeroSlides: Record<string, unknown>[];
  initialSponsors: Record<string, unknown>[];
  initialResources: Record<string, unknown>[];
  initialClubs: Record<string, unknown>[];
  stats: {
    pagesCount?: number;
    publishedPages?: number;
    draftPages?: number;
    totalSections?: number;
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
  | "hero_layout"
  | "pages"
  | "media"
  | "events"
  | "resources"
  | "sponsors"
  | "grassroots"
  | "faq-footer"
  | "fixtures"
  | "teams"
  | "clubs"
  | "campaigns"
  | "fanzone"
  | "onboarding"
  | "roles"
  | "audit_logs"
  | "backups";

interface NavItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
  count: number;
}

function AdminClientInner(props: AdminClientProps) {
  const {
    permissions,
    role,
    email,
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
    initialPages = [],
    initialSectionCounts = {},
    initialActivityFeed,
    teams,
    opponents,
    competitions,
    venues,
    initialTeams,
    initialPlayers = [],
    initialOpponents,
    initialCompetitions,
    initialVenues,
    initialHeroSlides,
    initialSponsors,
    initialResources,
    initialClubs,
    stats,
  } = props;

  const confirm = useConfirm();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [panelDirty, setPanelDirty] = useState<Record<string, boolean>>({});
  const [teamsRemountKey, setTeamsRemountKey] = useState(0);
  const [focusItem, setFocusItem] = useState<{ id: string | number } | null>(null);

  const dirty = Object.values(panelDirty).some(Boolean);

  const canReview = role === "super_admin" || role === "editor";

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
      label: "Home",
      items: [
        { id: "overview", label: "Today", icon: LayoutDashboard, count: stats.activeCampaignCount },
        { id: "directus_ai", label: "Drafting Assistant", icon: Sparkles, count: 0 },
      ],
    },
    {
      id: "content",
      label: "Site & Audience",
      items: [
        { id: "hero_layout", label: "Homepage & Banners", icon: Layers, count: 0 },
        { id: "media", label: "News & Stories", icon: BookOpen, count: initialNews.length },
                { id: "events", label: "Events & Festivals", icon: CalendarDays, count: stats.eventCount },
        { id: "clubs", label: "Clubs", icon: Building2, count: initialClubs.length },
        { id: "resources", label: "Resources", icon: FolderOpen, count: 0 },
        { id: "sponsors", label: "Sponsors & Partners", icon: Handshake, count: 0 },
        { id: "grassroots", label: "Clubs & Development", icon: Sprout, count: initialGrassroots.length + initialProgrammes.length },
        { id: "faq-footer", label: "Help & Footer", icon: HelpCircle, count: initialFaqs.length + initialFooterNav.length },
      ],
    },
    {
      id: "matches",
      label: "Matches",
      items: [
        { id: "fixtures", label: "Fixtures & Results", icon: Radio, count: initialMatches.length },
        { id: "teams", label: "Teams & Squads", icon: Trophy, count: teamsCount },
      ],
    },
    {
      id: "fans",
      label: "Fans & Partners",
      items: [
        { id: "campaigns", label: "Campaigns", icon: Flag, count: stats.campaignCount },
        { id: "fanzone", label: "Fan Zone", icon: Users, count: initialFanZoneMembers.length },
        { id: "onboarding", label: "Enquiries", icon: ShieldCheck, count: initialOnboardingSubmissions.length },
      ],
    },
    {
      id: "admin",
      label: "Team & Safety",
      items: [
        { id: "roles", label: "Team & Permissions", icon: ShieldCheck, count: 0 },
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

  // Sync activeTab with URL hash/query parameter and localStorage on load and tab change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#/, "") as TabId;
    const params = new URLSearchParams(window.location.search);
    const tabParam = (hash || params.get("tab") || localStorage.getItem("zru_admin_last_tab")) as TabId | null;
    if (tabParam && tabParam !== activeTab && canAccessPanel(permissions, tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("zru_admin_last_tab", activeTab);
      window.history.replaceState(null, "", `#${activeTab}`);
    }
  }, [activeTab]);

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
        toast("Live site refreshed ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â changes are now visible.", "success");
      } else {
        toast("Could not refresh the live site. Please try again.", "error");
      }
    } catch {
      toast("Network error while refreshing the live site.", "error");
    } finally {
      setIsPurgingCache(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF0] text-[#1b1c1c] font-sans antialiased">
      {/* ── TopNavBar (Stitch Design) ─────────────────────────────────── */}
      <header className="bg-[#002d19] text-white flex justify-between items-center w-full px-6 h-16 border-b border-white/10 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8 h-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006c4a] flex items-center justify-center text-white font-heading font-black text-sm shadow-xs">
              Z
            </div>
            <div>
              <h1 className="text-base font-heading font-bold text-white tracking-tight leading-none m-0">
                The Touchline
              </h1>
              <span className="text-[9px] text-[#84d7af] font-mono uppercase tracking-widest font-semibold">
                ZRU Studio
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex h-full items-end gap-5">
            <button
              type="button"
              onClick={() => navigate("overview")}
              className={`h-full flex items-center px-2 py-3.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "text-white border-b-2 border-[#3be0a2]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate("media")}
              className={`h-full flex items-center px-2 py-3.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === "media" || activeTab === "hero_layout"
                  ? "text-white border-b-2 border-[#3be0a2]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Editorial
            </button>
            <button
              type="button"
              onClick={() => navigate("fixtures")}
              className={`h-full flex items-center px-2 py-3.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === "fixtures" || activeTab === "teams" || activeTab === "clubs"
                  ? "text-white border-b-2 border-[#3be0a2]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Match Ops
            </button>
            <button
              type="button"
              onClick={() => navigate("onboarding")}
              className={`h-full flex items-center px-2 py-3.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === "onboarding" || activeTab === "fanzone" || activeTab === "campaigns"
                  ? "text-white border-b-2 border-[#3be0a2]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Governance
            </button>
          </nav>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePurgeCache}
            disabled={isPurgingCache}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPurgingCache ? "animate-spin" : ""}`} />
            <span>{isPurgingCache ? "Syncing..." : "Sync Live Site"}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006c4a] hover:bg-[#00875a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Site</span>
          </a>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#006c4a] text-white flex items-center justify-center text-xs font-black font-heading border border-white/20 shadow-xs uppercase">
              {email ? email.charAt(0) : "A"}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-white/90">
              {email ? email.split("@")[0] : "Admin"}
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Layout Container ───────────────────────────────────── */}
      <div className="flex-1 flex w-full">
        {/* SideNavBar (Desktop) */}
        <AdminSidebar
          activeTab={activeTab}
          onNavigate={(tab) => navigate(tab as TabId)}
          permissions={permissions}
          userEmail={email}
          userRole={role}
        />

        {/* Main Content Canvas */}
        <main className="flex-1 flex flex-col lg:pl-64 w-full min-h-screen p-4 md:p-6 lg:p-8">
          <div className="max-w-[1440px] mx-auto w-full space-y-6">

        {/* Panel body */}
        {activeTab === "overview" && (
          <TodayOverview
            permissions={permissions}
            role={role}
            email={email}
            canReview={canReview}
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
            <NewsMasterDetailPanel
              initialNews={initialNews as any[]}
              canPublish={canReview}
              currentUserEmail={email}
            />
            <CollectionManager
              collection="announcements"
              title="Banners & announcements"
              description="Short alert banners shown on the site (e.g. ticket on-sale notices)."
              grants={grantsFor("announcements")}
              canPurge={permissions?.all === true}
              fields={[
                { key: "title", label: "Title", type: "text", placeholder: "e.g. Tickets on sale now", required: true, colSpan: "full" },
                { key: "body", label: "Message", type: "textarea", colSpan: "full" },
                { key: "design_variant", label: "Design variant", type: "select", options: ["banner", "spotlight-card", "ticker", "overlay"] },
                { key: "badge", label: "Badge", type: "text", placeholder: "e.g. TICKET ALERT, LIVE UPDATES" },
                { key: "priority", label: "Priority (0 normal / 20 high / 30 critical)", type: "select", options: ["0", "20", "30"] },
                { key: "starts_at", label: "Show from (UTC)", type: "datetime" },
                { key: "ends_at", label: "Show until (UTC)", type: "datetime" },
                { key: "segment", label: "Audience segment", type: "select", options: ["general", "sables", "lady_sables", "schools"] },
                { key: "scope", label: "Scope (comma-separated)", type: "csv", placeholder: "global, homepage, media" },
                { key: "cta_label", label: "Button label", type: "text", placeholder: "e.g. BOOK TICKETS" },
                { key: "cta_url", label: "Button link (route)", type: "text", placeholder: "e.g. /tickets" },
                { key: "is_sticky", label: "Sticky (stays pinned)", type: "boolean" },
                { key: "is_enabled", label: "Show on website", type: "boolean" },
                { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
              ]}
              items={initialAnnouncements}
              displayField="title"
              subtitleField="badge"
              statusField="is_enabled"
              scheduleField={{ starts: "starts_at", ends: "ends_at" }}
              searchable={["title", "body", "badge"]}
              singularLabel="announcement"
              onDirtyChange={registerDirty("announcements")}
            />
          </div>
        )}

        {activeTab === "pages" && (
          <PagesGrid initialPages={initialPages as any[]} initialSectionCounts={initialSectionCounts} />
        )}

        {activeTab === "events" && (
          <EventsPanel
            initialEvents={[
              ...initialEvents.map((e) => ({ ...e, is_match: false })),
              ...initialMatches.map((m) => {
                const home = m.homeTeam?.name || "Team A";
                const away = m.awayTeam?.name || "Team B";
                return {
                  id: Number(m.id.replace(/\D/g, "")) || Math.floor(Math.random() * 100000),
                  title: `${home} vs ${away}`,
                  subtitle: `${m.competition} ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ ${m.teamCategory}`,
                  date: m.dateIso ? m.dateIso.split("T")[0] : "",
                  time: m.time,
                  location: m.venue,
                  is_match: true,
                  status: "published",
                  page_type: "competition",
                  category: m.competition,
                };
              }),
            ]}
            onDirtyChange={registerDirty("events")}
          />
        )}

        {activeTab === "grassroots" && (
          <div className="space-y-8">
            <CollectionManager
              collection="grassroots_initiatives"
              title="Grassroots initiatives"
              description="Cards shown in the homepage Grassroots & Youth Rugby section."
              grants={grantsFor("grassroots_initiatives")}
              canPurge={permissions?.all === true}
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
              canPurge={permissions?.all === true}
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
              canPurge={permissions?.all === true}
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
              canPurge={permissions?.all === true}
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
            {/* Visual Team Cards & Squad Player Management */}
            <VisualTeamsManager
              teams={initialTeams}
              players={initialPlayers}
              grantsFor={grantsFor}
              canPurge={permissions?.all === true}
              onDirtyChange={registerDirty("teams")}
            />

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
                canPurge={permissions?.all === true}
                fields={[
                  { key: "name", label: "Name", type: "text", placeholder: "e.g. Namibia", required: true },
                  { key: "short_name", label: "Short name", type: "text", placeholder: "e.g. NAM" },
                  { key: "code", label: "Code", type: "text", placeholder: "e.g. NAM" },
                  { key: "slug", label: "Slug", type: "text", placeholder: "e.g. namibia" },
                  { key: "country", label: "Country", type: "text", placeholder: "e.g. Namibia" },
                  { key: "team_type", label: "Team type", type: "select", options: ["international", "club", "province", "tour", "u20", "u18"] },
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
              description="Tournaments and leagues (Rugby Africa Cup, Gold CupÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦)."
              defaultOpen={false}
            >
              <CollectionManager
                collection="competitions"
                title="Competitions"
                description="Competitions used in the fixtures dropdown."
                grants={grantsFor("competitions")}
                canPurge={permissions?.all === true}
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
                canPurge={permissions?.all === true}
                fields={[
                  { key: "name", label: "Name", type: "text", placeholder: "e.g. Hartsfield Grounds", required: true },
                  { key: "slug", label: "Slug", type: "text", placeholder: "e.g. hartsfield-grounds" },
                  { key: "city", label: "City", type: "text", placeholder: "e.g. Bulawayo" },
                  { key: "region", label: "Region", type: "text", placeholder: "e.g. Matabeleland North" },
                  { key: "country", label: "Country", type: "text", placeholder: "e.g. Zimbabwe" },
                  { key: "full_label", label: "Full label", type: "text", placeholder: "e.g. Hartsfield Grounds, Bulawayo" },
                  { key: "address", label: "Address", type: "text", placeholder: "e.g. 12 Park Road" },
                  { key: "google_maps_url", label: "Google Maps URL", type: "text", placeholder: "https://maps.google.com/ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦" },
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

        {activeTab === "hero_layout" && <HeroLayoutPanel initialSlides={initialHeroSlides as any[]} />}

        {activeTab === "clubs" && (
          <CollectionManager
            collection="clubs"
            title="Clubs"
            description="Club cards shown on the Clubs page."
            grants={grantsFor("clubs")}
            canPurge={permissions?.all === true}
            fields={[
              { key: "name", label: "Name", type: "text", placeholder: "e.g. Old Hararians RFC", required: true },
              { key: "slug", label: "Web address (slug)", type: "text", placeholder: "auto-generated", colSpan: "full" },
              { key: "province", label: "Province", type: "text", placeholder: "e.g. Mashonaland" },
              { key: "league", label: "League", type: "text", placeholder: "e.g. Super Six League" },
              { key: "venue", label: "Venue", type: "text", placeholder: "e.g. Old Hararians Sports Club, Milton Park, Harare" },
              { key: "color", label: "Colours", type: "text", placeholder: "e.g. ZRU Green / Gold Accent" },
              { key: "contact", label: "Contact email", type: "text", placeholder: "e.g. ohrfc@zru.co.zw" },
              { key: "description", label: "Description", type: "textarea", colSpan: "full" },
              { key: "sort", label: "Display order", type: "number" },
              { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
            ]}
            items={initialClubs}
            displayField="name"
            subtitleField="league"
            badgeField="province"
            statusField="status"
            searchable={["name", "province", "league", "venue"]}
            singularLabel="club"
            onDirtyChange={registerDirty("clubs")}
          />
        )}

        {activeTab === "sponsors" && <SponsorsPanel initialSponsors={initialSponsors as any[]} />}
        {activeTab === "resources" && <ResourcesPanel initialResources={initialResources as any[]} />}

        {activeTab === "campaigns" && <CampaignsPanel initialCampaigns={initialCampaigns} canReview={canReview} currentUserEmail={email} />}

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
        {activeTab === "backups" && <BackupsPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminClient(props: AdminClientProps) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AdminInactivityLock />
        <AdminClientInner {...props} />
      </ConfirmProvider>
    </ToastProvider>
  );
}









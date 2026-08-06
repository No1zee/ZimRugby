"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, CheckCircle2, ShieldCheck, Users, Trophy, Newspaper, Radio, Flag, CalendarDays, ImageIcon, BookOpen, Sprout, HelpCircle, LayoutDashboard, FileText, Globe, Activity, ArrowUpRight, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import SlantedButton from "@/components/ui/SlantedButton";
import CollectionManager from "@/components/admin/CollectionManager";
import type { MatchCardViewModel, StandingsTableViewModel } from "@/lib/match-centre/types";
import type { Campaign } from "@/lib/api/campaigns";

interface AdminClientProps {
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

export default function AdminClient({
  initialMatches,
  initialStandings,
  initialAnnouncements,
  initialFanZoneMembers,
  initialOnboardingSubmissions,
  initialCampaigns,
  initialNews,
  initialGrassroots,
  initialProgrammes,
  initialFaqs,
  initialFooterNav,
  initialPages,
  initialSectionCounts,
  initialActivityFeed,
  stats,
}: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "pages" | "media" | "news" | "fixtures" | "standings" | "campaigns" | "fanzone" | "onboarding" | "grassroots" | "faq-footer">("overview");
  const [message, setMessage] = useState<string | null>(null);
  const [timeStrings, setTimeStrings] = useState<Record<number, string>>({});

  useEffect(() => {
    const strings: Record<number, string> = {};
    initialActivityFeed.forEach((entry) => {
      const diff = Date.now() - new Date(entry.timestamp).getTime();
      const mins = Math.floor(diff / 60000);
      let timeString = "just now";
      if (mins >= 1 && mins < 60) timeString = `${mins}m ago`;
      else if (mins >= 60 && mins < 1440) timeString = `${Math.floor(mins / 60)}h ago`;
      else if (mins >= 1440) timeString = `${Math.floor(mins / 1440)}d ago`;
      strings[entry.id] = timeString;
    });
    setTimeStrings(strings);
  }, [initialActivityFeed]);

  // New Fixture Form state
  const [homeTeam, setHomeTeam] = useState("Zimbabwe Sables");
  const [awayTeam, setAwayTeam] = useState("");
  const [venue, setVenue] = useState("Harare Sports Club");
  const [status, setStatus] = useState("upcoming");

  // New Announcement Form state
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annCategory, setAnnCategory] = useState("Sables");

  async function handleAddFixture(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "matches",
          data: {
            title: `${homeTeam} vs ${awayTeam}`,
            team_id: 1,
            opponent_id: null,
            venue_id: null,
            status: status,
            kickoff_at: new Date().toISOString(),
            home_or_away: "home",
            show_on_match_centre: true,
          },
        }),
      });

      if (res.ok) {
        setMessage(`✅ Match '${homeTeam} vs ${awayTeam}' created successfully! Refreshing...`);
        setAwayTeam("");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage(`❌ Failed to create match: ${res.statusText}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err}`);
    }
  }

  async function handleAddAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "announcements",
          data: {
            title: annTitle,
            body: annBody,
            category: annCategory,
            variant: "banner",
            priority: "normal",
            is_enabled: true,
            status: "published",
            start_at: new Date().toISOString(),
          },
        }),
      });

      if (res.ok) {
        setMessage(`✅ Announcement '${annTitle}' published to website! Refreshing...`);
        setAnnTitle("");
        setAnnBody("");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage(`❌ Failed to publish announcement`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err}`);
    }
  }

  return (
    <main className="bg-milk-white min-h-screen pt-28 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-black/10 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-zru-green text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
                ZRU OFFICIAL PORTAL
              </span>
              <span className="text-xs font-bold text-black/50">Directus Powered</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-black text-rich-black uppercase">
              Website Content Manager
            </h1>
            <p className="text-sm text-black/60 mt-1">
              Manage news, fixtures, match scores, standings, and registrations for Zimbabwe Rugby Union.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SlantedButton href={process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055"} variant="secondary" size="sm">
              DIRECTUS BACKEND
            </SlantedButton>
            <SlantedButton href="/match-centre" variant="primary" size="sm">
              VIEW LIVE WEBSITE
            </SlantedButton>
          </div>
        </div>

        {/* Notification Toast */}
        {message && (
          <div className="mb-6 bg-zru-green/10 border border-zru-green/40 p-4 rounded-xl text-zru-green font-bold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 no-scrollbar border-b border-black/10 pb-4 mb-8">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard, count: stats.activeCampaignCount },
            { id: "pages", label: "Pages & Layouts", icon: FileText, count: stats.pagesCount },
            { id: "fixtures", label: "Match Centre & Fixtures", icon: Radio, count: initialMatches.length },
            { id: "media", label: "News & Media", icon: BookOpen, count: initialNews.length },
            { id: "news", label: "News & Announcements", icon: Newspaper, count: initialAnnouncements.length },
            { id: "standings", label: "League Standings", icon: Trophy, count: initialStandings[0]?.rows.length || 0 },
            { id: "campaigns", label: "Campaigns", icon: Flag, count: stats.campaignCount },
            { id: "grassroots", label: "Grassroots & Programs", icon: Sprout, count: initialGrassroots.length + initialProgrammes.length },
            { id: "faq-footer", label: "FAQ & Footer", icon: HelpCircle, count: initialFaqs.length + initialFooterNav.length },
            { id: "fanzone", label: "Fan Zone Members", icon: Users, count: initialFanZoneMembers.length },
            { id: "onboarding", label: "Onboarding Submissions", icon: ShieldCheck, count: initialOnboardingSubmissions.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-zru-green text-white shadow-lg"
                    : "bg-black/5 text-black/70 hover:bg-black/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-black/10 text-black/70"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab 0: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div>
              <h2 className="text-xs font-black text-black/40 uppercase tracking-[0.3em] mb-4 font-subheading">
                System Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  onClick={() => setActiveTab("pages")}
                  className="bg-white border border-black/10 rounded-2xl p-5 hover:border-zru-green/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[9px] font-black text-black/40 uppercase tracking-[0.4em] font-subheading mb-3">
                        CMS Pages
                      </div>
                      <div className="text-3xl font-heading text-rich-black font-black">
                        {stats.pagesCount}
                      </div>
                      <div className="text-[10px] text-black/40 font-subheading uppercase tracking-widest mt-1">
                        {stats.publishedPages} Published, {stats.draftPages} Draft
                      </div>
                    </div>
                    <div className="w-9 h-9 bg-zru-green/10 rounded-lg flex items-center justify-center group-hover:bg-zru-green/20 transition-colors">
                      <FileText className="w-4 h-4 text-zru-green" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-black/10 rounded-2xl p-5 hover:border-zru-green/30 hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[9px] font-black text-black/40 uppercase tracking-[0.4em] font-subheading mb-3">
                        Page Sections
                      </div>
                      <div className="text-3xl font-heading text-rich-black font-black">
                        {stats.totalSections}
                      </div>
                      <div className="text-[10px] text-black/40 font-subheading uppercase tracking-widest mt-1">
                        Across all pages
                      </div>
                    </div>
                    <div className="w-9 h-9 bg-zru-green/10 rounded-lg flex items-center justify-center group-hover:bg-zru-green/20 transition-colors">
                      <BookOpen className="w-4 h-4 text-zru-green" />
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab("campaigns")}
                  className="bg-white border border-black/10 rounded-2xl p-5 hover:border-zru-green/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[9px] font-black text-black/40 uppercase tracking-[0.4em] font-subheading mb-3">
                        Campaigns
                      </div>
                      <div className="text-3xl font-heading text-rich-black font-black">
                        {stats.campaignCount}
                      </div>
                      <div className="text-[10px] text-black/40 font-subheading uppercase tracking-widest mt-1">
                        {stats.activeCampaignCount} Active campaigns
                      </div>
                    </div>
                    <div className="w-9 h-9 bg-zru-green/10 rounded-lg flex items-center justify-center group-hover:bg-zru-green/20 transition-colors">
                      <Flag className="w-4 h-4 text-zru-green" />
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab("news")}
                  className="bg-white border border-black/10 rounded-2xl p-5 hover:border-zru-green/40 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[9px] font-black text-black/40 uppercase tracking-[0.4em] font-subheading mb-3">
                        Announcements
                      </div>
                      <div className="text-3xl font-heading text-rich-black font-black">
                        {stats.announcementCount}
                      </div>
                      <div className="text-[10px] text-black/40 font-subheading uppercase tracking-widest mt-1">
                        Active alerts & posts
                      </div>
                    </div>
                    <div className="w-9 h-9 bg-zru-green/10 rounded-lg flex items-center justify-center group-hover:bg-zru-green/20 transition-colors">
                      <Newspaper className="w-4 h-4 text-zru-green" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xs font-black text-black/40 uppercase tracking-[0.3em] mb-4 font-subheading">
                Quick Access Hub
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/admin/home"
                  className="group flex items-center gap-4 bg-white border border-black/10 rounded-2xl p-5 hover:border-zru-green/40 hover:shadow-md transition-all relative"
                >
                  <div className="w-10 h-10 bg-zru-green/10 rounded-lg flex items-center justify-center group-hover:bg-zru-green/20 transition-colors shrink-0">
                    <LayoutDashboard className="w-5 h-5 text-zru-green" />
                  </div>
                  <div>
                    <div className="text-rich-black font-heading text-sm uppercase tracking-wider group-hover:text-zru-green transition-colors flex items-center gap-2">
                      Homepage Editor
                    </div>
                    <div className="text-black/40 text-[10px] font-subheading uppercase tracking-widest mt-0.5">
                      Visual page builder for homepage
                    </div>
                  </div>
                </Link>

                <a
                  href={process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055/admin"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 bg-white border border-black/10 rounded-2xl p-5 hover:border-zru-green/40 hover:shadow-md transition-all relative"
                >
                  <div className="w-10 h-10 bg-zru-green/10 rounded-lg flex items-center justify-center group-hover:bg-zru-green/20 transition-colors shrink-0">
                    <Globe className="w-5 h-5 text-zru-green" />
                  </div>
                  <div>
                    <div className="text-rich-black font-heading text-sm uppercase tracking-wider group-hover:text-zru-green transition-colors flex items-center gap-2">
                      Directus Panel <ExternalLink className="w-3 h-3 text-black/20" />
                    </div>
                    <div className="text-black/40 text-[10px] font-subheading uppercase tracking-widest mt-0.5">
                      Direct access to raw collections
                    </div>
                  </div>
                </a>

                <Link
                  href="/"
                  target="_blank"
                  className="group flex items-center gap-4 bg-white border border-black/10 rounded-2xl p-5 hover:border-zru-green/40 hover:shadow-md transition-all relative"
                >
                  <div className="w-10 h-10 bg-zru-green/10 rounded-lg flex items-center justify-center group-hover:bg-zru-green/20 transition-colors shrink-0">
                    <Globe className="w-5 h-5 text-zru-green" />
                  </div>
                  <div>
                    <div className="text-rich-black font-heading text-sm uppercase tracking-wider group-hover:text-zru-green transition-colors flex items-center gap-2">
                      View Live Website
                    </div>
                    <div className="text-black/40 text-[10px] font-subheading uppercase tracking-widest mt-0.5">
                      Open user interface in new tab
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Main panels side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Active Campaigns */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xs font-black text-black/40 uppercase tracking-[0.3em] font-subheading flex items-center gap-2">
                  <Flag className="w-4 h-4 text-zru-green" />
                  Active Hub Campaigns
                </h2>
                {initialCampaigns.filter(c => c.status === "active" || c.status === "published").length === 0 ? (
                  <div className="bg-white border border-dashed border-black/10 rounded-2xl p-8 text-center text-black/40">
                    No active campaigns. Start campaigns in the Directus panel.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {initialCampaigns.filter(c => c.status === "active" || c.status === "published").map((campaign) => (
                      <div key={campaign.id} className="bg-white border border-black/10 rounded-2xl p-5 relative overflow-hidden group hover:border-zru-green/40 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-rich-black font-heading text-sm uppercase tracking-wider truncate">{campaign.name}</h3>
                              <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border bg-zru-green/10 text-zru-green border-zru-green/20">
                                {campaign.status}
                              </span>
                            </div>
                            {campaign.subtitle && (
                              <p className="text-black/40 text-[10px] font-subheading uppercase tracking-[0.2em] truncate">{campaign.subtitle}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4 text-[10px] text-black/55 font-subheading uppercase tracking-wider">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3 text-zru-green" />{campaign.players?.length || 0} Players</span>
                          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3 text-zru-green" />{campaign.matches?.length || 0} Fixtures</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/campaigns/${campaign.slug}`} target="_blank" className="flex items-center gap-1 px-3 py-1.5 bg-zru-green/10 text-zru-green rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-zru-green/20 transition-colors">
                            View Campaign Hub <ArrowUpRight className="w-3 h-3" />
                          </Link>
                          <a href={`${process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055"}/admin/content/campaigns/${campaign.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-black/5 text-black/55 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-black/10 transition-colors">
                            Edit Data <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity feed */}
              <div className="space-y-4">
                <h2 className="text-xs font-black text-black/40 uppercase tracking-[0.3em] font-subheading flex items-center gap-2">
                  <Activity className="w-4 h-4 text-zru-green" />
                  Recent Activity Feed
                </h2>
                {initialActivityFeed.length === 0 ? (
                  <div className="bg-white border border-dashed border-black/10 rounded-2xl p-8 text-center text-black/40">
                    No recent activity.
                  </div>
                ) : (
                  <div className="bg-white border border-black/10 rounded-2xl p-4 space-y-3 max-h-[360px] overflow-y-auto">
                    {initialActivityFeed.slice(0, 8).map((entry) => {
                      const actionColor = entry.action === "create" ? "text-zru-green" : entry.action === "update" ? "text-amber-600" : entry.action === "delete" ? "text-red-500" : "text-black/40";
                      const actionLabel = entry.action === "create" ? "Created" : entry.action === "update" ? "Updated" : entry.action === "delete" ? "Deleted" : entry.action === "login" ? "Login" : entry.action;
                      const collectionLabel = entry.collection.replace("directus_", "").replace(/_/g, " ");
                      
                      const timeString = timeStrings[entry.id] || "just now";

                      return (
                        <div key={entry.id} className="flex items-center gap-3 border-b border-black/5 pb-2.5 last:border-b-0 last:pb-0">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/5 shrink-0 ${actionColor}`}>
                            {actionLabel}
                          </span>
                          <span className="text-black/75 text-xs capitalize truncate max-w-[120px]">
                            {collectionLabel}
                          </span>
                          <span className="text-black/35 text-[9px] ml-auto font-subheading">
                            {timeString}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 0.5: Pages & Layouts Manager */}
        {activeTab === "pages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-black uppercase text-rich-black">
                  Website Pages & Layouts
                </h2>
                <p className="text-sm text-black/60">
                  Select a website page below to launch the visual block-builder and design its layout.
                </p>
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055"}/admin/content/pages`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zru-green hover:bg-zru-green/90 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Page In Directus
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {initialPages.map((page) => {
                const count = initialSectionCounts[page.id] || 0;
                return (
                  <div key={page.id} className="bg-white border border-black/10 rounded-2xl p-6 flex flex-col hover:border-zru-green/45 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-zru-green/10 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-zru-green" />
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded border ${
                        page.status === "published"
                          ? "bg-zru-green/15 text-zru-green border-zru-green/20"
                          : "bg-amber-500/15 text-amber-600 border-amber-500/20"
                      }`}>
                        {page.status}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-black text-rich-black uppercase group-hover:text-zru-green transition-colors mb-1">
                      {page.title}
                    </h3>
                    <p className="text-black/45 text-xs font-mono mb-6">
                      /{page.slug === "home" ? "" : page.slug}
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between text-xs text-black/55 border-t border-black/5 pt-4 mb-4">
                        <span>Configured Sections</span>
                        <span className="font-bold text-rich-black bg-black/5 px-2 py-0.5 rounded-full text-[10px]">
                          {count} block{count !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/admin/${page.slug}`}
                          className="bg-zru-green text-white hover:bg-zru-green/90 text-center font-bold py-2.5 px-3 rounded-xl text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit Layout
                        </Link>
                        <Link
                          href={`/${page.slug === "home" ? "" : page.slug}`}
                          target="_blank"
                          className="bg-black/5 text-rich-black hover:bg-black/10 text-center font-bold py-2.5 px-3 rounded-xl text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                        >
                          Preview Live <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 1: Fixtures Manager */}
        {activeTab === "fixtures" && (
          <div className="space-y-8">
            {/* Create Fixture Form */}
            <form onSubmit={handleAddFixture} className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <h2 className="font-heading text-xl font-black uppercase text-rich-black mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-zru-green" /> Add New Match Fixture
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-black/60 mb-1">Home Team</label>
                  <input
                    type="text"
                    value={homeTeam}
                    onChange={(e) => setHomeTeam(e.target.value)}
                    required
                    className="w-full bg-black/5 border border-black/10 rounded-lg p-2.5 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-black/60 mb-1">Away Team / Opponent</label>
                  <input
                    type="text"
                    placeholder="e.g. Kenya Simbas"
                    value={awayTeam}
                    onChange={(e) => setAwayTeam(e.target.value)}
                    required
                    className="w-full bg-black/5 border border-black/10 rounded-lg p-2.5 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-black/60 mb-1">Venue</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    required
                    className="w-full bg-black/5 border border-black/10 rounded-lg p-2.5 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-black/60 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-black/5 border border-black/10 rounded-lg p-2.5 text-sm font-bold"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed / Final</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-6 py-2.5 bg-zru-green text-white font-heading font-black text-xs uppercase tracking-wider rounded-lg hover:bg-green-800 transition-colors"
              >
                SAVE FIXTURE TO DIRECTUS
              </button>
            </form>

            {/* List Existing Fixtures */}
            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <h2 className="font-heading text-xl font-black uppercase text-rich-black mb-4">
                Current Directus Matches ({initialMatches.length})
              </h2>
              <div className="divide-y divide-black/5">
                {initialMatches.map((match) => (
                  <div key={match.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zru-green bg-zru-green/10 px-2 py-0.5 rounded">
                        {match.competition}
                      </span>
                      <h3 className="font-heading text-base font-black text-rich-black uppercase mt-1">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </h3>
                      <p className="text-xs text-black/60">{match.venue} • {match.time}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {match.homeTeam.score !== undefined && (
                        <span className="font-heading font-black text-lg text-zru-green bg-black/5 px-3 py-1 rounded-lg">
                          {match.homeTeam.score} - {match.awayTeam.score}
                        </span>
                      )}
                      <span className="text-xs font-bold uppercase px-3 py-1 bg-black/5 rounded-full">
                        {match.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: News Manager */}
        {activeTab === "news" && (
          <div className="space-y-8">
            <form onSubmit={handleAddAnnouncement} className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <h2 className="font-heading text-xl font-black uppercase text-rich-black mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-zru-green" /> Publish News Article or Announcement
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-black/60 mb-1">Headline / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sables Squad Named for Rugby Africa Cup"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    required
                    className="w-full bg-black/5 border border-black/10 rounded-lg p-2.5 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-black/60 mb-1">Article Body / Excerpt</label>
                  <textarea
                    rows={3}
                    placeholder="Type article content..."
                    value={annBody}
                    onChange={(e) => setAnnBody(e.target.value)}
                    required
                    className="w-full bg-black/5 border border-black/10 rounded-lg p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-black/60 mb-1">Category / Tag</label>
                  <input
                    type="text"
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value)}
                    className="w-full bg-black/5 border border-black/10 rounded-lg p-2.5 text-sm font-bold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-6 py-2.5 bg-zru-green text-white font-heading font-black text-xs uppercase tracking-wider rounded-lg hover:bg-green-800 transition-colors"
              >
                PUBLISH TO DIRECTUS & WEBSITE
              </button>
            </form>

            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <h2 className="font-heading text-xl font-black uppercase text-rich-black mb-4">
                Published Announcements ({initialAnnouncements.length})
              </h2>
              <div className="space-y-4">
                {initialAnnouncements.map((ann: any) => (
                  <div key={ann.id} className="p-4 bg-black/5 rounded-xl border border-black/5">
                    <span className="text-[10px] font-black text-zru-green uppercase tracking-wider bg-zru-green/10 px-2 py-0.5 rounded">
                      {ann.category || "General"}
                    </span>
                    <h3 className="font-heading text-base font-black text-rich-black uppercase mt-1">{ann.title}</h3>
                    <p className="text-xs text-black/70 mt-1">{ann.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Standings */}
        {activeTab === "standings" && (
          <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading text-xl font-black uppercase text-rich-black mb-4">
              Rugby Africa Cup Standings Table
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/10 text-xs font-black uppercase text-black/50">
                    <th className="py-2">Pos</th>
                    <th className="py-2">Team</th>
                    <th className="py-2">P</th>
                    <th className="py-2">W</th>
                    <th className="py-2">D</th>
                    <th className="py-2">L</th>
                    <th className="py-2">Pts</th>
                    <th className="py-2">Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-sm font-bold">
                  {initialStandings[0]?.rows.map((row) => (
                    <tr key={row.team}>
                      <td className="py-3 font-heading font-black text-zru-green">{row.position}</td>
                      <td className="py-3 text-rich-black uppercase">{row.team}</td>
                      <td className="py-3">{row.played}</td>
                      <td className="py-3">{row.won}</td>
                      <td className="py-3">{row.drawn}</td>
                      <td className="py-3">{row.lost}</td>
                      <td className="py-3 font-heading font-black text-zru-green">{row.points}</td>
                      <td className="py-3 font-mono text-xs">{row.form.join("")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3b: Campaigns */}
        {activeTab === "campaigns" && (
          <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-black uppercase text-rich-black">
                Campaigns ({initialCampaigns.length})
              </h2>
              <SlantedButton href="http://localhost:8055/admin/content/campaigns" variant="secondary" size="sm">
                MANAGE IN DIRECTUS
              </SlantedButton>
            </div>

            {initialCampaigns.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-black/10 rounded-xl">
                <Flag className="w-10 h-10 text-black/10 mx-auto mb-3" />
                <h3 className="font-heading text-sm font-black uppercase text-black/40">No campaigns yet</h3>
                <p className="text-xs text-black/30 mt-1">Create campaigns in Directus to manage them here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 text-xs font-black uppercase text-black/50">
                      <th className="py-2">Campaign</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Players</th>
                      <th className="py-2">Matches</th>
                      <th className="py-2">Media</th>
                      <th className="py-2">Dates</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-sm">
                    {initialCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-black/[0.02] transition-colors">
                        <td className="py-3">
                          <div className="font-heading font-black text-rich-black uppercase">{campaign.name}</div>
                          {campaign.subtitle && <div className="text-[10px] text-black/50 uppercase tracking-wider">{campaign.subtitle}</div>}
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            campaign.status === "active" ? "bg-zru-green/10 text-zru-green" :
                            campaign.status === "published" ? "bg-black/5 text-black/60" :
                            "bg-amber-900/10 text-amber-700"
                          }`}>
                            {campaign.status || "draft"}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-black/70">{campaign.players?.length || 0}</td>
                        <td className="py-3 font-bold text-black/70">{campaign.matches?.length || 0}</td>
                        <td className="py-3 font-bold text-black/70">{campaign.media?.length || 0}</td>
                        <td className="py-3 text-[11px] text-black/60">
                          {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
                          {campaign.end_date ? ` – ${new Date(campaign.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Link href={`/campaigns/${campaign.slug}`} target="_blank" className="flex items-center gap-1 px-2.5 py-1.5 bg-zru-green/10 text-zru-green rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-zru-green/20 transition-colors">
                              View <Edit2 className="w-3 h-3" />
                            </Link>
                            <Link href={`http://localhost:8055/admin/content/campaigns/${campaign.id}`} target="_blank" className="flex items-center gap-1 px-2.5 py-1.5 bg-black/5 text-black/50 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-black/10 transition-colors">
                              Directus <Edit2 className="w-3 h-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: News & Media (news collection) */}
        {activeTab === "media" && (
          <CollectionManager
            collection="news"
            title="News & Media Articles"
            description="Articles published here appear in the homepage LATEST NEWS panel and the /media archive."
            fields={[
              { key: "title", label: "Headline / Title", type: "text", placeholder: "e.g. Sables Squad Named for Rugby Africa Cup", required: true },
              { key: "slug", label: "Slug (URL)", type: "text", placeholder: "e.g. sables-squad-named-for-rugby-africa-cup" },
              { key: "excerpt", label: "Excerpt", type: "textarea", placeholder: "Short summary shown on cards" },
              { key: "body", label: "Full Article Body", type: "textarea", placeholder: "Full article content" },
              { key: "category", label: "Category / Tag", type: "text", placeholder: "e.g. Sables, Youth Rugby, Women's Rugby" },
              { key: "date", label: "Publish Date", type: "text", placeholder: "e.g. 2026-07-31T10:00:00Z" },
              { key: "image", label: "Image (Directus asset UUID or URL)", type: "text", placeholder: "e.g. 9f0e8b6c-... or https://..." },
              { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
            ]}
            items={initialNews}
            displayField="title"
            subtitleField="date"
            badgeField="category"
          />
        )}

        {/* Tab: Grassroots & Programs */}
        {activeTab === "grassroots" && (
          <div className="space-y-8">
            <CollectionManager
              collection="grassroots_initiatives"
              title="Grassroots Initiatives"
              description="Cards shown in the homepage GRASSROOTS & YOUTH RUGBY section."
              fields={[
                { key: "title", label: "Title", type: "text", placeholder: "e.g. Schoolboy & Schoolgirl Leagues", required: true },
                { key: "badge", label: "Badge", type: "text", placeholder: "e.g. YOUTH PATHWAYS" },
                { key: "subtitle", label: "Subtitle", type: "text", placeholder: "e.g. PRIMARY & SECONDARY SCHOOLS" },
                { key: "description", label: "Description", type: "textarea", placeholder: "Short description shown on the card" },
                { key: "stat", label: "Stat", type: "text", placeholder: "e.g. 120+" },
                { key: "stat_label", label: "Stat Label", type: "text", placeholder: "e.g. Participating Schools" },
                { key: "image", label: "Image (Directus asset UUID or URL)", type: "text", placeholder: "e.g. 9f0e8b6c-... or https://..." },
                { key: "link", label: "Link (internal route)", type: "text", placeholder: "e.g. /schools" },
                { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
              ]}
              items={initialGrassroots}
              displayField="title"
              subtitleField="subtitle"
              badgeField="badge"
            />

            <CollectionManager
              collection="programmes"
              title="Programmes (Play Rugby)"
              description="Programmes displayed on the PLAY RUGBY page."
              fields={[
                { key: "title", label: "Title", type: "text", placeholder: "e.g. Get Into Rugby", required: true },
                { key: "description", label: "Description", type: "textarea", placeholder: "Short description shown on the card" },
                { key: "icon", label: "Icon", type: "text", placeholder: "e.g. rugby-ball, users, trophy" },
                { key: "link", label: "Link (internal route)", type: "text", placeholder: "e.g. /play-rugby" },
                { key: "stat", label: "Stat", type: "text", placeholder: "e.g. 15,000+" },
                { key: "stat_label", label: "Stat Label", type: "text", placeholder: "e.g. Active Children" },
                { key: "color", label: "Color", type: "text", placeholder: "e.g. #006B3F" },
                { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
              ]}
              items={initialProgrammes}
              displayField="title"
              subtitleField="link"
            />
          </div>
        )}

        {/* Tab: FAQ & Footer */}
        {activeTab === "faq-footer" && (
          <div className="space-y-8">
            <CollectionManager
              collection="faqs"
              title="Frequently Asked Questions"
              description="FAQs displayed on the TICKETS page under Ticket FAQs & Safety."
              fields={[
                { key: "question", label: "Question", type: "text", placeholder: "e.g. How do I know this is the official ticket source?", required: true },
                { key: "answer", label: "Answer", type: "textarea", placeholder: "Full answer text" },
                { key: "category", label: "Category", type: "text", placeholder: "e.g. Tickets, General" },
                { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
              ]}
              items={initialFaqs}
              displayField="question"
              subtitleField="category"
            />

            <CollectionManager
              collection="footer_navigation"
              title="Footer Navigation Columns"
              description="Columns shown in the website footer."
              fields={[
                { key: "column_title", label: "Column Title", type: "text", placeholder: "e.g. About ZRU", required: true },
                { key: "links", label: "Links (JSON array)", type: "textarea", placeholder: '[{"label":"Governance","url":"/about/governance"},{"label":"History","url":"/about/history"}]' },
                { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
              ]}
              items={initialFooterNav}
              displayField="column_title"
            />
          </div>
        )}

        {/* Tab 4: Fan Zone Members */}
        {activeTab === "fanzone" && (
          <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading text-xl font-black uppercase text-rich-black mb-4">
              Fan Zone Members Directory ({initialFanZoneMembers.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/10 text-xs font-black uppercase text-black/50">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Team</th>
                    <th className="py-2">VIP Code</th>
                    <th className="py-2">CDPA Consent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-sm">
                  {initialFanZoneMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="py-3 font-bold text-rich-black">{member.name}</td>
                      <td className="py-3 text-black/70">{member.email}</td>
                      <td className="py-3 font-bold text-zru-green">{member.favorite_team || "Sables"}</td>
                      <td className="py-3 font-mono text-xs">{member.vip_code}</td>
                      <td className="py-3 font-bold text-green-600">✅ Granted</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Onboarding Submissions */}
        {activeTab === "onboarding" && (
          <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading text-xl font-black uppercase text-rich-black mb-4">
              Player / Referee / Coach Onboarding ({initialOnboardingSubmissions.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/10 text-xs font-black uppercase text-black/50">
                    <th className="py-2">Full Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Organization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-sm">
                  {initialOnboardingSubmissions.map((sub) => (
                    <tr key={sub.id}>
                      <td className="py-3 font-bold text-rich-black">{sub.full_name}</td>
                      <td className="py-3 text-black/70">{sub.email}</td>
                      <td className="py-3 text-black/70">{sub.phone || "N/A"}</td>
                      <td className="py-3 font-bold text-zru-green">{sub.role}</td>
                      <td className="py-3 text-black/70">{sub.organization || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

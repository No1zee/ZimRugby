"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Users,
  Film,
  Award,
  Layers,
  FileText,
  DollarSign,
  UserPlus,
  BarChart3,
  History,
  HardDrive,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
  Shield,
  LogOut,
  Sparkles,
  Command,
} from "lucide-react";
import type { AdminRole } from "@/lib/admin/iam";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  section: "core" | "matchday" | "content" | "governance" | "system";
}

const ALL_NAV_ITEMS: NavItem[] = [
  // Core
  { id: "overview", label: "Dashboard", icon: LayoutDashboard, section: "core" },
  
  // Content & Publishing
  { id: "media", label: "News & Media", icon: Newspaper, section: "content" },
  { id: "events", label: "Events & Calendar", icon: CalendarDays, section: "content" },
  { id: "hero", label: "Hero & Announcements", icon: Film, section: "content" },
  { id: "pages", label: "Pages & Sections", icon: FileText, section: "content" },
  { id: "resources", label: "Resources & Docs", icon: Layers, section: "content" },

  // Matchday & Teams
  { id: "fixtures", label: "Match Centre", icon: CalendarDays, section: "matchday" },
  { id: "teams", label: "Teams & Squads", icon: Users, section: "matchday" },

  // Commercial & Growth
  { id: "sponsors", label: "Commercial & Partners", icon: DollarSign, section: "governance" },
  { id: "signups", label: "Signups & Forms", icon: UserPlus, section: "governance" },

  // System & Logs
  { id: "analytics", label: "Analytics", icon: BarChart3, section: "system" },
  { id: "logs", label: "Audit Logs", icon: History, section: "system" },
  { id: "backups", label: "System & Backups", icon: HardDrive, section: "system" },
  { id: "trash", label: "Trash & Recycle", icon: Trash2, section: "system" },
];

const SECTION_LABELS: Record<string, string> = {
  core: "Overview",
  content: "Content & Publishing",
  matchday: "Matchday & Teams",
  governance: "Commercial & Growth",
  system: "Governance & System",
};

interface AdminSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  allowedTabs: string[];
  userEmail?: string;
  userRole?: AdminRole | string;
  onOpenCommandPalette: () => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  allowedTabs,
  userEmail,
  userRole,
  onOpenCommandPalette,
  onLogout,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const visibleItems = ALL_NAV_ITEMS.filter((item) => allowedTabs.includes(item.id));
  const sections = ["core", "content", "matchday", "governance", "system"] as const;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-md border-r border-white/10
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-zru-green/20 border border-zru-green/40 flex items-center justify-center shrink-0 text-zru-green">
              <span className="font-heading font-black text-sm tracking-wider">ZRU</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white truncate">
                  Admin Command
                </span>
                <span className="text-[10px] font-mono text-zinc-400 truncate">
                  v2.4 · {userRole || "Admin"}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Search / Cmd+K Trigger */}
        <div className="p-3 shrink-0">
          <button
            onClick={onOpenCommandPalette}
            className={`
              w-full flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400
              hover:text-white hover:border-zru-green/40 hover:bg-white/[0.06] transition-all
              ${collapsed ? "p-2.5 justify-center" : "px-3 py-2 text-xs"}
            `}
            title="Search & Quick Actions (Cmd+K)"
          >
            <Search className="w-4 h-4 shrink-0 text-zru-green" />
            {!collapsed && (
              <>
                <span className="truncate text-left flex-1">Quick Search...</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-zinc-300">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </>
            )}
          </button>
        </div>

        {/* Navigation Item List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          {sections.map((sec) => {
            const items = visibleItems.filter((i) => i.section === sec);
            if (items.length === 0) return null;

            return (
              <div key={sec} className="space-y-1">
                {!collapsed && (
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    {SECTION_LABELS[sec]}
                  </div>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      title={collapsed ? item.label : undefined}
                      className={`
                        w-full flex items-center gap-3 rounded-lg font-medium transition-all group
                        ${collapsed ? "p-3 justify-center" : "px-3 py-2.5 text-xs"}
                        ${
                          isActive
                            ? "bg-zru-green text-white font-semibold shadow-lg shadow-zru-green/20"
                            : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]"
                        }
                      `}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? "text-white" : "text-zinc-400 group-hover:text-zru-green"
                        }`}
                      />
                      {!collapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}
                      {!collapsed && item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                            isActive ? "bg-black/30 text-white" : "bg-white/10 text-zinc-300"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Live Site & User Footer */}
        <div className="p-3 border-t border-white/10 shrink-0 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              w-full flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-zinc-400
              hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all
              ${collapsed ? "p-2.5 justify-center" : "px-3 py-2 text-xs"}
            `}
            title="View Live Website"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-zinc-400" />
            {!collapsed && <span className="truncate">View Live Site</span>}
          </a>

          <div
            className={`flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03] border border-white/5 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 text-zinc-300 text-xs font-bold">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs text-white font-medium truncate">{userEmail}</span>
                <span className="text-[10px] text-zinc-500 capitalize truncate">{userRole || "Admin"}</span>
              </div>
            )}
            <button
              onClick={onLogout}
              title="Log Out"
              className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

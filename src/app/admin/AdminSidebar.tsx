"use client";

import React, { useState, useEffect } from "react";
import { Shield, LogOut, UserCheck, Lock, LayoutDashboard, Sparkles, BookOpen, FileText, CalendarDays, Sprout, HelpCircle, Radio, Trophy, Flag, Users, ShieldAlert, KeyRound, Layers, Handshake, FolderOpen, Search, Command, Database } from "lucide-react";
import { onAdminTab, setAdminTab } from "@/lib/admin/tab-events";
import { canAccessPanel, type RolePermissions } from "@/lib/admin/iam";
import CommandPalette from "@/components/admin/ui/CommandPalette";

const NAV_SECTIONS = [
  {
    label: "Home",
    items: [
      { id: "overview", label: "Today", icon: LayoutDashboard },
      { id: "directus_ai", label: "Drafting Assistant", icon: Sparkles },
    ],
  },
  {
    label: "Write & Publish",
    items: [
      { id: "media", label: "News & Stories", icon: BookOpen },
    ],
  },
  {
    label: "Site & Audience",
    items: [
      { id: "hero_layout", label: "Homepage & Banners", icon: Layers },
      { id: "pages", label: "Website Pages", icon: FileText },
      { id: "events", label: "Events & Festivals", icon: CalendarDays },
      { id: "resources", label: "Resources", icon: FolderOpen },
      { id: "sponsors", label: "Sponsors & Partners", icon: Handshake },
      { id: "grassroots", label: "Clubs & Development", icon: Sprout },
      { id: "faq-footer", label: "Help & Footer", icon: HelpCircle },
    ],
  },
  {
    label: "Matches",
    items: [
      { id: "fixtures", label: "Fixtures & Results", icon: Radio },
      { id: "teams", label: "Teams & Squads", icon: Trophy },
    ],
  },
  {
    label: "Fans & Partners",
    items: [
      { id: "campaigns", label: "Campaigns", icon: Flag },
      { id: "fanzone", label: "Fan Zone", icon: Users },
      { id: "onboarding", label: "Enquiries", icon: ShieldAlert },
    ],
  },
  {
    label: "Team & Safety",
    items: [
      { id: "roles", label: "Team & Permissions", icon: KeyRound },
      { id: "audit_logs", label: "Activity Log", icon: ShieldAlert },
      { id: "backups", label: "Backups & Restore", icon: Database },
    ],
  },
];

interface AdminSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface SidebarUserInfo {
  email: string;
  role: string;
  permissions: RolePermissions;
}

const visibleSections = (
  sections: typeof NAV_SECTIONS,
  userInfo: SidebarUserInfo | null
) =>
  sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!userInfo) return item.id === "overview";
        return canAccessPanel(userInfo.permissions, item.id);
      }),
    }))
    .filter((section) => section.items.length > 0);

export default function AdminSidebar({ activeTab = "overview", onTabChange }: AdminSidebarProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [userInfo, setUserInfo] = useState<SidebarUserInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const unsubscribe = onAdminTab((intent) => setCurrentTab(intent.tab));
    return unsubscribe;
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    fetch("/api/admin/auth/check")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.permissions) {
          setUserInfo({
            email: data.user.email,
            role: data.user.role,
            permissions: data.user.permissions,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // Cookie clearing happens on redirect
    }
    window.location.href = "/admin-login";
  };

  const handleTabClick = (id: string) => {
    setAdminTab(id);
    setIsOpen(false);
    if (onTabChange) onTabChange(id);
  };

  return (
    <>
      {/* Command Palette Modal */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0d131a] border-b border-white/10 px-4 py-3.5 flex items-center justify-between fixed top-0 left-0 right-0 z-40 h-14">
        <div className="flex items-center gap-2.5">
          <div className="w-7.5 h-7.5 rounded-lg bg-[#006B3F] flex items-center justify-center text-white font-bold shadow-md shadow-[#006B3F]/30">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wider">ZRU ADMIN</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCmdOpen(true)}
            className="text-white/70 hover:text-white p-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono flex items-center gap-1 cursor-pointer"
            title="Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-[#006B3F] p-1 text-lg font-bold leading-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-45 transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar aside panel */}
      <aside
        className={`w-64 bg-[#0d131a] border-r border-white/10 flex flex-col h-screen fixed md:sticky top-0 left-0 z-50 transform md:transform-none transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#006B3F] flex items-center justify-center text-white font-bold shadow-md shadow-[#006B3F]/30">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wider">THE TOUCHLINE</h2>
                <p className="text-[10px] text-[#006B3F] font-mono uppercase tracking-widest font-semibold">
                  ZRU Digital
                </p>
              </div>
            </div>
          </div>

          {/* Quick Search / Command Palette Button */}
          <button
            type="button"
            onClick={() => setIsCmdOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-xl text-xs text-white/60 hover:text-white transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-[#006B3F]" />
              <span>Quick jump...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white/10 text-white/60 rounded border border-white/10">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleSections(NAV_SECTIONS, userInfo).map((section) => (
            <div key={section.label} className="space-y-0.5 mb-3">
              <div className="pt-2 pb-1 px-3">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 block">
                  {section.label}
                </span>
              </div>
              {section.items.map((item) => {
                const isActive = currentTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-[#006B3F] text-white shadow-md shadow-[#006B3F]/25 font-bold"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-zinc-400"}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Security Status & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 relative bg-black/20">
          <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All systems normal</span>
            </div>
          </div>

          {userInfo && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/[0.04] rounded-lg border border-white/5">
              <UserCheck className="w-4 h-4 text-[#006B3F] shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[11px] text-white font-medium truncate">{userInfo.email}</p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest font-mono">
                  {userInfo.role}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

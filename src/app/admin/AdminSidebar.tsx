"use client";

import React from "react";
import {
  LayoutDashboard,
  Newspaper,
  Radio,
  Gavel,
  CalendarDays,
  Users,
  Building2,
  Flag,
  Layers,
  Handshake,
  FolderOpen,
  HelpCircle,
  Trash2,
  Sparkles,
  ShieldCheck,
  Plus,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { canAccessPanel, type RolePermissions } from "@/lib/admin/iam";

interface AdminSidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  permissions?: RolePermissions;
  userEmail?: string;
  userRole?: string;
}

export default function AdminSidebar({
  activeTab,
  onNavigate,
  permissions,
  userEmail = "admin@zimrugby.co.zw",
  userRole = "super_admin",
}: AdminSidebarProps) {
  const hasPanel = (tab: string) => canAccessPanel(permissions, tab);

  const navGroups = [
    {
      title: "Core Operations",
      items: [
        {
          id: "overview",
          label: "Dashboard",
          icon: LayoutDashboard,
          visible: hasPanel("overview"),
        },
        {
          id: "media",
          label: "Editorial",
          icon: Newspaper,
          visible: hasPanel("media"),
        },
        {
          id: "fixtures",
          label: "Match Ops",
          icon: Radio,
          visible: hasPanel("fixtures"),
        },
        {
          id: "events",
          label: "Events & Calendar",
          icon: CalendarDays,
          visible: hasPanel("events"),
        },
      ],
    },
    {
      title: "Squads & Directory",
      items: [
        {
          id: "teams",
          label: "Teams & Squads",
          icon: Users,
          visible: hasPanel("teams"),
        },
        {
          id: "clubs",
          label: "Rugby Clubs",
          icon: Building2,
          visible: hasPanel("clubs"),
        },
        {
          id: "hero_layout",
          label: "Hero & Announcements",
          icon: Layers,
          visible: hasPanel("hero_layout"),
        },
      ],
    },
    {
      title: "Governance & Fans",
      items: [
        {
          id: "fanzone",
          label: "Fan Zone Members",
          icon: ShieldCheck,
          visible: hasPanel("fanzone"),
        },
        {
          id: "onboarding",
          label: "Onboarding Enquiries",
          icon: Gavel,
          visible: hasPanel("onboarding"),
        },
        {
          id: "campaigns",
          label: "Campaigns & Drives",
          icon: Flag,
          visible: hasPanel("campaigns"),
        },
        {
          id: "directus_ai",
          label: "Directus AI Assistant",
          icon: Sparkles,
          visible: hasPanel("directus_ai"),
        },
      ],
    },
    {
      title: "Resources & Assets",
      items: [
        {
          id: "sponsors",
          label: "Sponsors & Partners",
          icon: Handshake,
          visible: hasPanel("sponsors"),
        },
        {
          id: "resources",
          label: "Document Library",
          icon: FolderOpen,
          visible: hasPanel("resources"),
        },
        {
          id: "faq-footer",
          label: "FAQs & Footer",
          icon: HelpCircle,
          visible: hasPanel("faq-footer"),
        },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 flex-col w-64 z-40 bg-white border-r border-black/10 select-none shadow-xs">
      {/* Brand Header */}
      <div className="p-4 mb-2 flex items-center gap-3 border-b border-black/5">
        <div className="w-9 h-9 rounded-lg bg-[#002d19] flex items-center justify-center text-white font-heading font-black text-base shadow-sm">
          Z
        </div>
        <div>
          <h2 className="font-heading text-sm font-bold text-[#002d19] leading-tight">
            Admin Portal
          </h2>
          <p className="text-[10px] text-[#707972] uppercase tracking-wider font-semibold">
            Regulatory & Match Ops
          </p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin">
        {navGroups.map((group, gIdx) => {
          const visibleItems = group.items.filter((i) => i.visible);
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#707972] mb-1.5">
                {group.title}
              </p>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-[#60fdbc]/30 text-[#00452a] font-bold shadow-xs scale-[0.99]"
                        : "text-[#404942] hover:bg-black/[0.03] hover:text-[#1b1c1c]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-[#006c4a]" : "text-[#707972]"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-black/5 bg-[#fbf9f8] space-y-2">
        {hasPanel("trash") && (
          <button
            type="button"
            onClick={() => onNavigate("trash")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
              activeTab === "trash"
                ? "bg-red-50 text-red-700 font-bold"
                : "text-[#707972] hover:text-red-700 hover:bg-red-50/50"
            }`}
          >
            <Trash2 className="w-4 h-4 text-[#707972]" />
            <span>Trash & Archive</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onNavigate("media")}
          className="w-full py-2.5 px-3 bg-[#002d19] hover:bg-[#00452a] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Publication</span>
        </button>
      </div>
    </aside>
  );
}

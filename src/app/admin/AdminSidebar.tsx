"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, Shield, UserCheck, ShieldAlert, Lock } from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Quick Dashboard", icon: "⚡" },
  { id: "directus_ai", label: "Directus AI Assistant", icon: "🤖" },
  { id: "articles", label: "News & Articles", icon: "📰" },
  { id: "announcements", label: "Announcements", icon: "📢" },
  { id: "fixtures", label: "Match Fixtures", icon: "🏉" },
  { id: "gallery", label: "Media Gallery", icon: "📸" },
  { id: "videos", label: "Video Hub", icon: "🎥" },
  { id: "tickets", label: "Ticketing & Sales", icon: "🎟️" },
  { id: "fan_zone", label: "Fan Zone & Polls", icon: "💬" },
  { id: "pages", label: "Visual Page Builder", icon: "🖥️" },
];

interface AdminSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function AdminSidebar({ activeTab = "overview", onTabChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserInfo({ email: data.user.email, role: data.user.role });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin-login";
  };

  return (
    <aside className="w-64 bg-[#0d131a] border-r border-white/10 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#006B3F] flex items-center justify-center text-white font-bold">
            <Shield className="w-5 h-5 text-accent-teal" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wider">ZRU ADMIN</h2>
            <p className="text-[10px] text-accent-teal font-mono uppercase tracking-widest">
              Directus Engine
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="pt-3 pb-1.5 px-3">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 block">
            Navigation Menu
          </span>
        </div>
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id || (activeTab === "" && item.id === "overview");

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onTabChange) onTabChange(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#006B3F] text-white shadow-md shadow-[#006B3F]/20"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Security Status & Logout */}
      <div className="p-4 border-t border-white/10 space-y-3 relative bg-black/20">
        <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
          <Lock className="w-3 h-3 text-accent-teal shrink-0" />
          <span className="truncate">Encrypted Session</span>
        </div>

        {userInfo && (
          <div className="flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded-lg border border-white/5">
            <UserCheck className="w-4 h-4 text-accent-teal shrink-0" />
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
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

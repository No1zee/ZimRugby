"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, Shield, UserCheck, ShieldAlert, Lock } from "lucide-react";

const PAGE_ROUTES = [
  { slug: "home", label: "Home" },
  { slug: "teams", label: "Teams" },
  { slug: "events", label: "Events" },
  { slug: "tickets", label: "Tickets" },
  { slug: "about", label: "About" },
  { slug: "fan-zone", label: "Fan Zone" },
  { slug: "play-rugby", label: "Play Rugby" },
  { slug: "clubs", label: "Clubs" },
  { slug: "schools", label: "Schools" },
  { slug: "media", label: "Media" },
  { slug: "match-centre", label: "Match Centre" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUserInfo(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin-login";
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "super_admin":
        return { label: "SUPER ADMIN", bg: "bg-[#006B3F] text-white border-accent-teal/40" };
      case "editor":
        return { label: "CONTENT EDITOR", bg: "bg-blue-600/30 text-blue-300 border-blue-500/30" };
      case "media_manager":
        return { label: "MEDIA MANAGER", bg: "bg-purple-600/30 text-purple-300 border-purple-500/30" };
      default:
        return { label: "COMPLIANCE AUDITOR", bg: "bg-amber-600/30 text-amber-300 border-amber-500/30" };
    }
  };

  const roleMeta = getRoleBadge(userInfo?.role);

  return (
    <aside className="w-64 bg-[#002D1A] border-r border-white/10 flex flex-col relative overflow-hidden select-none">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#006B3F] via-[#00A85A] to-[#006B3F]" />

      {/* Logo & Identity */}
      <div className="p-5 border-b border-white/10 relative space-y-3">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#006B3F] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,107,63,0.4)] group-hover:shadow-[0_0_25px_rgba(0,107,63,0.6)] transition-shadow border border-white/10">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-heading text-sm uppercase tracking-wider font-black">ZRU VISUAL BUILDER</div>
            <div className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-subheading font-bold">NIST & ISO 27001 SECURED</div>
          </div>
        </Link>

        {/* User Role Badge */}
        {userInfo && (
          <div className="pt-1">
            <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider flex items-center justify-between ${roleMeta.bg}`}>
              <span className="flex items-center gap-1.5 truncate">
                <UserCheck className="w-3 h-3 shrink-0" />
                <span className="truncate">{userInfo.email.split("@")[0]}</span>
              </span>
              <span className="text-[9px] font-mono opacity-80">{roleMeta.label.split(" ")[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto relative">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-heading uppercase tracking-wider transition-all ${
            pathname === "/admin"
              ? "bg-[#006B3F]/30 text-accent-teal border border-accent-teal/30 shadow-[0_0_15px_rgba(0,107,63,0.2)]"
              : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-accent-teal" />
          <span>Dashboard</span>
        </Link>

        <div className="pt-3 pb-1.5 px-3">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 block">
            Editable Pages
          </span>
        </div>

        {PAGE_ROUTES.map((page) => {
          const isActive = pathname === `/admin/${page.slug}`;
          return (
            <Link
              key={page.slug}
              href={`/admin/${page.slug}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
                isActive
                  ? "bg-[#006B3F]/30 text-accent-teal border border-accent-teal/30 font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-white/40" />
              <span>{page.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Security Status & Logout */}
      <div className="p-4 border-t border-white/10 space-y-3 relative bg-black/20">
        <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
          <Lock className="w-3 h-3 text-accent-teal shrink-0" />
          <span>AAA Session Active</span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-300 text-xs font-heading font-bold uppercase tracking-wider transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>SIGN OUT</span>
        </button>
      </div>
    </aside>
  );
}

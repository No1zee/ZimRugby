"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, Shield, Settings2 } from "lucide-react";

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

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin-login";
  };

  return (
    <aside className="w-64 bg-[#002D1A] border-r border-white/10 flex flex-col relative overflow-hidden">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {/* Green accent stripe at top */}
      <div className="h-1 bg-gradient-to-r from-[#006B3F] via-[#00A85A] to-[#006B3F]" />

      {/* Logo */}
      <div className="p-6 border-b border-white/10 relative">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#006B3F] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,107,63,0.3)] group-hover:shadow-[0_0_25px_rgba(0,107,63,0.5)] transition-shadow">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-heading text-sm uppercase tracking-wider">ZRU</div>
            <div className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-subheading">Content Manager</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto relative">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
            pathname === "/admin"
              ? "bg-[#006B3F]/20 text-[#00A85A] border border-[#006B3F]/30"
              : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>

        <Link
          href="/admin#content-manager"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
            pathname === "/admin" && false
              ? "bg-[#006B3F]/20 text-[#00A85A] border border-[#006B3F]/30"
              : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <Settings2 className="w-4 h-4" />
          Content Manager
        </Link>

        <div className="pt-4 pb-2">
          <div className="px-3 text-[9px] font-black text-white/25 uppercase tracking-[0.4em] font-subheading">
            Pages
          </div>
        </div>

        {PAGE_ROUTES.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/${page.slug}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
              pathname === `/admin/${page.slug}`
                ? "bg-[#006B3F]/20 text-[#00A85A] border border-[#006B3F]/30"
                : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <FileText className="w-4 h-4" />
            {page.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10 relative">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-white/40 hover:text-[#FF4444] hover:bg-[#FF4444]/10 border border-transparent hover:border-[#FF4444]/20 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

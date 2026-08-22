"use client";

import { useState, useEffect } from "react";
import { PlusCircle, RefreshCw, Radio, Database, Sparkles, Wifi, WifiOff } from "lucide-react";
import { useToast } from "./ToastProvider";

interface AdminQuickActionDockProps {
  role: string;
  onNavigate: (tab: string, intent?: { openItem?: string | number }) => void;
  onRefreshCdn: () => Promise<void>;
  isPurgingCache: boolean;
}

export default function AdminQuickActionDock({
  role,
  onNavigate,
  onRefreshCdn,
  isPurgingCache,
}: AdminQuickActionDockProps) {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const canManageBackups = role === "super_admin";
  const canPublish = role === "super_admin" || role === "editor";

  return (
    <aside aria-label="Quick Actions" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] sm:max-w-max">
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#1b1c16]/95 backdrop-blur-md border border-[#00C88C]/40 shadow-[0_0_25px_rgba(0,200,140,0.25)] text-white">
        {/* Network Status Badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/80"
          title={isOnline ? "Network Online • Local buffer synced" : "Offline mode • Buffered locally in browser"}
        >
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3 text-[#00C88C]" />
              <span className="hidden md:inline text-[#00C88C] font-bold uppercase">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-amber-400" />
              <span className="hidden md:inline text-amber-400 font-bold uppercase">Offline</span>
            </>
          )}
        </div>

        <div className="h-5 w-px bg-white/15 mx-0.5" />

        {/* Quick New Article */}
        <button
          onClick={() => {
            onNavigate("media");
            toast("Opened News & Stories composer", "info");
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#006747] text-white font-heading text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>New Story</span>
        </button>

        {/* Live Fixtures & Score */}
        <button
          onClick={() => {
            onNavigate("fixtures");
            toast("Navigated to Match Operations", "info");
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
        >
          <Radio className="h-3.5 w-3.5 text-[#00C88C]" />
          <span className="hidden sm:inline">Match Ops</span>
        </button>

        {/* AI Drafting Assistant */}
        <button
          onClick={() => {
            onNavigate("directus_ai");
            toast("Opened AI Drafting Assistant", "info");
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#00C88C]" />
          <span className="hidden sm:inline">AI Draft</span>
        </button>

        {/* One-Click CDN Purge */}
        {canPublish && (
          <button
            onClick={onRefreshCdn}
            disabled={isPurgingCache}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            title="Purge Next.js ISR Edge Cache"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#00C88C] ${isPurgingCache ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">{isPurgingCache ? "Purging..." : "Sync CDN"}</span>
          </button>
        )}

        {/* Backups trigger for Super Admin */}
        {canManageBackups && (
          <button
            onClick={() => {
              onNavigate("backups");
              toast("Navigated to PostgreSQL 18 Backups", "info");
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
            title="Database Backups & Retention"
          >
            <Database className="h-3.5 w-3.5 text-[#00C88C]" />
            <span className="hidden lg:inline">Backups</span>
          </button>
        )}
      </div>
    </aside>
  );
}

"use client";

import React from "react";
import { 
  Monitor, Tablet, Smartphone, Eye, Sparkles, CheckCircle2, RotateCcw, 
  Send, Layers, Sliders, ChevronDown, ExternalLink, ShieldCheck, ArrowLeft
} from "lucide-react";
import { useStudioLive, type StudioViewport, type StudioPage } from "@/lib/admin/studio-context";
import { useToast } from "../ui/ToastProvider";

interface StudioTopBarProps {
  onSwitchToDataMode: () => void;
}

export default function StudioTopBar({ onSwitchToDataMode }: StudioTopBarProps) {
  const { 
    viewport, setViewport, 
    zoom, setZoom,
    activePage, setActivePage,
    isInspectorOpen, setIsInspectorOpen,
    hasUnsavedChanges, isSaving,
    publishChanges, resetToPublished
  } = useStudioLive();

  const { toast } = useToast();

  const handlePublish = async () => {
    const ok = await publishChanges();
    if (ok) {
      toast("Published to Live Edge CDN & Directus successfully!", "success");
    } else {
      toast("Changes saved to local session baseline.", "success");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#1A1A1B] via-[#0F141C] to-[#031812] border-b border-[#C5A059]/30 text-white shadow-xl px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand, Back to Data Tables & Page Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToDataMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold transition-colors cursor-pointer"
            title="Switch to classic Data Tables view"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden sm:inline">Data CMS</span>
          </button>

          <div className="h-5 w-px bg-white/15 hidden sm:block" />

          {/* Brand Badge */}
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 40 40" className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor">
              <path d="M6 34 L12 10 L28 10 L34 34 Z" strokeWidth="2.5" strokeLinejoin="bevel" />
              <path d="M12 34 L15 16 L25 16 L28 34 Z" strokeWidth="2" />
              <circle cx="20" cy="8" r="2.5" fill="currentColor" />
            </svg>
            <span className="font-heading font-black tracking-wider text-xs uppercase text-white hidden md:inline">
              SAMARIA <span className="text-[#C5A059]">STUDIO</span>
            </span>
          </div>

          {/* Page Selector */}
          <div className="relative">
            <select
              value={activePage}
              onChange={(e) => setActivePage(e.target.value as StudioPage)}
              className="bg-[#141A22] border border-white/15 hover:border-[#C5A059]/50 text-white text-xs font-bold font-heading uppercase px-3 py-1.5 rounded-xl outline-none cursor-pointer transition-colors pr-8 appearance-none"
            >
              <option value="home">🏠 Home Overview</option>
              <option value="matches">🏉 Match Centre</option>
              <option value="news">📰 Media & News</option>
              <option value="tickets">🎟️ Tickets & FAQs</option>
              <option value="squads">🇿🇼 Squads & Roster</option>
            </select>
            <ChevronDown className="w-3 h-3 text-white/50 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Center: Device Viewport Switcher & Zoom */}
        <div className="flex items-center gap-2 bg-[#090D12] border border-white/15 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => setViewport("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === "desktop"
                ? "bg-gradient-to-r from-[#006B3F] to-[#014d2e] text-white shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
            title="Desktop 1400px"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">1400px</span>
          </button>

          <button
            onClick={() => setViewport("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === "tablet"
                ? "bg-gradient-to-r from-[#006B3F] to-[#014d2e] text-white shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">768px</span>
          </button>

          <button
            onClick={() => setViewport("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === "mobile"
                ? "bg-gradient-to-r from-[#006B3F] to-[#014d2e] text-white shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">375px</span>
          </button>
        </div>

        {/* Right: Telemetry, Inspector Toggle & Publish */}
        <div className="flex items-center gap-2.5">
          {/* Live Sync Telemetry */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            0ms Hot-Preview
          </div>

          {/* Toggle Inspector Panel */}
          <button
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isInspectorOpen
                ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]"
                : "bg-white/5 border-white/10 text-white/70 hover:text-white"
            }`}
            title="Toggle Live Property Inspector"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inspector</span>
          </button>

          {/* Reset / Revert Button */}
          {hasUnsavedChanges && (
            <button
              onClick={resetToPublished}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              title="Reset unsaved edits"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Publish Live Button */}
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#006B3F] to-[#014d2e] hover:from-green-600 hover:to-green-700 border border-emerald-400/40 px-4 py-1.5 text-xs font-bold font-heading uppercase tracking-wider text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSaving ? "Publishing..." : "Publish Live"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

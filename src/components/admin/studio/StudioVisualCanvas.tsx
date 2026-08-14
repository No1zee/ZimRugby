"use client";

import React from "react";
import { useStudioLive } from "@/lib/admin/studio-context";
import HeroCanvasPreview from "./preview/HeroCanvasPreview";
import TickerCanvasPreview from "./preview/TickerCanvasPreview";
import MatchesCanvasPreview from "./preview/MatchesCanvasPreview";
import NewsCanvasPreview from "./preview/NewsCanvasPreview";
import SponsorsCanvasPreview from "./preview/SponsorsCanvasPreview";
import TicketsCanvasPreview from "./preview/TicketsCanvasPreview";
import SquadsCanvasPreview from "./preview/SquadsCanvasPreview";

export default function StudioVisualCanvas() {
  const { viewport, zoom, activePage } = useStudioLive();

  // Determine container width based on viewport selection
  const viewportWidthClass =
    viewport === "mobile"
      ? "max-w-[390px]"
      : viewport === "tablet"
      ? "max-w-[768px]"
      : "max-w-[1280px]";

  const scaleStyle = zoom !== 100 ? { transform: `scale(${zoom / 100})`, transformOrigin: "top center" } : {};

  return (
    <div className="flex-1 overflow-y-auto bg-[#080B0F] p-4 sm:p-8 flex flex-col items-center min-h-[calc(100vh-60px)]">
      {/* Viewport Frame Header & Resolution Badge */}
      <div className="mb-3 flex items-center justify-between w-full max-w-[1280px] px-2 text-[11px] font-mono text-white/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-white font-bold uppercase">
            {viewport.toUpperCase()} CANVAS
          </span>
          <span className="text-white/40">
            ({viewport === "mobile" ? "390 × 844" : viewport === "tablet" ? "768 × 1024" : "1280 × Dynamic"})
          </span>
        </div>
        <span className="text-[#C5A059] font-bold">
          Click any component block to inspect and edit live
        </span>
      </div>

      {/* Device Frame */}
      <div
        style={scaleStyle}
        className={`w-full ${viewportWidthClass} transition-all duration-300 rounded-[28px] border border-white/15 bg-[#03070A] shadow-2xl p-4 sm:p-6 space-y-6 relative`}
      >
        {/* Mobile Camera Notch Simulation when in Mobile View */}
        {viewport === "mobile" && (
          <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 border border-white/10" />
        )}

        {/* Render sections according to activePage */}
        {activePage === "home" && (
          <>
            <HeroCanvasPreview />
            <TickerCanvasPreview />
            <MatchesCanvasPreview />
            <NewsCanvasPreview />
            <TicketsCanvasPreview />
            <SquadsCanvasPreview />
            <SponsorsCanvasPreview />
          </>
        )}

        {activePage === "matches" && (
          <>
            <TickerCanvasPreview />
            <MatchesCanvasPreview />
            <SquadsCanvasPreview />
          </>
        )}

        {activePage === "news" && (
          <>
            <NewsCanvasPreview />
          </>
        )}

        {activePage === "tickets" && (
          <>
            <TicketsCanvasPreview />
            <MatchesCanvasPreview />
          </>
        )}

        {activePage === "squads" && (
          <>
            <HeroCanvasPreview />
            <SquadsCanvasPreview />
            <MatchesCanvasPreview />
          </>
        )}
      </div>
    </div>
  );
}

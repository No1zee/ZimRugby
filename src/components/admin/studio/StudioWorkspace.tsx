"use client";

import React from "react";
import StudioTopBar from "./StudioTopBar";
import StudioVisualCanvas from "./StudioVisualCanvas";
import StudioInspector from "./StudioInspector";

interface StudioWorkspaceProps {
  onSwitchToDataMode: () => void;
}

export default function StudioWorkspace({ onSwitchToDataMode }: StudioWorkspaceProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#080B0F] text-white">
      {/* Studio Top Control & Device Bar */}
      <StudioTopBar onSwitchToDataMode={onSwitchToDataMode} />

      {/* Main Split Layout: Live Canvas + Docked Property Inspector */}
      <div className="flex flex-1 overflow-hidden relative">
        <StudioVisualCanvas />
        <StudioInspector />
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";

interface SamariaSplashLoaderProps {
  onComplete?: () => void;
}

/**
 * SamariaSplashLoader — "The Digital Ivory Palace"
 * Built strictly according to the official Samaria Tech Brand Identity System:
 * - 60% Royal Obsidian (#1A1A1B) & Black Bean (#031812)
 * - 30% Ivory Glow (#F5F5F0) & Carved Stone Surfaces
 * - 10% Metallic Brass (#C5A059)
 * - Neo-Ancient Circuit-Tribal Temple Gate Motif
 * - Anti-AI Slop: Purposeful, cinematic storyboard transitions
 */
export default function SamariaSplashLoader({ onComplete }: SamariaSplashLoaderProps) {
  const [mounted, setMounted] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState("Initializing Digital Ivory Palace...");

  useEffect(() => {
    // Check if session splash was already rendered in this browser session
    const hasShown = typeof window !== "undefined" && sessionStorage.getItem("samaria_admin_splash_shown");
    if (hasShown) {
      setMounted(false);
      if (onComplete) onComplete();
      return;
    }

    // Step-by-step authentic loading sequence
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusMessage("Connecting to Samaria Control Plane...");
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(85);
      setStatusMessage("Authenticating Sovereign IAM & Directus Gateways...");
    }, 850);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusMessage("Welcome to Samaria CMS");
      setIsFading(true);
    }, 1350);

    const t4 = setTimeout(() => {
      sessionStorage.setItem("samaria_admin_splash_shown", "true");
      setMounted(false);
      if (onComplete) onComplete();
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0d131a] select-none overflow-hidden"
      style={{
        opacity: isFading ? 0 : 1,
        transform: isFading ? "scale(1.02)" : "scale(1)",
        transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: isFading ? "none" : "all",
      }}
    >
      {/* Background Subtle Circuit-Tribal Texture Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C5A059 1px, transparent 1px), radial-gradient(#C5A059 1px, #0d131a 1px)`,
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0, 16px 16px"
        }}
      />

      {/* Decorative Geometric Framing Corners (Neo-Ancient Ivory/Brass) */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[#C5A059]/40 pointer-events-none" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[#C5A059]/40 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[#C5A059]/40 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[#C5A059]/40 pointer-events-none" />

      {/* Central Monolithic Temple Gate & Circuit Motif */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        <div className="relative mb-6">
          {/* Outer Monolith Shield Hexagon */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-[#1A1A1B] to-[#031812] border-2 border-[#C5A059]/50 shadow-2xl flex items-center justify-center p-4 relative overflow-hidden">
            {/* Inner Circuit Traces */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-[#C5A059]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Stepped Temple / Ivory Palace Gate */}
              <path d="M 20 85 L 20 35 L 50 15 L 80 35 L 80 85" strokeWidth="2.5" />
              <path d="M 32 85 L 32 45 L 50 32 L 68 45 L 68 85" strokeWidth="2" />
              <path d="M 44 85 L 44 58 L 50 53 L 56 58 L 56 85" strokeWidth="2" />
              
              {/* Circuit Micro-Nodes */}
              <circle cx="50" cy="15" r="3" fill="#C5A059" />
              <circle cx="20" cy="35" r="2.5" fill="#C5A059" />
              <circle cx="80" cy="35" r="2.5" fill="#C5A059" />
              <circle cx="50" cy="53" r="2" fill="#F5F5F0" />
              <line x1="50" y1="15" x2="50" y2="32" strokeDasharray="2 2" />
              <line x1="20" y1="55" x2="32" y2="55" />
              <line x1="68" y1="55" x2="80" y2="55" />
            </svg>
          </div>

          {/* Micro Subtitle Pill */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#1A1A1B] border border-[#C5A059]/60 text-[9px] font-mono tracking-widest text-[#C5A059] uppercase font-bold shadow-lg">
            SAMARIA TECH
          </div>
        </div>

        {/* Brand Headline (Cinzel Aesthetic) */}
        <h1 
          className="text-2xl sm:text-3xl font-black tracking-widest text-[#F5F5F0] uppercase mb-1"
          style={{ fontFamily: "'Cinzel', 'Cinzel Decorative', 'Montserrat', serif", letterSpacing: "0.2em" }}
        >
          SAMARIA CMS
        </h1>
        <p className="text-xs font-medium text-[#C5A059] tracking-wider uppercase mb-6 font-mono">
          The Digital Ivory Palace &bull; ZRU Control Plane
        </p>

        {/* High-Precision Metallic Brass Progress Bar */}
        <div className="w-64 bg-white/10 h-1 rounded-full overflow-hidden mb-3.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#C5A059] via-[#F5F5F0] to-[#C5A059] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Telemetry Status Message */}
        <p className="text-[11px] font-mono text-[#F5F5F0]/60 tracking-wider h-4">
          {statusMessage}
        </p>
      </div>

      {/* Footer Sovereign Tagline */}
      <div className="absolute bottom-6 text-center">
        <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
          Institutional Software &bull; Powered by Samaria Tech Architecture
        </p>
      </div>
    </div>
  );
}

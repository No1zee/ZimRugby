"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function SamariaSplashLoader() {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Show splash on initial session entry for 1.4s, then smooth fade out
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 1100);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{ opacity, transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#080B0E] p-8 text-white select-none pointer-events-none"
    >
      {/* Top micro status */}
      <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-[#006B3F] animate-ping" />
        <span>SAMARIA CLOUD OS · SECURE INSTANCE</span>
      </div>

      {/* Center Hero Brand & Emblem */}
      <div className="flex flex-col items-center text-center">
        {/* Geometric Samaria Vector Emblem */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_0_50px_rgba(0,107,63,0.25)] backdrop-blur-xl">
          <svg className="h-10 w-10 text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
              stroke="#006B3F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 14L34 20V28L24 34L14 28V20L24 14Z"
              fill="#F5B800"
              fillOpacity="0.85"
            />
            <circle cx="24" cy="24" r="3" fill="#ffffff" />
          </svg>
        </div>

        {/* Samaria Brand Wordmark */}
        <h1 className="font-heading text-2xl font-black tracking-[0.25em] text-white uppercase sm:text-3xl">
          SAMARIA<span className="text-[#006B3F]">.</span>STUDIO
        </h1>

        <div className="mt-2 flex items-center gap-2 text-xs font-medium tracking-wider text-neutral-400">
          <span>Enterprise Digital Experience Platform</span>
          <span className="text-white/20">/</span>
          <span className="text-[#F5B800] font-semibold">Zimbabwe Rugby Union</span>
        </div>

        {/* Minimal Progress Line */}
        <div className="mt-8 h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full bg-gradient-to-r from-[#006B3F] via-[#F5B800] to-[#006B3F] animate-[shimmer_1.2s_infinite]" />
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="flex flex-col items-center gap-1 text-[11px] text-neutral-500 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-neutral-400">
            <ShieldCheck className="h-3.5 w-3.5 text-[#006B3F]" /> ISO 27001 / SOC 2 Ready
          </span>
          <span>·</span>
          <span>v4.2.0-PROD</span>
        </div>
        <span className="text-[10px] text-neutral-600">© {new Date().getFullYear()} SAMARIA TECHNOLOGIES. ALL RIGHTS RESERVED.</span>
      </div>
    </div>
  );
}

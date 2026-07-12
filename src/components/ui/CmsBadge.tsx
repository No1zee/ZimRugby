"use client";

import { Wifi, WifiOff } from "lucide-react";

export default function CmsBadge() {
  const isDev = process.env.NODE_ENV === "development";
  const hasCms = !!process.env.NEXT_PUBLIC_DIRECTUS_URL;

  if (!isDev) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-2xl">
      {hasCms ? (
        <>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <Wifi className="w-3.5 h-3.5 text-green-500" />
          <span>LIVE CMS</span>
        </>
      ) : (
        <>
          <span className="w-2 h-2 rounded-full bg-neutral-500" />
          <WifiOff className="w-3.5 h-3.5 text-neutral-500" />
          <span>MOCK DATA</span>
        </>
      )}
    </div>
  );
}

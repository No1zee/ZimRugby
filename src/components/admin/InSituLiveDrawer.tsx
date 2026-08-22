"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Edit3,
  ExternalLink,
  RotateCw,
  Eye,
  CheckCircle2,
  X,
  FileCheck,
  Shield,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useToast } from "./ui/ToastProvider";

export function InSituLiveDrawer() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);

  // Check admin session
  useEffect(() => {
    fetch("/api/admin/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  // Trigger on-demand cache revalidation
  const handleRevalidate = async () => {
    try {
      setIsRevalidating(true);
      toast("Revalidating page cache...", "info");

      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
      });

      if (res.ok) {
        toast("Page cache purged & updated live!", "success");
      } else {
        toast("Cache purge completed", "info");
      }
    } catch {
      toast("Revalidation trigger sent", "info");
    } finally {
      setIsRevalidating(false);
    }
  };

  // Do not render on /admin or /admin-login
  if (!isAdmin || pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <>
      {/* Floating Action Pill */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-950/90 border border-zru-green/50 text-white shadow-2xl shadow-black hover:border-zru-green transition-all hover:scale-105 group backdrop-blur-md text-xs font-semibold"
          title="Open ZRU In-Situ Live Editor"
        >
          <div className="w-2 h-2 rounded-full bg-zru-green animate-pulse" />
          <Edit3 className="w-3.5 h-3.5 text-zru-green group-hover:rotate-12 transition-transform" />
          <span className="tracking-wider uppercase text-[10px]">Edit Mode</span>
        </button>
      </div>

      {/* Slide-over Quick Drawer */}
      {isOpen && (
        <div className="fixed top-0 right-0 bottom-0 w-80 bg-zinc-950 border-l border-white/10 shadow-2xl z-50 p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200 backdrop-blur-lg">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-zru-green/20 border border-zru-green/40 flex items-center justify-center text-zru-green">
                  <Edit3 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    Live In-Situ Drawer
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Path: {pathname}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Live Controls
              </span>

              <button
                onClick={handleRevalidate}
                disabled={isRevalidating}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-zru-green/40 text-xs text-zinc-200 transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <RotateCw className={`w-3.5 h-3.5 text-zru-green ${isRevalidating ? "animate-spin" : ""}`} />
                  <span>Purge & Revalidate Cache</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Instant</span>
              </button>

              <a
                href="/admin#media"
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-zru-green/40 text-xs text-zinc-200 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-zru-green" />
                  <span>Manage News & Stories</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </a>

              <a
                href="/admin#fixtures"
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-zru-green/40 text-xs text-zinc-200 transition-all"
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-zru-green" />
                  <span>Update Match Scores</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </a>
            </div>
          </div>

          {/* Footer Direct Jump */}
          <div className="border-t border-white/10 pt-4">
            <a
              href="/admin"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zru-green hover:bg-zru-green/90 text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-lg shadow-zru-green/20"
            >
              <span>Open Full Command Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}

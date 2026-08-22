"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Edit2, FileText, Loader2, Layout, Layers, Globe2 } from "lucide-react";
import { useToast } from "@/components/admin/ui/ToastProvider";

interface Page {
  id: string;
  slug: string;
  title: string;
  status: string;
  page_type?: string;
  hero_title?: string;
  updated_at?: string;
  sort?: number;
}

export default function PagesGrid({
  initialPages,
  initialSectionCounts,
}: {
  initialPages: Page[];
  initialSectionCounts: Record<string, number>;
}) {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (page: Page) => {
    const nextStatus = page.status === "published" ? "draft" : "published";
    setTogglingId(page.id);
    try {
      const res = await fetch(`/api/admin/pages/${page.slug}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextStatus === "published" }),
      });
      if (res.ok) {
        setPages((prev) => prev.map((p) => (p.id === page.id ? { ...p, status: nextStatus } : p)));
        toast(`Page "${page.title}" is now ${nextStatus.toUpperCase()}`, "success");
      } else {
        toast("Failed to update page status", "error");
      }
    } catch {
      toast("Network error updating page status", "error");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-zru-green" />
            <span className="font-heading text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
              Page Builder & Architecture
            </span>
          </div>
          <h2 className="font-heading text-2xl font-black uppercase text-rich-black">
            Website Pages & Visual Layouts
          </h2>
          <p className="text-xs text-black/60 mt-0.5">
            Launch the visual block-composer for any page or toggle live availability.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-black/5 px-3.5 py-2 text-xs font-mono font-bold text-rich-black">
            {pages.filter((p) => p.status === "published").length}/{pages.length} Pages Live
          </span>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white py-16 text-center">
          <FileText className="mx-auto mb-2 h-8 w-8 text-black/20" />
          <p className="text-xs font-bold uppercase tracking-wider text-black/40">No pages registered</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => {
            const count = initialSectionCounts[page.id] || 0;
            const isToggling = togglingId === page.id;
            const isHome = page.slug === "home";

            return (
              <div
                key={page.id}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-6 transition-all duration-200 hover:shadow-lg ${
                  isHome ? "border-zru-green/40 shadow-xs md:col-span-2 lg:col-span-2" : "border-black/10 hover:border-black/20"
                }`}
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0B1520] text-white shadow-md">
                      {isHome ? <Globe2 className="h-5 w-5 text-zru-green" /> : <Layout className="h-5 w-5 text-white/80" />}
                    </div>

                    <button
                      onClick={() => handleToggleStatus(page)}
                      disabled={isToggling}
                      className={`inline-flex items-center gap-1.5 rounded-none border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-50 ${
                        page.status === "published"
                          ? "border-zru-green/40 bg-zru-green/10 text-zru-green hover:bg-zru-green/20"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                      }`}
                      title="Click to toggle published status"
                    >
                      {isToggling ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <span
                          className={`h-1.5 w-1.5 ${
                            page.status === "published" ? "bg-zru-green" : "bg-amber-500"
                          }`}
                        />
                      )}
                      {page.status}
                    </button>
                  </div>

                  <h3 className="mb-1 font-heading text-lg font-black uppercase text-rich-black group-hover:text-zru-green transition-colors">
                    {page.title}
                  </h3>
                  <p className="font-mono text-xs text-black/40">
                    /{page.slug === "home" ? "" : page.slug}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5 space-y-4">
                  <div className="flex items-center justify-between text-xs text-black/60">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Layers className="h-3.5 w-3.5 text-black/40" />
                      Configured Sections
                    </span>
                    <span className="rounded-lg bg-black/5 px-2.5 py-1 text-[11px] font-mono font-black text-rich-black">
                      {count} block{count !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href={`/admin/${page.slug}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-zru-green py-2.5 text-center text-xs font-black uppercase tracking-wider text-white shadow-xs transition-all hover:bg-green-800"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit Layout
                    </Link>
                    <Link
                      href={`/${page.slug === "home" ? "" : page.slug}`}
                      target="_blank"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-black/5 py-2.5 text-center text-xs font-black uppercase tracking-wider text-rich-black transition-all hover:bg-black/10"
                    >
                      Preview Live <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

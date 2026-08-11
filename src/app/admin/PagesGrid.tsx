"use client";

import Link from "next/link";
import { ArrowUpRight, Edit2, FileText } from "lucide-react";

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-black uppercase text-rich-black">Website pages</h2>
          <p className="text-sm text-black/60">Select a page to launch the visual block-builder and design its layout.</p>
        </div>
      </div>

      {initialPages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white py-16 text-center">
          <FileText className="mx-auto mb-2 h-8 w-8 text-black/10" />
          <p className="text-xs font-bold uppercase tracking-wider text-black/40">No pages yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {initialPages.map((page) => {
            const count = initialSectionCounts[page.id] || 0;
            return (
              <div key={page.id} className="group flex flex-col rounded-2xl border border-black/10 bg-white p-6 transition-all hover:border-zru-green/45 hover:shadow-md">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zru-green/10">
                    <FileText className="h-5 w-5 text-zru-green" />
                  </div>
                  <span
                    className={`rounded border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em] ${
                      page.status === "published"
                        ? "border-zru-green/20 bg-zru-green/15 text-zru-green"
                        : "border-amber-500/20 bg-amber-500/15 text-amber-600"
                    }`}
                  >
                    {page.status}
                  </span>
                </div>

                <h3 className="mb-1 font-heading text-lg font-black uppercase text-rich-black transition-colors group-hover:text-zru-green">
                  {page.title}
                </h3>
                <p className="mb-6 font-mono text-xs text-black/45">/{page.slug === "home" ? "" : page.slug}</p>

                <div className="mt-auto space-y-4">
                  <div className="mb-4 flex items-center justify-between border-t border-black/5 pt-4 text-xs text-black/55">
                    <span>Configured sections</span>
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold text-rich-black">
                      {count} block{count !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/${page.slug}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-zru-green py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-zru-green/90"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit layout
                    </Link>
                    <Link
                      href={`/${page.slug === "home" ? "" : page.slug}`}
                      target="_blank"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-black/5 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-rich-black transition-all hover:bg-black/10"
                    >
                      Preview live <ArrowUpRight className="h-3.5 w-3.5" />
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

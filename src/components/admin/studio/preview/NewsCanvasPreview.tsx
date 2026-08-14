"use client";

import React from "react";
import { Newspaper, Calendar, ArrowRight } from "lucide-react";
import { useStudioLive } from "@/lib/admin/studio-context";

export default function NewsCanvasPreview() {
  const { news, selectedSection, setSelectedSection } = useStudioLive();
  const articles = news.slice(0, 3);
  const isSelected = selectedSection === "news";

  return (
    <section
      onClick={() => setSelectedSection("news")}
      className={`space-y-3 rounded-3xl p-5 bg-[#0D1117] border transition-all cursor-pointer ${
        isSelected
          ? "border-[#C5A059] ring-2 ring-[#C5A059]/50 shadow-2xl"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            04 NEWS & MEDIA
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider font-heading text-white">
            Editorial Releases & Match Reports
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#C5A059]">Click article to edit</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {articles.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#161B22] to-[#0A0D12] p-4 border border-white/10 hover:border-[#C5A059]/40 transition-colors space-y-2"
          >
            <div>
              <span className="text-[9px] font-mono uppercase font-bold text-[#00a862] bg-[#006B3F]/20 px-2 py-0.5 rounded">
                {item.category || "National Teams"}
              </span>
              <h4 className="text-xs font-bold text-white mt-2 line-clamp-2">
                {item.title}
              </h4>
              <p className="text-[11px] text-white/60 mt-1 line-clamp-2 font-sans">
                {item.excerpt || "Read full report and squad reactions on official portal."}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-white/40 flex items-center justify-between">
              <span>Published</span>
              <span className="text-[#C5A059] font-bold">Edit →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

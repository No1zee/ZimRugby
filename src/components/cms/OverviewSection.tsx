"use client";

import type { PageSection } from "@/lib/api/pages";

export default function OverviewSection({ section }: { section: PageSection }) {
  const stats = ((section.items as { label?: string; value?: string }[]) || []).filter(
    (stat) => stat && (stat.label || stat.value)
  );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="border-l-4 border-zru-green pl-4 mb-8">
          <h2 className="text-2xl font-black uppercase tracking-wider text-rich-black">
            {section.eyebrow || section.title || "OVERVIEW"}
          </h2>
          <p className="text-sm text-rich-black/50 mt-1">
            Introduction and core details.
          </p>
        </div>

        {/* Content */}
        {section.content && (
          <p className="text-rich-black/80 leading-relaxed text-lg font-normal mb-8">
            {section.content}
          </p>
        )}

        {section.body && !section.content && (
          <p className="text-rich-black/80 leading-relaxed text-lg font-normal mb-8">
            {section.body}
          </p>
        )}

        {/* Stats Grid */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-black/5 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white border border-black/5 rounded-2xl p-4 shadow-sm">
                <div className="text-3xl font-black text-zru-green italic mb-1">
                  {stat.value}
                </div>
                <div className="text-rich-black/40 text-[10px] font-bold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

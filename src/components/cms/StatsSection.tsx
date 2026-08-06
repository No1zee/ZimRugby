"use client";

import type { PageSection } from "@/lib/api/pages";

export default function StatsSection({ section }: { section: PageSection }) {
  const stats = (section.items as { label: string; value: string }[]) || [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1440px] mx-auto">
        {section.eyebrow && (
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green mb-3 block">
            {section.eyebrow}
          </span>
        )}
        {section.title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black uppercase italic tracking-tight text-rich-black mb-10 leading-[1.0]">
            {section.title}
          </h2>
        )}

        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="bg-gray-50 border border-black/5 rounded-2xl p-6 shadow-sm">
                <div className="text-3xl md:text-4xl font-black text-zru-green italic mb-2">
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

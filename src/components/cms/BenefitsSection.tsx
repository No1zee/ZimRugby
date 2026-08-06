"use client";

import { CheckCircle2 } from "lucide-react";
import type { PageSection } from "@/lib/api/pages";

export default function BenefitsSection({ section }: { section: PageSection }) {
  const items = (section.items as { title: string; description: string }[]) || [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1440px] mx-auto">
        {section.eyebrow && (
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green mb-3 block">
            {section.eyebrow}
          </span>
        )}
        {section.title && (
          <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-rich-black mb-10 leading-[1.0]">
            {section.title}
          </h2>
        )}
        {section.body && (
          <p className="text-rich-black/60 text-sm mb-8 max-w-2xl">{section.body}</p>
        )}

        {items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl border border-black/5"
              >
                <CheckCircle2 className="w-5 h-5 text-zru-green shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-rich-black text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-rich-black/50 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

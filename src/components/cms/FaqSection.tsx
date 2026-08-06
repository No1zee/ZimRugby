"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { PageSection } from "@/lib/api/pages";

export default function FaqSection({ section }: { section: PageSection }) {
  const items = (section.items as { question: string; answer: string }[]) || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <HelpCircle className="w-6 h-6 text-zru-green" />
          <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-rich-black">
            {section.title || "Frequently Asked Questions"}
          </h2>
        </div>

        <div className="max-w-3xl space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-black/5 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-bold text-rich-black text-sm pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-zru-green shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-sm text-rich-black/60 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

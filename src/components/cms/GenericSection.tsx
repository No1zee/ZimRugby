"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PageSection } from "@/lib/api/pages";

export default function GenericSection({ section }: { section: PageSection }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-3xl">
          {section.eyebrow && (
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green mb-3 block">
              {section.eyebrow}
            </span>
          )}
          {section.title && (
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-rich-black mb-4 leading-[1.0]">
              {section.title}
            </h2>
          )}
          {section.body && (
            <p className="text-rich-black/60 text-sm leading-relaxed mb-4">
              {section.body}
            </p>
          )}
          {section.content && (
            <div className="text-rich-black/60 text-sm leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          )}
          {section.image && (
            <div className="mt-6 h-64 bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={section.image}
                alt={section.title || ""}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {section.cta_label && (
            <Link
              href={section.cta_url || "#"}
              className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-zru-green hover:gap-3 transition-all"
            >
              {section.cta_label} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

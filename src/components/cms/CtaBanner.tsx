"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PageSection } from "@/lib/api/pages";

export default function CtaBanner({ section }: { section: PageSection }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zru-green">
      <div className="max-w-[1440px] mx-auto text-center">
        {section.eyebrow && (
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-3 block">
            {section.eyebrow}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-4">
          {section.title || "Ready to Get Started?"}
        </h2>
        {section.body && (
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            {section.body}
          </p>
        )}
        {section.cta_label && (
          <Link
            href={section.cta_url || "/contact"}
            className="inline-flex items-center gap-2 bg-white text-zru-green px-8 py-4 font-bold uppercase tracking-wider rounded hover:bg-white/90 transition-colors text-sm"
          >
            {section.cta_label} <ArrowRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </section>
  );
}

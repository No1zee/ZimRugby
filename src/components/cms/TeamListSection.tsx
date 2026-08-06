"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { PageSection } from "@/lib/api/pages";

interface TeamItem {
  name: string;
  location?: string;
  slug?: string;
  image?: string;
  description?: string;
  category?: string;
}

export default function TeamListSection({ section }: { section: PageSection }) {
  const items = (section.items as unknown as TeamItem[]) || [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-milk-white">
      <div className="max-w-[1440px] mx-auto">
        {section.eyebrow && (
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green mb-3 block">
            {section.eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-rich-black mb-10 leading-[1.0]">
          {section.title || "Our Teams"}
        </h2>

        {items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((team, i) => (
              <Link
                key={i}
                href={team.slug ? `/teams/${team.slug}` : "#"}
                className="group block bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-lg transition-all"
              >
                {team.image && (
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={team.image}
                      alt={team.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  {team.category && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-zru-green mb-2 block">
                      {team.category}
                    </span>
                  )}
                  <h3 className="font-bold text-rich-black group-hover:text-zru-green transition-colors">
                    {team.name}
                  </h3>
                  {team.location && (
                    <p className="text-rich-black/40 text-xs mt-1">{team.location}</p>
                  )}
                  {team.description && (
                    <p className="text-rich-black/50 text-xs mt-2 line-clamp-2">
                      {team.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 text-zru-green text-xs font-bold mt-3 group-hover:gap-2 transition-all">
                    View Team <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

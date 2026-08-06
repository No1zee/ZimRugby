"use client";

import { MapPin, Search } from "lucide-react";
import type { PageSection } from "@/lib/api/pages";

interface ClubItem {
  name: string;
  location: string;
  league?: string;
}

export default function ClubsSection({ section }: { section: PageSection }) {
  const items = (section.items as unknown as ClubItem[]) || [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-rich-black mb-2">
              {section.title || "Find a Club"}
            </h2>
            {section.content && (
              <p className="text-rich-black/50 text-sm">{section.content}</p>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city or club name…"
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg w-full md:w-80 focus:outline-none focus:border-zru-green text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((club, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-5 border border-gray-100 hover:border-zru-green/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-zru-green">{club.name}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    {club.location}
                  </div>
                </div>
                <span className="bg-zru-green/20 text-zru-green text-[10px] font-bold px-2 py-1 rounded uppercase">
                  {club.league || "Super League"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

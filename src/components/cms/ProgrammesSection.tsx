"use client";

import Link from "next/link";
import { ArrowRight, MapPin, GraduationCap, Heart, Users } from "lucide-react";
import type { PageSection } from "@/lib/api/pages";

const iconMap: Record<string, any> = {
  MapPin,
  GraduationCap,
  Heart,
  Users,
};

const colorMap: string[] = [
  "bg-zru-green",
  "bg-blue-600",
  "bg-pink-600",
  "bg-orange-600",
  "bg-purple-600",
  "bg-teal-600",
];

interface ProgrammeItem {
  title: string;
  description: string;
  link?: string;
  icon?: string;
  stat?: number;
  stat_label?: string;
}

export default function ProgrammesSection({ section }: { section: PageSection }) {
  const items = (section.items as unknown as ProgrammeItem[]) || [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1440px] mx-auto">
        {section.eyebrow && (
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green mb-3 block">
            {section.eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-rich-black mb-10 leading-[1.0]">
          {section.title || "Find Your Path"}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((prog, i) => {
            const IconComponent = iconMap[prog.icon || ""] || MapPin;
            const colorClass = colorMap[i % colorMap.length] || "bg-zru-green";

            return (
              <Link key={i} href={prog.link || "#"} className="group block">
                <div className="bg-gray-50 rounded-lg p-6 h-full hover:shadow-lg transition-all duration-300 border border-transparent hover:border-zru-green/30">
                  <div className={`${colorClass} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-zru-green mb-2 group-hover:text-zru-green transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {prog.description}
                  </p>
                  <span className="text-zru-green text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

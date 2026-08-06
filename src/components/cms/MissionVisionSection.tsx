"use client";

import { Target, Award } from "lucide-react";
import type { PageSection } from "@/lib/api/pages";

interface MissionVisionProps {
  missionSection?: PageSection;
  visionSection?: PageSection;
}

export default function MissionVisionSection({
  missionSection,
  visionSection,
}: MissionVisionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-black/5">
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-zru-green" />
              <h3 className="text-lg font-black uppercase tracking-wide text-rich-black">
                {missionSection?.title || "OUR MISSION"}
              </h3>
            </div>
            <p className="text-rich-black/60 text-sm leading-relaxed font-normal">
              {missionSection?.content ||
                "To develop, promote, and govern the game of rugby union in Zimbabwe, fostering excellence at all levels while using the sport to positively impact communities across the nation."}
            </p>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-zru-green" />
              <h3 className="text-lg font-black uppercase tracking-wide text-rich-black">
                {visionSection?.title || "OUR VISION"}
              </h3>
            </div>
            <p className="text-rich-black/60 text-sm leading-relaxed font-normal">
              {visionSection?.content ||
                "To be the leading rugby nation in Africa, renowned for competitive excellence, inclusive development, and the positive transformation of lives through the values of rugby."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

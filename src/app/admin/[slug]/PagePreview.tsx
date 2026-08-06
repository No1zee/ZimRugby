"use client";

import type { PageSection } from "@/lib/api/pages";
import CmsHero from "@/components/cms/CmsHero";
import SectionRenderer from "@/components/cms/SectionRenderer";
import { Plus } from "lucide-react";

interface Page {
  slug: string;
  title: string;
  hero_kicker?: string;
  hero_title?: string;
  hero_intro?: string;
  hero_image?: string;
}

const SECTION_LABELS: Record<string, string> = {
  overview: "Overview",
  mission: "Mission",
  vision: "Vision",
  values: "Values",
  history: "History",
  leadership: "Leadership",
  contact: "Contact",
  faq: "FAQ",
  stats: "Stats",
  benefits: "Benefits",
  cta: "Call to Action",
  team_list: "Team List",
  programmes: "Programmes",
  clubs: "Clubs",
  development_pathways: "Development Pathways",
  custom: "Custom Section",
};

export default function PagePreview({
  page,
  sections,
  selectedSectionId,
  onSelectSection,
}: {
  page: Page;
  sections: PageSection[];
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
}) {
  const missionSection = sections.find((s) => s.section_key === "mission");
  const visionSection = sections.find((s) => s.section_key === "vision");

  const renderableSections = sections.filter((s) => {
    if (s.section_key === "vision") return false;
    if (s.section_key === "hero_image") return false;
    return true;
  });

  return (
    <div className="min-h-full bg-white">
      <div
        onClick={() => onSelectSection(null)}
        className={`relative cursor-pointer transition-all ${
          selectedSectionId === null
            ? "ring-2 ring-inset ring-zru-green"
            : "hover:ring-2 hover:ring-inset hover:ring-zru-green/50"
        }`}
      >
        <CmsHero
          kicker={page.hero_kicker}
          title={page.hero_title || page.title}
          intro={page.hero_intro}
          image={page.hero_image}
        />
        <div className="absolute top-4 left-4 bg-black/60 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded z-10">
          Hero
        </div>
      </div>

      {renderableSections.length === 0 ? (
        <div className="p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zru-green/10 mb-4">
            <Plus className="w-8 h-8 text-zru-green" />
          </div>
          <p className="text-gray-500 text-sm font-medium">No sections yet</p>
          <p className="text-gray-400 text-xs mt-1">Add a section from the panel on the right</p>
        </div>
      ) : (
        <div>
          {renderableSections.map((section) => (
            <div
              key={section.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSection(section.id);
              }}
              className={`relative cursor-pointer transition-all group ${
                selectedSectionId === section.id
                  ? "ring-2 ring-inset ring-zru-green ring-offset-2"
                  : "hover:ring-2 hover:ring-inset hover:ring-zru-green/30 hover:ring-offset-1"
              }`}
            >
              <div className="absolute top-4 left-4 bg-black/60 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded z-10">
                {SECTION_LABELS[section.section_key] || section.section_key}
              </div>

              <SectionRenderer
                sections={[section]}
                missionSection={section.section_key === "mission" ? section : missionSection}
                visionSection={visionSection}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

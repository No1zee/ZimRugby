"use client";

import type { PageData } from "@/lib/api/pages";
import SectionRenderer from "@/components/cms/SectionRenderer";

interface AboutClientProps {
  cmsPage: PageData | null;
}

export default function AboutClient({ cmsPage }: AboutClientProps) {
  if (!cmsPage) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-rich-black/40">Loading about content…</p>
      </div>
    );
  }

  const missionSection = cmsPage.sections.find((s) => s.section_key === "mission");
  const visionSection = cmsPage.sections.find((s) => s.section_key === "vision");

  // Filter out vision since it's rendered with mission as a pair
  const renderableSections = cmsPage.sections.filter(
    (s) => s.section_key !== "vision"
  );

  return (
    <div className="bg-milk-white min-h-screen">
      <SectionRenderer
        sections={renderableSections}
        missionSection={missionSection}
        visionSection={visionSection}
      />
    </div>
  );
}

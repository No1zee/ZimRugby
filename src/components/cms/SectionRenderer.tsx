"use client";

import type { PageSection } from "@/lib/api/pages";
import OverviewSection from "./OverviewSection";
import MissionVisionSection from "./MissionVisionSection";
import ContactSection from "./ContactSection";
import StatsSection from "./StatsSection";
import FaqSection from "./FaqSection";
import BenefitsSection from "./BenefitsSection";
import CtaBanner from "./CtaBanner";
import TeamListSection from "./TeamListSection";
import ProgrammesSection from "./ProgrammesSection";
import ClubsSection from "./ClubsSection";
import DevelopmentPathways from "./DevelopmentPathways";
import GenericSection from "./GenericSection";
import EditableWrapper from "@/lib/edit-mode/EditableWrapper";
import { useEditMode } from "@/lib/edit-mode/EditContext";

/* Homepage-specific components */
import HeroCarousel from "@/components/home/HeroCarousel";
import PinnedAnnouncements from "@/components/home/PinnedAnnouncements";
import type { AnnouncementItem } from "@/components/home/PinnedAnnouncements";
import type { Report } from "@/lib/data-fetcher";
import type { MatchCardViewModel } from "@/lib/match-centre/types";
import UnifiedHubGrid from "@/components/home/UnifiedHubGrid";
import RoadToWorldCup from "@/components/home/RoadToWorldCup";
import type { Campaign } from "@/lib/api/campaigns";
import GrassrootsInitiativeSection from "@/components/home/GrassrootsInitiativeSection";
import HomeNewsletterBanner from "@/components/home/HomeNewsletterBanner";
import SponsorGrid from "@/components/home/SponsorGrid";

interface SectionRendererProps {
  sections: PageSection[];
  missionSection?: PageSection;
  visionSection?: PageSection;
  /* Homepage data props passed through from page.tsx */
  heroSlides?: any[];
  partners?: any[];
  featuredPlayers?: any[];
  campaign?: Campaign | null;
  initiatives?: any[];
  announcementItems?: AnnouncementItem[];
  hubNews?: Report[];
  hubNextMatch?: MatchCardViewModel | null;
}

const SECTION_LABELS: Record<string, string> = {
  overview: "Overview",
  mission: "Mission",
  vision: "Vision",
  contact: "Contact",
  stats: "Statistics",
  faq: "FAQ",
  benefits: "Benefits",
  cta: "Call to Action",
  team_list: "Team List",
  programmes: "Programmes",
  clubs: "Clubs",
  development_pathways: "Development",
  hero_image: "Hero Image",
  hero_carousel: "Hero Carousel",
  announcements: "Announcements",
  hub_grid: "Hub Grid",
  campaign_highlight: "Campaign Highlight",
  grassroots: "Grassroots",
  newsletter_cta: "Newsletter",
  sponsors_grid: "Sponsors & Partners",
  custom: "Custom Section",
};

export default function SectionRenderer({
  sections,
  missionSection,
  visionSection,
  heroSlides,
  partners,
  featuredPlayers,
  campaign,
  initiatives,
  announcementItems,
  hubNews,
  hubNextMatch,
}: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          missionSection={missionSection}
          visionSection={visionSection}
          heroSlides={heroSlides}
          partners={partners}
          featuredPlayers={featuredPlayers}
          campaign={campaign}
          initiatives={initiatives}
          announcementItems={announcementItems}
          hubNews={hubNews}
          hubNextMatch={hubNextMatch}
        />
      ))}
    </>
  );
}

function SectionBlock({
  section,
  missionSection,
  visionSection,
  heroSlides,
  partners,
  featuredPlayers,
  campaign,
  initiatives,
  announcementItems,
  hubNews,
  hubNextMatch,
}: {
  section: PageSection;
  missionSection?: PageSection;
  visionSection?: PageSection;
  heroSlides?: any[];
  partners?: any[];
  featuredPlayers?: any[];
  campaign?: Campaign | null;
  initiatives?: any[];
  announcementItems?: AnnouncementItem[];
  hubNews?: Report[];
  hubNextMatch?: MatchCardViewModel | null;
}) {
  const { isEditMode } = useEditMode();

  const hasImage = ["hero_image", "overview", "custom", "programmes", "clubs", "cta", "development_pathways", "campaign_highlight"].includes(section.section_key);
  const editableFields = [
    { key: "eyebrow", label: "Eyebrow", value: section.eyebrow || "" },
    { key: "title", label: "Title", value: section.title || "" },
    { key: "body", label: "Body", value: section.body || "", multiline: true },
    ...(hasImage ? [
      { key: "image", label: "Image Upload", value: section.image || "", type: "image" as const },
      { key: "image_url", label: "Fallback URL", value: section.image_url || "" },
    ] : []),
    { key: "cta_label", label: "Button Text", value: section.cta_label || "" },
    { key: "cta_url", label: "Button URL", value: section.cta_url || "" },
    { key: "status", label: "Status", value: section.status || "published", type: "select" as const, options: [
      { label: "Published", value: "published" },
      { label: "Draft", value: "draft" },
    ]},
  ];

  let content: React.ReactNode;

  switch (section.section_key) {
    case "overview":
      content = <OverviewSection section={section} />;
      break;
    case "mission":
    case "vision":
      if (section.section_key === "mission") {
        content = (
          <MissionVisionSection
            missionSection={missionSection || section}
            visionSection={visionSection}
          />
        );
      } else {
        return null;
      }
      break;
    case "contact":
      content = <ContactSection section={section} />;
      break;
    case "stats":
      content = <StatsSection section={section} />;
      break;
    case "faq":
      content = <FaqSection section={section} />;
      break;
    case "benefits":
      content = <BenefitsSection section={section} />;
      break;
    case "cta":
      content = <CtaBanner section={section} />;
      break;
    case "team_list":
      content = <TeamListSection section={section} />;
      break;
    case "programmes":
      content = <ProgrammesSection section={section} />;
      break;
    case "clubs":
      content = <ClubsSection section={section} />;
      break;
    case "development_pathways":
      content = <DevelopmentPathways section={section} />;
      break;
    case "hero_image":
      return null;

    /* Homepage-specific dynamic sections */
    case "hero_carousel":
      content = <HeroCarousel slides={heroSlides || []} />;
      break;
      case "announcements":
      content = <PinnedAnnouncements items={announcementItems} />;
      break;
    case "hub_grid":
      content = <UnifiedHubGrid news={hubNews} nextMatch={hubNextMatch} customTitle={section.title} />;
      break;
    case "campaign_highlight":
      content = <RoadToWorldCup featuredPlayers={featuredPlayers || []} campaign={campaign} />;
      break;
    case "grassroots":
      content = <GrassrootsInitiativeSection initiatives={initiatives} />;
      break;
    case "newsletter_cta":
      content = <HomeNewsletterBanner />;
      break;
    case "sponsors_grid":
      content = <SponsorGrid partners={partners || []} />;
      break;

    case "custom":
    default:
      content = <GenericSection section={section} />;
      break;
  }

  if (isEditMode) {
    return (
      <EditableWrapper
        collection="page_sections"
        id={section.id}
        fields={editableFields}
        label={SECTION_LABELS[section.section_key] || "Section"}
      >
        {content}
      </EditableWrapper>
    );
  }

  return content;
}

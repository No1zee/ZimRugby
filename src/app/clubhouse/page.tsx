"use client";

/**
 * ZIMRUGBY CLUBHOUSE - Ecommerce Home
 * 
 * DESIGN RATIONALE:
 * This page parallels the premium athletic-fashion hierarchy of jlindeberg.com.
 * It builds a narrative starting from elite performance (Hero) through product discovery 
 * (Collections & Carousel) to brand storytelling (Campaign & Story) and finally community (Clubhouse).
 * 
 * VISUAL SYSTEM:
 * - Color: Deep Charcoal (#0e0e0e), Championship Gold (#d4af37), Forest Green (#004d2e).
 * - Typography: Geometric Sans Serif with heavy weights for headings; High-readability sans for body.
 * - Motion: Cinematic reveals and parallax interactions using Framer Motion.
 */

import ClubhouseHero from "@/components/shop/ClubhouseHero";
import CollectionsStrip from "@/components/shop/CollectionsStrip";
import ProductCarousel from "@/components/shop/ProductCarousel";
import CampaignSection from "@/components/shop/CampaignSection";
import ClubhouseBanner from "@/components/shop/ClubhouseBanner";
import StorySection from "@/components/shop/StorySection";

import FixtureRibbon from "@/components/shop/FixtureRibbon";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import ClubhouseNavBridge from "@/components/shop/ClubhouseNavBridge";

export default function ClubhousePage() {
  return (
    <main className="bg-rich-black min-h-screen selection:bg-zru-green selection:text-white relative overflow-hidden">
      {/* QA-001: Nav bridge back to main ZRU site */}
      <ClubhouseNavBridge />

      {/* Ambient Background Splashes */}
      <div className="pointer-events-none absolute top-[5%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#006039] opacity-[0.15] blur-[120px] mix-blend-screen" />
      <div className="pointer-events-none absolute top-[45%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-[#006039] opacity-[0.12] blur-[140px] mix-blend-screen" />
      <div className="pointer-events-none absolute bottom-[15%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#006039] opacity-[0.15] blur-[120px] mix-blend-screen" />

      <FixtureRibbon />
      
      {/* Narrative Section 1: Peak Performance Entry */}
      <ClubhouseHero />
      
      {/* Contextual Announcements */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <PageAnnouncements scope="clubhouse" />
      </div>

      <div className="relative z-10">
        {/* Narrative Section 2: Collection Discovery */}
        <CollectionsStrip />
        
        {/* Narrative Section 3: Product Exploration */}
        <ProductCarousel />
        
        {/* Narrative Section 4: Editorial Storytelling */}
        <CampaignSection />
        
        {/* Narrative Section 5: Brand Manifesto */}
        <StorySection />
        
        {/* Narrative Section 6: Membership & Conversion */}
        <ClubhouseBanner />
      </div>
    </main>
  );
}

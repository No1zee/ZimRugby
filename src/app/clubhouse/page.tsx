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

import ClubhouseHeader from "@/components/shop/ClubhouseHeader";
import ClubhouseFooter from "@/components/shop/ClubhouseFooter";
import ClubhouseHero from "@/components/shop/ClubhouseHero";
import CollectionsStrip from "@/components/shop/CollectionsStrip";
import ProductCarousel from "@/components/shop/ProductCarousel";
import CampaignSection from "@/components/shop/CampaignSection";
import ClubhouseBanner from "@/components/shop/ClubhouseBanner";
import StorySection from "@/components/shop/StorySection";
import JournalStrip from "@/components/home/JournalStrip";
import FixtureRibbon from "@/components/shop/FixtureRibbon";

export default function ClubhousePage() {
  return (
    <main className="bg-clubhouse-charcoal min-h-screen selection:bg-clubhouse-gold selection:text-clubhouse-charcoal">
      <FixtureRibbon />
      <ClubhouseHeader />
      
      {/* Narrative Section 1: Peak Performance Entry */}
      <ClubhouseHero />
      
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
      
      {/* Narrative Section 7: Editorial Digest (Unified) */}
      <JournalStrip />
      
      <ClubhouseFooter />
    </main>
  );
}

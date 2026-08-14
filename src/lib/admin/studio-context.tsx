"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { MatchCardViewModel } from "@/lib/match-centre/types";
import type { Campaign } from "@/lib/api/campaigns";

export type StudioViewport = "desktop" | "tablet" | "mobile";
export type StudioSection = "hero" | "ticker" | "fixtures" | "news" | "sponsors" | "campaigns" | null;
export type StudioPage = "home" | "matches" | "news" | "tickets" | "squads";

export interface HeroSlideItem {
  id: string | number;
  title: string;
  subtitle?: string;
  cta_text?: string;
  cta_url?: string;
  image_url?: string;
  status: "published" | "draft";
  sort?: number;
}

export interface AnnouncementItem {
  id: string | number;
  title: string;
  content?: string;
  tag?: string;
  status: "published" | "draft";
  date?: string;
}

export interface NewsItem {
  id: string | number;
  title: string;
  excerpt?: string;
  category?: string;
  image_url?: string;
  status: "published" | "draft";
  date?: string;
}

export interface SponsorItem {
  id: string | number;
  name: string;
  tier: string;
  logo_url?: string;
  website_url?: string;
  status: "published" | "draft";
}

interface StudioState {
  viewport: StudioViewport;
  zoom: number;
  activePage: StudioPage;
  selectedSection: StudioSection;
  selectedItemId: string | number | null;
  isInspectorOpen: boolean;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  
  // Real-time live data collections
  heroSlides: HeroSlideItem[];
  announcements: AnnouncementItem[];
  matches: MatchCardViewModel[];
  news: NewsItem[];
  sponsors: SponsorItem[];
  campaigns: Campaign[];
}

interface StudioContextType extends StudioState {
  setViewport: (vp: StudioViewport) => void;
  setZoom: (zoom: number) => void;
  setActivePage: (page: StudioPage) => void;
  setSelectedSection: (sec: StudioSection, itemId?: string | number | null) => void;
  setIsInspectorOpen: (open: boolean) => void;
  
  // Update methods for instant live canvas reactivity
  updateHeroSlide: (id: string | number, patch: Partial<HeroSlideItem>) => void;
  updateAnnouncement: (id: string | number, patch: Partial<AnnouncementItem>) => void;
  updateMatch: (id: string, patch: Partial<MatchCardViewModel>) => void;
  updateNewsItem: (id: string | number, patch: Partial<NewsItem>) => void;
  updateSponsor: (id: string | number, patch: Partial<SponsorItem>) => void;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;

  // Publish to Directus Edge
  publishChanges: () => Promise<boolean>;
  resetToPublished: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioLiveProvider({
  children,
  initialHeroSlides = [],
  initialAnnouncements = [],
  initialMatches = [],
  initialNews = [],
  initialSponsors = [],
  initialCampaigns = [],
}: {
  children: React.ReactNode;
  initialHeroSlides?: any[];
  initialAnnouncements?: any[];
  initialMatches?: MatchCardViewModel[];
  initialNews?: any[];
  initialSponsors?: any[];
  initialCampaigns?: Campaign[];
}) {
  const [viewport, setViewport] = useState<StudioViewport>("desktop");
  const [zoom, setZoom] = useState<number>(100);
  const [activePage, setActivePage] = useState<StudioPage>("home");
  const [selectedSection, setSelectedSectionState] = useState<StudioSection>("hero");
  const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Normalize initial data with robust fallbacks
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>(() => {
    if (initialHeroSlides && initialHeroSlides.length > 0) {
      return initialHeroSlides.map((s, idx) => ({
        id: s.id ?? idx + 1,
        title: s.title || "Zimbabwe Sables • The Road to Australia 2027",
        subtitle: s.subtitle || "Africa Men's Cup Champions & World Cup Qualifiers Campaign",
        cta_text: s.cta_text || s.button_text || "Match Centre & Tickets",
        cta_url: s.cta_url || s.button_link || "/matches",
        image_url: s.image_url || s.image || "/images/sables-hero.jpg",
        status: s.status || "published",
        sort: s.sort ?? idx,
      }));
    }
    return [
      {
        id: 1,
        title: "Zimbabwe Sables • The Road to Australia 2027",
        subtitle: "Africa Men's Cup Champions & Rugby World Cup Qualifying Campaign",
        cta_text: "Match Centre & Tickets",
        cta_url: "/matches",
        image_url: "/images/sables-hero.jpg",
        status: "published",
      },
    ];
  });

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    if (initialAnnouncements && initialAnnouncements.length > 0) {
      return initialAnnouncements.map((a, idx) => ({
        id: a.id ?? idx + 1,
        title: a.title || "Sables vs Uganda • Harare Sports Club • Kickoff 15:00 CAT",
        content: a.content || "",
        tag: a.tag || "LIVE MATCH",
        status: a.status || "published",
        date: a.date || new Date().toISOString(),
      }));
    }
    return [
      {
        id: 1,
        title: "Sables vs Uganda • Harare Sports Club • Kickoff 15:00 CAT • Gates open 11:00",
        tag: "BREAKING",
        status: "published",
      },
    ];
  });

  const [matches, setMatches] = useState<MatchCardViewModel[]>(initialMatches);
  
  const [news, setNews] = useState<NewsItem[]>(() => {
    if (initialNews && initialNews.length > 0) {
      return initialNews.map((n, idx) => ({
        id: n.id ?? idx + 1,
        title: n.title || "ZRU Announces 30-Man Preliminary Squad for Rugby Africa Cup",
        excerpt: n.excerpt || "Head Coach Pieter Benade has named an exciting blend of Currie Cup stars and international talent.",
        category: n.category || "National Teams",
        image_url: n.image_url || n.image || "/images/sables-news.jpg",
        status: n.status || "published",
        date: n.date || new Date().toISOString(),
      }));
    }
    return [
      {
        id: 1,
        title: "ZRU Announces 30-Man Preliminary Squad for Rugby Africa Cup",
        excerpt: "Head Coach Pieter Benade has named an exciting blend of Currie Cup stars and international talent.",
        category: "National Teams",
        status: "published",
      },
    ];
  });

  const [sponsors, setSponsors] = useState<SponsorItem[]>(() => {
    if (initialSponsors && initialSponsors.length > 0) {
      return initialSponsors.map((sp, idx) => ({
        id: sp.id ?? idx + 1,
        name: sp.name || "Principal Partner",
        tier: sp.tier || "Title Sponsor",
        logo_url: sp.logo_url || sp.logo || "",
        website_url: sp.website_url || "",
        status: sp.status || "published",
      }));
    }
    return [
      { id: 1, name: "Nedbank Zimbabwe", tier: "Principal Partner", status: "published" },
      { id: 2, name: "Delta Beverages", tier: "Official Beverage Partner", status: "published" },
      { id: 3, name: "Old Mutual", tier: "Grassroots Development Partner", status: "published" },
    ];
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);

  const setSelectedSection = useCallback((sec: StudioSection, itemId: string | number | null = null) => {
    setSelectedSectionState(sec);
    setSelectedItemId(itemId);
    setIsInspectorOpen(true);
  }, []);

  // Update actions with instant optimistic reactivity
  const updateHeroSlide = useCallback((id: string | number, patch: Partial<HeroSlideItem>) => {
    setHeroSlides((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setHasUnsavedChanges(true);
  }, []);

  const updateAnnouncement = useCallback((id: string | number, patch: Partial<AnnouncementItem>) => {
    setAnnouncements((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setHasUnsavedChanges(true);
  }, []);

  const updateMatch = useCallback((id: string, patch: Partial<MatchCardViewModel>) => {
    setMatches((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setHasUnsavedChanges(true);
  }, []);

  const updateNewsItem = useCallback((id: string | number, patch: Partial<NewsItem>) => {
    setNews((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setHasUnsavedChanges(true);
  }, []);

  const updateSponsor = useCallback((id: string | number, patch: Partial<SponsorItem>) => {
    setSponsors((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setHasUnsavedChanges(true);
  }, []);

  const updateCampaign = useCallback((id: string | number, patch: Partial<Campaign>) => {
    setCampaigns((prev) => prev.map((item) => (String(item.id) === String(id) ? { ...item, ...patch } : item)));
    setHasUnsavedChanges(true);
  }, []);

  const resetToPublished = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const publishChanges = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      // 1. Save active Hero Slides
      for (const slide of heroSlides) {
        if (slide.id) {
          await fetch("/api/admin/directus", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ collection: "hero_slides", id: slide.id, data: slide }),
          });
        }
      }

      // 2. Save Announcements
      for (const ann of announcements) {
        if (ann.id) {
          await fetch("/api/admin/directus", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ collection: "announcements", id: ann.id, data: ann }),
          });
        }
      }

      // 3. Trigger edge revalidation
      await fetch("/api/revalidate?tag=all", { method: "POST" }).catch(() => {});

      setHasUnsavedChanges(false);
      return true;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [heroSlides, announcements]);

  return (
    <StudioContext.Provider
      value={{
        viewport,
        zoom,
        activePage,
        selectedSection,
        selectedItemId,
        isInspectorOpen,
        hasUnsavedChanges,
        isSaving,
        heroSlides,
        announcements,
        matches,
        news,
        sponsors,
        campaigns,
        setViewport,
        setZoom,
        setActivePage,
        setSelectedSection,
        setIsInspectorOpen,
        updateHeroSlide,
        updateAnnouncement,
        updateMatch,
        updateNewsItem,
        updateSponsor,
        updateCampaign,
        publishChanges,
        resetToPublished,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudioLive() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error("useStudioLive must be used within a StudioLiveProvider");
  }
  return context;
}

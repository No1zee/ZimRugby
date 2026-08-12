"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Clock, Award, Users, Layers, Shield, Trophy, Activity, CheckCircle, Sparkles } from "lucide-react";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import CmsHero from "@/components/cms/CmsHero";
import DayTimelineDrawer from "@/components/events/DayTimelineDrawer";

import FeaturedFixtureHero from "@/components/events/FeaturedFixtureHero";
import CalendarToolbar from "@/components/events/CalendarToolbar";
import CalendarFilters from "@/components/events/CalendarFilters";
import CalendarMonthGrid from "@/components/events/CalendarMonthGrid";
import SelectedDatePanel from "@/components/events/SelectedDatePanel";
import CalendarAgendaList from "@/components/events/CalendarAgendaList";

import type { EventItem } from "@/types";

function toDateStr(iso?: string): string {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const d = new Date(iso);
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  return "";
}

function getTagBadge(tags: string[] = []): { label: string; bg: string; text: string } {
  const tagStr = tags.join(" ").toLowerCase();
  if (tagStr.includes("squad")) {
    return { label: "[ SQD ]", bg: "bg-blue-600 text-white", text: "Squad Drop" };
  }
  if (tagStr.includes("campaign")) {
    return { label: "[ CMPG ]", bg: "bg-rose-600 text-white", text: "Campaign" };
  }
  if (tagStr.includes("clinic") || tagStr.includes("ref") || tagStr.includes("coach")) {
    return { label: "[ CLN ]", bg: "bg-teal-600 text-white", text: "Clinic / Seminar" };
  }
  if (tagStr.includes("gov") || tagStr.includes("agm") || tagStr.includes("board")) {
    return { label: "[ GOV ]", bg: "bg-indigo-700 text-white", text: "Governance" };
  }
  if (tagStr.includes("camp")) {
    return { label: "[ CMP ]", bg: "bg-orange-600 text-white", text: "Youth Camp" };
  }
  if (tagStr.includes("sponsor") || tagStr.includes("brand")) {
    return { label: "[ SPN ]", bg: "bg-amber-500 text-white", text: "Sponsor Event" };
  }
  if (tagStr.includes("national") || tagStr.includes("sables")) {
    return { label: "[ NAT ]", bg: "bg-zru-green text-white", text: "National Team" };
  }
  if (tagStr.includes("club")) {
    return { label: "[ CLB ]", bg: "bg-rich-black text-white", text: "Club Rugby" };
  }
  if (tagStr.includes("school")) {
    return { label: "[ SCH ]", bg: "bg-amber-600 text-white", text: "Schools Rugby" };
  }
  if (tagStr.includes("women")) {
    return { label: "[ WMN ]", bg: "bg-purple-700 text-white", text: "Women's Rugby" };
  }
  if (tagStr.includes("seven") || tagStr.includes("7s")) {
    return { label: "[ 7S ]", bg: "bg-emerald-600 text-white", text: "Sevens" };
  }
  return { label: "[ EVT ]", bg: "bg-black/70 text-white", text: "Event" };
}

interface EventsClientProps {
  cmsPage?: any;
  competitions?: EventItem[];
  generalEvents?: EventItem[];
}

export default function EventsClient({ cmsPage, competitions: apiCompetitions = [], generalEvents: apiGeneralEvents = [] }: EventsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Combine all API events
  const allEvents = useMemo(() => {
    return [...apiCompetitions, ...apiGeneralEvents];
  }, [apiCompetitions, apiGeneralEvents]);

  // Featured Event: First national/sables event or highest priority upcoming
  const featuredEvent = useMemo(() => {
    return (
      allEvents.find((e) => e.tags?.some((t) => /national|sables|campaign/i.test(t))) ||
      allEvents[0]
    );
  }, [allEvents]);

  // UI States
  const [viewMode, setViewMode] = useState<"calendar" | "agenda">("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Month navigation cursor
  const [cursorMonth, setCursorMonth] = useState(() => new Date(2026, 7, 1)); // Default August 2026

  // Default to Agenda on mobile screens on initial mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setViewMode("agenda");
    }
  }, []);

  // Sync state from URL params
  useEffect(() => {
    const v = searchParams.get("view");
    if (v === "calendar" || v === "agenda") setViewMode(v);

    const q = searchParams.get("q");
    if (q !== null) setSearchQuery(q);

    const cats = searchParams.get("cats");
    if (cats) setSelectedCategories(cats.split(","));

    const date = searchParams.get("date");
    if (date) setSelectedDateStr(date);
  }, [searchParams]);

  // Update URL params on state changes
  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(newParams)) {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    }
    router.replace(`/events?${params.toString()}`, { scroll: false });
  };

  // Toggle Category
  const handleToggleCategory = (catId: string) => {
    const updated = selectedCategories.includes(catId)
      ? selectedCategories.filter((c) => c !== catId)
      : [...selectedCategories, catId];
    setSelectedCategories(updated);
    updateUrlParams({ cats: updated.length > 0 ? updated.join(",") : null });
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
    updateUrlParams({ cats: null });
  };

  // Handle Search Input Change
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    updateUrlParams({ q: q || null });
  };

  // Handle View Mode Change
  const handleViewModeChange = (mode: "calendar" | "agenda") => {
    setViewMode(mode);
    updateUrlParams({ view: mode });
  };

  // Handle Date Shortcut Clicks
  const handleShortcutClick = (shortcut: string | null) => {
    setActiveShortcut(shortcut);
    const today = new Date();
    const todayStr = toDateStr(today.toISOString());

    if (shortcut === "today") {
      setSelectedDateStr(todayStr);
      updateUrlParams({ date: todayStr });
    } else if (shortcut === "this-week" || shortcut === "this-month") {
      setSelectedDateStr(null);
      setCursorMonth(new Date(today.getFullYear(), today.getMonth(), 1));
      updateUrlParams({ date: null });
    } else if (shortcut === "sables-window") {
      setSelectedCategories(["National"]);
      updateUrlParams({ cats: "National" });
    } else if (shortcut === "schools-season") {
      setSelectedCategories(["Schools"]);
      updateUrlParams({ cats: "Schools" });
    } else {
      setSelectedDateStr(null);
      updateUrlParams({ date: null });
    }
  };

  const handleResetAll = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setActiveShortcut(null);
    setSelectedDateStr(null);
    updateUrlParams({ q: null, cats: null, date: null });
  };

  // Filter events based on Search Query & Selected Categories
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      // 1. Category Filter
      if (selectedCategories.length > 0) {
        const evTags = (ev.tags || []).map((t) => t.toLowerCase());
        const hasCategory = selectedCategories.some((cat) => {
          const cLower = cat.toLowerCase();
          return evTags.some((t) => t.includes(cLower)) || (ev.subtitle || "").toLowerCase().includes(cLower);
        });
        if (!hasCategory) return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = ev.title.toLowerCase().includes(q);
        const subMatch = (ev.subtitle || "").toLowerCase().includes(q);
        const locMatch = (ev.location || "").toLowerCase().includes(q);
        const descMatch = (ev.description || "").toLowerCase().includes(q);
        if (!titleMatch && !subMatch && !locMatch && !descMatch) return false;
      }

      return true;
    });
  }, [allEvents, selectedCategories, searchQuery]);

  // Group filtered events by YYYY-MM-DD for Month Grid
  const eventsByDayMap = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const ev of filteredEvents) {
      const k = toDateStr(ev.date);
      if (!k) continue;
      const list = map.get(k) || [];
      list.push(ev);
      map.set(k, list);
    }
    return map;
  }, [filteredEvents]);

  // Selected date events for right-hand panel & drawer
  const selectedDateEvents = useMemo(() => {
    if (!selectedDateStr) {
      // Default: Show upcoming fixtures if no date selected
      return filteredEvents.slice(0, 5);
    }
    return eventsByDayMap.get(selectedDateStr) || [];
  }, [selectedDateStr, eventsByDayMap, filteredEvents]);

  const handleSelectDateCell = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    updateUrlParams({ date: dateStr });
    // On small screens, open drawer
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsDrawerOpen(true);
    }
  };

  const hasActiveFilters = selectedCategories.length > 0 || searchQuery !== "" || activeShortcut !== null;

  return (
    <div className="bg-milk-white min-h-screen pb-24">
      {/* CMS Top Hero */}
      {cmsPage ? (
        <CmsHero
          kicker={cmsPage.kicker}
          title={cmsPage.title}
          intro={cmsPage.intro}
          image={cmsPage.image}
          pageId={cmsPage.id}
        />
      ) : (
        <div className="bg-rich-black text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-zru-green/20">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-black uppercase tracking-widest bg-zru-green text-white">
              <CalendarIcon className="w-3.5 h-3.5" />
              OFFICIAL FIXTURE & EVENT UTILITY
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight uppercase">
              MASTER <span className="text-zru-green">CALENDAR</span>
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
              The single source of truth for Zimbabwe Rugby. Track test fixtures, club championships, school leagues, squad announcements, and union clinics.
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <PageAnnouncements scope="events" />

        {/* 1. Featured Fixture Hero Strip */}
        <FeaturedFixtureHero event={featuredEvent} />

        {/* 2. Control Toolbar (Search, Date Shortcuts, View Switcher) */}
        <CalendarToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          activeShortcut={activeShortcut}
          onShortcutClick={handleShortcutClick}
          onResetAll={handleResetAll}
          hasActiveFilters={hasActiveFilters}
        />

        {/* 3. Faceted Multi-Select Filters */}
        <CalendarFilters
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          onClearCategories={handleClearCategories}
        />

        {/* 4. Main Body Layout */}
        {viewMode === "calendar" ? (
          /* Desktop 2-Column Dashboard Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 60% Column: Month Calendar Grid */}
            <div className="lg:col-span-7 xl:col-span-8">
              <CalendarMonthGrid
                currentMonth={cursorMonth}
                onPrevMonth={() => setCursorMonth(new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() - 1, 1))}
                onNextMonth={() => setCursorMonth(new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() + 1, 1))}
                eventsByDay={eventsByDayMap}
                selectedDateStr={selectedDateStr}
                onSelectDate={handleSelectDateCell}
                getTagBadge={getTagBadge}
              />
            </div>

            {/* Right 40% Column: Selected Date / Upcoming Schedule Panel */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
              <SelectedDatePanel
                selectedDateStr={selectedDateStr}
                events={selectedDateEvents}
                getTagBadge={getTagBadge}
              />
            </div>
          </div>
        ) : (
          /* Mobile-First Agenda / Chronological List View */
          <div className="max-w-4xl mx-auto">
            <CalendarAgendaList
              events={filteredEvents}
              getTagBadge={getTagBadge}
              onSelectEvent={(ev) => {
                if (ev.date) handleSelectDateCell(ev.date);
              }}
            />
          </div>
        )}
      </div>

      {/* Mobile Drawer for Selected Date */}
      <DayTimelineDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        dateStr={selectedDateStr || ""}
        events={selectedDateEvents}
      />
    </div>
  );
}

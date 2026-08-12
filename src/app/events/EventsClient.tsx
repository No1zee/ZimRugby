"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, MapPin, Clock, Award, Users, Layers, Shield, Trophy, Activity, CheckCircle,
  ChevronLeft, ChevronRight, CalendarDays, Download, Filter, List, Sparkles, Ticket
} from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageAnnouncements from "@/components/ui/PageAnnouncements";

import CmsHero from "@/components/cms/CmsHero";
import DayTimelineDrawer from "@/components/events/DayTimelineDrawer";
import type { EventItem } from "@/types";

interface Competition extends EventItem {
  level: string;
  dateRange: string;
  teamCount: string;
  status: NonNullable<EventItem["status"]>;
  category: string;
}

interface GeneralEvent extends EventItem {
  time: string;
  category: string;
}

function mapToCompetition(e: EventItem): Competition {
  return {
    ...e,
    level: e.subtitle || "",
    dateRange: e.date,
    teamCount: e.tags?.[0] || "",
    status: e.status || "upcoming",
    category: e.subtitle || ""
  };
}

function mapToGeneralEvent(e: EventItem): GeneralEvent {
  return {
    ...e,
    time: "",
    status: e.status || "upcoming",
    category: e.tags?.[0] || "EVENT"
  };
}

const levels = [
  { name: "National Teams", icon: Shield, tag: "National", code: "NAT" },
  { name: "Club Rugby", icon: Trophy, tag: "Clubs", code: "CLB" },
  { name: "Schools Rugby", icon: Users, tag: "Schools", code: "SCH" },
  { name: "Women's Rugby", icon: Activity, tag: "Women", code: "WMN" },
  { name: "Youth Pathways", icon: Layers, tag: "Youth", code: "YTH" },
  { name: "Sevens Rugby", icon: Award, tag: "Sevens", code: "7S" }
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getTagBadge(tags: string[] = []): { label: string; bg: string; text: string } {
  const tagStr = tags.join(" ").toLowerCase();
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
  
  const [viewMode, setViewMode] = useState<"calendar" | "grid">("calendar");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  // Calendar Navigation Cursor
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Drawer state for selected date
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const allEvents = useMemo(() => {
    const combined = [...apiCompetitions, ...apiGeneralEvents];
    return combined;
  }, [apiCompetitions, apiGeneralEvents]);

  const competitions = apiCompetitions.map(mapToCompetition);
  const generalEvents = apiGeneralEvents.map(mapToGeneralEvent);

  // Group all events by date string YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const ev of allEvents) {
      const key = toDateStr(ev.date);
      if (!key) continue;
      const list = map.get(key) || [];
      list.push(ev);
      map.set(key, list);
    }
    return map;
  }, [allEvents]);

  // Calendar cells generation
  const calendarCells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const todayKey = dayKey(new Date());

  const handleCellClick = (date: Date) => {
    const key = dayKey(date);
    setSelectedDateKey(key);
    setIsDrawerOpen(true);
  };

  const selectedDateEvents = useMemo(() => {
    if (!selectedDateKey) return [];
    return eventsByDate.get(selectedDateKey) || [];
  }, [selectedDateKey, eventsByDate]);

  const selectedDateFormatted = useMemo(() => {
    if (!selectedDateKey) return "";
    const [y, m, d] = selectedDateKey.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  }, [selectedDateKey]);

  return (
    <main className="bg-milk-white min-h-screen pb-16 relative overflow-hidden text-rich-black">
      
      <CmsHero
        kicker={cmsPage?.hero_kicker || "Master Rugby Calendar"}
        title={cmsPage?.hero_title || "Official Fixtures & Events"}
        intro={cmsPage?.hero_intro || "The single source of truth for Zimbabwe Rugby. Track past results, upcoming Sables test matches, club leagues, and school fixtures."}
        image={cmsPage?.hero_image || "/images/gallery/zimbabwe-sables-0350.webp"}
        breadcrumb={[{ label: "Calendar & Events", href: "/events" }]}
        pageId={cmsPage?.id}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">

        <PageAnnouncements scope="events" className="mb-8" />

        {/* Level Filters */}
        <div className="mb-8">
          <span className="text-black/45 text-[9px] font-black uppercase tracking-[0.4em] block mb-4 font-subheading">
            Filter Master Calendar
          </span>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {levels.map((level) => {
              const Icon = level.icon;
              const isSelected = selectedLevel === level.tag;
              return (
                <button
                  key={level.name}
                  onClick={() => setSelectedLevel(isSelected ? null : level.tag)}
                  className={`flex items-center justify-between p-3.5 border rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isSelected 
                      ? "bg-zru-green text-white border-zru-green shadow-md" 
                      : "bg-white border-black/5 text-black/70 hover:text-black hover:border-black/20 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-zru-green"}`} />
                    <span className="text-[11px] font-heading font-bold uppercase tracking-wider">{level.name}</span>
                  </div>
                  <span className={`text-[9px] font-black font-mono px-1.5 py-0.5 rounded ${isSelected ? "bg-white/20 text-white" : "bg-black/5 text-black/50"}`}>
                    {level.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bar: View Switcher + Sync to Phone */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-3 rounded-2xl border border-black/5 shadow-sm">
          
          {/* Calendar View vs Grid View Toggle */}
          <div className="flex p-1 bg-black/5 rounded-xl border border-black/10">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
                viewMode === "calendar" ? "bg-zru-green text-white shadow" : "text-black/60 hover:text-black"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Master Calendar
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
                viewMode === "grid" ? "bg-zru-green text-white shadow" : "text-black/60 hover:text-black"
              }`}
            >
              <List className="w-4 h-4" />
              Card View
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs text-black/50 font-bold uppercase tracking-widest">
              {selectedLevel ? `Filtering by: ${selectedLevel}` : "Showing All Union Events & Fixtures"}
            </span>
          </div>
        </div>

        {/* MASTER CALENDAR MONTH GRID VIEW */}
        {viewMode === "calendar" ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            
            {/* Month Header Navigation */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-black/5 pb-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zru-green block">Single Source of Truth</span>
                <h3 className="font-heading text-2xl font-black uppercase text-rich-black">{monthLabel(cursor)}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                  className="rounded-xl border border-black/10 bg-white p-2.5 text-black/70 hover:bg-black/5 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const now = new Date();
                    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
                  }}
                  className="rounded-xl border border-black/10 bg-white px-4 py-2 text-[11px] font-heading font-black uppercase tracking-wider text-black/70 hover:bg-black/5 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                  className="rounded-xl border border-black/10 bg-white p-2.5 text-black/70 hover:bg-black/5 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid Header (Sun-Sat) */}
            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/5">
              {WEEKDAYS.map((d) => (
                <div key={d} className="bg-black/[0.03] px-3 py-3 text-center text-[10px] font-black uppercase tracking-widest text-black/60 font-subheading">
                  {d}
                </div>
              ))}

              {/* Day Cells */}
              {calendarCells.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} className="min-h-[130px] bg-white/50" />;
                const key = dayKey(date);
                const dayEvents = eventsByDate.get(key) || [];
                
                // Filter by level if selected
                const filteredDayEvents = selectedLevel
                  ? dayEvents.filter(ev => ev.tags?.some(t => t.toLowerCase().includes(selectedLevel.toLowerCase())))
                  : dayEvents;

                const isToday = key === todayKey;
                const isPast = date < new Date(new Date().setHours(0,0,0,0));

                return (
                  <div
                    key={key}
                    onClick={() => handleCellClick(date)}
                    className={`min-h-[130px] bg-white p-2.5 relative group cursor-pointer transition-all duration-200 hover:bg-zru-green/[0.04] border-t border-black/5 ${
                      isToday ? "bg-zru-green/[0.08] ring-2 ring-zru-green/50 ring-inset" : ""
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black font-mono ${
                          isToday ? "bg-zru-green text-white shadow" : "text-black/70"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {filteredDayEvents.length > 0 && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-zru-green bg-zru-green/10 border border-zru-green/20 px-1.5 py-0.5 rounded">
                          {filteredDayEvents.length} {filteredDayEvents.length === 1 ? "Event" : "Events"}
                        </span>
                      )}
                    </div>

                    {/* Events list in the day cell */}
                    <div className="space-y-1.5">
                      {filteredDayEvents.slice(0, 2).map((ev) => {
                        const badge = getTagBadge(ev.tags);
                        return (
                          <div
                            key={ev.id}
                            title={`${ev.title} - ${ev.location}`}
                            className="relative overflow-hidden rounded-lg border border-black/10 bg-milk-white p-1.5 transition-all group-hover:border-zru-green/40 shadow-2xs"
                          >
                            {/* Slanted Diagonal Sash Accent on top-right (NO DOTS!) */}
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className={`text-[8px] font-black font-mono px-1 py-0.2 rounded ${badge.bg}`}>
                                {badge.label}
                              </span>
                              {ev.status === "completed" && (
                                <span className="text-[8px] font-black uppercase text-black/40">DONE</span>
                              )}
                            </div>

                            {/* Title */}
                            <p className="text-[10px] font-heading font-black text-rich-black truncate leading-tight">
                              {ev.title}
                            </p>

                            {/* Score Injection for completed/past events */}
                            {ev.score ? (
                              <div className="mt-1 bg-rich-black text-white px-1.5 py-0.5 rounded text-[9px] font-mono font-black text-center tracking-wider uppercase">
                                {ev.score}
                              </div>
                            ) : (
                              ev.location && (
                                <p className="text-[8px] text-black/50 truncate font-body">
                                  {ev.location}
                                </p>
                              )
                            )}
                          </div>
                        );
                      })}

                      {filteredDayEvents.length > 2 && (
                        <span className="block text-center text-[9px] font-black text-zru-green tracking-wider uppercase bg-zru-green/5 py-1 rounded border border-zru-green/10">
                          +{filteredDayEvents.length - 2} More
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* CARD GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
            {competitions.length > 0 ? (
              competitions.map((comp) => (
                <div 
                  key={comp.id}
                  className="bg-white border border-black/5 group flex flex-col justify-between p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black tracking-widest text-zru-green uppercase bg-zru-green/10 border border-zru-green/20 px-3 py-1 rounded-sm">
                        {comp.level || comp.category || "Tournament"}
                      </span>
                      <span className="flex items-center gap-1.5 text-[9px] font-black tracking-wider uppercase text-black/50">
                        {comp.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-heading font-black text-rich-black mb-3 group-hover:text-zru-green transition-colors">
                      {comp.title}
                    </h3>
                    
                    {comp.score && (
                      <div className="bg-rich-black text-white px-3 py-1.5 rounded-lg font-mono font-black text-sm text-center mb-3">
                        FINAL: {comp.score}
                      </div>
                    )}

                    <p className="text-black/60 text-xs leading-relaxed mb-6 font-body line-clamp-3">
                      {comp.description}
                    </p>
                  </div>

                  <div className="border-t border-black/5 pt-4 flex items-center justify-between text-xs font-bold text-black/70">
                    <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-zru-green" /> {comp.dateRange}</span>
                    <SlantedButton href={`/contact`} variant="outline" size="sm">DETAILS</SlantedButton>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 border border-dashed border-black/10 rounded-2xl bg-black/5">
                <p className="text-black/45 font-bold uppercase tracking-widest">No Events matching filter.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-16 border-t border-black/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-black/45 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-zru-green" />
            <span>Official Zimbabwe Rugby Union Master Calendar</span>
          </div>
          <div>
            <span>Verified Source &bull; Single Source of Truth</span>
          </div>
        </div>

      </div>

      {/* Slide-over Timeline Drawer when a date is clicked */}
      <DayTimelineDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        dateStr={selectedDateFormatted}
        events={selectedDateEvents}
      />
    </main>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Clock, Award, Users, Layers, Shield, Trophy, Activity, CheckCircle } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import EdgyGradient from "@/components/ui/EdgyGradient";
import SlantedButton from "@/components/ui/SlantedButton";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Mock Data split into Competitions and Events
const competitions = [
  {
    id: "comp-1",
    title: "National Sevens Series",
    level: "National / Sevens",
    dateRange: "SEP - NOV 2026",
    teamCount: "12 CLUBS",
    status: "ONGOING",
    description: "The premier domestic sevens tournament featuring Zimbabwe's top tier rugby clubs competing across multiple rounds.",
    location: "Harare Sports Club / Hartsfield",
    category: "SEVENS",
    tags: ["National", "Sevens"]
  },
  {
    id: "comp-2",
    title: "Super Rugby Club Championship",
    level: "Club Rugby",
    dateRange: "APR - AUG 2026",
    teamCount: "10 TEAMS",
    status: "UPCOMING",
    description: "The absolute pinnacle of local club XVs rugby. The champion earns direct qualification to regional club fixtures.",
    location: "Harare / Bulawayo / Mutare",
    category: "CLUBS",
    tags: ["Clubs"]
  },
  {
    id: "comp-3",
    title: "National Schools Championship",
    level: "Schools / Youth",
    dateRange: "JUN - JUL 2026",
    teamCount: "16 SCHOOLS",
    status: "UPCOMING",
    description: "The historical proving ground for Zimbabwe's future Sables. High-intensity schoolboy rugby at its finest.",
    location: "Prince Edward School, Harare",
    category: "SCHOOLS",
    tags: ["Schools", "Youth"]
  },
  {
    id: "comp-4",
    title: "Women's Inter-Provincial Cup",
    level: "Women's Rugby",
    dateRange: "MAY - SEP 2026",
    teamCount: "6 PROVINCES",
    status: "ONGOING",
    description: "The top-tier women's XVs competition showcasing elite provincial selections vying for national supremacy.",
    location: "Hartsfield, Bulawayo",
    category: "WOMEN",
    tags: ["Women"]
  }
];

const generalEvents = [
  {
    id: "event-1",
    title: "ZRU Annual General Meeting",
    date: "15 AUG 2026",
    time: "10:00 - 13:00",
    description: "The Annual General Meeting of the Zimbabwe Rugby Union involves all stakeholders, provincial boards, and partners.",
    location: "ZRU Offices, Harare Sports Club",
    category: "ADMINISTRATION",
    color: "bg-neutral-800",
    tags: ["National"]
  },
  {
    id: "event-2",
    title: "Level 1 Coaching Course (World Rugby)",
    date: "20 AUG 2026",
    time: "09:00 - 16:00",
    description: "A foundational accreditation course for aspiring rugby coaches. Covers safety, laws of the game, and coaching drills.",
    location: "Hartsfield, Bulawayo",
    category: "EDUCATION",
    color: "bg-zru-green",
    tags: ["Clubs", "Youth"]
  },
  {
    id: "event-3",
    title: "Sables Fundraising Gala Dinner",
    date: "10 SEP 2026",
    time: "18:30 - 22:00",
    description: "A high-profile benefit dinner supporting the Sables' World Cup qualification campaign. Special guest keynotes.",
    location: "Meikles Hotel, Harare",
    category: "SOCIAL",
    color: "bg-zru-green",
    tags: ["National"]
  },
  {
    id: "event-4",
    title: "National Youth Training Camp",
    date: "17 SEP 2026",
    time: "09:00 - 14:00",
    description: "High-performance coaching clinic targeting selected regional youth pathway prospects under ZRU coordinators.",
    location: "Harare Sports Club",
    category: "DEVELOPMENT",
    color: "bg-neutral-800",
    tags: ["Youth"]
  }
];

const levels = [
  { name: "National Teams", icon: Shield, tag: "National" },
  { name: "Club Rugby", icon: Trophy, tag: "Clubs" },
  { name: "Schools Rugby", icon: Users, tag: "Schools" },
  { name: "Women's Rugby", icon: Activity, tag: "Women" },
  { name: "Youth Pathways", icon: Layers, tag: "Youth" },
  { name: "Sevens Rugby", icon: Award, tag: "Sevens" }
];

function EventsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams?.get("tab") === "events" ? "events" : "competitions";
  
  const [activeTab, setActiveTab] = useState<"competitions" | "events">(initialTab);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Sync tab state with URL query parameter
  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "events" || tab === "competitions") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: "competitions" | "events") => {
    setActiveTab(tab);
    setSelectedLevel(null); // Reset level filter on tab switch
    router.push(`/events?tab=${tab}`, { scroll: false });
  };

  // Filter content based on active level selection
  const filteredCompetitions = selectedLevel 
    ? competitions.filter(c => c.tags.includes(selectedLevel))
    : competitions;

  const filteredEvents = selectedLevel 
    ? generalEvents.filter(e => e.tags.includes(selectedLevel))
    : generalEvents;

  return (
    <main className="bg-rich-black min-h-screen pt-24 pb-24 relative overflow-hidden">
      
      {/* Ambient Visual Layers */}
      <EdgyGradient opacity={0.5} />
      <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.15),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-16 mt-8"
        >
           <h1 className="text-5xl md:text-7xl font-heading text-white mb-4 uppercase tracking-wider">
             COMPETITIONS & <span className="text-stroke-white text-transparent">EVENTS</span>
           </h1>
           <p className="text-lg text-gray-400 max-w-2xl font-body">
             Explore the full heartbeat of Zimbabwean rugby. Drill down into active leagues, regional championships, and official union events.
           </p>
        </motion.div>

        {/* 1. Browse by Rugby Level Block (First-Class Shortcuts) */}
        <div className="mb-16">
          <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] block mb-6 font-subheading">Browse by Rugby Level</span>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {levels.map((level) => {
              const Icon = level.icon;
              const isSelected = selectedLevel === level.tag;
              return (
                <button
                  key={level.name}
                  onClick={() => setSelectedLevel(isSelected ? null : level.tag)}
                  className={`flex flex-col items-center justify-center p-6 border rounded-xl transition-all duration-400 group relative overflow-hidden ${
                    isSelected 
                      ? "bg-zru-green/20 border-zru-green text-white shadow-[0_0_20px_rgba(0,107,63,0.25)]" 
                      : "bg-white/3 border-white/5 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-3 transition-transform duration-300 group-hover:scale-110 ${isSelected ? "text-zru-green" : "text-white/40 group-hover:text-white"}`} />
                  <span className="text-[11px] font-subheading font-bold uppercase tracking-wider text-center">{level.name}</span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-zru-green animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Dual-View Tab Selector */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/3 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
           
           {/* Tab Switcher */}
           <div className="flex p-1 bg-black/40 rounded-xl border border-white/5 relative z-0">
             {(["competitions", "events"] as const).map((tab) => {
               const isActive = activeTab === tab;
               return (
                 <button
                   key={tab}
                   onClick={() => handleTabChange(tab)}
                   className={`relative px-8 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors duration-300 select-none z-10 ${
                     isActive ? "text-white" : "text-gray-400 hover:text-white"
                   }`}
                 >
                   {isActive && (
                     <motion.div
                       layoutId="activeEventTab"
                       className="absolute inset-0 bg-zru-green rounded-lg shadow-lg -z-10"
                       transition={{ type: "spring", stiffness: 380, damping: 26 }}
                     />
                   )}
                   {tab === "competitions" ? "Tournaments & Leagues" : "Federation Events"}
                 </button>
               );
             })}
           </div>

           {/* Filter Indicator / Status */}
           <div className="text-right">
             <span className="text-xs text-white/40 font-bold uppercase tracking-widest">
               {selectedLevel ? `Filtering by Level: ${selectedLevel}` : "Showing all divisions"}
             </span>
           </div>
        </div>

        {/* 3. Render Grid Elements */}
        <AnimatePresence mode="wait">
          {activeTab === "competitions" ? (
            <motion.div 
              key="competitions-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]"
            >
              {filteredCompetitions.length > 0 ? (
                filteredCompetitions.map((comp) => (
                  <div 
                    key={comp.id}
                    className="bento-card group flex flex-col justify-between p-8 border border-white/5 hover:border-zru-green/30 bg-white/3 rounded-2xl transition-all duration-300"
                  >
                    <div>
                      {/* Top Row Status and Level */}
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black tracking-widest text-zru-green uppercase bg-zru-green/10 border border-zru-green/20 px-3 py-1 rounded-sm clip-slanted-sm">
                          {comp.level}
                        </span>
                        <span className="flex items-center gap-1.5 text-[9px] font-black tracking-wider uppercase text-white/50">
                          <span className={`w-1.5 h-1.5 rounded-full ${comp.status === "ONGOING" ? "bg-zru-green animate-pulse" : "bg-neutral-600"}`} />
                          {comp.status}
                        </span>
                      </div>

                      {/* Main Title & Details */}
                      <h3 className="text-2xl font-heading text-white mb-4 group-hover:text-zru-green transition-colors">
                        {comp.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-6 font-body">
                        {comp.description}
                      </p>
                    </div>

                    {/* Meta info & Action */}
                    <div className="border-t border-white/5 pt-6 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest block font-bold">Timeline / Teams</span>
                        <div className="flex gap-4 text-xs font-bold text-white/80">
                          <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-zru-green" /> {comp.dateRange}</span>
                          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-zru-green" /> {comp.teamCount}</span>
                        </div>
                      </div>
                      <SlantedButton href={`/match-centre`} variant="outline" size="sm" className="w-full sm:w-auto">
                        GO TO LEAGUE
                      </SlantedButton>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/3">
                  <p className="text-white/40 font-bold uppercase tracking-widest">No Competitions matching this level filter.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="events-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]"
            >
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="bento-card group flex flex-col justify-between p-6 border border-white/5 bg-white/3 rounded-2xl"
                  >
                    <div>
                      {/* Event Banner */}
                      <div className="bg-white/3 p-4 flex items-center justify-between border border-white/5 rounded-xl mb-6">
                        <div className="flex items-center gap-2 text-white font-bold tracking-wider text-xs">
                          <CalendarIcon className="w-4 h-4 text-zru-green" />
                          <span>{event.date}</span>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded text-white bg-neutral-900 border border-white/10 tracking-widest`}>
                          {event.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-heading text-white mb-4 group-hover:text-zru-green transition-colors leading-tight">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2.5 text-white/50 text-xs font-medium font-body">
                          <Clock className="w-4 h-4 text-zru-green shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-white/50 text-xs font-medium font-body">
                          <MapPin className="w-4 h-4 text-zru-green shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      <p className="text-white/60 text-xs leading-relaxed mb-6 font-body line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    <SlantedButton href={`/contact`} variant="outline" size="sm" className="w-full justify-center mt-4">
                      REGISTER INTEREST
                    </SlantedButton>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/3">
                  <p className="text-white/40 font-bold uppercase tracking-widest">No Events matching this level filter.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Data Provenance Timestamp */}
        <div className="mt-20 border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-zru-green" />
            <span>Official ZRU Competition Feed</span>
          </div>
          <div>
            <span>Verified Source • Last Synced July 2026</span>
          </div>
        </div>

      </div>
    </main>
  );
}

export default function EventsPage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={<div className="min-h-screen bg-rich-black flex items-center justify-center text-white">Loading Competitions Hub...</div>}>
        <EventsInner />
      </Suspense>
      <Footer />
    </>
  );
}

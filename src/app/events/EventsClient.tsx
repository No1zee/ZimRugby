"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Clock, Award, Users, Layers, Shield, Trophy, Activity, CheckCircle } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageAnnouncements from "@/components/ui/PageAnnouncements";

import CmsHero from "@/components/cms/CmsHero";
import type { EventItem } from "@/types";

interface Competition extends EventItem {
  level: string;
  dateRange: string;
  teamCount: string;
  status: string;
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
    status: "UPCOMING",
    category: e.subtitle || ""
  };
}

function mapToGeneralEvent(e: EventItem): GeneralEvent {
  return {
    ...e,
    time: "",
    category: e.tags?.[0] || "EVENT"
  };
}

const levels = [
  { name: "National Teams", icon: Shield, tag: "National" },
  { name: "Club Rugby", icon: Trophy, tag: "Clubs" },
  { name: "Schools Rugby", icon: Users, tag: "Schools" },
  { name: "Women's Rugby", icon: Activity, tag: "Women" },
  { name: "Youth Pathways", icon: Layers, tag: "Youth" },
  { name: "Sevens Rugby", icon: Award, tag: "Sevens" }
];

interface EventsClientProps {
  cmsPage?: any;
  competitions?: EventItem[];
  generalEvents?: EventItem[];
}

export default function EventsClient({ cmsPage, competitions: apiCompetitions = [], generalEvents: apiGeneralEvents = [] }: EventsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams?.get("tab") === "events" ? "events" : "competitions";
  
  const [activeTab, setActiveTab] = useState<"competitions" | "events">(initialTab);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const competitions = apiCompetitions.map(mapToCompetition);
  const generalEvents = apiGeneralEvents.map(mapToGeneralEvent);

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "events" || tab === "competitions") {
      setTimeout(() => setActiveTab(tab), 0);
    }
  }, [searchParams]);

  const handleTabChange = (tab: "competitions" | "events") => {
    setActiveTab(tab);
    setSelectedLevel(null);
    router.push(`/events?tab=${tab}`, { scroll: false });
  };

  const filteredCompetitions = selectedLevel 
    ? competitions.filter(c => c.tags.includes(selectedLevel))
    : competitions;

  const filteredEvents = selectedLevel 
    ? generalEvents.filter(e => e.tags.includes(selectedLevel))
    : generalEvents;

  return (
    <main className="bg-milk-white min-h-screen pb-12 relative overflow-hidden text-rich-black">
      
      <CmsHero
        kicker={cmsPage?.hero_kicker || "Tournaments & Hub"}
        title={cmsPage?.hero_title || "Competitions & Events"}
        intro={cmsPage?.hero_intro || "Explore the full heartbeat of Zimbabwean rugby. Drill down into active leagues, regional championships, and official union events."}
        image={cmsPage?.hero_image || "/images/gallery/zimbabwe-sables-0350.webp"}
        breadcrumb={[{ label: "Events", href: "/events" }]}
        pageId={cmsPage?.id}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">

        <PageAnnouncements scope="events" className="mb-8" />

        <div className="mb-10">
          <span className="text-black/45 text-[9px] font-black uppercase tracking-[0.4em] block mb-6 font-subheading">Browse by Rugby Level</span>
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
                      ? "bg-zru-green/20 border-zru-green text-rich-black shadow-[0_0_20px_rgba(0,107,63,0.15)]" 
                      : "bg-white border border-black/5 text-black/60 hover:text-black hover:border-black/20 shadow-sm hover:shadow-md"
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-3 transition-transform duration-300 group-hover:scale-110 ${isSelected ? "text-zru-green" : "text-black/40 group-hover:text-black"}`} />
                  <span className="text-[11px] font-subheading font-bold uppercase tracking-wider text-center">{level.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white p-2 rounded-2xl border border-black/5 shadow-sm">
           
           <div className="flex p-1 bg-black/5 rounded-xl border border-black/10 relative z-0">
             {(["competitions", "events"] as const).map((tab) => {
               const isActive = activeTab === tab;
               return (
                 <button
                   key={tab}
                   onClick={() => handleTabChange(tab)}
                   className={`relative px-8 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors duration-300 select-none z-10 ${
                     isActive ? "text-white" : "text-black/60 hover:text-black"
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

           <div className="text-right">
             <span className="text-xs text-black/45 font-bold uppercase tracking-widest">
               {selectedLevel ? `Filtering by Level: ${selectedLevel}` : "Showing all divisions"}
             </span>
           </div>
        </div>

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
                    className="bg-white border border-black/5 group flex flex-col justify-between p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black tracking-widest text-zru-green uppercase bg-zru-green/10 border border-zru-green/20 px-3 py-1 rounded-sm">
                          {comp.level}
                        </span>
                        <span className="flex items-center gap-1.5 text-[9px] font-black tracking-wider uppercase text-black/50">
                          <span className={`w-1.5 h-1.5 rounded-full ${comp.status === "ONGOING" ? "bg-zru-green" : "bg-neutral-300"}`} />
                          {comp.status}
                        </span>
                      </div>

                      <h3 className="text-2xl font-heading text-rich-black mb-4 group-hover:text-zru-green transition-colors">
                        {comp.title}
                      </h3>
                      <p className="text-black/60 text-sm leading-relaxed mb-6 font-body">
                        {comp.description}
                      </p>
                    </div>

                    <div className="border-t border-black/5 pt-6 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-black/45 uppercase tracking-widest block font-bold">Timeline / Teams</span>
                        <div className="flex gap-4 text-xs font-bold text-black/80">
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
                <div className="col-span-2 text-center py-20 border border-dashed border-black/10 rounded-2xl bg-black/5">
                  <p className="text-black/45 font-bold uppercase tracking-widest">No Competitions matching this level filter.</p>
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
                    className="bg-white border border-black/5 group flex flex-col justify-between p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div>
                      <div className="bg-black/5 p-4 flex items-center justify-between border border-black/5 rounded-xl mb-6">
                        <div className="flex items-center gap-2 text-rich-black font-bold tracking-wider text-xs">
                          <CalendarIcon className="w-4 h-4 text-zru-green" />
                          <span>{event.date}</span>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded text-rich-black bg-white border border-black/10 tracking-widest`}>
                          {event.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-heading text-rich-black mb-4 group-hover:text-zru-green transition-colors leading-tight">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2.5 text-black/50 text-xs font-normal font-body">
                          <Clock className="w-4 h-4 text-zru-green shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-black/50 text-xs font-normal font-body">
                          <MapPin className="w-4 h-4 text-zru-green shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      <p className="text-black/60 text-xs leading-relaxed mb-6 font-body line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    <SlantedButton href={`/contact`} variant="outline" size="sm" className="w-full justify-center mt-4">
                      REGISTER INTEREST
                    </SlantedButton>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-20 border border-dashed border-black/10 rounded-2xl bg-black/5">
                  <p className="text-black/45 font-bold uppercase tracking-widest">No Events matching this level filter.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 border-t border-black/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-black/45 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-zru-green" />
            <span>Official ZRU Competition Feed</span>
          </div>
          <div>
            <span>Verified Source &bull; Last Synced July 2026</span>
          </div>
        </div>

      </div>
    </main>
  );
}

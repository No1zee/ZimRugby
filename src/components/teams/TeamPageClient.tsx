"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronDown, Calendar, MapPin, Users, Award, ShieldAlert, Image as ImageIcon } from "lucide-react";
import { Team } from "@/types";

const ALL_TEAMS = [
  { id: "sables", name: "Zimbabwe Sables", href: "/teams/sables" },
  { id: "lady-sables", name: "Lady Sables", href: "/teams/lady-sables" },
  { id: "junior-sables", name: "Junior Sables (U20)", href: "/teams/junior-sables" },
  { id: "cheetahs", name: "Zimbabwe Cheetahs", href: "/teams/cheetahs" },
  { id: "u20", name: "Zimbabwe U20 Development", href: "/teams/u20" }
];

interface TeamPageClientProps {
  team: Team;
}

export default function TeamPageClient({ team }: TeamPageClientProps) {
  const [activeTab, setActiveTab] = useState<"squad" | "matches" | "coaching" | "history" | "gallery">("squad");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentIndex = ALL_TEAMS.findIndex(t => t.id === team.id);
  const prevTeam = ALL_TEAMS[(currentIndex - 1 + ALL_TEAMS.length) % ALL_TEAMS.length];
  const nextTeam = ALL_TEAMS[(currentIndex + 1) % ALL_TEAMS.length];

  const tabItems = [
    { id: "squad", label: "SQUAD", icon: Users },
    { id: "coaching", label: "COACHES", icon: Award },
    { id: "matches", label: "FIXTURES & RESULTS", icon: Calendar },
    { id: "history", label: "HISTORY", icon: ShieldAlert },
    { id: "gallery", label: "GALLERY", icon: ImageIcon }
  ] as const;

  return (
    <div className="min-h-screen bg-rich-black text-white">
      
      {/* 1. Dynamic Hero Banner */}
      <div className="relative h-[45vh] min-h-[350px] overflow-hidden flex items-end">
        {/* Banner image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={team.gallery[0] || "/images/events/africa-cup.jpg"}
            alt={team.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 filter-[brightness(0.7)]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/40 to-transparent" />
        </div>

        {/* Content container */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="text-zru-green text-xs font-black uppercase tracking-[0.4em] mb-3 block">
                NATIONAL REPRESENTATIVE TEAM
              </span>
              <div className="relative inline-block text-left z-40">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 text-5xl sm:text-7xl font-black uppercase italic tracking-tighter text-glow-green leading-none hover:text-zru-green transition-colors text-left"
                >
                  <span>{team.name}</span>
                  <ChevronDown className={`w-8 h-8 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-3 w-72 rounded-xl card-green border p-2 shadow-2xl backdrop-blur-md z-50"
                      >
                        <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Switch Squad</span>
                        </div>
                        {ALL_TEAMS.map((t) => (
                          <Link
                            key={t.id}
                            href={t.href}
                            onClick={() => setIsDropdownOpen(false)}
                            className={`block px-3 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                              t.id === team.id
                                ? "bg-zru-green text-rich-black"
                                : "text-white/60 hover:text-white hover:bg-zru-green/10"
                            }`}
                          >
                            {t.name}
                          </Link>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-white/70 font-medium text-lg mt-4 max-w-2xl">
                {team.tagline}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="flex flex-wrap gap-4 lg:gap-6 card-green border rounded-xl p-4 backdrop-blur-md">
              {team.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col border-r border-white/10 last:border-0 pr-6 last:pr-0">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{stat.label}</span>
                  <span className="text-xl font-black text-zru-green uppercase italic mt-1">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="border-b border-white/10 bg-rich-black/80 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-2 no-scrollbar">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    isActive 
                      ? "bg-zru-green text-white shadow-lg shadow-zru-green/20" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Dynamic Content Panels */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            
            {/* Squad tab content */}
            {activeTab === "squad" && (
              <div className="space-y-12">
                <div className="border-l-4 border-zru-green pl-4">
                  <h2 className="text-2xl font-black uppercase tracking-wider">ACTIVE SQUAD</h2>
                  <p className="text-sm text-white/50 mt-1">Current player selection representing {team.name} on the international stage.</p>
                </div>
                
                {/* Responsive Squad Grid: Single column mobile, 2 tablet, 3-4 desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {team.squad.map((player, idx) => (
                    <div 
                      key={idx} 
                      className="card-green border rounded-xl p-5 flex flex-col items-center text-center hover:-translate-y-1 shadow-lg group glow-green-card"
                    >
                      {/* Player photo placeholder */}
                      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/10 relative overflow-hidden mb-4 group-hover:border-zru-green/50 transition-colors">
                        <Users className="w-10 h-10 text-white/30" />
                      </div>
                      
                      <h3 className="font-black text-lg uppercase tracking-tight text-white">{player.name}</h3>
                      <span className="text-zru-green text-xs font-bold uppercase tracking-wider mt-1">{player.position}</span>
                      
                      <div className="mt-4 pt-4 border-t border-white/5 w-full flex justify-between text-[11px] text-white/40 font-bold uppercase">
                        <span>Club: <strong className="text-white/80 font-semibold">{player.club}</strong></span>
                        <span>Caps: <strong className="text-white/80 font-semibold">{player.caps}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coaching Staff tab content */}
            {activeTab === "coaching" && (
              <div className="space-y-12">
                <div className="border-l-4 border-zru-green pl-4">
                  <h2 className="text-2xl font-black uppercase tracking-wider">COACHING & MANAGEMENT</h2>
                  <p className="text-sm text-white/50 mt-1">The strategic minds behind {team.name}&apos;s performances and preparation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {team.coachingStaff.map((coach, idx) => (
                    <div 
                      key={idx} 
                      className="card-green border rounded-xl p-6 flex items-center gap-6 group"
                    >
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/15 relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <Award className="w-8 h-8 text-white/40" />
                      </div>
                      <div>
                        <h3 className="font-black text-lg uppercase tracking-tight text-white">{coach.name}</h3>
                        <span className="text-zru-green text-xs font-bold uppercase tracking-widest mt-1 block">{coach.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fixtures & Results tab content */}
            {activeTab === "matches" && (
              <div className="space-y-12">
                <div className="border-l-4 border-zru-green pl-4">
                  <h2 className="text-2xl font-black uppercase tracking-wider">FIXTURES & RESULTS</h2>
                  <p className="text-sm text-white/50 mt-1">Track the match history and upcoming international campaigns for {team.name}.</p>
                </div>

                <div className="space-y-4">
                  {team.matches.map((match, idx) => {
                    const isCompleted = match.status === 'completed';
                    return (
                      <div 
                        key={idx} 
                        className="card-green border rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                      >
                        {/* Match Opponent and details */}
                        <div className="flex items-center gap-4">
                          {match.opponentLogo ? (
                            <div className="w-10 h-7 relative shrink-0">
                              <Image src={match.opponentLogo} alt={match.opponent} fill sizes="60px" className="object-cover rounded-xs" />
                            </div>
                          ) : (
                            <div className="w-10 h-7 bg-white/10 rounded-xs flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-black text-white">{match.opponent.substring(0, 3).toUpperCase()}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-[9px] text-white/40 font-black uppercase tracking-wider">OPPONENT</span>
                            <h3 className="font-black text-base md:text-lg uppercase tracking-wide text-white">vs {match.opponent}</h3>
                          </div>
                        </div>

                        {/* Match center scores or status */}
                        <div className="flex flex-col md:items-center">
                          {isCompleted ? (
                            <div className="flex flex-col md:items-center">
                              <span className="text-[9px] text-white/40 font-black uppercase tracking-wider">FINAL SCORE</span>
                              <span className="text-2xl font-black italic tracking-tighter text-glow-green text-white">{match.score}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col md:items-center">
                              <span className="text-[9px] text-zru-green font-black uppercase tracking-wider">UPCOMING FIXTURE</span>
                              <span className="text-xs font-bold uppercase text-white mt-1">KICK OFF SCHEDULED</span>
                            </div>
                          )}
                        </div>

                        {/* Date and Venue */}
                        <div className="flex items-center gap-6 justify-between md:justify-end">
                          <div className="text-right">
                            <div className="flex items-center gap-1.5 justify-end text-[11px] text-white/60 font-bold uppercase tracking-tight">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{match.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 justify-end text-[10px] text-white/40 mt-1 uppercase">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{match.venue}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/20 hidden md:block" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* History tab content */}
            {activeTab === "history" && (
              <div className="space-y-12">
                <div className="border-l-4 border-zru-green pl-4">
                  <h2 className="text-2xl font-black uppercase tracking-wider">TEAM HISTORY & LEGACY</h2>
                  <p className="text-sm text-white/50 mt-1">Understanding the origins, historic achievements, and identity of {team.name}.</p>
                </div>

                <div className="card-green border rounded-2xl p-8 max-w-4xl">
                  <p className="text-white/80 text-lg leading-relaxed font-medium">
                    {team.history}
                  </p>
                </div>
              </div>
            )}

            {/* Gallery tab content */}
            {activeTab === "gallery" && (
              <div className="space-y-12">
                <div className="border-l-4 border-zru-green pl-4">
                  <h2 className="text-2xl font-black uppercase tracking-wider">PHOTO GALLERY</h2>
                  <p className="text-sm text-white/50 mt-1">Cinematic snapshots of {team.name} in action, during training campaigns and historic matches.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {team.gallery.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative h-64 card-green border rounded-xl overflow-hidden group shadow-lg"
                    >
                      <Image 
                        src={img} 
                        alt={`${team.name} gallery image ${idx + 1}`} 
                        fill 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-black uppercase tracking-widest border border-white/30 px-4 py-2 rounded">
                          View Image
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Next / Previous Linear Navigation Pager */}
        <div className="mt-20 pt-12 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          <Link
            href={prevTeam.href}
            className="card-green border rounded-2xl p-6 flex items-center justify-between group hover:border-zru-green/40 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 group-hover:bg-zru-green/10 group-hover:text-zru-green transition-colors border border-white/5">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </div>
              <div>
                <span className="text-[9px] text-white/40 font-black uppercase tracking-wider block">PREVIOUS TEAM</span>
                <span className="text-sm font-black text-white uppercase tracking-tight">{prevTeam.name}</span>
              </div>
            </div>
          </Link>

          <Link
            href={nextTeam.href}
            className="card-green border rounded-2xl p-6 flex items-center justify-between group hover:border-zru-green/40 transition-all text-right"
          >
            <div className="flex items-center gap-4 justify-end w-full">
              <div>
                <span className="text-[9px] text-white/40 font-black uppercase tracking-wider block">NEXT TEAM</span>
                <span className="text-sm font-black text-white uppercase tracking-tight">{nextTeam.name}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 group-hover:bg-zru-green/10 group-hover:text-zru-green transition-colors border border-white/5">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>
      </main>

    </div>
  );
}

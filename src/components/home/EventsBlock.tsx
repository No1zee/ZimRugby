"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { StaggerContainer, staggerItemVariants } from "../ui/animations";
import { PretextBackground } from "../ui/PretextBackground";
import { PretextHeadline } from "../ui/PretextHeadline";

const events = [
  {
    id: 1,
    title: "SUPER SIX RUGBY LEAGUE",
    subtitle: "PREMIER CLUB COMPETITION",
    date: "May - Sep 2026",
    location: "HARARE & BULAWAYO",
    description: "Zimbabwe's top clubs including Old Hararians, Old Georgians, and Old Miltonians battle for supremacy.",
    tags: ["Premier League", "Club Rugby"],
    icon: Trophy,
    color: "from-zru-green to-black",
    image: "/images/events/super-league.jpg"
  },
  {
    id: 2,
    title: "SABLE LAGER GRID CUP",
    subtitle: "FRANCHISE RUGBY",
    date: "Oct - Nov 2026",
    location: "HARARE SPORTS CLUB",
    description: "The new franchise-style format boosting excitement and participation in the local scene.",
    tags: ["Franchise", "Sable Lager"],
    icon: Trophy,
    color: "from-zru-gold to-black",
    image: "/images/media/vid1.jpg"
  },
  {
    id: 3,
    title: "NEDBANK CHALLENGE CUP",
    subtitle: "KNOCKOUT TOURNAMENT",
    date: "Mar 2026",
    location: "OLD HARARIANS",
    description: "The 4th edition of the prominent knockout tournament highlighting provincial and club talent.",
    tags: ["Knockout", "Nedbank"],
    icon: Trophy,
    color: "from-green-900 to-black",
    image: "/images/events/schools-fest.jpg"
  },
  {
    id: 4,
    title: "HARARE UNDER-20 LEAGUE",
    subtitle: "YOUTH DEVELOPMENT",
    date: "Jan 2026",
    location: "OLD HARARIANS",
    description: "Future stars in action at the Harare Under-20 League, rescheduled for January.",
    tags: ["Youth", "U20 League"],
    icon: Trophy,
    color: "from-blue-900 to-black",
    image: "/images/events/schools-fest.jpg"
  }
];

export default function EventsBlock() {
  return (
    <section className="relative py-24 overflow-hidden" id="events-block">
      
      {/* Background text - Restored big interactive text */}
      <PretextBackground 
        text="WHAT'S ON? "
        className="absolute -top-[15vh] -bottom-[15vh] left-0 right-0 opacity-80" 
      />
      
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Sticky Header Block */}
          <div className="lg:w-1/4 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-px bg-zru-gold" />
                  <span className="text-zru-gold text-[10px] font-black uppercase tracking-[0.4em]">The Calendar</span>
                </div>
                <div className="pr-4">
                  <PretextHeadline 
                    text="WHAT'S ON?" 
                    maxFontSize={140} 
                    minFontSize={50}
                  />
                </div>
              </div>
              
              <p className="text-white/60 text-sm leading-relaxed font-medium">
                From Super Six matches to community development festivals, explore the heart of Zimbabwean rugby across the nation.
              </p>
              
              <Link 
                href="/events" 
                className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-none font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-zru-gold hover:text-black group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(235,178,23,0.3)]"
              >
                <span>Explore All</span>
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              </Link>
            </motion.div>
          </div>

          {/* Events Grid - Asymmetric Layout */}
          <div className="lg:w-3/4">
            <StaggerContainer 
              className="flex flex-col gap-12 lg:gap-20" 
              staggerDelay={0.05}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {events.map((event, idx) => (
                  <motion.div 
                    key={event.id} 
                    variants={staggerItemVariants}
                    className={`${idx === 0 ? "lg:col-span-2" : ""} ${idx % 2 === 0 && idx !== 0 ? "lg:mt-32" : ""}`}
                  >
                    <Link href={`/events/${event.id}`} className="block group">
                      <div className={`relative ${idx === 0 ? "aspect-21/9" : "aspect-4/5"} overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl transition-all duration-700 group-hover:-translate-y-2 glow-green-card`}>
                        <Image 
                          src={event.image || "/images/events/africa-cup.jpg"} 
                          alt={`${event.title} - ${event.subtitle}`}
                          fill
                          sizes="(max-width: 1200px) 100vw, 50vw"
                          className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                        />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80" />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-8 flex flex-col justify-end gap-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {event.tags.map((tag, i) => (
                              <span 
                                key={tag} 
                                className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded backdrop-blur-sm ${
                                  i === 0 
                                    ? "bg-zru-gold text-black shadow-sm" 
                                    : "text-white border border-white/20 bg-black/20"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none group-hover:text-zru-gold transition-colors">
                            {event.title}
                          </h3>
                        </div>
                        
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          <p className="text-white/60 text-xs line-clamp-2 font-medium">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-[9px] font-bold text-white/60 uppercase tracking-widest pt-4">
                            <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {event.date}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

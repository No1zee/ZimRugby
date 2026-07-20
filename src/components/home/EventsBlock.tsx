"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { StaggerContainer, staggerItemVariants } from "../ui/animations";
import { PretextBackground } from "../ui/PretextBackground";
import { PretextHeadline } from "../ui/PretextHeadline";
import SlantedButton from "../ui/SlantedButton";

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
    color: "from-zru-green to-black",
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
    color: "from-zru-green to-black",
    image: "/images/events/schools-fest.jpg"
  }
];

export default function EventsBlock() {
  return (
    <section className="relative py-section" id="events-block">
      
      {/* Background text - Restored big interactive text */}
      <PretextBackground 
        text="WHAT'S ON? "
        className="absolute -top-[15vh] -bottom-[15vh] left-0 right-0 opacity-20 z-10" 
      />
      
      <div className="max-w-[1440px] mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
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
                  <div className="w-8 h-px bg-zru-green" />
                  <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.4em]">The Calendar</span>
                </div>
                <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-rich-black">
                  WHAT'S <span className="text-stroke-black text-transparent">ON?</span>
                </h2>
              </div>
              
              <p className="body-small text-rich-black/60 font-medium">
                From Super Six matches to community development festivals, explore the heart of Zimbabwean rugby across the nation.
              </p>
              
              <SlantedButton 
                href="/events" 
                variant="secondary"
                className="inline-flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_25px_rgba(0,107,63,0.35)] w-fit group"
              >
                <span>Explore All</span>
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              </SlantedButton>
            </motion.div>
          </div>

          {/* Events Grid - Asymmetric Layout */}
          <div className="lg:w-3/4">
            <StaggerContainer 
              className="flex flex-col gap-6" 
              staggerDelay={0.05}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {events.map((event, idx) => (
                  <motion.div 
                    key={event.id} 
                    variants={staggerItemVariants}
                    className="w-full flex"
                  >
                    <Link href={`/events/${event.id}`} className="block w-full">
                      <div className="card-dark p-4 md:p-5 flex flex-col justify-between h-[420px] md:h-[450px] w-full select-none hover:border-zru-green/30 transition-all duration-300">
                        {/* Top Image Section */}
                        <div className="relative h-40 md:h-48 w-full overflow-hidden rounded-xl bg-neutral-900 shrink-0">
                          <Image 
                            src={event.image || "/images/events/africa-cup.jpg"} 
                            alt={`${event.title}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
                          />
                        </div>

                        {/* Card Body */}
                        <div className="flex-grow flex flex-col justify-between mt-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/48 block">
                              {event.subtitle}
                            </span>
                            <h3 className="text-base md:text-lg font-semibold tracking-[-0.01em] text-white line-clamp-1">
                              {event.title}
                            </h3>
                            <p className="text-xs md:text-sm leading-relaxed text-white/72 line-clamp-2">
                              {event.description}
                            </p>
                          </div>

                          {/* Footer with Divider */}
                          <div className="border-t border-white/8 pt-3 mt-3">
                            <div className="flex items-center justify-between text-[10px] font-medium text-white/48 uppercase tracking-[0.14em]">
                              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-zru-green" /> {event.date}</span>
                              <span className="flex items-center gap-1.5 truncate max-w-[150px]"><MapPin className="w-3.5 h-3.5 text-zru-green" /> {event.location}</span>
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

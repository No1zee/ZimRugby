"use client";

import { Users, Trophy, GraduationCap, Radio, Handshake, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "../ui/animations";

const PATHWAYS = [
  {
    title: "Fans",
    description: "Follow the Sables, book tickets, explore the fan zone, and check match schedules.",
    href: "/match-centre",
    cta: "Match Centre",
    icon: Users,
  },
  {
    title: "Players",
    description: "Find a club near you, discover age-grade divisions, and register to play rugby.",
    href: "/play-rugby",
    cta: "Join a Team",
    icon: Trophy,
  },
  {
    title: "Clubs & Schools",
    description: "Access school leagues, coaching development resources, and administrative toolkits.",
    href: "/clubs",
    cta: "Development Hub",
    icon: GraduationCap,
  },
  {
    title: "Media",
    description: "Read latest press updates, download media accreditation, and access the ZRU Video Hub.",
    href: "/video-hub",
    cta: "Video Hub",
    icon: Radio,
  },
  {
    title: "Sponsors & Partners",
    description: "Invest in Zimbabwe rugby, explore sponsorship tiers, and view corporate partners.",
    href: "/partners",
    cta: "Partner With Us",
    icon: Handshake,
  },
];

export default function AudiencePathways() {
  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <ScrollReveal className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-zru-green/40" />
              <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.5em]">Pathways</span>
            </div>
            <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-rich-black uppercase">
              Rugby <span className="text-stroke-black text-transparent">Ecosystem</span>
            </h2>
          </div>
          <p className="text-rich-black/60 max-w-md font-body text-sm">
            Whether you are cheering from the stands, contesting on the field, or supporting the game's growth, find your path in Zimbabwe Rugby.
          </p>
        </ScrollReveal>

        {/* Pathways Grid - Desktop (Detailed Cards) */}
        <div className="hidden md:block">
          <StaggerContainer className="grid grid-cols-5 gap-6" staggerDelay={0.05}>
            {PATHWAYS.map((path) => {
              const Icon = path.icon;
              return (
                <motion.div
                  key={path.title}
                  variants={staggerItemVariants}
                  className="group flex flex-col justify-between rounded-2xl border border-white/8 hover:border-zru-green/35 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.22)] overflow-hidden"
                >
                  <Link
                    href={path.href}
                    className="flex-1 flex flex-col justify-between p-6 card-dark h-full w-full"
                  >
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-zru-green/10 flex items-center justify-center border border-zru-green/20 text-zru-green group-hover:scale-105 transition-transform duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading text-xl text-white tracking-wide uppercase">
                        {path.title}
                      </h3>
                      <p className="text-white/60 text-xs font-body leading-relaxed">
                        {path.description}
                      </p>
                    </div>

                    <div className="pt-6">
                      <span className="inline-flex items-center gap-2 text-[10px] font-heading tracking-widest uppercase text-white group-hover:text-zru-green transition-colors">
                        {path.cta} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Pathways Grid - Mobile (Compact Icon Buttons) */}
        <div className="block md:hidden">
          <div className="grid grid-cols-2 gap-3">
            {PATHWAYS.map((path, idx) => {
              const Icon = path.icon;
              const isLast = idx === PATHWAYS.length - 1;
              return (
                <Link
                  key={path.title}
                  href={path.href}
                  className={`flex items-center gap-3 p-4 card-dark rounded-xl border border-white/8 active:border-zru-green/50 shadow-md ${
                    isLast ? "col-span-2 justify-center" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-zru-green/15 flex items-center justify-center text-zru-green shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading text-xs text-white uppercase tracking-wider">
                      {path.title}
                    </span>
                    <ArrowRight className="w-3 h-3 text-white/40" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

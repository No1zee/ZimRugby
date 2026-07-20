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
    href: "/about/safeguarding",
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

        {/* Pathways Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6" staggerDelay={0.05}>
          {PATHWAYS.map((path) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.title}
                variants={staggerItemVariants}
                className="group flex flex-col justify-between p-6 card-dark rounded-2xl border border-white/8 hover:border-zru-green/35 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
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
                  <Link
                    href={path.href}
                    className="inline-flex items-center gap-2 text-[10px] font-heading tracking-widest uppercase text-white group-hover:text-zru-green transition-colors"
                  >
                    {path.cta} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </StaggerContainer>

      </div>
    </section>
  );
}

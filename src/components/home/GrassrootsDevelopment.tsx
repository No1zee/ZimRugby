"use client";

import { MapPin, Sparkles, HeartHandshake, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "../ui/animations";
import SlantedButton from "../ui/SlantedButton";

const PATHWAYS = [
  {
    title: "Play Rugby",
    description: "Whether you are a beginner or returning player, find programs suited for your level.",
    href: "/play-rugby",
    icon: Sparkles,
  },
  {
    title: "Find a Club",
    description: "Search local clubs and school leagues to start training and playing competitively.",
    href: "/play-rugby",
    icon: MapPin,
  },
  {
    title: "Volunteer",
    description: "Support local teams by becoming a certified referee, youth coach, or admin helper.",
    href: "/referees",
    icon: HeartHandshake,
  },
  {
    title: "Youth & Pathways",
    description: "Under-18 programs designed to scout talent and grow the game safely at the school level.",
    href: "/about/safeguarding",
    icon: ShieldCheck,
  },
];

export default function GrassrootsDevelopment() {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <ScrollReveal className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-zru-green/40" />
              <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.5em]">Grassroots</span>
            </div>
            <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-rich-black uppercase">
              GROWING THE <span className="text-stroke-black text-transparent">GAME</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <SlantedButton href="/play-rugby" variant="primary">
              Get Started
            </SlantedButton>
            <SlantedButton href="/about/safeguarding" variant="outline">
              Safeguarding Rules
            </SlantedButton>
          </div>
        </ScrollReveal>

        {/* Pathways Grid - Desktop (Detailed Cards) */}
        <div className="hidden md:block">
          <StaggerContainer className="grid grid-cols-4 gap-8" staggerDelay={0.06}>
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
                    className="flex-1 flex flex-col justify-between p-8 card-dark h-full w-full"
                  >
                    <div className="space-y-6">
                      <div className="w-12 h-12 rounded-2xl bg-zru-green/10 flex items-center justify-center border border-zru-green/20 text-zru-green group-hover:rotate-6 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-heading text-2xl text-white tracking-wide uppercase">
                        {path.title}
                      </h3>
                      <p className="text-white/60 text-sm font-body leading-relaxed">
                        {path.description}
                      </p>
                    </div>

                    <div className="pt-8">
                      <span className="inline-flex items-center gap-2 text-xs font-heading tracking-widest uppercase text-white group-hover:text-zru-green transition-colors">
                        Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            {PATHWAYS.map((path) => {
              const Icon = path.icon;
              return (
                <Link
                  key={path.title}
                  href={path.href}
                  className="flex items-center gap-3 p-4 card-dark rounded-xl border border-white/8 active:border-zru-green/50 shadow-md"
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

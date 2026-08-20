"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, GraduationCap } from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "../ui/animations";
import SlantedButton from "@/components/ui/SlantedButton";

const programs = [
  {
    id: 1,
    title: "GRASSROOTS DEVELOPMENT",
    description: "Building the future of Zimbabwe Rugby from the ground up in communities and provincial unions across the nation.",
    icon: Users,
    stat: 50,
    statLabel: "CLUBS",
    cta: "Explore Program",
    ctaLink: "/play-rugby",
    color: "from-zru-green to-[#002214]"
  },
  {
    id: 2,
    title: "SCHOOLS PROGRAMME",
    description: "Partnering with primary and secondary schools nationwide to introduce young Zimbabweans to the game of rugby.",
    icon: GraduationCap,
    stat: 200,
    statLabel: "SCHOOLS",
    cta: "Explore Program",
    ctaLink: "/schools",
    color: "from-[#003822] to-black"
  },
  {
    id: 3,
    title: "WOMEN'S RUGBY",
    description: "Empowering women and girls through rugby with structured pathways from community leagues to the national Lady Sables.",
    icon: Heart,
    stat: 5000,
    statLabel: "PLAYERS",
    cta: "Join Program",
    ctaLink: "/play-rugby",
    color: "from-zru-green to-black"
  },
];

export default function PlayRugbyDevelopment() {
  return (
    <section className="bg-zru-green text-white py-16 sm:py-20 overflow-hidden relative select-none">
      {/* Pitch Watermark & Ambient Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-white/20 pb-8 max-w-3xl space-y-4"
        >
          <div className="heading-plate heading-plate-light">
            <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-white not-italic leading-[1.05]">
              RUGBY FOR <span className="text-emerald-400">GOOD</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/80 font-normal leading-relaxed border-l-2 border-emerald-400 pl-6 max-w-2xl">
            Using rugby to transform communities, empower youth, and build an enduring sporting legacy across Zimbabwe.
          </p>
        </motion.div>

        {/* Programs: Cinematic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {programs.map((program, idx) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-[#002214]/60 border border-white/20 shadow-2xl backdrop-blur-md">
                <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-90 transition-opacity group-hover:opacity-100`} />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 space-y-5">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <program.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-5xl sm:text-6xl font-heading font-black text-white tracking-tighter">
                      <AnimatedCounter value={program.stat} suffix="+" />
                    </div>
                    <span className="text-[10px] font-heading font-black tracking-widest uppercase text-emerald-400">
                      {program.statLabel}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight leading-tight">
                    {program.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 font-normal line-clamp-3 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA: High-end Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="p-8 md:p-12 bg-[#002214]/70 border border-white/20 rounded-[24px] backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          <div className="space-y-3 relative z-10 max-w-xl text-center md:text-left">
             <div className="heading-plate heading-plate-light">
               <h3 className="text-2xl md:text-4xl font-heading font-black text-white uppercase tracking-tight leading-tight">
                 JOIN THE <span className="text-zru-green">1985 CLUB</span>
               </h3>
             </div>
             <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
               Whether as a volunteer, donor, or strategic grassroots partner, your involvement drives the next era of Zimbabwe Rugby.
             </p>
          </div>
          <div className="flex relative z-10 w-full sm:w-auto justify-center">
            <Link
              href="/contact"
              className="clip-slanted px-8 py-3.5 bg-white text-rich-black hover:bg-milk-white hover:text-zru-green text-xs font-heading font-black uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 shadow-lg inline-flex items-center gap-2"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

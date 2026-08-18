"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, GraduationCap } from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "../ui/animations";

const programs = [
  {
    id: 1,
    title: "GRASSROOTS DEVELOPMENT",
    description: "Building the future of Zimbabwe Rugby from the ground up in communities across the nation.",
    icon: Users,
    stat: 50,
    statLabel: "CLUBS",
    cta: "Explore Program",
    ctaLink: "/play-rugby",
    color: "from-zru-green to-green-900"
  },
  {
    id: 2,
    title: "SCHOOLS PROGRAMME",
    description: "Partnering with schools nationwide to introduce young Zimbabweans to the game of rugby.",
    icon: GraduationCap,
    stat: 200,
    statLabel: "SCHOOLS",
    cta: "Explore Program",
    ctaLink: "/schools",
    color: "from-gray-900 to-black"
  },
  {
    id: 3,
    title: "WOMEN&apos;S RUGBY",
    description: "Empowering women and girls through rugby with pathways from community to international level.",
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
    <section className="bg-zru-green text-white py-16 sm:py-20 overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 border-b border-white/20 pb-10 max-w-3xl space-y-4"
        >
          <span className="text-xs font-black uppercase tracking-[0.2em] text-accent-teal">For the Future</span>
          <div className="heading-plate heading-plate-light">
            <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-wide sm:tracking-widest text-white not-italic leading-[1.05]">
              Rugby For <span className="text-accent-teal">Good</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/70 font-normal leading-relaxed border-l-2 border-accent-teal pl-6 max-w-xl">
            Using rugby to transform communities, empower youth, and build a lasting legacy across Zimbabwe.
          </p>
        </motion.div>

        {/* Programs: Cinematic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {programs.map((program, idx) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <div className="relative aspect-3/4 mb-8 overflow-hidden rounded-2xl bg-neutral-100 shadow-2xl shadow-black/5">
                <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-90 transition-opacity group-hover:opacity-100`} />
                <div className="absolute inset-0 flex flex-col justify-end p-10 space-y-6">
                  <div className="space-y-2">
                    <program.icon className="w-8 h-8 text-zru-green" />
                    <div className="text-6xl font-black text-white px-0 tracking-tighter">
                      <AnimatedCounter value={program.stat} suffix="+" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                    {program.title}
                  </h3>
                  <p className="text-sm text-white/70 font-normal line-clamp-3">
                    {program.description}
                  </p>
                  <Link href={program.ctaLink} className="pt-4 block group/btn">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white">
                      <span>{program.cta}</span>
                      <ArrowRight className="w-4 h-4 translate-x-0 group-hover/btn:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                </div>
                {/* Visual backdrop removed as icon is now anchored */}
                {/* <program.icon className="absolute top-10 right-10 w-24 h-24 text-white/10 rotate-12" /> */}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA: High-end Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-10 md:p-16 bg-clubhouse-charcoal rounded-4xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.1),transparent_50%)]" />
          <div className="space-y-4 relative z-10 max-w-xl">
             <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9]">
               Join The <br /><span className="text-zru-green">Ranks of Impact</span>
             </h3>
             <p className="text-white/60 font-normal">
               Whether as a volunteer, donor, or strategic partner, your involvement drives the next era of Zimbabwe Rugby.
             </p>
          </div>
          <div className="flex gap-4 relative z-10">
            <Link href="/volunteer" className="px-10 py-5 bg-zru-green text-white text-[10px] font-black uppercase tracking-widest clip-slanted hover:bg-white hover:text-clubhouse-charcoal transition-all shadow-xl">
              Donate Now
            </Link>
            <Link href="/volunteer" className="px-10 py-5 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest clip-slanted hover:bg-white/10 transition-all">
              Volunteer
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

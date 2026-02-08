"use client";

import { motion } from "framer-motion";
import { ArrowRight, Trophy, GraduationCap, Users } from "lucide-react";
import Button from "../common/Button";

const pillars = [
  {
    title: "CLUBS & UNIONS",
    description: "Join one of the 50+ registered clubs across Zimbabwe. From premier league to social rugby, there's a place for you.",
    icon: Trophy,
    stat: "50+ CLUBS",
  },
  {
    title: "SCHOOLS & YOUTH",
    description: "The heartbeat of our game. Discover the schools league fixtures, festivals, and development pathways.",
    icon: GraduationCap,
    stat: "100+ SCHOOLS",
  },
  {
    title: "WOMEN & COMMUNITY",
    description: "Accepting, inclusive, and growing fast. Be part of the Lady Sables revolution or join touch rugby.",
    icon: Users,
    stat: "GROWING FAST",
  },
];

export default function PlayRugbyDevelopment() {
  return (
    <section className="bg-zru-green py-24 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[url('/images/pattern-overlay.png')] opacity-10 mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-black/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
           <h2 className="text-white text-sm font-bold tracking-[0.2em] uppercase mb-4 opacity-80">PATHWAYS & DEVELOPMENT</h2>
           <h3 className="text-4xl md:text-5xl font-heading text-white mb-6">A GAME FOR EVERY ZIMBABWEAN</h3>
           <p className="text-white/80 text-lg leading-relaxed">
              Whether you're looking to turn pro, play socially, or get your school involved, Zimbabwe Rugby Union has a pathway for you. Join the family today.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
                <motion.div
                   key={pillar.title}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1 }}
                   whileHover={{ y: -10 }}
                   className="bg-rich-black/10 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-rich-black/20 transition-all duration-300 group cursor-pointer"
                >
                   <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-white text-white group-hover:text-zru-green">
                      <pillar.icon className="w-8 h-8" />
                   </div>
                   
                   <div className="text-zru-gold text-xs font-bold tracking-widest uppercase mb-2">{pillar.stat}</div>
                   <h4 className="text-2xl font-heading text-white mb-4">{pillar.title}</h4>
                   <p className="text-white/70 text-sm leading-relaxed mb-8">
                      {pillar.description}
                   </p>

                   <div className="flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase group-hover:translate-x-2 transition-transform">
                      <span>Get Involved</span>
                      <ArrowRight className="w-4 h-4" />
                   </div>
                </motion.div>
            ))}
        </div>

        <div className="mt-16 text-center">
            <Button variant="primary" className="bg-white text-zru-green hover:bg-gray-100 border-none px-8 py-3 text-lg">
                FIND A CLUB NEAR YOU
            </Button>
        </div>
      </div>
    </section>
  );
}

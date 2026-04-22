"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

// Sponsor data with actual logos
const principalSponsors = [
  { name: "NEDBANK", color: "#00A651", logo: "/images/sponsors/nedbank.jpeg" },
  { name: "WORLD RUGBY", color: "#003DA5", logo: "/images/sponsors/world-rugby.png" },
  { name: "RUGBY AFRICA", color: "#ED1C24", logo: "/images/sponsors/rugby-africa.png" },
];

const partners = [
  { name: "ZOC", initial: "ZOC", logo: "/images/sponsors/zoc.png" },
  { name: "SRC", initial: "SRC", logo: "/images/sponsors/src.png" },
];

export default function PartnersSection() {
  return (
    <section className="bg-rich-black py-32 relative overflow-hidden">
      
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-zru-gold/5 to-transparent pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-zru-gold" />
              <span className="text-zru-gold text-[10px] font-black uppercase tracking-[0.4em]">Institutional</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              STRATEGIC <br /><span className="text-stroke-white text-transparent">PARTNERS</span>
            </h2>
          </div>
          <div className="md:text-right space-y-6">
            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-sm ml-auto">
              Fueling the engine of Zimbabwean rugby. We thank our partners for their tireless commitment to the game.
            </p>
            <Link href="/partners" className="inline-block group">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white">
                <span className="pb-1 border-b border-white/20 group-hover:border-zru-gold transition-colors">Join the Network</span>
                <Plus className="w-4 h-4 text-zru-gold" />
              </div>
            </Link>
          </div>
        </div>

        {/* Principal Sponsors Header */}
        <div className="flex flex-col items-center gap-2 mb-12">
            <div className="w-8 h-1 bg-zru-gold mb-2" />
            <span className="text-zru-gold text-[10px] font-black uppercase tracking-[0.4em]">Principal Sponsors</span>
        </div>

        {/* Principal Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {principalSponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <div className="relative h-48 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex items-center justify-center transition-all duration-700 group-hover:bg-white/10 group-hover:border-white/20">
                <div className="relative w-full h-full">
                  <Image 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-contain filter grayscale brightness-200 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
                  />
                </div>
                {/* Accent line */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-zru-gold origin-center rounded-b-2xl"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ticker for Partners */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-rich-black to-transparent z-20" />
          <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-rich-black to-transparent z-20" />
          
          <div className="flex flex-col items-center gap-2 mb-12">
            <div className="w-8 h-px bg-white/20 mb-2" />
            <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em]">Official Partners</span>
          </div>

          <div className="overflow-hidden py-10">
            <motion.div 
              animate={{ x: [0, -100 * partners.length * 10] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-24 whitespace-nowrap"
            >
              {[...partners, ...partners].map((partner, i) => (
                <div key={i} className="flex items-center gap-4 shrink-0">
                  <div className="w-16 h-16 relative">
                    <Image 
                      src={partner.logo || "/images/sponsors/nedbank.jpeg"} 
                      alt={partner.name} 
                      fill 
                      sizes="64px"
                      className="object-contain grayscale brightness-150 opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{partner.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}

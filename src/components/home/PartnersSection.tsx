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
    <section className="bg-milk-white py-24 relative overflow-hidden border-t border-b border-black/10">
      
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-zru-green/5 to-transparent pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <div className="max-w-xl space-y-3">
            <span className="label block mb-1">INSTITUTIONAL PARTNERSHIPS</span>
            <h2 className="heading-1 text-black">
              STRATEGIC <span className="text-zru-green">PARTNERS</span>
            </h2>
          </div>
          <div className="md:text-right space-y-4">
            <p className="body-base text-black/70 max-w-sm ml-auto">
              Fueling the engine of Zimbabwean rugby. We thank our corporate sponsors for their commitment to the game.
            </p>
            <Link href="/partners" className="inline-block group">
              <div className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-widest text-zru-green">
                <span className="pb-0.5 border-b border-zru-green/30 group-hover:border-zru-green transition-colors">Join the Partner Network</span>
                <Plus className="w-4 h-4 text-zru-green" />
              </div>
            </Link>
          </div>
        </div>

        {/* Principal Sponsors Header */}
        <div className="flex flex-col items-center gap-2 mb-12">
            <div className="w-8 h-1 bg-zru-green mb-2" />
            <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.4em]">Principal Sponsors</span>
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
              <div className="relative h-44 bg-white border border-black/10 hover:border-zru-green/60 shadow-md hover:shadow-xl rounded-2xl p-6 flex items-center justify-center transition-all duration-300">
                <div className="relative w-full h-full">
                  <Image 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-contain transition-all duration-500" 
                  />
                </div>
                {/* Accent line */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-zru-green origin-center rounded-b-2xl"
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

          <div className="overflow-hidden py-10 w-full">
            <motion.div 
              animate={{ x: [0, "-50%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-24 w-max"
            >
              {[...partners, ...partners, ...partners, ...partners].map((partner, i) => (
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

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function CampaignSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section ref={containerRef} className="bg-clubhouse-charcoal py-32 relative overflow-hidden grain-texture">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        
        {/* Left: Narrative */}
        <div className="flex-1 text-left z-20 w-full lg:w-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-12">
              The Heritage Drop
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[1.1] mb-8">
              SABLES <br /> <span className="text-clubhouse-gold/80 italic">HERITAGE</span> & PERFORMANCE
            </h2>
            <p className="text-sm md:text-lg text-white/50 mb-12 leading-[1.6] max-w-lg tracking-wide font-medium">
              A celebration of legacy and a commitment to the future. Our 2026 Heritage collection merges historic motifs with peak performance engineering.
            </p>
            <Link 
              href="/clubhouse/campaign"
              className="inline-flex items-center space-x-6 group"
            >
              <span className="text-xs font-black uppercase tracking-[0.3em] text-white group-hover:text-clubhouse-gold transition-colors">
                View the drop
              </span>
              <div className="w-20 h-[2px] bg-white/20 group-hover:bg-clubhouse-gold group-hover:w-32 transition-all duration-700 ease-in-out" />
            </Link>
          </motion.div>
        </div>

        {/* Right: Immersive Imagery with Parallax */}
        <div className="flex-[1.2] relative w-full aspect-4/5 lg:aspect-auto lg:h-[800px]">
          <motion.div 
            style={{ y: y1 }}
            className="relative w-full h-full bg-white/5 overflow-hidden shadow-3xl rounded-sm shine-glass"
          >
            {/* Main Campaign Image */}
            <div 
              className="absolute inset-0 bg-[url('/images/shop/campaign-hero.png')] bg-cover bg-center grayscale-[0.4] opacity-70 group-hover:grayscale-0 transition-all duration-1000" 
            />
            
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-clubhouse-charcoal/20 to-clubhouse-charcoal/60" />

            {/* Floating Detail Image (Stage 2 Parallax) */}
            <motion.div 
              style={{ y: y2 }}
              className="absolute top-1/4 -right-10 w-3/5 aspect-square bg-clubhouse-charcoal border border-white/5 shadow-2x-strong z-30 overflow-hidden rounded-xs"
            >
              <div 
                className="absolute inset-0 bg-[url('/images/shop/fabric-detail.png')] bg-cover bg-center grayscale-[0.2] opacity-90 group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-clubhouse-green/30 mix-blend-multiply" />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-black to-transparent">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-clubhouse-gold">Fabric Detail // MK-1</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* Large Background Text with slow parallax */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -400]) }}
        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 text-[25vw] font-black text-white/3 uppercase tracking-tighter whitespace-nowrap pointer-events-none z-0 italic"
      >
        CAMPAIGN
      </motion.div>
    </section>
  );
}

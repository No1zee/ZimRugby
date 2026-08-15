"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

export default function CampaignSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? containerRef : undefined,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section ref={containerRef} className="bg-clubhouse-charcoal py-32 relative overflow-hidden grain-texture">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        
        {/* Left: Narrative */}
        <div className="flex-1 text-left z-20 w-full lg:w-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-zru-green mb-12">
              The Heritage Drop
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[1.1] mb-8">
              SABLES <br /> <span className="text-zru-green/80 italic">HERITAGE</span> & PERFORMANCE
            </h2>
            <p className="text-sm md:text-lg text-white/50 mb-12 leading-[1.6] max-w-lg tracking-wide font-normal">
              A celebration of legacy and a commitment to the future. Our 2026 Heritage collection merges historic motifs with peak performance engineering.
            </p>
            <Link 
              href="/clubhouse/campaign"
              className="inline-flex items-center space-x-6 group"
            >
              <span className="text-xs font-black uppercase tracking-[0.3em] text-white group-hover:text-zru-green transition-colors duration-300">
                Explore Lookbook
              </span>
              <span className="w-12 h-[1px] bg-white/30 group-hover:bg-zru-green group-hover:w-16 transition-all duration-300" />
            </Link>
          </motion.div>
        </div>

        {/* Right: Asymmetric Product Collage */}
        <div className="flex-1 w-full lg:w-auto flex justify-center relative">
          {/* Large main image */}
          <motion.div 
            style={{ y: y1 }}
            className="w-4/5 aspect-[3/4] overflow-hidden grayscale contrast-[1.1] brightness-90 border border-white/5"
          >
            <img 
              src="https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop" 
              alt="Sables Heritage Jersey Fit" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
          
          {/* Overlapping secondary card */}
          <motion.div 
            style={{ y: y2 }}
            className="absolute right-0 bottom-[-10%] w-2/5 aspect-[3/4] overflow-hidden border border-white/10 shadow-2xl hidden sm:block"
          >
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop" 
              alt="Sables Gold Embroidery detail" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}

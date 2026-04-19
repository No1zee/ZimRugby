"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const collections = [
  {
    title: "Matchday Essentials",
    description: "Elite performance gear for the elite player.",
    image: "/images/clubhouse/coll-1.png",
    href: "/clubhouse/kits",
    color: "from-clubhouse-green/80",
  },
  {
    title: "Off-Field Lifestyle",
    description: "Refined aesthetics for the modern clubhouse life.",
    image: "/images/clubhouse/coll-2.png",
    href: "/clubhouse/lifestyle",
    color: "from-clubhouse-charcoal/80",
  },
  {
    title: "Women's Game",
    description: "Empowering performance, tailored with precision.",
    image: "/images/clubhouse/coll-3.png",
    href: "/clubhouse/women",
    color: "from-clubhouse-copper/80",
  },
  {
    title: "Junior & Academy",
    description: "Nurturing the future of Zimbabwean excellence.",
    image: "/images/clubhouse/coll-4.png",
    href: "/clubhouse/junior",
    color: "from-clubhouse-gold/80",
  },
];

export default function CollectionsStrip() {
  return (
    <section className="bg-clubhouse-charcoal py-20 px-6 md:px-12 grain-texture">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((collection, idx) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
            >
              <Link 
                href={collection.href}
                className="group relative block aspect-4/5 overflow-hidden bg-white/5 shadow-2xl"
              >
                {/* Image with Directorial Wipe Reveal */}
                <motion.div 
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  whileInView={{ clipPath: "inset(0 0 0 0)" }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 1.2, 
                    delay: idx * 0.15, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="absolute inset-0 z-0"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="w-full h-full bg-cover bg-center grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0"
                    style={{ backgroundImage: `url(${collection.image})` }}
                  />
                </motion.div>

                {/* Glassmorphism Shine Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-clubhouse-charcoal via-clubhouse-charcoal/40 to-transparent opacity-80 z-10" />
                <div className={`absolute inset-0 bg-linear-to-t ${collection.color} to-transparent opacity-20 group-hover:opacity-40 transition-opacity z-10`} />
                
                {/* Content: Staggered Entrance */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                  <motion.h3 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx * 0.15) + 0.4, duration: 0.6 }}
                    className="text-2xl font-black uppercase tracking-tight text-white mb-2 leading-tight"
                  >
                    {collection.title}
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx * 0.15) + 0.5, duration: 0.6 }}
                    className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[80%]"
                  >
                    {collection.description}
                  </motion.p>
                  
                  <div className="mt-8 flex items-center space-x-3 text-[9px] font-black uppercase tracking-[0.4em] text-clubhouse-gold overflow-hidden">
                    <span className="transform group-hover:translate-x-1 transition-transform">Shop Collection</span>
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (idx * 0.15) + 0.7, duration: 0.8 }}
                      className="w-8 h-px bg-clubhouse-gold origin-left" 
                    />
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-white/5 transition-all duration-500 group-hover:w-full group-hover:h-full group-hover:border-clubhouse-gold/20" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

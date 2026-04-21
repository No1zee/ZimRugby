"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function StorySection() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        
        {/* Supporting Image */}
        <div className="flex-1 order-2 md:order-1 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-4/5 bg-gray-100 relative grayscale hover:grayscale-0 transition-all duration-1000 group overflow-hidden"
          >
            <Image 
              src="/images/shop/story-main.png" 
              alt="Clubhouse Heritage" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-clubhouse-charcoal opacity-10 group-hover:opacity-0 transition-opacity" />
            
            {/* Overlay Info */}
            <div className="absolute bottom-10 left-10 z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Provenance // Zimbabwe</span>
            </div>
          </motion.div>
        </div>

        {/* Story Copy */}
        <div className="flex-1 order-1 md:order-2">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-8">
              The Manifesto
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-clubhouse-charcoal mb-10 leading-[1.1]">
              ELITE RUGBY <br /> MEETS STREET STYLE
            </h2>
            <div className="space-y-6 text-sm md:text-base text-clubhouse-charcoal/70 leading-relaxed font-medium">
              <p>
                Founded in Harare, The Clubhouse is an independent label bridging the gap between professional-grade rugby engineering and contemporary African street style.
              </p>
              <p>
                We believe that the discipline of the pitch should reflect in the precision of the garment. Every stitch in our Clubhouse collection is tested for elite performance while maintaining a silhouette that belongs in the metropolitan landscape.
              </p>
            </div>
            
            <div className="mt-12">
              <Link 
                href="/about"
                className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-clubhouse-charcoal border-b-2 border-clubhouse-charcoal pb-1 hover:text-clubhouse-gold hover:border-clubhouse-gold transition-colors"
              >
                Read our story
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

export default function PartnersSection() {
  return (
    <section className="py-24 bg-rich-black relative border-t border-white/5 overflow-hidden">
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-zru-orange/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-center mb-16"
        >
          <h2 className="text-zru-orange font-heading text-lg tracking-[0.2em] mb-3">
            MADE POSSIBLE BY
          </h2>
          <h3 className="text-3xl md:text-4xl font-heading text-white">
            OUR PARTNERS
          </h3>
        </motion.div>

        {/* Principal Sponsors */}
        <div className="mb-16">
          <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Principal Partner</p>
          <div className="flex justify-center">
            <motion.div 
               whileHover={{ scale: 1.05 }}
               className="w-64 h-32 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 hover:border-zru-orange/30 hover:bg-white/10 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer shadow-lg"
            >
              <div className="text-2xl font-heading text-white/40">NEDBANK</div>
            </motion.div>
          </div>
        </div>

        {/* Official Partners */}
        <div className="mb-16">
            <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Official Partners</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[1, 2, 3, 4].map((i) => (
                <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="w-40 h-24 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 hover:border-white/20 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer"
                >
                <div className="text-xl font-heading text-white/30">PARTNER {i}</div>
                </motion.div>
            ))}
            </div>
        </div>

        {/* Suppliers */}
        <div>
            <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Official Suppliers</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[1, 2, 3].map((i) => (
                <motion.div
                key={i}
                whileHover={{ y: -3 }}
                className="w-32 h-16 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 hover:border-white/20 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer"
                >
                <div className="text-sm font-heading text-white/20">SUPPLIER {i}</div>
                </motion.div>
            ))}
            </div>
        </div>

        <div className="mt-20 text-center">
            <a href="#" className="text-zru-orange text-sm font-bold tracking-widest hover:text-white transition-colors border-b border-zru-orange pb-1 hover:border-white">
                BECOME A PARTNER
            </a>
        </div>
      </div>
    </section>
  );
}

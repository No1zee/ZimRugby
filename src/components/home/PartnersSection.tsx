"use client";

import { motion } from "framer-motion";

export default function PartnersSection() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-zru-orange font-heading text-xl tracking-[0.2em] mb-16">
          OUR PARTNERS
        </h2>

        {/* Principal Partner */}
        <div className="mb-16">
            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-6">Principal Partner</p>
            <div className="flex justify-center">
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-48 h-24 bg-gray-100 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
                >
                    <span className="text-gray-400 font-heading text-2xl">NEDBANK</span>
                </motion.div>
            </div>
        </div>

        {/* Official Partners */}
        <div className="mb-16">
            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-6">Official Partners</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="w-32 h-16 bg-gray-100 rounded md:w-40 md:h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
                    >
                        <span className="text-gray-300 font-heading text-lg">PARTNER {i}</span>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Suppliers */}
        <div>
            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-6">Official Suppliers</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -3 }}
                        className="w-24 h-12 bg-gray-50 rounded flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
                    >
                        <span className="text-gray-300 font-heading text-xs">SUPPLIER {i}</span>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}

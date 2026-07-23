"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Sables Elite Match Jersey",
    category: "Matchday Elite",
    price: "$145",
    badge: "Official Match Spec",
    image: "/images/shop/1.png",
    colorClasses: ["bg-[#006747]", "bg-[#D4AF37]", "bg-[#FFFFFF]"],
  },
  {
    id: 2,
    name: "Heritage Clubhouse Polo",
    category: "Lifestyle / Heritage",
    price: "$95",
    badge: "Limited Drop",
    image: "/images/shop/2.png",
    colorClasses: ["bg-[#FDFBF0]", "bg-[#006747]"],
  },
  {
    id: 3,
    name: "Performance Training Vest",
    category: "High Intensity",
    price: "$75",
    badge: "Pro Tech Mesh",
    image: "/images/shop/3.png",
    colorClasses: ["bg-[#1A1A1A]", "bg-[#006747]"],
  },
  {
    id: 4,
    name: "Elite Team Duffel",
    category: "Travel & Gear",
    price: "$210",
    badge: "Cordura Spec",
    image: "/images/shop/1.png",
    colorClasses: ["bg-[#006747]", "bg-[#1A1A1A]"],
  },
];

export default function ProductCarousel() {
  return (
    <section id="drop-section" className="py-24 bg-[#131313] relative overflow-hidden border-t border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#84d7af] mb-2">
              THE CURRENT DROP
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tight text-white"
              style={{ fontFamily: "var(--font-montserrat, 'Montserrat'), sans-serif" }}
            >
              LATEST ARRIVALS
            </h2>
          </motion.div>

          <a
            href="/clubhouse/all"
            className="hidden sm:flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#84d7af] hover:text-white transition-colors"
          >
            <span>VIEW ALL ITEMS</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod, idx) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FDFBF0] rounded-xl p-5 flex flex-col justify-between group shadow-xl hover:shadow-2xl border border-black/10 hover:border-[#006747]/60 transition-all duration-300 relative overflow-hidden"
            >
              {/* Badge & Favorite Button */}
              <div className="flex justify-between items-start z-10 relative">
                <span className="bg-[#006747] text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded">
                  {prod.badge}
                </span>
                <button className="w-8 h-8 rounded-full bg-black/5 hover:bg-[#006747]/10 flex items-center justify-center text-[#1A1A1A] transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Product Image Stage */}
              <div className="my-6 h-56 relative flex items-center justify-center">
                {/* Subtle Dot Grid Background */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#006747 1px, transparent 1px)",
                    backgroundSize: "12px 12px",
                  }}
                />
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl"
                />
              </div>

              {/* Product Meta & Actions */}
              <div className="pt-4 border-t border-black/10 z-10 relative">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#006747]">
                    {prod.category}
                  </span>
                  <span className="text-lg font-black text-[#1A1A1A]">{prod.price}</span>
                </div>

                <h3
                  className="text-lg font-extrabold text-[#1A1A1A] uppercase tracking-tight mb-3 line-clamp-1"
                  style={{ fontFamily: "var(--font-montserrat, 'Montserrat'), sans-serif" }}
                >
                  {prod.name}
                </h3>

                {/* Color Variants & Add Button */}
                <div className="flex items-center justify-between gap-2 mt-4">
                  <div className="flex gap-1.5">
                    {prod.colorClasses.map((cls, i) => (
                      <span key={i} className={`w-3.5 h-3.5 rounded-full ${cls} border border-black/20`} />
                    ))}
                  </div>
                  <button className="clip-slanted bg-[#006747] hover:bg-[#00452A] text-white font-extrabold text-[11px] uppercase tracking-wider px-4 py-2.5 transition-colors flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

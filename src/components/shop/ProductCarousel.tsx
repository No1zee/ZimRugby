"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Sables Elite Match Jersey",
    category: "Matchday",
    price: "$145",
    badge: "Heritage",
    image: "/images/shop/jersey-home.png",
    colorClasses: ["bg-[#004d2e]", "bg-[#D4AF37]", "bg-[#FFFFFF]"],
  },
  {
    id: 2,
    name: "Heritage Clubhouse Polo",
    category: "Lifestyle",
    price: "$95",
    badge: "Limited",
    image: "/images/shop/polo-heritage.png",
    colorClasses: ["bg-[#F5F5DC]", "bg-[#004d2e]"],
  },
  {
    id: 3,
    name: "Performance Training Vest",
    category: "Training",
    price: "$75",
    image: "/images/shop/vest-performance.png",
    colorClasses: ["bg-[#1A1A1A]", "bg-[#D4AF37]"],
  },
  {
    id: 4,
    name: "Elite Team Duffel",
    category: "Accessories",
    price: "$210",
    badge: "Premium",
    image: "/images/shop/bag-duffel.png",
    colorClasses: ["bg-[#004d2e]", "bg-[#3D2B1F]"],
  },
];

export default function ProductCarousel() {
  return (
    <section className="bg-white py-32 overflow-hidden grain-texture">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Header: Directorial Rhythm */}
        <div className="flex justify-between items-end mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[10px] font-black uppercase tracking-[0.5em] text-clubhouse-gold mb-4"
            >
              The Current Drop
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-clubhouse-charcoal leading-none"
            >
              NEW ATELIER <br /> ARRIVALS
            </motion.h2>
          </motion.div>
          
          <button className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-clubhouse-charcoal border-b-2 border-clubhouse-charcoal pb-1 hover:text-clubhouse-gold hover:border-clubhouse-gold transition-colors">
            View All Series
          </button>
        </div>

        {/* Product Grid: Directorial Entrance */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1, 
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="group cursor-pointer"
            >
              {/* Product Image Container with Shine & Wipe */}
              <div className="relative aspect-3/4 bg-gray-50 overflow-hidden mb-8 shine-glass border border-gray-100/50">
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-clubhouse-charcoal text-[9px] font-bold uppercase tracking-widest text-white">
                    {product.badge}
                  </div>
                )}
                
                {/* The Wipe Reveal */}
                <motion.div 
                  initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
                  whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 1.2, 
                    delay: (idx * 0.1) + 0.3, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="absolute inset-0 z-10"
                >
                  <motion.div 
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full h-full bg-cover bg-center grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                </motion.div>
                
                {/* Fabric Detail Mock // Overlay on Hover */}
                <div className="absolute inset-0 bg-clubhouse-charcoal/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 backdrop-blur-[2px]">
                   <span className="text-[9px] font-bold text-clubhouse-gold uppercase tracking-[0.4em] border border-clubhouse-gold/30 px-4 py-2">Fabric Detail</span>
                </div>

                {/* Directorial Actions */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16, 1, 0.3, 1] z-30">
                  <div className="flex gap-2">
                    <button className="flex-1 bg-clubhouse-charcoal text-white text-[9px] font-bold uppercase tracking-widest py-3.5 flex items-center justify-center space-x-2 hover:bg-clubhouse-gold transition-colors shadow-2xl">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Quick Add</span>
                    </button>
                    <button className="p-3.5 bg-white text-clubhouse-charcoal hover:bg-clubhouse-gold group/heart transition-colors shadow-2xl" aria-label="Add to Wishlist">
                      <Heart className="w-4 h-4 group-hover/heart:fill-clubhouse-charcoal" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info: Staggered Reveal */}
              <div className="space-y-3 overflow-hidden">
                <div className="flex justify-between items-start">
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (idx * 0.1) + 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-clubhouse-charcoal/30"
                  >
                    {product.category}
                  </motion.span>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (idx * 0.1) + 0.7 }}
                    className="flex space-x-1.5"
                  >
                    {product.colorClasses.map(colorClass => (
                        <div 
                          key={colorClass} 
                          className={`w-2.5 h-2.5 rounded-full border border-black/10 ${colorClass}`} 
                        />
                    ))}
                  </motion.div>
                </div>
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (idx * 0.1) + 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base font-bold text-clubhouse-charcoal uppercase tracking-tight leading-tight"
                >
                  {product.name}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (idx * 0.1) + 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm font-bold text-clubhouse-gold"
                >
                  {product.price}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

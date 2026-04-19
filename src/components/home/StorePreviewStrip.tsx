"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import React, { useRef } from "react";
import MagneticElement from "../ui/MagneticElement";

/**
 * StorePreviewStrip
 * 
 * An elite, cinematic 'strip' for the main ZimRugby homepage.
 * It serves as a portal to the Clubhouse experience.
 */

const previewItems = [
  { name: "Elite Home Jersey", price: "$110", category: "Matchday", image: "/images/shop/jersey-home.png", badge: "New Arrival" },
  { name: "Clubhouse Oxford", price: "$85", category: "Lifestyle", image: "/images/shop/polo-heritage.png", badge: "Classic" },
  { name: "Weekender bag", price: "$180", category: "Accessories", image: "/images/shop/bag-duffel.png", badge: "Limited Drop" },
  { name: "Tech Training Top", price: "$95", category: "Training", image: "/images/shop/vest-performance.png" },
];

const ProductCard = ({ item, idx }: { item: typeof previewItems[0], idx: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  
  const shineOpacity = useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.3]);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ["-100%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex-none w-[260px] md:w-[320px] snap-start group perspective-1000"
    >
      <Link href="/clubhouse" className="cursor-none">
        <motion.div 
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative aspect-3/4 bg-neutral-100 overflow-hidden mb-6 rounded-2xl shadow-2xl shadow-black/10 transition-shadow duration-500 group-hover:shadow-black/20"
        >
          {/* Badge */}
          {item.badge && (
            <div className="absolute top-4 left-4 z-30 bg-white text-rich-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              {item.badge}
            </div>
          )}

          {/* Buy Button Overlay */}
          <div className="absolute inset-x-4 bottom-4 z-30 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <button className="w-full bg-rich-black text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
              Buy Now
            </button>
          </div>

          {/* Specular Highlight */}
          <motion.div 
            className="absolute inset-0 z-20 pointer-events-none bg-linear-to-b from-white/40 to-transparent blur-2xl"
            style={{ opacity: shineOpacity, y: shineY, rotate: "45deg", scale: 2 }}
          />

          <motion.div 
            initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
            whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: idx * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-10"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full h-full"
              style={{ transform: "translateZ(30px)" }}
            >
              <Image 
                src={item.image} 
                alt={item.name} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
              />
            </motion.div>
          </motion.div>
          
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20" />
        </motion.div>
        
        <div className="space-y-2 px-1 text-center md:text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-clubhouse-gold/60">
            {item.category}
          </span>
          <h3 className="text-base font-black uppercase tracking-tighter text-clubhouse-charcoal">
            {item.name}
          </h3>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <p className="text-sm font-black text-rich-black">
              {item.price}
            </p>
            <div className="w-1 h-1 bg-neutral-300 rounded-full" />
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-2 h-2 bg-zru-gold rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function StorePreviewStrip() {
  return (
    <section className="bg-white py-32 border-y border-transparent overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col lg:flex-row items-start lg:items-center gap-20">
        
        {/* Label and CTA */}
        <div className="lg:w-1/3 z-10">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="block text-[10px] font-black uppercase tracking-[0.5em] text-clubhouse-gold mb-6"
          >
            The Drop • Season 02
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-clubhouse-charcoal mb-8 leading-[0.9]"
          >
            THE <br /><span className="text-clubhouse-gold">CLUBHOUSE</span>
          </motion.h2>
          <MagneticElement intensity={0.3}>
            <Link 
              href="/clubhouse"
              className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-white bg-clubhouse-charcoal px-8 py-4 rounded-full group cursor-none"
            >
              Shop the Drop <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </MagneticElement>
        </div>

        {/* The Strip */}
        <div className="lg:w-2/3 w-full relative">
          <div className="flex space-x-12 overflow-x-auto py-10 no-scrollbar snap-x">
            {previewItems.map((item, idx) => (
              <ProductCard key={item.name} item={item} idx={idx} />
            ))}
          </div>

          {/* Faded edges */}
          <div className="absolute right-0 top-0 h-full w-32 bg-linear-to-l from-white via-white/50 to-transparent pointer-events-none hidden lg:block z-30" />
        </div>

      </div>
    </section>
  );
}

"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import MagneticElement from "../ui/MagneticElement";
import SlantedButton from "../ui/SlantedButton";

/**
 * StorePreviewStrip
 * 
 * Reimagined as an 'Exclusive Private Gallery'.
 * Focuses on high-end luxury constraints, restricted access cues, and premium typography.
 */


const previewItems = [
  { 
    name: "Elite Sables Home", 
    price: "$110", 
    category: "Matchday Elite", 
    image: "/images/shop/jersey-home.png", 
    badge: "Official Matchday",
    color: "bg-zru-green/5",
    description: "Matchday jersey worn for Africa Cup 2026 campaign."
  },
  { 
    name: "Oxford Heritage Polo", 
    price: "$85", 
    category: "Lifestyle / Heritage", 
    image: "/images/shop/polo-heritage.png", 
    badge: "Official Crest",
    color: "bg-zru-green/5",
    description: "Post-match premium cotton blend. Classic fit."
  },
  { 
    name: "V-Series Duffel", 
    price: "$180", 
    category: "Technical Carry", 
    image: "/images/shop/bag-duffel.png", 
    badge: "Pathway Support",
    color: "bg-zru-green/5",
    description: "Premium water-resistant duffel bag designed for official ZRU travel."
  },
  { 
    name: "Performance Vest", 
    price: "$95", 
    category: "High Intensity", 
    image: "/images/shop/vest-performance.png",
    badge: "Sables XV",
    color: "bg-zru-green/5",
    description: "Engineered for elite conditioning and dynamic drills."
  },
];

const ProductCard = ({ item, idx }: { item: typeof previewItems[0], idx: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  const shineOpacity = useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.2]);
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ["-50%", "50%"]);

  const boundsRef = useRef<DOMRect | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(() => {
      if (ref.current) boundsRef.current = ref.current.getBoundingClientRect();
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (ref.current) boundsRef.current = ref.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const bounds = boundsRef.current;
    if (!bounds) return;
    
    const width = bounds.width;
    const height = bounds.height;
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;
    
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex-none w-[280px] md:w-[340px] snap-start group perspective-2000"
    >
      <Link href="/clubhouse" className="block relative h-full">
        <div className="card-dark p-4 md:p-5 flex flex-col justify-between h-[450px] md:h-[500px] select-none hover:border-zru-green/30 transition-all duration-300">
          
          {/* 3D Product Image Slot */}
          <motion.div 
            ref={ref}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`relative h-48 md:h-64 bg-[#14201c] rounded-xl overflow-hidden shadow-xs transition-all duration-700 ease-out border border-white/5 flex items-center justify-center`}
          >
            {/* Badge: Minimalist Designer Label */}
            {item.badge && (
              <div className="absolute top-4 left-4 z-30 border border-white/10 bg-neutral-900/90 text-white text-[8px] font-black uppercase tracking-[0.3em] px-2.5 py-1">
                {item.badge}
              </div>
            )}

            {/* Icon Portal */}
            <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-10px] group-hover:translate-y-0">
               <div className="bg-neutral-900/90 p-2 rounded-full border border-white/10 shadow-lg">
                 <ShoppingBag className="w-3.5 h-3.5 text-white" />
               </div>
            </div>

            {/* Content Layer with 'Float' */}
            <motion.div 
              className="absolute inset-0 z-10 p-6 flex items-center justify-center"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={220}
                    height={220}
                    sizes="(max-width: 768px) 50vw, 220px"
                    className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform duration-1000 ease-out"
                    priority={idx === 0}
                  />
              </div>
            </motion.div>

            {/* Specular Highlight */}
            <motion.div 
              className="absolute inset-0 z-20 pointer-events-none bg-linear-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 mix-blend-overlay"
              style={{ opacity: shineOpacity, x: shineX, scale: 2 }}
            />
          </motion.div>
          
          {/* Card Meta Content */}
          <div className="flex-grow flex flex-col justify-between mt-4 space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/48 block">
                {item.category}
              </span>
              <h3 className="text-base md:text-lg font-semibold tracking-[-0.01em] text-white line-clamp-1">
                {item.name}
              </h3>
              <p className="text-xs md:text-sm leading-relaxed text-white/72 line-clamp-2">
                {item.description}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="text-base font-black text-zru-green">
                <span className="text-[10px] mr-1 align-top opacity-60">USD</span>{item.price.replace('$', '')}
              </div>
              <div className="flex items-center justify-between border-t border-white/8 pt-3 mt-1">
                <span className="text-[10px] font-black uppercase text-white/95 tracking-[0.14em] flex items-center gap-1">
                  Shop Now
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-white/60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
};

export default function StorePreviewStrip() {
  return (
    <section className="bg-white py-12 md:py-16 relative overflow-hidden bg-pattern-dots">
      {/* Background Aesthetic Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] md:text-[20vw] font-black text-rich-black/5 uppercase leading-none pointer-events-none select-none tracking-tighter mix-blend-multiply opacity-50 whitespace-nowrap">
        EST 1895
      </div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Section Header: Minimalist Institutional Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-px bg-zru-green" />
              <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.4em] font-subheading">Official Merchandise</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-heading text-rich-black font-black uppercase tracking-tighter leading-none"
            >
              THE <span className="text-stroke-charcoal text-transparent">CLUBHOUSE</span>
            </motion.h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-[10px] text-black/40 font-black uppercase tracking-[0.2em] max-w-[200px] text-left md:text-right">
                Official Zimbabwe Rugby Collection. <br />Wear the pride. Every purchase fuels the pathway.
            </p>
            <MagneticElement intensity={0.2}>
              <SlantedButton href="/clubhouse" variant="primary" size="md">
                Shop Collection <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </SlantedButton>
            </MagneticElement>
          </div>
        </div>

        {/* The Gallery Rail */}
        <div className="relative">
          <div className="flex space-x-8 md:space-x-16 overflow-x-auto pb-12 pt-4 no-scrollbar snap-x">
            {previewItems.map((item, idx) => (
              <ProductCard key={item.name} item={item} idx={idx} />
            ))}
            {/* End Spacer */}
            <div className="flex-none w-px h-full" />
          </div>

          {/* Magnetic Scroll Indicators (Subtle) */}
          <div className="absolute -bottom-4 left-0 w-full flex justify-center gap-2">
            {previewItems.map((_, i) => (
                <div key={i} className="w-8 h-px bg-neutral-200 transition-colors duration-300 hover:bg-zru-green cursor-pointer" />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

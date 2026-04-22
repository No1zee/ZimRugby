"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Lock, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import MagneticElement from "../ui/MagneticElement";

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
    badge: "Tier-1 Exclusive",
    color: "bg-zru-green/5",
    description: "Matchday jersey worn for Africa Cup 2026 campaign."
  },
  { 
    name: "Oxford Heritage Polo", 
    price: "$85", 
    category: "Lifestyle / Gold", 
    image: "/images/shop/polo-heritage.png", 
    badge: "Archival Release",
    color: "bg-zru-gold/5",
    description: "Post-match premium cotton blend. Classic fit."
  },
  { 
    name: "V-Series Duffel", 
    price: "$180", 
    category: "Technical Carry", 
    image: "/images/shop/bag-duffel.png", 
    badge: "Bespoke Carry",
    color: "bg-neutral-100",
    description: "Water-resistant institutional travel companion."
  },
  { 
    name: "Performance Vest", 
    price: "$95", 
    category: "High Intensity", 
    image: "/images/shop/vest-performance.png",
    badge: "Members Only",
    color: "bg-zru-red/5",
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex-none w-[280px] md:w-[360px] snap-start group perspective-2000"
    >
      <Link href="/clubhouse" className="block relative">
        <motion.div 
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`relative aspect-3/4 ${item.color} overflow-hidden mb-8 shadow-sm group-hover:shadow-3xl transition-all duration-700 ease-out border border-black/5 group-hover:border-zru-gold/30`}
        >
          {/* Badge: Minimalist Designer Label */}
          {item.badge && (
            <div className="absolute top-6 left-6 z-30 border border-black/10 bg-white/80 backdrop-blur-md text-rich-black text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] text-shadow-hero-glow">
              {item.badge}
            </div>
          )}

          {/* Icon Portal */}
          <div className="absolute top-6 right-6 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-10px] group-hover:translate-y-0">
             <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
               <Lock className="w-3.5 h-3.5 text-rich-black" />
             </div>
          </div>

          {/* Content Layer with 'Float' */}
          <motion.div 
            className="absolute inset-0 z-10 p-12 flex items-center justify-center"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
                <Image 
                src={item.image} 
                alt={item.name} 
                width={300}
                height={400}
                sizes="(max-width: 768px) 50vw, 300px"
                quality={60}
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:scale-110 transition-transform duration-1000 ease-out"
                priority={idx === 0}
                />
            </div>
          </motion.div>

          {/* Specular Highlight */}
          <motion.div 
            className="absolute inset-0 z-20 pointer-events-none bg-linear-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 mix-blend-overlay"
            style={{ opacity: shineOpacity, x: shineX, scale: 2 }}
          />
          
        </motion.div>
        
        {/* Designer Credits Typography */}
        <div className="space-y-3 px-1 border-l-2 border-black/5 pl-4 group-hover:border-zru-gold transition-colors duration-500">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">
                {item.category}
            </span>
            <span className="text-[8px] font-black uppercase text-zru-red tracking-[0.2em] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="w-1.5 h-1.5 rounded-full bg-zru-red animate-pulse" /> Live
            </span>
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-clubhouse-charcoal leading-none mb-2">
              {item.name}
            </h3>
            <p className="text-[10px] text-black/60 font-medium leading-relaxed mb-4 min-h-[30px]">
              {item.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-black/5">
            <span className="text-[10px] font-black uppercase text-zru-gold tracking-[0.3em] flex items-center gap-2">
              Secure Allocation <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-sm font-black text-black/70 bg-black/5 px-2 py-0.5 rounded shadow-xs">
                <span className="text-[9px] mr-1 align-top opacity-60">USD</span>{item.price.replace('$', '')}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function StorePreviewStrip() {
  return (
    <section className="bg-white py-24 relative overflow-hidden bg-pattern-dots">
      {/* Background Aesthetic Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] md:text-[20vw] font-black text-neutral-50 uppercase leading-none pointer-events-none select-none tracking-tighter mix-blend-multiply opacity-50 whitespace-nowrap">
        RESTRICTED
      </div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Section Header: Minimalist Institutional Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-zru-red/10 border border-zru-red/30">
                <div className="w-1.5 h-1.5 rounded-full bg-zru-red animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zru-red/80">Tier-1 Access Only</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-clubhouse-charcoal leading-[1.1]"
            >
              THE <br /><span className="text-stroke-charcoal text-transparent drop-shadow-sm">CLUBHOUSE</span>
            </motion.h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-[10px] text-black/40 font-black uppercase tracking-[0.2em] max-w-[200px] text-left md:text-right">
                Strictly limited allocations. <br />Reserved for the inner circle.
            </p>
            <MagneticElement intensity={0.2}>
                <Link 
                href="/clubhouse"
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white bg-rich-black px-8 py-4 rounded-full group transition-all hover:scale-105 hover:bg-zru-gold hover:text-black hover:shadow-lg hover:shadow-zru-gold/20 relative overflow-hidden"
                >
                <span className="relative z-10 flex items-center gap-3">Request Access <Lock className="w-3.5 h-3.5 group-hover:hidden" /><ArrowRight className="w-3.5 h-3.5 hidden group-hover:block transition-transform" /></span>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out z-0" />
                </Link>
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
                <div key={i} className="w-8 h-px bg-neutral-200 transition-colors duration-300 hover:bg-zru-gold cursor-pointer" />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

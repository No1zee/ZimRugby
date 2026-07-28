"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Store } from "lucide-react";

const SHOP_PRODUCTS = [
  {
    id: "jersey",
    cutout: "/images/shop/1.png",
  },
  {
    id: "polo",
    cutout: "/images/shop/2.png",
  },
  {
    id: "duffel",
    cutout: "/images/shop/3.png",
  },
];

export default function ShopCardShowcase() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inViewRef = React.useRef(false);
  const hiddenRef = React.useRef(false);

  React.useEffect(() => {
    const el = wrapperRef.current;
    const observer = el
      ? new IntersectionObserver(([entry]) => {
          inViewRef.current = entry.isIntersecting;
        }, { threshold: 0 })
      : null;
    if (el && observer) observer.observe(el);

    function handleVisibility() {
      hiddenRef.current = document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  React.useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (inViewRef.current && !hiddenRef.current) {
        setActiveIndex((prev) => (prev + 1) % SHOP_PRODUCTS.length);
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const currentProduct = SHOP_PRODUCTS[activeIndex];

  return (
    <div ref={wrapperRef}>
    <Link
      href="/fan-zone"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white rounded-lg overflow-hidden group h-[320px] md:h-full flex flex-col"
    >
      {/* Product Cutout — anchored to bottom (shop button) */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <Image
          key={currentProduct.id}
          src={currentProduct.cutout}
          alt="Official ZRU merchandise"
          fill
          className="object-contain object-bottom scale-[1.72] -translate-y-[32%] drop-shadow-[0_-8px_30px_rgba(0,0,0,0.25)] group-hover:brightness-110 transition-[filter] duration-500 ease-out opacity-40"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>

      {/* Gradient Overlay — subtle bottom for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-primary/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
        {/* Top: badge */}
        <div className="flex items-center gap-1.5 self-start">
          <Store className="w-3.5 h-3.5 text-white" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white">
            Official Store
          </span>
        </div>

        {/* Bottom */}
        <div className="space-y-2">
          <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider leading-relaxed">
            Join the Fan Zone for exclusive merch access and 10% off
          </p>
          <div className="w-full bg-white/10 border border-white/20 text-white py-3 font-extrabold text-[11px] uppercase not-italic flex justify-center items-center gap-2 group-hover:bg-white group-hover:text-green-primary transition-[background-color,color] duration-300">
            Join the Fan Zone <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
    </div>
  );
}

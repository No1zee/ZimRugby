"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

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
    <div ref={wrapperRef} className="h-full w-full">
    <Link
      href="/shop"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white group h-full w-full flex flex-col"
    >
      {/* Product Cutout — anchored to bottom */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <Image
          key={currentProduct.id}
          src={currentProduct.cutout}
          alt="Shop merchandise"
          fill
          className="object-contain object-bottom scale-[1.65] -translate-y-[25%] drop-shadow-xl group-hover:scale-[1.75] transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>

      {/* Subtle radial glow to highlight the product instead of a dark gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,107,63,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Product Dots */}
      <div className="absolute top-4 left-4 flex gap-1.5 z-10">
        {SHOP_PRODUCTS.map((prod, idx) => (
          <button
            key={prod.id}
            onClick={(e) => { e.preventDefault(); setActiveIndex(idx); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIndex ? "bg-zru-green scale-110" : "bg-black/10 hover:bg-black/20"
            }`}
          />
        ))}
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <span className="relative inline-flex group/shopbtn w-full">
          <span className="absolute inset-0 z-0 clip-slanted bg-black/10 translate-x-[4px] translate-y-[4px] transition-transform duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[6px] group-active:translate-x-[2px] group-active:translate-y-[2px]" aria-hidden="true" />
          <div className="relative z-10 w-full clip-slanted bg-zru-green text-white py-2.5 font-black text-[10px] uppercase tracking-widest flex justify-center items-center gap-2 group-hover:bg-rich-black transition-all duration-200 group-hover:-translate-y-px group-active:translate-x-[2px] group-active:translate-y-[2px] shadow-sm">
            Shop Collection <ShoppingBag size={14} />
          </div>
        </span>
      </div>
    </Link>
    </div>
  );
}

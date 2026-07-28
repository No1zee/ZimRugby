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
    <div ref={wrapperRef}>
    <Link
      href="/shop"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white rounded-lg overflow-hidden group h-[320px] md:h-full flex flex-col"
    >
      {/* Product Cutout — anchored to bottom (shop button) */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <Image
          key={currentProduct.id}
          src={currentProduct.cutout}
          alt="Shop merchandise"
          fill
          className="object-contain object-bottom scale-[1.72] -translate-y-[32%] drop-shadow-[0_-8px_30px_rgba(0,0,0,0.25)] group-hover:scale-[1.82] transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>

      {/* Gradient Overlay — subtle bottom for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-primary/40 via-transparent to-transparent" />

      {/* Product Dots */}
      <div className="absolute top-4 left-4 flex gap-1 z-10">
        {SHOP_PRODUCTS.map((prod, idx) => (
          <button
            key={prod.id}
            onClick={(e) => { e.preventDefault(); setActiveIndex(idx); }}
            className={`w-2 h-2 rounded-full transition-colors duration-300 cursor-pointer ${
              idx === activeIndex ? "bg-accent-teal" : "bg-white/50"
            }`}
          />
        ))}
      </div>
      {/* Bottom Button */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 font-extrabold text-[11px] uppercase italic flex justify-center items-center gap-2 group-hover:bg-white group-hover:text-green-primary transition-all">
          Shop Collection <ShoppingBag size={16} />
        </div>
      </div>
    </Link>
    </div>
  );
}

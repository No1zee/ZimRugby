"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const SHOP_PRODUCTS = [
  {
    id: "jersey",
    name: "SABLES 2026 HOME JERSEY",
    category: "AUTHENTIC MATCH KIT",
    price: "$65",
    image: "/images/shop/1.png",
    badge: "NEW 2026/27",
    tagline: "Pro-Vent Tech Mesh",
  },
  {
    id: "polo",
    name: "HERITAGE RUGBY POLO",
    category: "LEGACY COLLECTION",
    price: "$45",
    image: "/images/shop/2.png",
    badge: "POPULAR",
    tagline: "Heavyweight Cotton",
  },
  {
    id: "duffel",
    name: "PRO TEAM DUFFEL BAG",
    category: "TRAVEL & GEAR",
    price: "$55",
    image: "/images/shop/3.png",
    badge: "ESSENTIAL",
    tagline: "Water-Resistant Cordura",
  },
];

const unison: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontWeight: 900,
  textTransform: "uppercase" as const,
};

const labelCaps: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "12px",
  lineHeight: "1.0",
  letterSpacing: "0.1em",
  fontWeight: 700,
};

const h3Style: React.CSSProperties = {
  ...unison,
  fontSize: "24px",
  lineHeight: "1.2",
  letterSpacing: "-0.02em",
};

export default function ShopCardShowcase() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOP_PRODUCTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const currentProduct = SHOP_PRODUCTS[activeIndex];

  return (
    <Link
      href="/clubhouse"
      className="w-[82vw] xs:w-[320px] lg:w-auto shrink-0 snap-start box-border flex flex-col h-[460px] lg:h-[480px] xl:h-[500px] rounded-xl overflow-hidden border border-black/[0.06] hover:border-[#006747]/30 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 group/card relative bg-white hover:-translate-y-1"
    >
      {/* Slanted Header Badge */}
      <div className="flex justify-between items-center bg-gradient-to-b from-[#00704D] to-[#005238] text-white shrink-0 relative z-20" style={{ padding: "14px 20px" }}>
        <div style={labelCaps}>
          <span className="tracking-widest uppercase text-white font-extrabold text-[11px]">OFFICIAL SHOP</span>
        </div>
        <span className="text-[9px] font-extrabold tracking-widest uppercase bg-black/20 text-white px-2 py-0.5 rounded border border-white/20">
          {currentProduct.badge}
        </span>
      </div>

      {/* Atmospheric Background Grid & Lighting */}
      <div className="relative flex-grow flex flex-col justify-between p-5 text-rich-black overflow-hidden z-10 bg-[#FDFBF7]">
        
        {/* Subtle Dots Pattern Graphic */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(0,103,71,0.25) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Interactive Product Selector Tabs */}
        <div className="relative z-20 flex gap-1.5 justify-center mb-2">
          {SHOP_PRODUCTS.map((prod, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={prod.id}
                onClick={(e) => { e.preventDefault(); setActiveIndex(idx); }}
                className={`text-[9px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#00704D] text-white shadow-md shadow-[#00704D]/30 scale-105"
                    : "bg-black/5 text-rich-black/70 hover:bg-black/10 hover:text-rich-black border border-black/5"
                }`}
              >
                {prod.id === "jersey" ? "KIT" : prod.id === "polo" ? "POLO" : "BAG"}
              </button>
            );
          })}
        </div>

        {/* Product Showcase */}
        <div className="relative z-10 flex-grow flex flex-col justify-center items-center my-2 min-h-[210px] group/item">
          
          {/* Floating Product Image Container */}
          <div className="relative w-full h-48 flex items-center justify-center">
            
            {/* Soft Ambient Shadow below product */}
            <div className="absolute bottom-1 w-32 h-4 bg-black/15 rounded-[100%] blur-md group-hover/card:scale-110 transition-transform duration-500" />

            {/* Product PNG */}
            <div className="relative w-44 h-44 transition-all duration-500 ease-out transform group-hover/card:-translate-y-2 group-hover/card:scale-105">
              <Image
                key={currentProduct.id}
                src={currentProduct.image}
                alt={currentProduct.name}
                fill
                className="object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-opacity duration-300"
                sizes="176px"
                priority
              />
            </div>

            {/* Floating Price Pill */}
            <div className="absolute top-1 right-2 bg-[#00704D] text-white px-3 py-1 rounded-full shadow-md border border-[#005238] flex items-center gap-1 font-black text-xs tracking-tight">
              <span>{currentProduct.price}</span>
            </div>

            {/* Floating Material Tag */}
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-[#00704D] text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border border-black/10 uppercase shadow-xs">
              {currentProduct.tagline}
            </div>

          </div>

        </div>

        {/* Product Title & Call To Action */}
        <div className="relative z-20 flex flex-col mt-2 pt-3 border-t border-black/10">
          
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-[9px] font-bold text-[#00704D] uppercase tracking-widest block mb-0.5">
                {currentProduct.category}
              </span>
              <h3
                style={{ ...h3Style, fontSize: "16px", lineHeight: "1.2" }}
                className="text-rich-black font-black tracking-tight line-clamp-1"
              >
                {currentProduct.name}
              </h3>
            </div>
          </div>

          <div
            className="w-full bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#006747] hover:to-[#00402B] text-white font-extrabold flex items-center justify-center gap-2 rounded-lg transition-all duration-300 shadow-md shadow-[#00704D]/20 group/btn py-3 text-xs tracking-widest uppercase border-t border-white/20"
            style={unison}
          >
            <span>SHOP COLLECTION</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </div>
          
        </div>

      </div>
    </Link>
  );
}

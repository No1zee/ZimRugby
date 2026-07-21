"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function GearUpStoreSection() {
  return (
    <section className="py-12 md:py-16 bg-[#ECEAE0] text-rich-black border-t border-black/5">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-5 max-w-lg">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight uppercase leading-tight mb-4 font-heading text-rich-black">
              GEAR UP.<br />REPRESENT.<br />WEAR IT WITH PRIDE.
            </h2>
            <p className="text-sm text-rich-black/70 font-body leading-relaxed mb-6">
              The official 2026 match kits and fan apparel collection are now available for worldwide shipping. Support the Sables in style.
            </p>
            <Link
              href="/fan-zone"
              className="inline-block px-7 py-3 bg-[#004D2C] hover:bg-zru-green text-white font-extrabold text-xs tracking-widest uppercase rounded-full shadow-sm transition-all"
            >
              SHOP NOW
            </Link>
          </div>

          {/* Right Column: 2 Merch Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Merch Item 1: Sables Kit Jersey */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-black/5 shadow-xs flex flex-col items-center group">
              <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden mb-4">
                <Image
                  src="/images/hero/zru-6.webp"
                  alt="Official Sables Jersey"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-rich-black text-center">
                Official 2026 Sables Test Jersey
              </span>
            </div>

            {/* Merch Item 2: Sables Cap */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-black/5 shadow-xs flex flex-col items-center group">
              <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden mb-4">
                <Image
                  src="/images/hero/zru-7.webp"
                  alt="Official ZRU Green Cap"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-rich-black text-center">
                Official ZRU Green Supporter Cap
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function ShopTeaserBento() {
  return (
    <section className="px-6 lg:px-12 py-16">
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-gradient-to-br from-rich-black via-rich-black to-[#0a2a1a] border border-white/10 rounded-3xl overflow-hidden relative group/shop">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative z-10">
            {/* Content Side */}
            <div className="p-10 md:p-16 flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green mb-4">
                OFFICIAL SHOP
              </span>
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-6">
                GEAR UP FOR
                <br />
                <span className="text-zru-green">GLORY</span>
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-md mb-8 font-medium">
                Represent the Sables with the official 2026 replica kit and premium clubhouse collection.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/clubhouse"
                  className="inline-flex items-center gap-3 bg-zru-green hover:bg-zru-green/90 text-white px-8 py-4 text-xs font-black uppercase tracking-widest rounded-md shadow-sm transition-all [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]"
                >
                  <ShoppingBag className="w-4 h-4" /> SHOP NOW <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/tickets"
                  className="inline-flex items-center gap-3 border border-white/20 hover:border-zru-green/50 text-white px-8 py-4 text-xs font-black uppercase tracking-widest rounded-md transition-all"
                >
                  MATCH TICKETS
                </Link>
              </div>
            </div>

            {/* Visual Side */}
            <div className="relative min-h-[300px] md:min-h-full flex items-center justify-center p-8 md:p-12">
              <div className="relative w-full max-w-sm aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-zru-green/20 to-transparent rounded-3xl border border-white/10" />
                <div className="absolute inset-4 flex items-center justify-center">
                  <Image
                    src="/images/logos/zru-logo.svg"
                    alt="ZRU Kit"
                    width={200}
                    height={200}
                    className="object-contain opacity-80 group-hover/shop:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                    2026 SABLES REPLICA KIT • AVAILABLE NOW
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Ticket, ShoppingBag, Newspaper } from "lucide-react";

export default function UnifiedHubGrid() {
  const newsItems = [
    {
      id: "1",
      title: "SABLES PREPARE FOR NATIONS CUP CLASH",
      date: "15 MAY 2026",
      category: "SABLES",
      link: "/media",
    },
    {
      id: "2",
      title: "JUNIOR SABLES SQUAD ANNOUNCED FOR U20 TROPPHY",
      date: "14 MAY 2026",
      category: "JUNIOR SABLES",
      link: "/media",
    },
    {
      id: "3",
      title: "ZIMBABWE 7S CHEETAHS GEARING UP FOR AFRICA CUP",
      date: "12 MAY 2026",
      category: "7S CHEETAHS",
      link: "/media",
    },
  ];

  return (
    <section className="w-full bg-[#FDFBF0] py-12 lg:py-16 border-b border-gray-200/60">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 & 2: Dark Green News Hub (2 Columns Wide on Desktop) */}
          <div className="lg:col-span-2 bg-[#006747] text-white rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden group">
            {/* Subtle Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Newspaper className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading">
                    LATEST NEWS
                  </h3>
                </div>
                <Link
                  href="/media"
                  className="text-xs font-semibold tracking-wider text-emerald-300 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>VIEW ALL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* News Articles Stack */}
              <div className="space-y-5">
                {newsItems.map((item, idx) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className={`block group/item ${
                      idx < newsItems.length - 1 ? "border-b border-white/10 pb-4" : ""
                    }`}
                  >
                    <span className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase">
                      {item.category} • {item.date}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold font-heading group-hover/item:text-emerald-200 transition-colors leading-snug mt-1">
                      {item.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/70">
              <span>Official Union Bulletins</span>
              <span className="font-mono text-[11px] text-emerald-400">UPDATED DAILY</span>
            </div>
          </div>

          {/* Card 3: Tickets Feature Card */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#006747]/10 text-[#006747] rounded-full text-[11px] font-bold tracking-wider uppercase mb-6">
                <Ticket className="w-3.5 h-3.5" />
                <span>MATCH TICKETS</span>
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 font-heading leading-tight mb-3">
                BE PART OF THE ACTION.
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Secure your seat to witness the Sables live in action at National Sports Stadium.
              </p>
            </div>

            <Link
              href="/tickets"
              className="inline-flex items-center justify-center space-x-2 w-full py-3.5 px-5 bg-[#006747] hover:bg-[#005238] text-white font-bold text-xs tracking-widest uppercase rounded-lg transition-colors shadow-sm"
            >
              <span>BUY TICKETS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 4: Official Merchandise Card */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 text-amber-800 rounded-full text-[11px] font-bold tracking-wider uppercase mb-6">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                <span>OFFICIAL STORE</span>
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 font-heading leading-tight mb-3">
                GEAR UP. REPRESENT.
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Wear the green and yellow with pride. Official 2026 match replica kits now available.
              </p>
            </div>

            <Link
              href="/clubhouse"
              className="inline-flex items-center justify-center space-x-2 w-full py-3.5 px-5 bg-gray-900 hover:bg-black text-white font-bold text-xs tracking-widest uppercase rounded-lg transition-colors shadow-sm"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Ticket, ShoppingBag } from "lucide-react";

export default function SpecBentoGrid() {
  return (
    <section className="bg-rich-black w-full py-16 border-y border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:px-12 max-w-[1600px] mx-auto">
        
        {/* Column 1: LATEST NEWS */}
        <div className="bg-gradient-to-b from-white/10 via-[#003B28] to-[#00281B] border border-dashed border-white/20 rounded-2xl p-8 flex flex-col text-white shadow-xl shadow-black/20 relative overflow-hidden group/news">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">LATEST NEWS</h3>
            <Link href="/media" className="text-[10px] font-bold uppercase tracking-widest text-zru-green hover:text-white transition-colors">
              VIEW ALL &rarr;
            </Link>
          </div>
          
          <div className="space-y-6 flex-1 relative z-10">
            <article className="group cursor-pointer border-b border-white/10 pb-4">
              <h4 className="text-sm font-bold uppercase mb-1 group-hover:text-zru-green transition-colors">Sables Prepare For Africa Cup Defense</h4>
              <p className="text-[10px] text-white/60">OCTOBER 12, 2026</p>
            </article>
            <article className="group cursor-pointer border-b border-white/10 pb-4">
              <h4 className="text-sm font-bold uppercase mb-1 group-hover:text-zru-green transition-colors">U20 Barthes Trophy Squad Announced</h4>
              <p className="text-[10px] text-white/60">OCTOBER 8, 2026</p>
            </article>
            <article className="group cursor-pointer">
              <h4 className="text-sm font-bold uppercase mb-1 group-hover:text-zru-green transition-colors">New Grassroots Pathway Partnership</h4>
              <p className="text-[10px] text-white/60">OCTOBER 3, 2026</p>
            </article>
          </div>

          <Link
            href="/media"
            className="mt-8 bg-zru-green hover:bg-zru-green/90 text-white w-full py-3.5 flex items-center justify-center uppercase text-xs font-bold tracking-widest transition-all rounded-md shadow-sm relative z-10 [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]"
          >
            READ ALL NEWS &rarr;
          </Link>
        </div>

        {/* Column 2: UPCOMING FIXTURE */}
        <div className="bg-gradient-to-b from-white/10 via-[#00452A] to-[#002D1B] border border-dashed border-white/20 rounded-2xl p-8 flex flex-col text-white shadow-xl shadow-black/20 relative overflow-hidden group/fixture">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/80 mb-8 relative z-10">UPCOMING FIXTURE</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 relative bg-white/10 rounded-full p-2 flex items-center justify-center border border-white/20">
                <Image src="/images/logos/zru-logo.svg" alt="ZIM" width={36} height={36} className="object-contain" />
              </div>
              <span className="text-xs font-black text-zru-green">VS</span>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold border border-white/20">NAM</div>
            </div>
            
            <div className="text-center space-y-1.5 mb-8">
              <h4 className="text-lg font-black uppercase tracking-tight">ZIMBABWE SABLES <br/><span className="text-zru-green">vs</span> NAMIBIA</h4>
              <p className="text-[11px] text-white/70 font-medium tracking-wide">21 NOVEMBER 2026 • 15:00 CAT</p>
              <p className="text-[11px] text-white/70 font-medium tracking-wide">HARARE SPORTS CLUB</p>
            </div>
          </div>

          <Link 
            href="/match-centre"
            className="bg-zru-green hover:bg-zru-green/90 text-white w-full py-3.5 flex items-center justify-center uppercase text-xs font-bold tracking-widest transition-all mt-auto rounded-md shadow-sm relative z-10 [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]"
          >
            VIEW FIXTURE DETAILS &rarr;
          </Link>
        </div>

        {/* Column 3: TICKETS */}
        <div className="bg-white rounded-2xl p-8 flex flex-col text-black shadow-xl shadow-black/10 border border-gray-200 relative overflow-hidden">
          <div className="bg-zru-green text-white px-4 py-1.5 rounded-full w-fit text-[10px] font-bold uppercase tracking-widest mb-8">
            TICKETS
          </div>
          
          <div className="flex-1">
            <Ticket className="w-8 h-8 text-zru-green mb-6" />
            <h4 className="font-heading text-3xl uppercase leading-none mb-4 font-black">BE PART OF<br/>THE ACTION</h4>
            <p className="text-sm text-gray-600 font-medium">Secure your matchday seat and support the Sables on home soil.</p>
          </div>

          <Link 
            href="/tickets"
            className="bg-zru-green hover:bg-zru-green/90 text-white w-full py-3.5 flex items-center justify-center uppercase text-xs font-bold tracking-widest transition-all mt-8 rounded-md shadow-sm [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]"
          >
            BUY MATCH TICKETS &rarr;
          </Link>
        </div>

        {/* Column 4: OFFICIAL SHOP */}
        <div className="bg-white rounded-2xl p-8 flex flex-col text-black shadow-xl shadow-black/10 border border-gray-200 relative overflow-hidden">
          <div className="bg-zru-green text-white px-4 py-1.5 rounded-full w-fit text-[10px] font-bold uppercase tracking-widest mb-8">
            OFFICIAL SHOP
          </div>
          
          <div className="flex-1">
            <ShoppingBag className="w-8 h-8 text-zru-green mb-6" />
            <h4 className="font-bold text-sm uppercase mb-4 tracking-wide leading-relaxed">
              GEAR UP.<br/>REPRESENT.<br/>WEAR IT WITH PRIDE.
            </h4>
            <div className="w-full h-28 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200/60 p-4">
              <span className="text-xs font-black uppercase text-zru-green tracking-wider">2026 SABLES REPLICA KIT</span>
            </div>
          </div>

          <Link 
            href="/clubhouse"
            className="bg-zru-green hover:bg-zru-green/90 text-white w-full py-3.5 flex items-center justify-center uppercase text-xs font-bold tracking-widest transition-all mt-8 rounded-md shadow-sm [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]"
          >
            VISIT OFFICIAL STORE &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
}

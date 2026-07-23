import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function FixtureAndTicketsBlock() {
  return (
    <section className="py-20 bg-milk-white relative border-t border-b border-black/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="label block mb-2 font-heading">MATCHDAY TICKETING</span>
            <h2 className="heading-1 text-black font-heading">UPCOMING FIXTURES</h2>
          </div>
          <Link 
            href="/tickets" 
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-zru-green hover:text-black transition-colors"
          >
            VIEW ALL MATCHES & TICKETS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Card: Upcoming Fixture */}
          <div className="bg-[#EAE8DE] border border-black/5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <span className="inline-block px-3 py-1 bg-[#004D2C] text-white text-[11px] font-bold tracking-widest uppercase rounded-full mb-6">
                UPCOMING FIXTURE
              </span>

              {/* Matchup badges */}
              <div className="flex items-center justify-around py-4">
                
                {/* Team 1: Sables */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F6F5EF] border border-black/5 flex items-center justify-center p-3 shadow-xs mb-3 relative">
                    <Image
                      src="/images/logos/zru-logo.svg"
                      alt="Zimbabwe Sables"
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-rich-black">
                    SABLES
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-rich-black/50">
                    ZIM
                  </span>
                </div>

                {/* VS */}
                <span className="text-xs sm:text-sm font-bold tracking-widest text-rich-black/40 uppercase">
                  VS
                </span>

                {/* Team 2: Namibia */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F6F5EF] border border-black/5 flex items-center justify-center p-3 shadow-xs mb-3 relative">
                    <span className="text-lg font-black text-zru-green font-heading">
                      NAM
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-rich-black">
                    NAMIBIA
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-rich-black/50">
                    NAM
                  </span>
                </div>

              </div>
            </div>

            {/* Match Details & Link */}
            <div className="mt-8 pt-6 border-t border-black/10 flex items-center justify-between">
              <div>
                <span className="block text-xs font-extrabold uppercase tracking-widest text-rich-black">
                  HARARE SPORTS CLUB
                </span>
                <span className="block text-[11px] font-semibold text-rich-black/70 mt-0.5">
                  JUNE 18, 2026 • 15:30 CAT
                </span>
              </div>
              <Link 
                href="/match-centre" 
                className="text-xs font-bold tracking-widest uppercase text-rich-black hover:text-zru-green transition-colors flex items-center gap-1"
              >
                FULL DETAILS <span className="text-sm">→</span>
              </Link>
            </div>
          </div>

          {/* Right Card: Match Tickets */}
          <div className="bg-[#004D2C] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xs min-h-[320px]">
            {/* Watermark Ticket Icon */}
            <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
              <svg className="w-32 h-32 text-white fill-current" viewBox="0 0 24 24">
                <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-1.99 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.5 3h-7v-2h7v2zm0-4h-7V9h7v2z"/>
              </svg>
            </div>

            <div className="relative z-10 max-w-md my-auto">
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-wide uppercase mb-3 font-heading">
                MATCH TICKETS
              </h3>
              <p className="text-sm text-white/80 font-body leading-relaxed mb-6">
                Secure your place in the stands for the upcoming International Test Series. Limited VIP and general admission tickets available.
              </p>
              <Link
                href="/tickets"
                className="inline-block px-6 py-3 bg-white text-[#004D2C] hover:bg-milk-white font-extrabold text-xs tracking-widest uppercase rounded-full shadow-sm transition-all"
              >
                BUY TICKETS
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

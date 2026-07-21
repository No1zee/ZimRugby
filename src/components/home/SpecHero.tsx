"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SpecHero() {
  return (
    <section className="flex flex-col lg:flex-row min-h-[650px] w-full border-b border-gray-200">
      
      {/* Left Side (Green Box) */}
      <div className="w-full lg:w-1/2 bg-zru-green text-white p-12 lg:p-24 flex flex-col justify-center">
        <h1 className="font-heading text-6xl lg:text-[80px] leading-[0.85] uppercase mb-8 text-white">
          UNITED BY PASSION.<br />
          DRIVEN BY EXCELLENCE.
        </h1>
        <p className="font-body text-lg text-white/90 mb-12 max-w-md">
          The official home of Zimbabwe Rugby. One nation. One jersey. One ambition.
        </p>
        <Link 
          href="/about"
          className="bg-white text-black font-black uppercase tracking-[0.2em] text-xs px-8 py-4 flex items-center gap-4 hover:bg-gray-100 transition-colors w-fit"
        >
          ABOUT ZIMBABWE RUGBY
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Right Side (Watermark) */}
      <div className="w-full lg:w-1/2 bg-rich-black relative overflow-hidden flex items-center justify-center min-h-[400px]">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 p-12 lg:p-24 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <Image 
            src="/images/logos/zru-logo.svg" 
            alt="Zimbabwe Rugby Bird" 
            fill
            className="object-contain"
          />
        </div>
      </div>

    </section>
  );
}

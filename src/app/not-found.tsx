"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Calendar, Trophy, ArrowRight } from "lucide-react";

const links = [
  { label: "Home", href: "/", icon: Home },
  { label: "Fixtures & Results", href: "/match-centre", icon: Trophy },
  { label: "Events", href: "/events", icon: Calendar },
];

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-rich-black flex items-center justify-center overflow-hidden px-6">

      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zru-green/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-zru-green/5 rounded-full blur-[100px]" />
      </div>

      {/* Watermark ZRU crest */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative inline SVG watermark; next/image does not optimize SVGs */}
        <img
          src="/zru logo main.svg"
          alt=""
          aria-hidden="true"
          className="w-[600px] h-[600px] object-contain"
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">

        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block text-[160px] sm:text-[220px] font-black leading-none tracking-tighter text-white/5 select-none">
            404
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="-mt-8 sm:-mt-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 border border-zru-green/30 bg-zru-green/10 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-zru-green animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green">
              Page Not Found
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            INTO TOUCH
          </h1>
          <p className="text-white/50 font-medium text-lg max-w-md mx-auto leading-relaxed">
            That page has gone out of play. Let&apos;s get you back on the field.
          </p>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 border border-white/10 hover:border-zru-green/50 bg-white/5 hover:bg-zru-green/10 rounded-2xl px-6 py-4 transition-all duration-300 w-full sm:w-auto"
            >
              <Icon className="w-5 h-5 text-white/40 group-hover:text-zru-green transition-colors" />
              <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-wider">
                {label}
              </span>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-zru-green group-hover:translate-x-1 transition-all ml-auto" />
            </Link>
          ))}
        </motion.div>

      </div>
    </main>
  );
}

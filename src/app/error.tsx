"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting in future (Sentry, etc.)
    console.error("ZRU App Error:", error);
  }, [error]);

  return (
    <main className="relative min-h-screen bg-rich-black flex items-center justify-center overflow-hidden px-6">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zru-green/6 rounded-full blur-[100px] pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.025]">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative inline SVG watermark; next/image does not optimize SVGs */}
        <img src="/zru logo main.svg" alt="" aria-hidden="true" className="w-[500px] object-contain" />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto space-y-8">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 border border-red-500/30 bg-red-500/10 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
              Something went wrong
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-white leading-none">
            KNOCK<br />ON
          </h1>

          <p className="text-white/50 font-medium text-base leading-relaxed">
            We hit an unexpected error. Our team has been notified. Try refreshing — if the problem persists, come back later.
          </p>

          {/* Error digest for support */}
          {error.digest && (
            <p className="text-[10px] font-mono text-white/20">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => reset()}
            className="group flex items-center gap-3 bg-zru-green hover:bg-zru-green/80 text-white rounded-full px-8 py-4 font-black text-sm uppercase tracking-widest transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 border border-white/10 hover:border-zru-green/40 bg-white/5 hover:bg-white/8 text-white/70 hover:text-white rounded-full px-8 py-4 font-black text-sm uppercase tracking-widest transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </motion.div>

      </div>
    </main>
  );
}

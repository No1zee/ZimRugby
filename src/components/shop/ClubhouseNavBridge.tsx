import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

/**
 * ClubhouseNavBridge
 * QA-001 fix — Persistent top bar that anchors Clubhouse pages to the main ZRU site.
 * Renders above the Clubhouse hero so users always have a clear escape hatch.
 */
export default function ClubhouseNavBridge() {
  return (
    <div className="w-full bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
        {/* Back link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] font-heading">
            Back to ZimRugby
          </span>
        </Link>

        {/* ZRU wordmark — confirms site context */}
        <Link href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
          <div className="relative w-5 h-5">
            <Image
              src="/images/logos/zru-emblem.png"
              alt="Zimbabwe Rugby Union"
              fill
              className="object-contain"
              sizes="20px"
            />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/80 font-heading hidden sm:block">
            Zimbabwe Rugby Union
          </span>
        </Link>

        {/* Shop label */}
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 font-heading">
          Official Shop
        </span>
      </div>
    </div>
  );
}

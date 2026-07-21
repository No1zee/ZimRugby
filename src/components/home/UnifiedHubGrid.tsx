"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════
   UnifiedHubGrid — Exact Stitch Design Token Implementation
   
   Stitch tokens applied:
   - header-slanted clip-path: polygon(0 0, 100% 0, 100% 100%, 16px 100%, 0 calc(100% - 16px))
   - text-unison: Montserrat 900 uppercase
   - label-caps: 12px / 700 / 0.1em tracking
   - h2: 32px / 900 / -0.01em
   - h3: 24px / 900 / -0.02em
   - body-base: 16px / 500
   - grid-gap: 24px
   - section-padding-desktop: 80px
   - margin-safe: 32px
   - primary: #006747
   - background: #FDFBF0
   ═══════════════════════════════════════════════════════════════════ */

/* Stitch token constants */
const STITCH = {
  primary: "#006747",
  bg: "#FDFBF0",
  slantedClip: "polygon(0 0, 100% 0, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
  badgeClip: "polygon(0 0, 100% 0, calc(100% - 0px) 100%, 16px 100%, 0 calc(100% - 16px))",
} as const;

const unison: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 900,
  textTransform: "uppercase" as const,
};

const labelCaps: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "12px",
  lineHeight: "1.0",
  letterSpacing: "0.1em",
  fontWeight: 700,
};

const h2Style: React.CSSProperties = {
  ...unison,
  fontSize: "32px",
  lineHeight: "1.1",
  letterSpacing: "-0.01em",
};

const h3Style: React.CSSProperties = {
  ...unison,
  fontSize: "24px",
  lineHeight: "1.2",
  letterSpacing: "-0.02em",
};

const bodyBase: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "16px",
  lineHeight: "1.5",
  fontWeight: 500,
};

export default function UnifiedHubGrid() {
  return (
    <section
      className="w-full relative z-20"
      style={{ backgroundColor: STITCH.bg, paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto", paddingLeft: "32px", paddingRight: "32px" }}>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{ gap: "24px" }}
        >

          {/* ═══════════ CARD 1: LATEST NEWS ═══════════ */}
          <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            {/* Slanted Header */}
            <div
              className="flex justify-between items-center text-white"
              style={{
                ...labelCaps,
                backgroundColor: STITCH.primary,
                clipPath: STITCH.slantedClip,
                padding: "16px 24px",
              }}
            >
              <span>LATEST NEWS</span>
              <Link href="/media" className="hover:underline flex items-center gap-1">
                VIEW ALL
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
              </Link>
            </div>

            {/* Green Body */}
            <div
              className="flex flex-col flex-grow text-white"
              style={{ backgroundColor: STITCH.primary, padding: "20px" }}
            >
              {/* News Items Stack with Photography Thumbnails */}
              <div className="space-y-4 flex-grow">
                
                {/* ── 1. Featured Lead Article ── */}
                <Link href="/media" className="group block border-b border-white/20 pb-4">
                  <div className="flex gap-3 items-start">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-white/20 shadow-sm">
                      <Image
                        src="/images/teams/sables.jpg"
                        alt="Sables preparing for Nations Cup"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 bg-white/15 backdrop-blur-sm rounded text-[9px] font-bold tracking-widest text-emerald-300 uppercase mb-1">
                        SABLES
                      </span>
                      <h3
                        style={{ ...h3Style, fontSize: "14px", lineHeight: "1.25" }}
                        className="text-white group-hover:text-emerald-300 transition-colors line-clamp-2"
                      >
                        SABLES PREPARE FOR NATIONS CUP CLASH
                      </h3>
                      <p style={{ ...labelCaps, fontSize: "9px" }} className="text-white/60 mt-1">
                        15 MAY 2026
                      </p>
                    </div>
                  </div>
                </Link>

                {/* ── 2. Secondary Article ── */}
                <Link href="/media" className="group block border-b border-white/20 pb-4">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-13 h-13 rounded-md overflow-hidden shrink-0 border border-white/20 shadow-sm">
                      <Image
                        src="/images/teams/junior-sables.jpg"
                        alt="Junior Sables Squad"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="52px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        style={{ ...h3Style, fontSize: "13px", lineHeight: "1.25" }}
                        className="text-white group-hover:text-emerald-300 transition-colors line-clamp-2"
                      >
                        JUNIOR SABLES SQUAD ANNOUNCED
                      </h3>
                      <p style={{ ...labelCaps, fontSize: "9px" }} className="text-white/60 mt-0.5">
                        14 MAY 2026
                      </p>
                    </div>
                  </div>
                </Link>

                {/* ── 3. Tertiary Article ── */}
                <Link href="/media" className="group block">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-13 h-13 rounded-md overflow-hidden shrink-0 border border-white/20 shadow-sm">
                      <Image
                        src="/images/teams/cheetahs.jpg"
                        alt="Zimbabwe 7s Cheetahs"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="52px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        style={{ ...h3Style, fontSize: "13px", lineHeight: "1.25" }}
                        className="text-white group-hover:text-emerald-300 transition-colors line-clamp-2"
                      >
                        ZIMBABWE 7S GEARING UP FOR AFRICA CUP
                      </h3>
                      <p style={{ ...labelCaps, fontSize: "9px" }} className="text-white/60 mt-0.5">
                        12 MAY 2026
                      </p>
                    </div>
                  </div>
                </Link>

              </div>

              {/* Read More CTA */}
              <Link
                href="/media"
                className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity mt-5 pt-3 border-t border-white/10"
                style={labelCaps}
              >
                READ MORE
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* ═══════════ CARD 2: UPCOMING FIXTURE ═══════════ */}
          <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            {/* Slanted Header */}
            <div
              className="text-white"
              style={{
                ...labelCaps,
                backgroundColor: STITCH.primary,
                clipPath: STITCH.slantedClip,
                padding: "16px 24px",
              }}
            >
              <span>UPCOMING FIXTURE</span>
            </div>

            {/* Green Body */}
            <div
              className="flex flex-col flex-grow text-white"
              style={{ backgroundColor: STITCH.primary, padding: "24px" }}
            >
              {/* Teams VS */}
              <div className="flex items-center justify-between mb-8 mt-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-3xl" style={{ color: STITCH.primary }}>sports_rugby</span>
                  </div>
                  <span style={{ ...unison, fontSize: "14px" }} className="text-center text-white">
                    ZIMBABWE<br />SABLES
                  </span>
                </div>
                <div style={{ ...unison, fontSize: "24px" }} className="text-white/50">VS</div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-3 border border-white/20">
                    <span className="material-symbols-outlined text-white text-3xl">shield</span>
                  </div>
                  <span style={{ ...unison, fontSize: "14px" }} className="text-center text-white">
                    NAMIBIA
                  </span>
                </div>
              </div>

              {/* Match Info */}
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-center gap-3 text-white/90">
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>calendar_today</span>
                  <span style={{ ...bodyBase, fontSize: "14px", textTransform: "uppercase" }}>SAT, 24 MAY 2026</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>location_on</span>
                  <span style={{ ...bodyBase, fontSize: "14px", textTransform: "uppercase" }}>HARARE SPORTS CLUB</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>schedule</span>
                  <span style={{ ...bodyBase, fontSize: "14px", textTransform: "uppercase" }}>15:30 CAT</span>
                </div>
              </div>

              {/* View Fixture CTA */}
              <Link
                href="/match-centre"
                className="w-full bg-transparent border border-white text-white flex items-center justify-center gap-2 rounded-sm hover:bg-white transition-colors duration-300"
                style={{
                  ...labelCaps,
                  padding: "12px",
                  color: "white",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = STITCH.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "white"; }}
              >
                VIEW FIXTURE
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* ═══════════ CARD 3: TICKETS ═══════════ */}
          <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            {/* Green Badge Header (inline, self-start) */}
            <div
              className="inline-block self-start rounded-br-lg text-white"
              style={{
                ...labelCaps,
                backgroundColor: STITCH.primary,
                clipPath: STITCH.slantedClip,
                padding: "16px 24px",
              }}
            >
              <span>TICKETS</span>
            </div>

            {/* White Body */}
            <div className="p-6 flex flex-col flex-grow bg-white text-black">
              {/* Large Rotated Ticket Icon */}
              <div className="mb-12 mt-8 flex justify-center">
                <span
                  className="material-symbols-outlined text-gray-800"
                  style={{ fontSize: "80px", transform: "rotate(-15deg)" }}
                >
                  confirmation_number
                </span>
              </div>

              {/* Text + CTA */}
              <div className="flex-grow flex flex-col justify-end">
                <h3 style={h2Style} className="mb-4 text-black">
                  BE PART OF<br />THE ACTION
                </h3>
                <p style={{ ...bodyBase, fontSize: "14px" }} className="text-gray-600 mb-8">
                  Secure your seat and support the Sables.
                </p>
                <Link
                  href="/tickets"
                  className="w-full text-white flex items-center justify-center gap-2 rounded-sm hover:opacity-90 transition-opacity duration-300"
                  style={{
                    ...labelCaps,
                    backgroundColor: STITCH.primary,
                    padding: "12px",
                  }}
                >
                  BUY TICKETS
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ═══════════ CARD 4: OFFICIAL SHOP ═══════════ */}
          <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            {/* Green Badge Header (inline, self-start) */}
            <div
              className="inline-block self-start rounded-br-lg text-white"
              style={{
                ...labelCaps,
                backgroundColor: STITCH.primary,
                clipPath: STITCH.slantedClip,
                padding: "16px 24px",
              }}
            >
              <span>OFFICIAL SHOP</span>
            </div>

            {/* White Body */}
            <div className="p-6 flex flex-col flex-grow bg-white text-black">
              {/* Product Mockup */}
              <div className="flex justify-center items-center h-48 mb-8 relative mt-4">
                <div
                  className="w-32 h-40 rounded-lg shadow-md flex items-center justify-center relative"
                  style={{ backgroundColor: STITCH.primary }}
                >
                  <span className="material-symbols-outlined text-white text-4xl">apparel</span>
                </div>
                <div className="w-20 h-20 bg-black rounded-full shadow-lg absolute bottom-0 right-8 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">laundry</span>
                </div>
              </div>

              {/* Text + CTA */}
              <div className="flex-grow flex flex-col justify-end">
                <h3 style={{ ...h3Style, fontSize: "20px" }} className="mb-6 leading-tight text-black">
                  GEAR UP.<br />REPRESENT.<br />WEAR IT WITH PRIDE.
                </h3>
                <Link
                  href="/clubhouse"
                  className="w-full bg-black text-white flex items-center justify-center gap-2 rounded-sm hover:bg-gray-800 transition-colors duration-300"
                  style={{
                    ...labelCaps,
                    padding: "12px",
                  }}
                >
                  SHOP NOW
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

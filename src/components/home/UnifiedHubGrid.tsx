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
      className="w-full relative z-20 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-12"
      style={{ backgroundColor: STITCH.bg }}
    >
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-12">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#006747] block mb-1">
            ZIMRUGBY CENTRAL HUB
          </span>
          <h2 className="text-black text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight font-heading">
            MATCHDAY, MEDIA & MERCHANDISE
          </h2>
          <div className="w-12 h-1 bg-[#006747] mx-auto rounded-full mt-3" />
        </div>

        {/* 4-Column Quad-Pillar Hub Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 items-stretch">

          {/* ═══════════ CARD 1: LATEST NEWS (PRESSROOM) ═══════════ */}
          <div className="flex flex-col h-[460px] lg:h-[480px] xl:h-[500px] rounded-2xl overflow-hidden border border-black/10 hover:border-[#006747]/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group/news bg-gradient-to-b from-[#003822] via-[#002B19] to-[#001D11]">
            
            {/* Seamless Top Header */}
            <div className="flex items-center bg-gradient-to-b from-[#00704D] to-[#005238] text-white px-5 py-4 shrink-0 border-b border-emerald-500/20">
              <span className="tracking-widest uppercase text-white font-extrabold text-[11px]" style={labelCaps}>
                LATEST NEWS
              </span>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col justify-between flex-grow min-h-0 text-white relative overflow-hidden">
              {/* 100% Reliable Scrollable News Articles Stack */}
              <div className="relative z-10 space-y-3 flex-1 min-h-0 overflow-y-auto pr-2 news-scroll overscroll-contain">
                
                {/* Lead Story */}
                <Link href="/media" className="group/item block border-b border-emerald-800/40 pb-3">
                  <div className="flex gap-3 items-start">
                    <div className="relative w-18 h-18 rounded-lg overflow-hidden shrink-0 border border-emerald-600/30 shadow-sm">
                      <Image
                        src="/images/teams/sables.jpg"
                        alt="Sables preparing for Nations Cup"
                        fill
                        className="object-cover transition-transform duration-300 group-hover/item:scale-110"
                        sizes="72px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[8px] font-extrabold tracking-widest uppercase mb-1">
                        SABLES
                      </span>
                      <h3
                        style={{ ...h3Style, fontSize: "13px", lineHeight: "1.25" }}
                        className="text-white group-hover/item:text-emerald-300 transition-colors line-clamp-2"
                      >
                        SABLES PREPARE FOR NATIONS CUP CLASH
                      </h3>
                      <p className="text-[9px] font-bold text-white/50 mt-1">15 MAY 2026</p>
                    </div>
                  </div>
                </Link>

                {/* Article 2 */}
                <Link href="/media" className="group/item block border-b border-emerald-800/40 pb-3">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-emerald-600/30 shadow-sm">
                      <Image
                        src="/images/teams/junior-sables.jpg"
                        alt="Junior Sables Squad"
                        fill
                        className="object-cover transition-transform duration-300 group-hover/item:scale-110"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        style={{ ...h3Style, fontSize: "12px", lineHeight: "1.25" }}
                        className="text-white group-hover/item:text-emerald-300 transition-colors line-clamp-2"
                      >
                        JUNIOR SABLES SQUAD ANNOUNCED
                      </h3>
                      <p className="text-[9px] font-bold text-white/50 mt-0.5">14 MAY 2026</p>
                    </div>
                  </div>
                </Link>

                {/* Article 3 */}
                <Link href="/media" className="group/item block border-b border-emerald-800/40 pb-3">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-emerald-600/30 shadow-sm">
                      <Image
                        src="/images/teams/cheetahs.jpg"
                        alt="Zimbabwe 7s Cheetahs"
                        fill
                        className="object-cover transition-transform duration-300 group-hover/item:scale-110"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        style={{ ...h3Style, fontSize: "12px", lineHeight: "1.25" }}
                        className="text-white group-hover/item:text-emerald-300 transition-colors line-clamp-2"
                      >
                        ZIMBABWE 7S GEARING UP FOR AFRICA CUP
                      </h3>
                      <p className="text-[9px] font-bold text-white/50 mt-0.5">12 MAY 2026</p>
                    </div>
                  </div>
                </Link>

                {/* Article 4 */}
                <Link href="/media" className="group/item block border-b border-emerald-800/40 pb-3">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-emerald-600/30 shadow-sm">
                      <Image
                        src="/images/teams/lady-sables.jpg"
                        alt="Lady Sables Training Camp"
                        fill
                        className="object-cover transition-transform duration-300 group-hover/item:scale-110"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        style={{ ...h3Style, fontSize: "12px", lineHeight: "1.25" }}
                        className="text-white group-hover/item:text-emerald-300 transition-colors line-clamp-2"
                      >
                        LADY SABLES ANNOUNCE TRAINING CAMP
                      </h3>
                      <p className="text-[9px] font-bold text-white/50 mt-0.5">10 MAY 2026</p>
                    </div>
                  </div>
                </Link>

                {/* Article 5 */}
                <Link href="/media" className="group/item block">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-emerald-600/30 shadow-sm">
                      <Image
                        src="/images/teams/grassroots.jpg"
                        alt="Grassroots Rugby Development"
                        fill
                        className="object-cover transition-transform duration-300 group-hover/item:scale-110"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        style={{ ...h3Style, fontSize: "12px", lineHeight: "1.25" }}
                        className="text-white group-hover/item:text-emerald-300 transition-colors line-clamp-2"
                      >
                        GRASSROOTS RUGBY INITIATIVE EXPANDS
                      </h3>
                      <p className="text-[9px] font-bold text-white/50 mt-0.5">08 MAY 2026</p>
                    </div>
                  </div>
                </Link>

              </div>

              {/* Read More Footer */}
              <Link
                href="/media"
                className="relative z-10 w-full bg-white/10 hover:bg-white text-white hover:text-[#006747] font-extrabold flex items-center justify-center gap-2 rounded-lg py-2.5 transition-all duration-300 text-xs tracking-widest uppercase border border-white/20 mt-3"
                style={unison}
              >
                <span>EXPLORE ALL NEWS</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* ═══════════ CARD 2: UPCOMING FIXTURE (MATCH NIGHT) ═══════════ */}
          <div className="flex flex-col min-h-[460px] lg:min-h-[480px] xl:min-h-[520px] h-full rounded-2xl overflow-hidden border border-black/10 hover:border-[#006747]/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group/fixture bg-gradient-to-b from-[#00331F] via-[#002415] to-[#00160D]">
            
            {/* Seamless Top Header */}
            <div className="flex items-center bg-gradient-to-b from-[#00704D] to-[#005238] text-white px-5 py-4 shrink-0 border-b border-emerald-500/20">
              <span className="tracking-widest uppercase text-white font-extrabold text-[11px]" style={labelCaps}>
                NEXT MATCH
              </span>
            </div>

            {/* Stadium Match Body */}
            <div className="p-5 flex flex-col justify-between flex-grow text-white relative overflow-hidden">
              
              {/* Teams VS Section */}
              <div className="relative z-10 flex items-center justify-between my-2">
                
                {/* Zimbabwe Sables */}
                <div className="flex flex-col items-center group/team cursor-pointer">
                  <div className="relative w-15 h-15 bg-white rounded-full flex items-center justify-center p-2 mb-2 shadow-lg ring-2 ring-emerald-400/40 group-hover/team:scale-105 transition-transform">
                    <Image
                      src="/images/teams/zimbabwe.png"
                      alt="Zimbabwe Rugby Union"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <span style={{ ...unison, fontSize: "11px", lineHeight: "1.1" }} className="text-center text-white font-black">
                    ZIMBABWE<br />SABLES
                  </span>
                </div>

                {/* VS Badge */}
                <div className="flex flex-col items-center">
                  <div
                    style={{ ...unison, fontSize: "16px" }}
                    className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black shadow-inner mb-1"
                  >
                    VS
                  </div>
                  <span className="text-[8px] font-extrabold tracking-widest text-emerald-400 uppercase">
                    MATCHDAY 1
                  </span>
                </div>

                {/* Namibia Welwitschias */}
                <div className="flex flex-col items-center group/team cursor-pointer">
                  <div className="relative w-15 h-15 bg-white rounded-full flex items-center justify-center p-2 mb-2 shadow-lg ring-2 ring-white/20 group-hover/team:scale-105 transition-transform">
                    <Image
                      src="/images/teams/namibia.png"
                      alt="Namibia Welwitschias"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <span style={{ ...unison, fontSize: "11px", lineHeight: "1.1" }} className="text-center text-white font-black">
                    NAMIBIA<br />WELWITSCHIAS
                  </span>
                </div>

              </div>

              {/* Glassmorphic Match Details */}
              <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-xl p-3.5 border border-white/10 space-y-2 my-2">
                <div className="flex items-center gap-2 text-white/90">
                  <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: "16px" }}>
                    calendar_today
                  </span>
                  <span style={{ ...bodyBase, fontSize: "11px", fontWeight: 700 }} className="uppercase tracking-wider">
                    SAT, 24 MAY 2026
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: "16px" }}>
                    location_on
                  </span>
                  <span style={{ ...bodyBase, fontSize: "11px", fontWeight: 700 }} className="uppercase tracking-wider truncate">
                    HARARE SPORTS CLUB
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: "16px" }}>
                    schedule
                  </span>
                  <span style={{ ...bodyBase, fontSize: "11px", fontWeight: 700 }} className="uppercase tracking-wider">
                    15:30 CAT KICKOFF
                  </span>
                </div>
              </div>

              {/* View Match Centre CTA */}
              <Link
                href="/match-centre"
                className="relative z-10 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold flex items-center justify-center gap-2 rounded-lg py-3 transition-all duration-300 shadow-lg shadow-emerald-950/40 text-xs tracking-widest uppercase group/btn"
                style={unison}
              >
                <span>MATCH CENTRE</span>
                <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover/btn:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* ═══════════ CARD 3: MATCH TICKETS (TACTILE PASS) ═══════════ */}
          <div className="flex flex-col min-h-[460px] lg:min-h-[480px] xl:min-h-[520px] h-full rounded-2xl overflow-hidden border border-black/10 hover:border-[#006747]/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white text-black">
            
            {/* Seamless Top Header */}
            <div className="flex items-center bg-gradient-to-b from-[#00704D] to-[#005238] text-white px-5 py-4 shrink-0">
              <span className="tracking-widest uppercase text-white font-extrabold text-[11px]" style={labelCaps}>
                MATCH TICKETS
              </span>
            </div>

            {/* Ticket Card Body */}
            <div className="p-5 flex flex-col justify-between flex-grow bg-white text-black">
              
              {/* Physical Matchday Ticket Stub Graphic */}
              <div className="relative my-2 p-4 bg-gradient-to-b from-white via-[#F4FAF6] to-[#E9F5EE] rounded-xl border border-emerald-600/30 shadow-sm overflow-hidden">
                {/* Perforated Stub Line */}
                <div className="absolute top-0 bottom-0 right-14 border-r-2 border-dashed border-emerald-700/30" />
                
                <div className="pr-14">
                  <span className="inline-block px-2 py-0.5 bg-[#006747] text-white rounded text-[8px] font-black tracking-widest uppercase mb-1">
                    OFFICIAL PASS
                  </span>
                  <p style={{ ...unison, fontSize: "14px" }} className="text-gray-900 leading-tight">
                    SABLES VS NAMIBIA
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                    HARARE SPORTS CLUB
                  </p>
                </div>

                {/* Price Tag Stub */}
                <div className="absolute top-0 bottom-0 right-0 w-14 bg-[#006747] flex flex-col items-center justify-center text-white p-1">
                  <span className="material-symbols-outlined text-emerald-300 mb-1" style={{ fontSize: "18px" }}>
                    confirmation_number
                  </span>
                  <span className="text-[9px] font-black tracking-widest uppercase text-white">
                    FROM $5
                  </span>
                </div>
              </div>

              {/* Messaging & Call To Action */}
              <div className="flex flex-col justify-end mt-2 space-y-3">
                <div>
                  <h3 style={h3Style} className="text-gray-900 text-xl leading-tight mb-1">
                    BE PART OF THE ACTION
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Secure your physical or digital matchpass to support the Sables live at the stadium.
                  </p>
                </div>

                <Link
                  href="/tickets"
                  className="w-full bg-[#006747] hover:bg-[#004D2C] text-white font-extrabold flex items-center justify-center gap-2 rounded-lg py-3 transition-all duration-300 shadow-md text-xs tracking-widest uppercase group/btn"
                  style={unison}
                >
                  <span>SECURE SEATS</span>
                  <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover/btn:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>

            </div>
          </div>

          {/* ═══════════ CARD 4: OFFICIAL SHOP (IMMERSIVE 3D) ═══════════ */}
          <ShopCardShowcase unison={unison} labelCaps={labelCaps} h3Style={h3Style} bodyBase={bodyBase} />

        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ShopCardShowcase — Immersive Interactive Official Shop Card
   ═══════════════════════════════════════════════════════════════════ */
const SHOP_PRODUCTS = [
  {
    id: "jersey",
    name: "SABLES 2026 HOME JERSEY",
    category: "AUTHENTIC MATCH KIT",
    price: "$65",
    image: "/images/shop/jersey-home.png",
    badge: "NEW 2026/27",
    tagline: "Pro-Vent Tech Mesh",
  },
  {
    id: "polo",
    name: "HERITAGE RUGBY POLO",
    category: "LEGACY COLLECTION",
    price: "$45",
    image: "/images/shop/polo-heritage.png",
    badge: "POPULAR",
    tagline: "Heavyweight Cotton",
  },
  {
    id: "duffel",
    name: "PRO TEAM DUFFEL BAG",
    category: "TRAVEL & GEAR",
    price: "$55",
    image: "/images/shop/bag-duffel.png",
    badge: "ESSENTIAL",
    tagline: "Water-Resistant Cordura",
  },
];

interface ShopCardShowcaseProps {
  unison: React.CSSProperties;
  labelCaps: React.CSSProperties;
  h3Style: React.CSSProperties;
  bodyBase: React.CSSProperties;
}

function ShopCardShowcase({ unison, labelCaps, h3Style }: ShopCardShowcaseProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  // Auto-rotate every 4.5 seconds unless hovered
  React.useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOP_PRODUCTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const currentProduct = SHOP_PRODUCTS[activeIndex];

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden border border-black/10 hover:border-[#006747]/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group/card relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "linear-gradient(145deg, #002D1A 0%, #001F12 50%, #00120B 100%)",
      }}
    >
      {/* ── 1. Slanted Header Badge ── */}
      <div className="flex justify-between items-center bg-gradient-to-b from-[#00704D] to-[#005238] text-white shrink-0 relative z-20" style={{ padding: "14px 20px" }}>
        <div style={labelCaps}>
          <span className="tracking-widest uppercase text-white font-extrabold text-[11px]">OFFICIAL SHOP</span>
        </div>
        <span className="text-[9px] font-extrabold tracking-widest uppercase bg-black/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
          {currentProduct.badge}
        </span>
      </div>

      {/* ── 2. Atmospheric Background Grid & Lighting ── */}
      <div className="relative flex-grow flex flex-col justify-between p-5 text-white overflow-hidden z-10">
        
        {/* Stadium Floodlight Radial Glow behind jersey */}
        <div
          className="absolute top-12 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none transition-all duration-700 blur-3xl opacity-35"
          style={{
            background: activeIndex === 0 
              ? "radial-gradient(circle, #00C853 0%, rgba(0,200,83,0) 70%)" 
              : activeIndex === 1 
              ? "radial-gradient(circle, #10B981 0%, rgba(16,185,129,0) 70%)" 
              : "radial-gradient(circle, #059669 0%, rgba(5,150,105,0) 70%)",
          }}
        />

        {/* Subtle Diagonal Mesh Graphic */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* ── 3. Interactive Product Selector Tabs ── */}
        <div className="relative z-20 flex gap-1.5 justify-center mb-2">
          {SHOP_PRODUCTS.map((prod, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={prod.id}
                onClick={() => setActiveIndex(idx)}
                className={`text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20 scale-105"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {prod.id === "jersey" ? "KIT" : prod.id === "polo" ? "POLO" : "BAG"}
              </button>
            );
          })}
        </div>

        {/* ── 4. Immersive 3D Floating Product Showcase ── */}
        <div className="relative z-10 flex-grow flex flex-col justify-center items-center my-2 min-h-[210px] group/item">
          
          {/* Floating Product Image Container */}
          <div className="relative w-full h-48 flex items-center justify-center">
            
            {/* Soft Ambient Shadow below product */}
            <div className="absolute bottom-1 w-32 h-4 bg-black/60 rounded-[100%] blur-md group-hover/card:scale-110 transition-transform duration-500" />

            {/* Product PNG with Floating Motion */}
            <div className="relative w-44 h-44 transition-all duration-500 ease-out transform group-hover/card:-translate-y-2 group-hover/card:scale-105">
              <Image
                key={currentProduct.id}
                src={currentProduct.image}
                alt={currentProduct.name}
                fill
                className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] transition-opacity duration-300"
                sizes="176px"
                priority
              />
            </div>

            {/* Floating Price Pill */}
            <div className="absolute top-1 right-2 bg-emerald-500/90 text-black backdrop-blur-md px-2.5 py-1 rounded-full shadow-lg border border-emerald-300/40 flex items-center gap-1 font-black text-xs tracking-tight">
              <span>{currentProduct.price}</span>
            </div>

            {/* Floating Material Tag */}
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-emerald-300 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
              {currentProduct.tagline}
            </div>

          </div>

        </div>

        {/* ── 5. Product Title, Info & Call To Action ── */}
        <div className="relative z-20 flex flex-col mt-2 pt-3 border-t border-emerald-800/50">
          
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">
                {currentProduct.category}
              </span>
              <h3
                style={{ ...h3Style, fontSize: "16px", lineHeight: "1.2" }}
                className="text-white font-black tracking-tight line-clamp-1"
              >
                {currentProduct.name}
              </h3>
            </div>
          </div>

          <Link
            href="/clubhouse"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold flex items-center justify-center gap-2 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-950/50 group/btn py-3 text-xs tracking-widest uppercase"
            style={unison}
          >
            <span>SHOP COLLECTION</span>
            <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover/btn:translate-x-1">
              arrow_forward
            </span>
          </Link>
          
        </div>

      </div>
    </div>
  );
}


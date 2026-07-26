import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin, Clock, Ticket } from "lucide-react";
import MatchdayVideoHighlights from "@/components/media/MatchdayVideoHighlights";
import ShopCardShowcase from "@/components/home/ShopCardShowcase";

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
  fontFamily: "var(--font-heading)",
  fontWeight: 900,
  textTransform: "uppercase" as const,
};

const labelCaps: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
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
  fontFamily: "var(--font-body)",
  fontSize: "16px",
  lineHeight: "1.5",
  fontWeight: 400,
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
          <h2 className="text-black text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight font-heading">
            MATCHDAY, MEDIA & MERCHANDISE
          </h2>
          <div className="w-12 h-1 bg-[#006747] mx-auto rounded-full mt-3" />
        </div>

        {/* 4-Column Quad-Pillar Hub Grid (Horizontal Swipe Carousel on Mobile) */}
        <div className="flex flex-nowrap lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 lg:gap-6 items-stretch py-2">

          {/* ═══════════ CARD 1: LATEST NEWS (PRESSROOM) ═══════════ */}
          <Link href="/media" className="w-[82vw] xs:w-[320px] lg:w-auto shrink-0 snap-start box-border flex flex-col h-[460px] lg:h-[480px] xl:h-[500px] rounded-2xl overflow-hidden border border-black/[0.06] hover:border-[#006747]/30 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 group/news bg-gradient-to-b from-[#003822] via-[#002B19] to-[#001D11] hover:-translate-y-1">
            
            {/* Seamless Top Header */}
            <div className="flex items-center bg-gradient-to-b from-[#00704D] to-[#005238] text-white px-5 py-4 shrink-0 border-b border-emerald-500/20">
              <span className="tracking-widest uppercase text-white font-extrabold text-[11px]" style={labelCaps}>
                LATEST NEWS
              </span>
            </div>

            {/* Content Body */}
            <div className="p-3 sm:p-5 flex flex-col justify-between flex-grow min-h-0 text-white relative overflow-hidden">
              {/* 100% Reliable Scrollable News Articles Stack */}
              <div className="relative z-10 space-y-3 flex-1 min-h-0 overflow-y-auto pr-2 news-scroll overscroll-contain">
                
                {/* Lead Story */}
                <div className="group/item block border-b border-emerald-800/40 pb-3">
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
                        className="text-white group-hover/news:text-emerald-300 transition-colors line-clamp-2"
                      >
                        SABLES PREPARE FOR NATIONS CUP CLASH
                      </h3>
                      <p className="text-[9px] font-bold text-white/50 mt-1">15 MAY 2026</p>
                    </div>
                  </div>
                </div>

                {/* Article 2 */}
                <div className="group/item block border-b border-emerald-800/40 pb-3">
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
                        className="text-white group-hover/news:text-emerald-300 transition-colors line-clamp-2"
                      >
                        JUNIOR SABLES SQUAD ANNOUNCED
                      </h3>
                      <p className="text-[9px] font-bold text-white/50 mt-0.5">14 MAY 2026</p>
                    </div>
                  </div>
                </div>

                {/* Article 3 */}
                <div className="group/item block border-b border-emerald-800/40 pb-3">
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
                        className="text-white group-hover/news:text-emerald-300 transition-colors line-clamp-2"
                      >
                        ZIMBABWE 7S GEARING UP FOR AFRICA CUP
                      </h3>
                      <p className="text-[9px] font-bold text-white/50 mt-0.5">12 MAY 2026</p>
                    </div>
                  </div>
                </div>

                {/* Article 4 */}
                <div className="group/item block border-b border-emerald-800/40 pb-3">
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
                        className="text-white group-hover/news:text-emerald-300 transition-colors line-clamp-2"
                      >
                        LADY SABLES ANNOUNCE TRAINING CAMP
                      </h3>
                      <p className="text-[9px] font-bold text-white/50 mt-0.5">10 MAY 2026</p>
                    </div>
                  </div>
                </div>

                {/* Article 5 */}
                <div className="group/item block">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-emerald-600/30 shadow-sm">
                      <Image
                        src="/images/schools/schoolboy-team-group.jpg"
                        alt="Grassroots Rugby Development"
                        fill
                        className="object-cover transition-transform duration-300 group-hover/item:scale-110"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        style={{ ...h3Style, fontSize: "12px", lineHeight: "1.25" }}
                        className="text-white group-hover/news:text-emerald-300 transition-colors line-clamp-2"
                      >
                        GRASSROOTS RUGBY INITIATIVE EXPANDS
                      </h3>
                      <p className="text-[9px] font-bold text-white/50 mt-0.5">08 MAY 2026</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Read More Footer */}
              <div
                className="relative z-10 w-full bg-white/10 hover:bg-white text-white hover:text-[#006747] font-extrabold flex items-center justify-center gap-2 rounded-lg py-2.5 transition-all duration-300 text-xs tracking-widest uppercase border border-white/20 mt-3"
                style={unison}
              >
                <span>EXPLORE ALL NEWS</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>

          {/* ═══════════ CARD 2: UPCOMING FIXTURE (MATCH NIGHT) ═══════════ */}
          <Link href="/match-centre" className="w-[82vw] xs:w-[320px] lg:w-auto shrink-0 snap-start box-border flex flex-col h-[460px] lg:h-[480px] xl:h-[500px] rounded-2xl overflow-hidden border border-black/[0.06] hover:border-[#006747]/30 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 group/fixture bg-gradient-to-b from-[#00331F] via-[#002415] to-[#00160D] hover:-translate-y-1">
            
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
                <div className="flex flex-col items-center group/team">
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
                <div className="flex flex-col items-center group/team">
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
                  <Calendar size={16} className="text-emerald-400" />
                  <span style={{ ...bodyBase, fontSize: "11px", fontWeight: 700 }} className="uppercase tracking-wider">
                    SAT, 24 MAY 2026
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin size={16} className="text-emerald-400" />
                  <span style={{ ...bodyBase, fontSize: "11px", fontWeight: 700 }} className="uppercase tracking-wider truncate">
                    HARARE SPORTS CLUB
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Clock size={16} className="text-emerald-400" />
                  <span style={{ ...bodyBase, fontSize: "11px", fontWeight: 700 }} className="uppercase tracking-wider">
                    15:30 CAT KICKOFF
                  </span>
                </div>
              </div>

              {/* View Match Centre CTA */}
              <div
                className="relative z-10 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold flex items-center justify-center gap-2 rounded-lg py-3 transition-all duration-300 shadow-lg shadow-emerald-950/40 text-xs tracking-widest uppercase group/btn"
                style={unison}
              >
                <span>MATCH CENTRE</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* ═══════════ CARD 3: MATCH TICKETS (TACTILE PASS) ═══════════ */}
          <Link href="/tickets" className="w-[82vw] xs:w-[320px] lg:w-auto shrink-0 snap-start box-border flex flex-col h-[460px] lg:h-[480px] xl:h-[500px] rounded-2xl overflow-hidden border border-black/[0.06] hover:border-[#006747]/30 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 bg-white text-black hover:-translate-y-1">
            
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
                  <Ticket size={18} className="text-emerald-300 mb-1" />
                  <span className="text-[9px] font-black tracking-widest uppercase text-white">
                    FROM $5
                  </span>
                </div>
              </div>

              {/* Messaging */}
              <div className="flex flex-col justify-end mt-2 space-y-3">
                <div>
                  <h3 style={h3Style} className="text-gray-900 text-xl leading-tight mb-1">
                    BE PART OF THE ACTION
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Secure your physical or digital matchpass to support the Sables live at the stadium.
                  </p>
                </div>

                <div
                  className="w-full bg-[#006747] hover:bg-[#004D2C] text-white font-extrabold flex items-center justify-center gap-2 rounded-lg py-3 transition-all duration-300 shadow-md text-xs tracking-widest uppercase group/btn"
                  style={unison}
                >
                  <span>SECURE SEATS</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </div>
              </div>

            </div>
          </Link>

          {/* ═══════════ CARD 4: OFFICIAL SHOP (IMMERSIVE 3D) ═══════════ */}
          <ShopCardShowcase />

        </div>

        {/* ── 5. Integrated Matchday Video Highlights Section ── */}
        <div className="mt-12 pt-10 border-t border-black/10">
          <MatchdayVideoHighlights
            title="NATIONS CUP"
            subtitle="MATCH HIGHLIGHTS"
            showChannelLink={true}
          />
        </div>

      </div>
    </section>
  );
}


import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Newspaper, Calendar, MapPin, Clock } from "lucide-react";
import ShopCardShowcase from "@/components/home/ShopCardShowcase";
import type { Report } from "@/lib/data-fetcher";
import type { MatchCardViewModel } from "@/lib/match-centre/types";

interface Props {
  news?: Report[];
  nextMatch?: MatchCardViewModel | null;
  customTitle?: string;
}

export default function UnifiedHubGrid({ news = [], nextMatch, customTitle }: Props) {

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      {/* Section Title */}
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-zru-green">
          <span className="h-px w-8 bg-zru-green/50" aria-hidden />
          The Hub
        </p>
        <h2 className="heading-plate text-3xl sm:text-5xl font-heading font-black uppercase tracking-wide sm:tracking-widest text-rich-black not-italic leading-[1.05]">
          {customTitle ? (
            customTitle
          ) : (
            <>
              MATCHDAY, MEDIA &amp;{" "}
              <span className="text-zru-green">MERCHANDISE</span>
            </>
          )}
        </h2>
      </div>

      {/* Asymmetric 12-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">

        {/* ═══════════ NEXT MATCH (SPAN 5) ═══════════ */}
        <div className="lg:col-span-5 bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow p-6 rounded-lg flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-heading font-black text-[11px] uppercase tracking-[0.2em] text-zru-green">
              NEXT MATCH
            </h3>
          </div>

          <div className="relative flex items-center justify-between my-auto px-2">
            {/* Home Team */}
            <div className="flex flex-col items-center group/team w-[100px]">
              <div className="relative w-20 h-20 flex items-center justify-center p-2 mb-3">
                {nextMatch?.homeTeam.logo ? (
                  <Image src={nextMatch.homeTeam.logo} alt={nextMatch.homeTeam.name || "Zimbabwe"} fill className="object-contain drop-shadow-md" />
                ) : (
                  <span className="text-xl font-heading font-black text-rich-black">ZIM</span>
                )}
              </div>
              <span className="font-heading font-black text-xs leading-[1.1] text-center text-rich-black uppercase">
                {nextMatch ? nextMatch.homeTeam.name.split(" ").join("\n") : "ZIMBABWE\nSABLES"}
              </span>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center px-4">
              <span className="font-heading font-black text-2xl text-zru-green/20 mb-2">VS</span>
              {nextMatch?.competition && (
                <span className="text-[9px] font-bold tracking-widest text-rich-black/50 uppercase text-center leading-tight">
                  {nextMatch.competition}
                </span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center group/team w-[100px]">
              <div className="relative w-20 h-20 flex items-center justify-center p-2 mb-3">
                {nextMatch?.awayTeam.logo ? (
                  <Image src={nextMatch.awayTeam.logo} alt={nextMatch.awayTeam.name || "Opponent"} fill className="object-contain drop-shadow-md" />
                ) : (
                  <span className="text-xl font-heading font-black text-rich-black">TBA</span>
                )}
              </div>
              <span className="font-heading font-black text-xs leading-[1.1] text-center text-rich-black uppercase">
                {nextMatch ? nextMatch.awayTeam.name.split(" ").join("\n") : "TBA"}
              </span>
            </div>
          </div>

          {/* Match Details */}
          <div className="bg-[#FDFBF0] rounded-lg p-5 space-y-3 mt-auto mb-5 border border-black/5">
            <div className="flex items-center gap-3 text-rich-black">
              <Calendar size={18} className="text-zru-green" />
              <span className="font-body font-bold text-xs uppercase tracking-wide">
                {nextMatch?.dateIso ? new Date(nextMatch.dateIso).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase() : "SAT, 24 MAY 2026"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-rich-black">
              <MapPin size={18} className="text-zru-green" />
              <span className="font-body font-bold text-xs uppercase tracking-wide truncate">
                {nextMatch?.venue?.toUpperCase() || "HARARE SPORTS CLUB"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-rich-black">
              <Clock size={18} className="text-zru-green" />
              <span className="font-body font-bold text-xs uppercase tracking-wide">
                {nextMatch?.time ? `${nextMatch.time} KICKOFF` : "15:30 CAT KICKOFF"}
              </span>
            </div>
          </div>

          {/* Match Centre CTA */}
          <span className="relative inline-flex group/btn w-full">
            <span className="absolute inset-0 z-0 clip-slanted bg-black/10 translate-x-[4px] translate-y-[4px] transition-transform duration-200 group-hover/btn:translate-x-[6px] group-hover/btn:translate-y-[6px] group-active/btn:translate-x-[2px] group-active/btn:translate-y-[2px]" aria-hidden="true" />
            <Link
              href="/match-centre"
              className="relative z-10 w-full clip-slanted bg-rich-black hover:bg-black text-white font-black flex items-center justify-center gap-2 py-3.5 transition-all duration-200 group-hover/btn:-translate-y-px group-active/btn:translate-x-[2px] group-active/btn:translate-y-[2px] text-[11px] tracking-widest uppercase font-heading shadow-sm"
            >
              <span>MATCH CENTRE</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </span>
        </div>

        {/* ═══════════ LATEST NEWS (SPAN 4) ═══════════ */}
        <div className="lg:col-span-4 bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow p-6 rounded-lg flex flex-col min-h-[400px] max-h-[500px]">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h3 className="font-heading font-black text-[11px] uppercase tracking-[0.2em] text-zru-green">
              LATEST NEWS
            </h3>
            <Newspaper size={16} className="text-zru-green" />
          </div>

          <div className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-2 news-scroll overscroll-contain">
            {news.length > 0 ? (
              news.map((article: Report) => (
                <Link key={article.id} href={article.url || "/media"} className="group/item block border-b border-black/5 pb-4 last:border-b-0">
                  <div className="flex gap-4 items-start">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 border border-black/5">
                      <Image src={article.image || "/images/teams/sables.jpg"} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover/item:scale-105" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-1.5 py-0.5 bg-zru-green/10 text-zru-green rounded text-[9px] font-black tracking-widest uppercase mb-1.5">
                        {article.category || "NEWS"}
                      </span>
                      <h4 className="font-heading font-black text-sm leading-[1.2] uppercase text-rich-black group-hover/item:text-zru-green transition-colors line-clamp-2 mb-1.5">
                        {article.title}
                      </h4>
                      <p className="text-[10px] font-bold text-rich-black/50">{article.date?.toUpperCase()}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <>
                <Link href="/media" className="group/item block border-b border-black/5 pb-4">
                  <div className="flex gap-4 items-start">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 border border-black/5">
                      <Image src="/images/teams/sables.jpg" alt="Sables" fill className="object-cover transition-transform duration-500 group-hover/item:scale-105" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-1.5 py-0.5 bg-zru-green/10 text-zru-green rounded text-[9px] font-black tracking-widest uppercase mb-1.5">SABLES</span>
                      <h4 className="font-heading font-black text-sm leading-[1.2] uppercase text-rich-black group-hover/item:text-zru-green transition-colors line-clamp-2 mb-1.5">SABLES PREPARE FOR NATIONS CUP CLASH</h4>
                      <p className="text-[10px] font-bold text-rich-black/50">15 MAY 2026</p>
                    </div>
                  </div>
                </Link>
                <Link href="/media" className="group/item block border-b border-black/5 pb-4">
                  <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 border border-black/5">
                      <Image src="/images/teams/junior-sables.jpg" alt="Junior Sables" fill className="object-cover transition-transform duration-500 group-hover/item:scale-105" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-black text-xs leading-[1.25] uppercase text-rich-black group-hover/item:text-zru-green transition-colors line-clamp-2 mb-1">JUNIOR SABLES SQUAD ANNOUNCED</h4>
                      <p className="text-[10px] font-bold text-rich-black/50">14 MAY 2026</p>
                    </div>
                  </div>
                </Link>
                <Link href="/media" className="group/item block border-b border-black/5 pb-4">
                  <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 border border-black/5">
                      <Image src="/images/teams/cheetahs.jpg" alt="Cheetahs" fill className="object-cover transition-transform duration-500 group-hover/item:scale-105" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-black text-xs leading-[1.25] uppercase text-rich-black group-hover/item:text-zru-green transition-colors line-clamp-2 mb-1">ZIMBABWE 7S GEARING UP FOR AFRICA CUP</h4>
                      <p className="text-[10px] font-bold text-rich-black/50">12 MAY 2026</p>
                    </div>
                  </div>
                </Link>
                <Link href="/media" className="group/item block">
                  <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 border border-black/5">
                      <Image src="/images/teams/lady-sables.jpg" alt="Lady Sables" fill className="object-cover transition-transform duration-500 group-hover/item:scale-105" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-black text-xs leading-[1.25] uppercase text-rich-black group-hover/item:text-zru-green transition-colors line-clamp-2 mb-1">LADY SABLES ANNOUNCE TRAINING CAMP</h4>
                      <p className="text-[10px] font-bold text-rich-black/50">10 MAY 2026</p>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>

          <span className="relative inline-flex group/btn w-full mt-4 shrink-0">
            <span className="absolute inset-0 z-0 clip-slanted bg-black/5 translate-x-[4px] translate-y-[4px] transition-transform duration-200 group-hover/btn:translate-x-[6px] group-hover/btn:translate-y-[6px] group-active/btn:translate-x-[2px] group-active/btn:translate-y-[2px]" aria-hidden="true" />
            <Link
              href="/media"
              className="relative z-10 w-full clip-slanted bg-[#FDFBF0] hover:bg-white text-rich-black hover:text-zru-green font-black flex items-center justify-center gap-2 py-2.5 transition-all duration-200 group-hover/btn:-translate-y-px group-active/btn:translate-x-[2px] group-active/btn:translate-y-[2px] text-[11px] tracking-widest uppercase border border-black/5 font-heading"
            >
              <span>EXPLORE ALL NEWS</span>
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </span>
        </div>

        {/* ═══════════ SHOP & TICKETS (SPAN 3) ═══════════ */}
        <div className="lg:col-span-3 flex flex-col gap-4 md:gap-5">
          {/* Shop Card (Top Section) */}
          <div className="flex-[5] relative overflow-hidden rounded-lg border border-black/5 shadow-sm hover:shadow-md transition-shadow min-h-[260px]">
            <ShopCardShowcase />
          </div>

          {/* Tickets Card (Bottom Section - Accent block) */}
          <div className="flex-[3] bg-zru-green text-white p-5 rounded-lg border border-transparent hover:border-white/20 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 relative overflow-hidden group min-h-[180px]">
            {/* Texture */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Tickets</span>
              <span className="bg-white text-zru-green px-2 py-0.5 text-[9px] font-bold uppercase rounded-full tracking-wider shadow-sm">From US$5</span>
            </div>

            <div className="relative z-10 flex flex-col gap-1 mt-auto mb-2">
              <h4 className="font-heading font-black text-lg not-italic text-white leading-tight uppercase">
                {nextMatch ? `${nextMatch.homeTeam.name} vs ${nextMatch.awayTeam.name}` : "Sables vs Namibia"}
              </h4>
              <div className="text-[10px] text-white/70 font-bold uppercase tracking-wider mt-1">
                {nextMatch?.venue?.toUpperCase() || "HARARE SPORTS CLUB"}
              </div>
            </div>

            <span className="relative z-10 inline-flex group/btn w-full mt-1">
              <span className="absolute inset-0 z-0 clip-slanted bg-black/30 translate-x-[4px] translate-y-[4px] transition-transform duration-200 group-hover/btn:translate-x-[6px] group-hover/btn:translate-y-[6px] group-active/btn:translate-x-[2px] group-active/btn:translate-y-[2px]" aria-hidden="true" />
              <Link
                href="/tickets"
                className="relative z-10 w-full clip-slanted bg-white text-zru-green hover:bg-rich-black hover:text-white py-2.5 font-black text-[10px] uppercase tracking-widest flex justify-center items-center gap-2 transition-all duration-200 group-hover/btn:-translate-y-px group-active/btn:translate-x-[2px] group-active/btn:translate-y-[2px] shadow-sm"
              >
                Buy Tickets <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

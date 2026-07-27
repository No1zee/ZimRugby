import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Newspaper, Calendar, MapPin, Clock } from "lucide-react";
import MatchdayVideoHighlights from "@/components/media/MatchdayVideoHighlights";
import ShopCardShowcase from "@/components/home/ShopCardShowcase";
import { getAllFixtures, formatFixtureForUI, getNextUnionMatch } from "@/lib/fixtures";
import { getLatestReports, getSocialPosts, type Report } from "@/lib/data-fetcher";

async function getLatestNews(): Promise<Report[]> {
  try {
    const [social, reports] = await Promise.all([getSocialPosts(), getLatestReports()]);
    const merged = [...social, ...reports];
    const seen = new Set<string>();
    const deduped = merged.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
    return deduped.slice(0, 3);
  } catch {
    return [];
  }
}

async function getNextMatch() {
  try {
    const fixtures = await getAllFixtures();
    const formatted = fixtures.map(formatFixtureForUI);
    return getNextUnionMatch(formatted);
  } catch {
    return null;
  }
}

export default async function UnifiedHubGrid() {
  const [news, nextMatch] = await Promise.all([getLatestNews(), getNextMatch()]);

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Title — Nations Cup format */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-rich-black not-italic">
          MATCHDAY, MEDIA &amp;{" "}
          <span className="text-accent-teal">MERCHANDISE</span>
        </h2>
      </div>

      {/* 4-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">

        {/* ═══════════ COLUMN 1: LATEST NEWS ═══════════ */}
        <div className="bg-gradient-to-b from-[#003822] via-[#002B19] to-[#001D11] text-white p-5 rounded-lg flex flex-col h-[460px] lg:h-[480px] xl:h-[500px] overflow-hidden border border-black/10 hover:border-green-primary/60 shadow-lg hover:shadow-2xl transition-shadow">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-b from-[#00704D] to-[#005238] text-white px-5 py-4 -mx-5 -mt-5 mb-4 shrink-0 border-b border-emerald-500/20">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">
              LATEST NEWS
            </span>
            <Newspaper size={14} className="text-accent-teal" />
          </div>

          {/* Scrollable News Stack */}
          <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-2 news-scroll overscroll-contain">
            {news.length > 0 ? (
              news.map((article: Report) => (
                <Link key={article.id} href={article.url || "/media"} className="group/item block border-b border-emerald-800/40 pb-3 last:border-b-0">
                  <div className="flex gap-3 items-start">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-emerald-600/30 shadow-sm">
                      <Image
                        src={article.image || "/images/teams/sables.jpg"}
                        alt={article.title}
                        fill
                        className="object-cover transition-[filter] duration-300 group-hover/item:brightness-110"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[8px] font-extrabold tracking-widest uppercase mb-1">
                        {article.category || "NEWS"}
                      </span>
                      <h3 className="font-heading font-black text-[13px] leading-[1.25] uppercase text-white group-hover/item:text-emerald-300 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-[9px] font-bold text-white/50 mt-1">{article.date?.toUpperCase()}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <>
                <Link href="/media" className="group/item block border-b border-emerald-800/40 pb-3">
                  <div className="flex gap-3 items-start">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-emerald-600/30 shadow-sm">
                      <Image src="/images/teams/sables.jpg" alt="Sables" fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[8px] font-extrabold tracking-widest uppercase mb-1">SABLES</span>
                      <h3 className="font-heading font-black text-[13px] leading-[1.25] uppercase text-white group-hover/item:text-emerald-300 transition-colors line-clamp-2">SABLES PREPARE FOR NATIONS CUP CLASH</h3>
                      <p className="text-[9px] font-bold text-white/50 mt-1">15 MAY 2026</p>
                    </div>
                  </div>
                </Link>
                <Link href="/media" className="group/item block border-b border-emerald-800/40 pb-3">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-emerald-600/30 shadow-sm">
                      <Image src="/images/teams/junior-sables.jpg" alt="Junior Sables" fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-black text-[12px] leading-[1.25] uppercase text-white group-hover/item:text-emerald-300 transition-colors line-clamp-2">JUNIOR SABLES SQUAD ANNOUNCED</h3>
                      <p className="text-[9px] font-bold text-white/50 mt-0.5">14 MAY 2026</p>
                    </div>
                  </div>
                </Link>
                <Link href="/media" className="group/item block border-b border-emerald-800/40 pb-3">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-emerald-600/30 shadow-sm">
                      <Image src="/images/teams/cheetahs.jpg" alt="Cheetahs" fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-black text-[12px] leading-[1.25] uppercase text-white group-hover/item:text-emerald-300 transition-colors line-clamp-2">ZIMBABWE 7S GEARING UP FOR AFRICA CUP</h3>
                      <p className="text-[9px] font-bold text-white/50 mt-0.5">12 MAY 2026</p>
                    </div>
                  </div>
                </Link>
                <Link href="/media" className="group/item block">
                  <div className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-emerald-600/30 shadow-sm">
                      <Image src="/images/teams/lady-sables.jpg" alt="Lady Sables" fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-black text-[12px] leading-[1.25] uppercase text-white group-hover/item:text-emerald-300 transition-colors line-clamp-2">LADY SABLES ANNOUNCE TRAINING CAMP</h3>
                      <p className="text-[9px] font-bold text-white/50 mt-0.5">10 MAY 2026</p>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Explore All News CTA */}
          <Link
            href="/media"
            className="relative z-10 w-full bg-white/10 hover:bg-white text-white hover:text-green-primary font-extrabold flex items-center justify-center gap-2 rounded-lg py-2.5 transition-colors duration-300 text-xs tracking-widest uppercase border border-white/20 mt-3 font-heading"
          >
            <span>EXPLORE ALL NEWS</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ═══════════ COLUMN 2: NEXT MATCH ═══════════ */}
        <div className="bg-gradient-to-b from-[#00331F] via-[#002415] to-[#00160D] text-white p-5 rounded-lg flex flex-col h-[460px] lg:h-[480px] xl:h-[500px] overflow-hidden border border-black/10 hover:border-green-primary/60 shadow-lg hover:shadow-2xl transition-shadow">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-b from-[#00704D] to-[#005238] text-white px-5 py-4 -mx-5 -mt-5 mb-4 shrink-0 border-b border-emerald-500/20">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">
              NEXT MATCH
            </span>
          </div>

          {/* Teams VS */}
          <div className="relative z-10 flex items-center justify-between my-2">
            {/* Home Team */}
            <div className="flex flex-col items-center group/team cursor-pointer">
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 mb-2 shadow-lg ring-2 ring-emerald-400/40 group-hover/team:brightness-110 transition-[filter]">
                <Image
                  src="/images/teams/zimbabwe.png"
                  alt="Zimbabwe"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-black text-[11px] leading-[1.1] text-center text-white uppercase">
                {nextMatch ? nextMatch.homeTeam.name.split(" ").join("\n") : "ZIMBABWE\nSABLES"}
              </span>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-heading font-black text-base shadow-inner mb-1">
                VS
              </div>
              {nextMatch?.competition && (
                <span className="text-[8px] font-extrabold tracking-widest text-emerald-400 uppercase max-w-[80px] text-center">
                  {nextMatch.competition}
                </span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center group/team cursor-pointer">
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 mb-2 shadow-lg ring-2 ring-white/20 group-hover/team:brightness-110 transition-[filter]">
                <Image
                  src="/images/teams/namibia.png"
                  alt="Namibia"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-black text-[11px] leading-[1.1] text-center text-white uppercase">
                {nextMatch ? nextMatch.awayTeam.name.split(" ").join("\n") : "NAMIBIA\nWELWITSCHIAS"}
              </span>
            </div>
          </div>

          {/* Glassmorphic Match Details */}
          <div className="relative z-10 bg-black/40 rounded-xl p-3.5 border border-white/10 space-y-2 my-2">
            <div className="flex items-center gap-2 text-white/90">
              <Calendar size={16} className="text-emerald-400" />
              <span className="font-body font-bold text-[11px] uppercase tracking-wider">
                {nextMatch?.dateIso
                  ? new Date(nextMatch.dateIso).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase()
                  : "SAT, 24 MAY 2026"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin size={16} className="text-emerald-400" />
              <span className="font-body font-bold text-[11px] uppercase tracking-wider truncate">
                {nextMatch?.venue?.toUpperCase() || "HARARE SPORTS CLUB"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Clock size={16} className="text-emerald-400" />
              <span className="font-body font-bold text-[11px] uppercase tracking-wider">
                {nextMatch?.time ? `${nextMatch.time} KICKOFF` : "15:30 CAT KICKOFF"}
              </span>
            </div>
          </div>

          {/* Match Centre CTA */}
          <Link
            href="/match-centre"
            className="relative z-10 mt-auto w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold flex items-center justify-center gap-2 rounded-lg py-3 transition-colors duration-300 shadow-lg shadow-emerald-950/40 text-xs tracking-widest uppercase group/btn font-heading"
          >
            <span>MATCH CENTRE</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>

        {/* ═══════════ COLUMN 3: MATCH TICKETS ═══════════ */}
        <div className="bg-green-primary text-white p-5 rounded-lg flex flex-col gap-4 relative overflow-hidden group">
          {/* Soft blur accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-teal/10 blur-3xl rounded-full" />

          {/* Header + Price Tag */}
          <div className="relative z-10 flex justify-between items-center">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent-teal">Match Tickets</span>
            <span className="bg-accent-teal/20 text-accent-teal px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wider">From US$5</span>
          </div>

          {/* Match Reference — ties to Next Match fixture */}
          <div className="relative z-10 p-4 border border-accent-teal/30 rounded flex flex-col gap-1">
            <h4 className="font-heading text-sm not-italic text-white">
              {nextMatch ? `${nextMatch.homeTeam.name} vs ${nextMatch.awayTeam.name}` : "Sables vs Namibia"}
            </h4>
            <div className="text-[11px] text-white/50 font-bold uppercase tracking-wider">
              {nextMatch?.venue?.toUpperCase() || "HARARE SPORTS CLUB"}
            </div>
          </div>

          {/* Benefit Copy */}
          <div className="relative z-10 space-y-1">
            <p className="text-white/70 text-sm leading-relaxed">Secure your seat for the Sables&apos; Nations Cup clash.</p>
          </div>

          {/* Primary CTA — Buy Tickets */}
          <Link
            href="/tickets"
            className="relative z-10 mt-auto bg-accent-teal text-green-primary py-3 font-extrabold text-[11px] uppercase tracking-[0.2em] flex justify-center items-center gap-2 hover:bg-accent-teal-dark transition-colors shadow-lg shadow-accent-teal/20"
          >
            Buy Tickets <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondary Link — Ticket Info */}
          <Link
            href="/tickets"
            className="relative z-10 text-center text-accent-teal/70 text-[10px] font-bold uppercase tracking-[0.15em] hover:text-accent-teal transition-colors"
          >
            Ticket info →
          </Link>
        </div>

        {/* ═══════════ COLUMN 4: OFFICIAL SHOP ═══════════ */}
        <ShopCardShowcase />

      </div>

      {/* ── Matchday Video Highlights Section ── */}
      <div className="mt-12 pt-10 border-t border-black/10">
        <MatchdayVideoHighlights
          title="NATIONS CUP"
          subtitle="MATCH HIGHLIGHTS"
          showChannelLink={true}
        />
      </div>
    </section>
  );
}

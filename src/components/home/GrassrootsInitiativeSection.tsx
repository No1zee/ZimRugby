import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Trophy, Users, GraduationCap } from "lucide-react";

const INITIATIVES = [
  {
    id: "schools-league",
    title: "Schoolboy & Schoolgirl Leagues",
    badge: "YOUTH PATHWAYS",
    subtitle: "PRIMARY & SECONDARY SCHOOLS",
    description: "Connecting provincial primary and high school rugby leagues directly to national age-grade squad selection.",
    stats: "120+ Participating Schools",
    image: "/images/schools/schoolboy-team-group.jpg",
    link: "/schools",
    btnText: "EXPLORE SCHOOL LEAGUES",
    gradient: "from-[#003822] via-[#002B19] to-[#001D11]",
    accentGlow: "rgba(0,200,83,0.25)",
  },
  {
    id: "get-into-rugby",
    title: "World Rugby 'Get Into Rugby'",
    badge: "GRASSROOTS DEVELOPMENT",
    subtitle: "PROVINCIAL PARTICIPATION",
    description: "Introducing try, play, and stay rugby principles to young boys and girls across all 10 provinces of Zimbabwe.",
    stats: "15,000+ Active Children",
    image: "/images/events/super-league.jpg",
    link: "/play-rugby",
    btnText: "PLAY GRASSROOTS RUGBY",
    gradient: "from-[#00301D] via-[#002315] to-[#00170E]",
    accentGlow: "rgba(16,185,129,0.25)",
  },
  {
    id: "provincial-academies",
    title: "Provincial High-Performance Hubs",
    badge: "COACHING & REFEREES",
    subtitle: "REGIONAL DEVELOPMENT HUBS",
    description: "Empowering local coaches, match officials, and club academies in Harare, Bulawayo, Mutare, Gweru & Masvingo.",
    stats: "10 Regional Hubs",
    image: "/images/events/africa-cup.jpg",
    link: "/clubs",
    btnText: "FIND A LOCAL HUB",
    gradient: "from-[#002D1A] via-[#001F12] to-[#00120B]",
    accentGlow: "rgba(5,150,105,0.25)",
  },
];

export default function GrassrootsInitiativeSection() {
  return (
    <section className="py-8 sm:py-10 bg-[#FDFBF0] relative overflow-hidden">
      
      {/* Background ambient watermark & subtle grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,103,71,0.04),transparent_60%)] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-8 h-0.5 bg-[#006747]" />
            <span className="text-[11px] font-heading font-black uppercase tracking-[0.25em] text-[#006747]">
              GROWING THE SPORT • COMMUNITY & DEVELOPMENT
            </span>
            <span className="w-8 h-0.5 bg-[#006747]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-rich-black italic font-heading">
            GRASSROOTS & YOUTH RUGBY INITIATIVES
          </h2>

          <p className="text-black/70 text-sm sm:text-base font-medium leading-relaxed">
            Building Zimbabwe&apos;s rugby legacy from provincial primary school festivals to national team caps. Discover our grassroots programs, coach education, and community pathways.
          </p>
        </div>

        {/* 3-Column Bento Grid (Horizontal Swipe Carousel on Mobile < 768px, 3-Col Grid on Desktop/Tablet) */}
        <div className="flex flex-nowrap md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 sm:gap-6 items-stretch py-2">
          {INITIATIVES.map((item) => (
            <div
              key={item.id}
              className="w-[280px] xs:w-[310px] md:w-auto shrink-0 snap-start box-border flex flex-col h-[440px] sm:h-[470px] rounded-2xl overflow-hidden border border-black/10 hover:border-[#006747]/50 shadow-md hover:shadow-xl transition-all duration-300 group/card bg-white relative"
            >
              {/* Image Header with Floating Badges */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                  sizes="(max-width: 768px) 85vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* Floating Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  <span className="px-2.5 py-1 bg-[#006747] text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-md">
                    {item.badge}
                  </span>
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-white rounded-full text-[9px] font-bold tracking-wider uppercase">
                    {item.stats}
                  </span>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow min-h-0 bg-white">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-[#006747] tracking-widest uppercase block">
                    {item.subtitle}
                  </span>
                  <h3 className="font-heading font-black text-sm sm:text-lg text-rich-black uppercase leading-snug group-hover/card:text-[#006747] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-black/70 text-xs font-medium leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-3 border-t border-black/10 mt-3">
                  <Link
                    href={item.link}
                    className="w-full bg-[#006747] hover:bg-[#004D34] text-white font-extrabold flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 shadow-sm hover:shadow-md text-xs tracking-wider uppercase font-heading group/btn"
                  >
                    <span>{item.btnText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Metrics Banner (Single-Row 4-Column Grid on Mobile & Desktop) */}
        <div className="bg-white border border-black/10 rounded-2xl p-4 sm:p-8 shadow-lg grid grid-cols-4 gap-2 sm:gap-6 text-center text-black">
          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-zru-green/10 border border-zru-green/20 flex items-center justify-center text-zru-green">
              <Users className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <span className="font-heading font-black text-lg xs:text-xl sm:text-3xl text-zru-green block tracking-tight">15,000+</span>
            <span className="text-[8px] xs:text-[9px] sm:text-xs font-extrabold text-black/60 uppercase tracking-wider block font-heading leading-tight">Active Youth Players</span>
          </div>

          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-zru-green/10 border border-zru-green/20 flex items-center justify-center text-zru-green">
              <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <span className="font-heading font-black text-lg xs:text-xl sm:text-3xl text-zru-green block tracking-tight">120+</span>
            <span className="text-[8px] xs:text-[9px] sm:text-xs font-extrabold text-black/60 uppercase tracking-wider block font-heading leading-tight">Schools &amp; Clubs</span>
          </div>

          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-zru-green/10 border border-zru-green/20 flex items-center justify-center text-zru-green">
              <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <span className="font-heading font-black text-lg xs:text-xl sm:text-3xl text-zru-green block tracking-tight">10</span>
            <span className="text-[8px] xs:text-[9px] sm:text-xs font-extrabold text-black/60 uppercase tracking-wider block font-heading leading-tight">Provincial Unions</span>
          </div>

          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-zru-green/10 border border-zru-green/20 flex items-center justify-center text-zru-green">
              <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <span className="font-heading font-black text-lg xs:text-xl sm:text-3xl text-zru-green block tracking-tight">45%</span>
            <span className="text-[8px] xs:text-[9px] sm:text-xs font-extrabold text-black/60 uppercase tracking-wider block font-heading leading-tight">Female Participation</span>
          </div>
        </div>

      </div>
    </section>
  );
}

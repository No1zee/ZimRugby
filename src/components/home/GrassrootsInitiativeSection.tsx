"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Trophy, Users, GraduationCap } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";

const emptySubscribe = () => () => {};

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
    btnText: "EXPLORE",
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

function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setCount(end);
      return;
    }

    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function: easeOutQuad
          const easeProgress = progress * (2 - progress);
          
          setCount(Math.floor(easeProgress * end));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(end);
          }
        };

        requestAnimationFrame(animate);
      }
    }, { threshold: 0.1 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, reduceMotion]);

  return <span ref={elementRef}>{count.toLocaleString()}{suffix}</span>;
}

export default function GrassrootsInitiativeSection({ initiatives: apiInitiatives }: { initiatives?: any[] } = {}) {
  const initiatives = apiInitiatives || INITIATIVES;
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isReduced = mounted && reduceMotion;

  return (
    <section className="py-12 sm:py-16 bg-[#006747] text-white relative overflow-hidden select-none">
      
      {/* Background ambient pitch watermark & diagonal brand lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <motion.div
          initial={isReduced ? false : { opacity: 0, y: 24 }}
          whileInView={isReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <div className="heading-plate heading-plate-light">
            <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-wide sm:tracking-widest text-white not-italic leading-[1.05]">
              GROWING THE GAME IN <span className="text-accent-teal">ZIMBABWE</span>
            </h2>
          </div>
        </motion.div>

        {/* 3-Column Asymmetric Grid — Card 1 wide (50%), Cards 2-3 narrow (25% each) */}
        <div className="flex flex-nowrap md:grid md:grid-cols-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 sm:gap-6 items-stretch py-2">
          {initiatives.map((item: any, idx: number) => (
            <motion.div
              key={item.id}
              initial={isReduced ? false : { y: 40, opacity: 0 }}
              whileInView={isReduced ? undefined : { y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: isReduced ? 0 : idx * 0.15, ease: [0.25, 1, 0.5, 1] }}
              className={`w-[280px] xs:w-[310px] md:w-auto shrink-0 snap-start box-border flex flex-col rounded-2xl overflow-hidden border border-white/20 hover:border-white shadow-2xl transition-shadow duration-300 group/card bg-white relative text-black ${
                idx === 0 ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              {/* Image Header with Floating Badges */}
              <div className={`relative w-full overflow-hidden shrink-0 ${idx === 0 ? "h-52 sm:h-60" : "h-40 sm:h-44"}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-[filter] duration-500 group-hover/card:brightness-110"
                  sizes="(max-width: 768px) 85vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Floating Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  <span className="px-2.5 py-1 bg-[#004D34] border border-white/20 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-md">
                    {item.badge}
                  </span>
                  <span className="px-2.5 py-1 bg-black/65 border border-white/20 text-white rounded-full text-[9px] font-bold tracking-wider uppercase">
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
                  <h3 className="font-heading font-black text-base sm:text-lg text-black uppercase leading-snug group-hover/card:text-[#006747] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-black/70 text-xs font-normal leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-3 border-t border-black/10 mt-3">
                <SlantedButton
                  href={item.link}
                  variant="primary"
                  size="sm"
                  className="w-full justify-between group/btn"
                  rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 shrink-0" />}
                >
                  <span>{item.btnText}</span>
                </SlantedButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Editorial Impact Stat Bar (Clean White Text on ZRU Green Background) */}
        <div className="pt-8 border-t border-white/20 grid grid-cols-4 divide-x divide-white/20 text-center text-white tabular-nums">
          
          <div className="flex flex-col items-center justify-center px-1 sm:px-4 space-y-1 group">
            <div className="flex items-center gap-1.5 text-white">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight not-italic">
                <CountUp end={15000} suffix="+" />
              </span>
            </div>
            <span className="text-[8px] sm:text-[11px] font-extrabold text-white/80 uppercase tracking-wider block font-heading leading-tight">
              Active Youth Players
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-1 sm:px-4 space-y-1 group">
            <div className="flex items-center gap-1.5 text-white">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight not-italic">
                <CountUp end={120} suffix="+" />
              </span>
            </div>
            <span className="text-[8px] sm:text-[11px] font-extrabold text-white/80 uppercase tracking-wider block font-heading leading-tight">
              Schools &amp; Clubs
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-1 sm:px-4 space-y-1 group">
            <div className="flex items-center gap-1.5 text-white">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight not-italic">
                <CountUp end={10} />
              </span>
            </div>
            <span className="text-[8px] sm:text-[11px] font-extrabold text-white/80 uppercase tracking-wider block font-heading leading-tight">
              Provincial Unions
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-1 sm:px-4 space-y-1 group">
            <div className="flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight not-italic">
                <CountUp end={45} suffix="%" />
              </span>
            </div>
            <span className="text-[8px] sm:text-[11px] font-extrabold text-white/80 uppercase tracking-wider block font-heading leading-tight">
              Female Participation
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Team } from "@/types/team";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TeamHero({
  team,
  reduceMotion,
}: {
  team: Team;
  reduceMotion: boolean;
}) {
  const variants = reduceMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -14 },
      };

  return (
    <motion.section
      id={`panel-${team.slug}`}
      role="tabpanel"
      aria-labelledby={`tab-${team.slug}`}
      {...variants}
      transition={{ duration: 0.45, ease: EASE }}
      className="relative overflow-hidden mt-6 mx-4 sm:mx-8 rounded-3xl"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={team.heroImage}
          alt={team.fullName}
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.22] contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rich-black via-rich-black/90 to-rich-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-rich-black/40" />
      </div>

      {/* Decorative diagonal accents */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-30">
        <div className="absolute right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent rotate-12 blur-[1px]" />
        <div className="absolute right-24 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-teal/50 to-transparent rotate-12 blur-[2px]" />
        <div className="absolute right-40 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent rotate-12 blur-[3px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-14">
        {/* Left: identity block */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-accent-teal mb-3">
            {team.category}
          </p>

          <h1 className="font-heading not-italic text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.88] text-glow-green text-white">
            {team.fullName}
          </h1>

          <motion.div
            initial={reduceMotion ? undefined : { width: 0 }}
            animate={reduceMotion ? undefined : { width: 72 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            className="h-[3px] rounded-full mt-4 mb-6"
            style={{
              backgroundColor: team.accent,
              width: reduceMotion ? 72 : undefined,
            }}
          />

          <p className="text-white/75 max-w-xl leading-relaxed mb-6">
            {team.description}
          </p>

          <div className="flex items-center gap-6 border-t border-white/10 pt-5 mb-8">
            {team.stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6">
                {i > 0 && <span className="w-px h-8 bg-white/10" />}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">
                    {stat.label}
                  </p>
                  <p className="font-heading not-italic text-2xl font-black text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href={team.href}
              className="inline-flex items-center justify-center font-heading tracking-wider uppercase transition-[background,box-shadow] duration-300 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zru-green bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#006747] hover:to-[#00402B] text-white shadow-md hover:shadow-xl shadow-[#006747]/25 border-t border-white/20 clip-slanted px-12 py-4 text-2xl gap-2"
            >
              Explore {team.shortName}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href={`${team.href}#fixtures`}
              className="inline-flex items-center justify-center font-heading tracking-wider uppercase transition-[background,border-color,box-shadow] duration-300 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zru-green border border-white/40 bg-white/[0.06] backdrop-blur-sm hover:bg-white/[0.12] hover:border-white/70 text-white clip-slanted px-12 py-4 text-2xl gap-2"
            >
              Fixtures & Results
            </Link>
          </div>
        </div>

        {/* Right: featured promo card */}
        <div className="lg:col-span-5">
          <div className="rounded-lg overflow-hidden h-full flex flex-col border border-white/10">
            <div
              className="px-5 py-3 text-[11px] uppercase tracking-wider font-bold text-white"
              style={{ background: "linear-gradient(90deg, #00704D, #005238)" }}
            >
              {team.keyHonour}
            </div>

            <div className="relative h-56 sm:h-64">
              <Image
                src={team.featuredImage}
                alt={team.featuredPlayer}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-top brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-transparent" />

              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/60">
                    Featured Playmaker
                  </p>
                  <p className="font-heading not-italic font-black text-white text-lg">
                    {team.featuredPlayer}
                  </p>
                </div>
              </div>

              <div className="absolute top-3 right-3 rounded-full px-3 py-1 bg-rich-black/60 backdrop-blur-sm text-[10px] font-bold text-accent-teal flex items-center gap-1">
                {team.ranking}
              </div>
            </div>

            <div
              className="mt-auto px-5 py-4 flex items-center justify-between text-white"
              style={{
                background: "linear-gradient(90deg, #005238, #00704D)",
              }}
            >
              <p className="text-xs">
                {team.format.toUpperCase()}{" "}
                <span className="opacity-50 mx-1">•</span>{" "}
                {team.squadSize} Players
              </p>
              <Link
                href={team.href}
                className="inline-flex items-center justify-center font-heading tracking-wider uppercase transition-[background-color] duration-300 active:scale-95 bg-white/15 hover:bg-white/25 text-white clip-slanted !py-1.5 !px-4 text-xs"
              >
                Visit Hub
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className="h-[2px] w-full"
        style={{
          background: "linear-gradient(90deg, #00C88C, #006747)",
        }}
      />
    </motion.section>
  );
}

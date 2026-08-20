"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";
import type { Partner } from "@/lib/api/partners";

interface SponsorGridProps {
  partners: Partner[];
}

const emptySubscribe = () => () => {};

export default function SponsorGrid({ partners }: SponsorGridProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const useStaticGrid = mounted && reduceMotion;

  if (!partners || partners.length === 0) return null;

  // Quadruple the partners array if it has very few items to ensure the marquee fills the screen width properly
  const logoList = partners.length < 8
    ? [...partners, ...partners, ...partners, ...partners]
    : partners;

  return (
    <section id="partners" className="bg-milk-white border-t border-black/5 pt-0 pb-0 px-4 sm:px-6 lg:px-8">
      {/* ── Green & White Strips with Logo Dock + Bottom CTA ── */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">

        {/* ── Green Title Band (title + CTA as one unit) ── */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#007A55] to-[#006747] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_0_#00301A,0_12px_24px_rgba(0,0,0,0.20)] py-8 sm:py-10">
          {/* Faint diagonal pitch-line texture */}
          <div aria-hidden className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(115deg,transparent_0px,transparent_34px,rgba(255,255,255,0.04)_34px,rgba(255,255,255,0.04)_35px)]" />
          {/* Soft center vignette to lift the title */}
          <div aria-hidden className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_65%)]" />

          {/*
            FIX: initial={false} prevents Framer Motion from writing inline SSR styles
            (opacity/transform) that differ from the client, eliminating the hydration mismatch.
            The whileInView animation still fires on the client when scrolled into view.
          */}
          <motion.div
            initial={false}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-3xl mx-auto px-4 text-center"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black uppercase tracking-[0.06em] sm:tracking-widest text-white leading-[1.08]">
              <span className="text-zru-green">POWERING</span> ZIMBABWEAN RUGBY
            </h2>
          </motion.div>
        </div>

        {/* White bottom strip — contains looping marquee or static grid depending on user motion settings */}
        <div className="bg-white py-10 sm:py-12 border-b border-black/5 overflow-hidden relative w-full flex items-center justify-center">
          {useStaticGrid ? (
            /* Reduced Motion Fallback: Show original partners list once statically without wrapping grid slop */
            <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-center gap-8 sm:gap-12 py-2">
              {partners.map((s) => (
                <div
                  key={s.id}
                  className="relative h-12 sm:h-16 w-32 sm:w-44 opacity-75 hover:opacity-100 transition-opacity duration-200 select-none grayscale hover:grayscale-0 sponsor-plate"
                  title={s.name}
                >
                  <Image
                    src={s.logo}
                    alt={s.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Animated Path: Infinite horizontal looping marquee */
            <div className="flex gap-12 sm:gap-16 animate-marquee py-2">
              {/* First set of logos */}
              {logoList.map((s, idx) => (
                <div
                  key={`${s.id}-${idx}-first`}
                  className="relative h-12 sm:h-16 w-32 sm:w-44 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-105 shrink-0 select-none grayscale hover:grayscale-0 sponsor-plate"
                  title={s.name}
                >
                  <Image
                    src={s.logo}
                    alt={s.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
              {/* Second set of logos for seamless loop */}
              {logoList.map((s, idx) => (
                <div
                  key={`${s.id}-${idx}-second`}
                  className="relative h-12 sm:h-16 w-32 sm:w-44 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-105 shrink-0 select-none grayscale hover:grayscale-0 sponsor-plate"
                  title={s.name}
                  aria-hidden="true"
                >
                  <Image
                    src={s.logo}
                    alt={s.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Green Bottom CTA Band ── */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#006747] to-[#00452A] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] py-8 sm:py-10">
          <div aria-hidden className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(115deg,transparent_0px,transparent_34px,rgba(255,255,255,0.04)_34px,rgba(255,255,255,0.04)_35px)]" />
          <motion.div
            initial={false}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex items-center justify-center"
          >
            <SlantedButton
              href="/partners"
              variant="primary"
              size="md"
              white
              rightIcon={<ArrowRight size={18} />}
            >
              BECOME AN OFFICIAL PARTNER
            </SlantedButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

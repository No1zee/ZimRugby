"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Shirt,
  Package,
  Star,
} from "lucide-react";

import ClubhouseNavBridge from "@/components/shop/ClubhouseNavBridge";
import FixtureRibbon from "@/components/shop/FixtureRibbon";
import JoinFanZoneSection from "@/components/home/JoinFanZoneSection";

/* ------------------------------------------------------------------ */
/*  Hero Section with Embedded Fan Zone Join Card                      */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="relative min-h-[90dvh] w-full flex items-center overflow-hidden bg-rich-black pt-36 sm:pt-40 md:pt-48 pb-16 sm:py-24">
      {/* Background with Darkened Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-371.webp"
          alt="Zimbabwe Sables Rugby"
          fill
          priority
          quality={60}
          className="object-cover object-top opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/80 to-rich-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zru-green block mb-3">
            Official Zimbabwe Rugby Store
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading text-white uppercase tracking-tight leading-[0.95]">
            Shop Coming Soon
          </h1>

          <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl font-body">
            Match jerseys, supporter gear, and international kits are arriving soon. Join the Fan Zone below for 10% member pricing, exclusive early drop access, and priority ordering.
          </p>
        </div>

        {/* Embedded Homepage Interactive Fan Zone Card with Full Logic & Animations */}
        <div className="w-full">
          <JoinFanZoneSection />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  What to Expect — 3 Cutout Product Showcase Cards                   */
/* ------------------------------------------------------------------ */
const items = [
  {
    image: "/images/shop/1.png",
    label: "Match Jerseys",
    note: "Official home and away kits in men's, women's, and junior sizing.",
  },
  {
    image: "/images/shop/2.png",
    label: "Training & Leisure",
    note: "Performance training wear and casual supporter apparel.",
  },
  {
    image: "/images/shop/3.png",
    label: "Accessories",
    note: "Caps, scarves, duffels, and matchday essentials.",
  },
];

function WhatToExpect() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-milk-white py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-lg mb-14"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zru-green block mb-3">
            What We&apos;re Preparing
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading text-rich-black uppercase tracking-tight">
            Built for Matchday. Worn with Pride.
          </h2>
          <p className="mt-3 text-sm text-black/50 leading-relaxed">
            Every piece is designed to the same standard worn by the national squad.
            Registered members get early access to new collections.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group bg-white rounded-2xl border border-black/8 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/[0.02] mb-5 flex items-center justify-center p-4">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                />
              </div>
              <h3 className="text-base font-heading font-black uppercase tracking-tight text-rich-black">
                {item.label}
              </h3>
              <p className="mt-1.5 text-xs text-black/50 leading-relaxed max-w-xs">
                {item.note}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Member Perks Strip                                                 */
/* ------------------------------------------------------------------ */
const perks = [
  {
    icon: Star,
    title: "Early Access",
    desc: "Shop new collections before anyone else.",
  },
  {
    icon: Shirt,
    title: "Member Pricing",
    desc: "10% discount on selected items.",
  },
  {
    icon: Package,
    title: "Worldwide Shipping",
    desc: "Tracked delivery to your door.",
  },
];

function MemberPerks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-[#F5F4F0] border-y border-black/5 py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.08 * i }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-zru-green/10 flex items-center justify-center text-zru-green shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rich-black">{perk.title}</h3>
                  <p className="text-xs text-black/50 mt-0.5 leading-relaxed">{perk.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Bottom CTA                                                         */
/* ------------------------------------------------------------------ */
function BottomCta() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="bg-rich-black py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto text-center px-4 sm:px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-heading text-white uppercase tracking-tight">
          Be First In Line
        </h2>
        <p className="mt-3 text-sm text-white/45 leading-relaxed">
          Join the Fan Zone today to unlock your 10% member discount and get notified the moment the store opens.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/fan-zone"
            className="inline-flex items-center gap-2 bg-zru-green hover:bg-[#005238] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-zru-green/20"
          >
            <span>Join Fan Zone Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-white/8">
          <p className="text-xs text-white/30">
            Already a member?{" "}
            <Link href="/fan-zone" className="text-zru-green hover:text-zru-green/80 transition-colors font-medium">
              Sign in to your Fan Zone
            </Link>{" "}
            to check your supporter privileges.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Assembly                                                      */
/* ------------------------------------------------------------------ */
export default function ClubhousePage() {
  return (
    <main className="bg-rich-black min-h-screen selection:bg-zru-green selection:text-white">
      <ClubhouseNavBridge />
      <FixtureRibbon />
      <Hero />
      <WhatToExpect />
      <MemberPerks />
      <BottomCta />
    </main>
  );
}

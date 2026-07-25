"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

function PartnersSection() {
  const shouldReduceMotion = useReducedMotion();

  const supportingPartners = [
    {
      name: "CFAO Mobility Zimbabwe",
      short: "CFAO",
      href: "/partners",
      blurb: "Mobility and commercial backing for elite competition and national operations.",
      accent: "from-emerald-400/20 via-emerald-300/5 to-transparent",
    },
    {
      name: "Gilbert Rugby",
      short: "GILBERT",
      href: "/partners",
      blurb: "Trusted performance equipment partner supporting the game on and off the field.",
      accent: "from-amber-300/20 via-amber-200/5 to-transparent",
    },
    {
      name: "Seed Co Zimbabwe",
      short: "SEED CO",
      href: "/partners",
      blurb: "Backing long-term development pathways from community rugby to the national stage.",
      accent: "from-lime-300/20 via-lime-200/5 to-transparent",
    },
    {
      name: "BLK Sport",
      short: "BLK",
      href: "/partners",
      blurb: "Technical apparel and elite sporting identity for modern Zimbabwe Rugby.",
      accent: "from-cyan-300/20 via-cyan-200/5 to-transparent",
    },
  ];

  const introVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.08,
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28, scale: shouldReduceMotion ? 1 : 0.985 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.18 + i * 0.08,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      aria-labelledby="partners-heading"
      className="relative isolate overflow-hidden bg-[#07111A] text-white"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(204,163,74,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(18,124,120,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D6A84A]/30 to-transparent" />
        <div
          className={`absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#D6A84A]/10 blur-3xl ${
            shouldReduceMotion ? "" : "animate-pulse"
          }`}
        />
        <div
          className={`absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#0F766E]/10 blur-3xl ${
            shouldReduceMotion ? "" : "animate-pulse"
          }`}
          style={{ animationDuration: "6s" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)] lg:items-end">
          <div className="max-w-3xl">
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={introVariants}
              className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/72 backdrop-blur-md"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-[#D6A84A]" />
              Powering Zimbabwe Rugby
            </motion.div>

            <motion.h2
              id="partners-heading"
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={introVariants}
              className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl"
            >
              Partners backing the game from grassroots to the Sables
            </motion.h2>

            <motion.p
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={introVariants}
              className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base"
            >
              From national team competition to school pathways and provincial development,
              our commercial partners help power every level of Zimbabwe Rugby.
            </motion.p>
          </div>

          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={introVariants}
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(214,168,74,0.16),transparent_36%,rgba(15,118,110,0.12))]" />
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D6A84A]">
                Commercial partnerships
              </p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/74">
                Align your brand with the national game, youth pathways, matchday experiences,
                and the next era of Zimbabwe Rugby.
              </p>

              <Link
                href="/partners"
                className="group mt-6 inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-[#D6A84A]/35 bg-[#D6A84A] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#07111A] transition duration-300 hover:translate-y-[-2px] hover:bg-[#e6bb65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111A]"
              >
                Become an official partner
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <motion.a
            href="https://www.nedbank.co.zw/"
            target="_blank"
            rel="noopener noreferrer"
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.34)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#D6A84A]/35 sm:p-8 lg:min-h-[420px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,168,74,0.24),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%,rgba(15,118,110,0.12))]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
            <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#D6A84A]/0 via-[#D6A84A]/30 to-[#D6A84A]/0" />
            <div className="absolute right-6 top-6 h-24 w-24 rounded-full border border-white/10 bg-white/5 blur-2xl transition duration-500 group-hover:scale-125 group-hover:bg-[#D6A84A]/10" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full border border-[#D6A84A]/25 bg-[#D6A84A]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E7C57A]">
                    Headline sponsor
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/42">
                    National program partner
                  </span>
                </div>

                <div className="mt-8">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.34em] text-white/34">
                    Nedbank Zimbabwe
                  </p>
                  <h3 className="mt-3 max-w-2xl text-3xl font-black uppercase leading-none tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                    Nedbank
                    <span className="mt-2 block text-white/78">Zimbabwe</span>
                  </h3>
                </div>

                <div className="mt-8 max-w-2xl">
                  <p className="text-base leading-7 text-white/74 sm:text-lg">
                    Official headline sponsor powering the Sables, domestic competitions,
                    and grassroots rugby nationwide.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="grid grid-cols-2 gap-3 text-left sm:flex sm:gap-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">Reach</p>
                    <p className="mt-2 text-lg font-bold uppercase tracking-[0.04em] text-white">
                      National
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">Impact</p>
                    <p className="mt-2 text-lg font-bold uppercase tracking-[0.04em] text-white">
                      Grassroots to elite
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-white">
                  Visit partner
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 transition duration-300 group-hover:translate-x-1 group-hover:border-[#D6A84A]/30 group-hover:bg-[#D6A84A]/12">
                    →
                  </span>
                </span>
              </div>
            </div>
          </motion.a>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {supportingPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                custom={index + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={cardVariants}
              >
                <Link
                  href={partner.href}
                  className="group relative flex h-full min-h-[160px] overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.075] sm:min-h-[190px] lg:min-h-[170px]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${partner.accent} opacity-80`} />
                  <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)] translate-x-[-120%] group-hover:translate-x-[120%]" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div className="relative flex w-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/38">
                          Supporting partner
                        </p>
                        <h3 className="mt-4 max-w-[15rem] text-xl font-black uppercase leading-tight tracking-[-0.03em] text-white sm:text-2xl">
                          {partner.name}
                        </h3>
                      </div>

                      <div className="flex h-12 min-w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/10 px-3 text-sm font-black uppercase tracking-[0.14em] text-white/78">
                        {partner.short}
                      </div>
                    </div>

                    <div className="mt-6 flex items-end justify-between gap-4">
                      <p className="max-w-[18rem] text-sm leading-6 text-white/66">
                        {partner.blurb}
                      </p>

                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/78 transition duration-300 group-hover:translate-x-1 group-hover:bg-white/10">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-md sm:px-6">
          <div
            className={`flex min-w-max items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45 ${
              shouldReduceMotion ? "" : "animate-[marquee_22s_linear_infinite]"
            }`}
          >
            <span>Nedbank Zimbabwe</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#D6A84A]/70" />
            <span>CFAO Mobility Zimbabwe</span>
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span>Gilbert Rugby</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E]/70" />
            <span>Seed Co Zimbabwe</span>
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span>BLK Sport</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#D6A84A]/70" />
            <span>National game. Provincial pathways. Grassroots growth.</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-20%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </section>
  );
}

export default PartnersSection;

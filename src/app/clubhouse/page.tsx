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
  Bell,
} from "lucide-react";

import ClubhouseNavBridge from "@/components/shop/ClubhouseNavBridge";
import FixtureRibbon from "@/components/shop/FixtureRibbon";

/* ------------------------------------------------------------------ */
/*  Email Registration                                                 */
/* ------------------------------------------------------------------ */
function useRegister() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/fan-zone/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "clubhouse_waitlist", tags: ["merch-early-access"] }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return { email, setEmail, status, submit };
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
function Hero() {
  const { email, setEmail, status, submit } = useRegister();

  return (
    <section className="relative min-h-[100dvh] w-full flex items-end overflow-hidden bg-rich-black">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-371.webp"
          alt="Zimbabwe Sables"
          fill
          priority
          quality={60}
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/60 to-transparent" />
      </div>

      {/* Content — bottom-left aligned, clean */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28 pt-32">
        <div className="max-w-xl">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zru-green block mb-4">
            Official Zimbabwe Rugby Store
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading text-white uppercase tracking-tight leading-[0.95]">
            The Clubhouse
          </h1>

          <p className="mt-5 text-sm sm:text-[15px] text-white/55 leading-relaxed max-w-md">
            Official jerseys, training kits, and supporter gear — direct from Zimbabwe Rugby.
            Register below and be the first to know when we open the doors.
          </p>

          {/* Email */}
          <form onSubmit={submit} className="mt-8 max-w-md">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 py-3.5 px-5 bg-zru-green/15 border border-zru-green/25 rounded-xl"
                >
                  <Check className="w-4 h-4 text-zru-green shrink-0" />
                  <span className="text-sm text-white font-medium">You&apos;re registered. We&apos;ll be in touch.</span>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/15 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-zru-green/40 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="px-5 py-3 bg-zru-green hover:bg-[#005238] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {status === "submitting" ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>Notify Me</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {status === "error" && <p className="text-xs text-red-400 mt-2">Something went wrong. Please try again.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  What to Expect — simple 3-column grid                              */
/* ------------------------------------------------------------------ */
const items = [
  {
    image: "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-344.webp",
    label: "Match Jerseys",
    note: "Official home and away kits in men's, women's, and junior sizing.",
  },
  {
    image: "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-383.webp",
    label: "Training & Leisure",
    note: "Performance training wear and casual supporter apparel.",
  },
  {
    image: "/images/gallery/sables-women-2523590097200736450.webp",
    label: "Accessories",
    note: "Caps, scarves, bags, and match-day essentials.",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/5 mb-4">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <h3 className="text-sm font-heading font-black uppercase tracking-tight text-rich-black">
                {item.label}
              </h3>
              <p className="mt-1 text-xs text-black/50 leading-relaxed">
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
/*  Member Perks — clean horizontal strip                              */
/* ------------------------------------------------------------------ */
const perks = [
  { icon: Star, title: "Early Access", desc: "Shop new collections before anyone else." },
  { icon: Shirt, title: "Member Pricing", desc: "Permanent 10% discount on all purchases." },
  { icon: Package, title: "Worldwide Shipping", desc: "Tracked delivery from Harare to your door." },
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
/*  Bottom CTA — simple, quiet                                         */
/* ------------------------------------------------------------------ */
function BottomCta() {
  const { email, setEmail, status, submit } = useRegister();
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
          Leave your email and we&apos;ll let you know the moment the store opens.
          No spam — just one email when it matters.
        </p>

        <form onSubmit={submit} className="mt-8">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 py-3 text-sm text-zru-green font-medium"
              >
                <Check className="w-4 h-4" />
                <span>Registered. We&apos;ll be in touch.</span>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 bg-white/8 border border-white/12 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/25 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="px-5 py-3 bg-zru-green hover:bg-[#005238] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {status === "submitting" ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Register</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {status === "error" && <p className="text-xs text-red-400 mt-2">Something went wrong. Try again.</p>}
        </form>

        {/* Fan Zone link */}
        <div className="mt-10 pt-8 border-t border-white/8">
          <p className="text-xs text-white/30">
            Already a supporter?{" "}
            <Link href="/fan-zone" className="text-zru-green hover:text-zru-green/80 transition-colors font-medium">
              Sign in to your Fan Zone
            </Link>{" "}
            for member pricing when we launch.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
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

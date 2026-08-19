"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Ticket,
  Percent,
  Mail,
  Trophy,
  Bell,
  ArrowRight,
  LogOut,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import CmsHero from "@/components/cms/CmsHero";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import { useAuth } from "@/context/AuthContext";

interface FanZoneClientProps {
  cmsPage?: any;
}

const BENEFITS = [
  {
    icon: Ticket,
    title: "Priority Match Tickets",
    description:
      "48-hour exclusive early access window for Sables, Lady Sables, and international test matches before general release.",
    badge: "Early Access",
  },
  {
    icon: Percent,
    title: "10% Clubhouse Store Discount",
    description:
      "Save 10% on official jerseys, training wear, and supporter merchandise online and on matchdays.",
    badge: "10% Discount",
  },
  {
    icon: Mail,
    title: "Direct Squad News & Dispatches",
    description:
      "Get verified team sheets, injury updates, and tactical briefings delivered straight to you first.",
    badge: "First to Know",
  },
  {
    icon: Trophy,
    title: "Exclusive Fan Experiences",
    description:
      "Automatic entry into supporter draws for VIP matchday hospitality, signed test jerseys, and open training sessions.",
    badge: "VIP Draws",
  },
];

const WHAT_TO_EXPECT = [
  {
    step: "01",
    title: "Verified News & Squad Announcements",
    description:
      "No rumors or delays. Whenever team lineups, tour squads, or union updates are locked in, you get them first right here and in your inbox.",
  },
  {
    step: "02",
    title: "Ticket Drop Alerts & Presale Codes",
    description:
      "When major fixtures and tournaments go live, your supporter code unlocks the presale before tickets hit the general public.",
  },
  {
    step: "03",
    title: "Growing Member Perks",
    description:
      "We are rolling out regular member-only perks, partner rewards, merchandise drops, and digital match programmes all season long.",
  },
];

export default function FanZoneClient({ cmsPage }: FanZoneClientProps) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);

  const displayName = user?.name || "Edward Magejo";
  const memberCode = user
    ? `ZRU-${(user.name.slice(0, 3) + (user.handle?.replace(/[^0-9]/g, "") || "2026")).toUpperCase().padEnd(8, "0")}`
    : "ZRU-2026-FAN";

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(memberCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <main className="bg-milk-white min-h-screen pb-20 text-rich-black">
      {/* Header */}
      <CmsHero
        kicker={cmsPage?.hero_kicker || "OFFICIAL SUPPORTERS NETWORK"}
        title={cmsPage?.hero_title || "FAN ZONE"}
        intro={
          cmsPage?.hero_intro ||
          "Welcome to the official Zimbabwe Rugby Union fan hub. Your direct connection to the Sables, matchday perks, and supporter benefits."
        }
        image={cmsPage?.hero_image || "/images/gallery/zimbabwe-sables-0350.webp"}
        breadcrumb={[{ label: "Fan Zone", href: "/fan-zone" }]}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        <PageAnnouncements scope="media" />

        {/* 1. Personalized Welcome Card */}
        <div className="bg-rich-black text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-zru-green/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zru-green/20 border border-zru-green/40 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OFFICIAL ZRU SUPPORTER</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black uppercase tracking-tight text-white leading-tight">
                Welcome, <span className="text-zru-green">{displayName}</span>
              </h1>

              <p className="text-white/75 text-sm sm:text-base font-body leading-relaxed">
                You are connected to the official heartbeat of Zimbabwe Rugby. Your supporter status gives you direct access to test match presales, store discounts, and official union dispatches.
              </p>
            </div>

            {/* Supporter Code / Actions Box */}
            <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between min-w-[260px] sm:min-w-[280px]">
              <div className="space-y-2 pb-4 border-b border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">
                  Your Supporter Code
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-mono font-bold tracking-wider text-white">
                    {memberCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                {isAuthenticated ? (
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-red-400 hover:text-red-300 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login?redirect=/fan-zone"
                    className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-zru-green hover:underline uppercase tracking-wider"
                  >
                    Sign In / Register
                  </Link>
                )}
                <span className="text-[10px] font-mono text-white/40 uppercase">Season 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Notice: Watch Out Here for News & Benefits */}
        <div className="bg-zru-green/10 border-2 border-zru-green/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-rich-black shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-zru-green text-white flex items-center justify-center shrink-0 shadow-md">
            <Bell className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-zru-green text-white px-2 py-0.5 rounded">
                WATCH THIS SPACE
              </span>
              <h3 className="font-heading font-black text-base sm:text-lg uppercase text-rich-black">
                Keep An Eye On This Hub
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-black/75 font-body leading-relaxed">
              Watch out right here for breaking team news, priority ticket release dates, exclusive partner benefits, and new fan features throughout the 2026 season.
            </p>
          </div>
        </div>

        {/* 3. Benefits of Being a Fan */}
        <section className="space-y-5">
          <div className="border-b border-black/10 pb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zru-green block mb-1">
              Member Privileges
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-rich-black uppercase tracking-tight">
              Benefits of Being a Fan
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="bg-white border border-black/10 rounded-2xl p-6 flex flex-col justify-between hover:border-zru-green/50 transition-all duration-200 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-zru-green/10 flex items-center justify-center text-zru-green">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zru-green bg-zru-green/10 px-2.5 py-1 rounded-md">
                        {benefit.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-heading font-black uppercase tracking-tight text-rich-black mb-1.5">
                        {benefit.title}
                      </h3>
                      <p className="text-xs text-black/65 font-body leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. What to Expect */}
        <section className="space-y-5">
          <div className="border-b border-black/10 pb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zru-green block mb-1">
              Supporter Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-rich-black uppercase tracking-tight">
              What to Expect
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHAT_TO_EXPECT.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-black/10 rounded-2xl p-6 relative overflow-hidden shadow-sm"
              >
                <span className="text-4xl font-heading font-black text-black/10 absolute top-4 right-5 select-none pointer-events-none">
                  {item.step}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zru-green block mb-2">
                  Step {item.step}
                </span>
                <h3 className="text-lg font-heading font-black uppercase tracking-tight text-rich-black mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-black/70 font-body leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links Footer Banner */}
        <div className="bg-white border border-black/10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-heading font-black text-sm uppercase text-rich-black">
              Ready to explore Zimbabwe Rugby?
            </h4>
            <p className="text-xs text-black/60 font-body">
              Browse upcoming fixtures or visit the media centre for recent match highlights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/match-centre"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zru-green hover:bg-[#004D2C] text-white text-xs font-heading font-black uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Match Centre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/media"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-rich-black text-xs font-heading font-black uppercase tracking-wider transition-colors border border-black/10"
            >
              <span>Latest News</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

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
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import CmsHero from "@/components/cms/CmsHero";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import { useAuth } from "@/context/AuthContext";

interface FanZoneClientProps {
  cmsPage?: any;
}

const PRIMARY_BENEFIT = {
  icon: Ticket,
  title: "Priority Match Tickets",
  description:
    "48-hour exclusive early access window for all Sables, Lady Sables, and international test matches before tickets hit general public release.",
  badge: "48h Early Access",
  detail: "Verified supporter access delivered straight to your member account.",
};

const SECONDARY_BENEFITS = [
  {
    icon: Percent,
    title: "10% Clubhouse Store Privilege",
    description:
      "Save 10% on official jerseys, training vests, and supporter merchandise online and on matchdays.",
    badge: "10% Discount",
  },
  {
    icon: Mail,
    title: "Direct Squad Dispatches",
    description:
      "Official team sheets, injury updates, and tactical briefings sent straight from the camp.",
    badge: "First to Know",
  },
  {
    icon: Trophy,
    title: "VIP Matchday Draws",
    description:
      "Automatic entry into seasonal draws for VIP hospitality, signed test jerseys, and open training sessions.",
    badge: "VIP Draws",
  },
];

const WHAT_TO_EXPECT = [
  {
    step: "01",
    title: "Verified Squad News",
    description:
      "No rumors or delays. Whenever matchday lineups, tour selections, or union updates are locked in, you receive them first right here and via direct dispatch.",
  },
  {
    step: "02",
    title: "Presale Ticket Drops",
    description:
      "When major fixtures and test tournaments go live, your verified supporter code unlocks priority allocations before general public windows open.",
  },
  {
    step: "03",
    title: "Growing Member Privileges",
    description:
      "We are rolling out regular member-only perks, merchandise drops, partner rewards, and digital match programmes all season long.",
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

  const PrimaryIcon = PRIMARY_BENEFIT.icon;

  return (
    <main className="bg-milk-white min-h-screen pb-24 text-rich-black">
      {/* Editorial Header */}
      <CmsHero
        kicker={cmsPage?.hero_kicker || "OFFICIAL SUPPORTERS NETWORK"}
        title={cmsPage?.hero_title || "FAN ZONE"}
        intro={
          cmsPage?.hero_intro ||
          "Welcome to the official Zimbabwe Rugby Union fan hub. Your direct connection to the national teams, matchday perks, and supporter benefits."
        }
        image={cmsPage?.hero_image || "/images/gallery/zimbabwe-sables-0350.webp"}
        breadcrumb={[{ label: "Fan Zone", href: "/fan-zone" }]}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        <PageAnnouncements scope="media" />

        {/* 1. Personalized Welcome Card (Hallmark Elevation) */}
        <div className="bg-rich-black text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zru-green/20 border border-zru-green/40 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>OFFICIAL ZRU SUPPORTER</span>
                </span>
                <span className="text-white/40 text-[10px] font-mono tabular-nums uppercase tracking-widest">
                  SEASON 2026
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-white leading-tight">
                Welcome, <span className="text-zru-green">{displayName}</span>
              </h1>

              <p className="text-white/75 text-sm sm:text-base font-body leading-relaxed max-w-xl">
                You are connected to the official heartbeat of Zimbabwe Rugby. Your supporter status gives you direct access to test match presales, store privileges, and official union dispatches.
              </p>

              {/* Quick Action Navigation Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/tickets"
                  className="inline-flex items-center gap-2 rounded-xl bg-zru-green hover:bg-[#004D2C] px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white shadow-sm transition-colors duration-200"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Match Tickets</span>
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors duration-200 border border-white/10"
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Clubhouse Store (10% Off)</span>
                </Link>
              </div>
            </div>

            {/* Supporter Code / Credentials Box */}
            <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-w-[280px] sm:min-w-[320px]">
              <div className="space-y-3 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                    Supporter Code
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase">Active</span>
                </div>
                <div className="flex items-center justify-between bg-black/30 px-3.5 py-2.5 rounded-xl border border-white/5">
                  <span className="text-base font-mono font-bold tracking-wider text-white tabular-nums">
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

              <div className="pt-4 flex items-center justify-between">
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
                <span className="text-[10px] font-mono text-white/40 tabular-nums uppercase">EST. 1895</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Notice: Watch Out Here for News & Benefits (Clean Focal Callout) */}
        <div className="bg-white border-2 border-zru-green/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-zru-green/10 text-zru-green flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zru-green bg-zru-green/10 px-2 py-0.5 rounded">
                  WATCH THIS SPACE
                </span>
                <h3 className="font-heading font-black text-lg uppercase text-rich-black">
                  Keep An Eye On This Hub
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-black/70 font-body leading-relaxed">
                Watch out right here for breaking team news, priority ticket release dates, exclusive partner benefits, and new fan features throughout the 2026 season.
              </p>
            </div>
          </div>

          <Link
            href="/media"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-rich-black text-xs font-heading font-black uppercase tracking-wider transition-colors duration-200 border border-black/10"
          >
            <span>Latest News</span>
            <ArrowRight className="w-3.5 h-3.5 text-zru-green" />
          </Link>
        </div>

        {/* 3. Benefits of Being a Fan (Asymmetric Bento Grid) */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-black/10 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zru-green block mb-1">
                MEMBERSHIP PRIVILEGES
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-rich-black uppercase tracking-tight">
                Benefits of Being a Fan
              </h2>
            </div>
            <p className="text-xs text-black/60 font-body max-w-sm">
              Your official supporter pass grants direct access across ticketing, merchandise, and national squad content.
            </p>
          </div>

          {/* Asymmetric Bento Layout: 6 cols featured + 6 cols stacked 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Featured Primary Perk */}
            <div className="md:col-span-6 bg-white border border-black/10 rounded-3xl p-7 sm:p-8 flex flex-col justify-between hover:border-zru-green/50 transition-colors duration-200 shadow-sm">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-zru-green/10 flex items-center justify-center text-zru-green">
                    <PrimaryIcon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zru-green bg-zru-green/10 border border-zru-green/20 px-3 py-1 rounded-full">
                    {PRIMARY_BENEFIT.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-rich-black leading-tight">
                    {PRIMARY_BENEFIT.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-black/70 font-body leading-relaxed">
                    {PRIMARY_BENEFIT.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-black/10 text-xs text-black/50 font-mono">
                {PRIMARY_BENEFIT.detail}
              </div>
            </div>

            {/* 3 Secondary Stacked Bento Cards */}
            <div className="md:col-span-6 grid grid-cols-1 gap-4">
              {SECONDARY_BENEFITS.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="bg-white border border-black/10 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-zru-green/40 transition-colors duration-200 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zru-green/10 flex items-center justify-center text-zru-green shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-heading font-black uppercase tracking-tight text-rich-black">
                          {benefit.title}
                        </h4>
                        <p className="text-xs text-black/65 font-body leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-[9px] font-mono font-bold uppercase tracking-wider text-zru-green bg-zru-green/10 px-2.5 py-1 rounded-md">
                      {benefit.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. What to Expect (Numbered Step Sequence) */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-black/10 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zru-green block mb-1">
                SUPPORTER TIMELINE
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-rich-black uppercase tracking-tight">
                What to Expect
              </h2>
            </div>
            <p className="text-xs text-black/60 font-body max-w-sm">
              How information, ticket releases, and exclusive member privileges reach you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHAT_TO_EXPECT.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-black/10 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:border-zru-green/40 transition-colors duration-200"
              >
                <span className="text-5xl font-heading font-black text-black/5 absolute top-3 right-4 select-none pointer-events-none tabular-nums">
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

        {/* Quick Links Exploration Footer Banner */}
        <div className="bg-white border border-black/10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h4 className="font-heading font-black text-sm uppercase text-rich-black">
              Ready to explore Zimbabwe Rugby?
            </h4>
            <p className="text-xs text-black/60 font-body">
              Browse upcoming fixtures or visit the match centre for live tournament updates.
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
              href="/tickets"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-rich-black text-xs font-heading font-black uppercase tracking-wider transition-colors border border-black/10"
            >
              <span>View Fixtures</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

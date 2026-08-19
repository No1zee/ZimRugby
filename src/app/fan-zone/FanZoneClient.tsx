"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ArrowRight,
  LogOut,
  ExternalLink,
  Copy,
  Check,
  Ticket,
  Percent,
  Mail,
  Trophy,
  Users,
  Compass,
  Sparkles,
  Award,
  ChevronRight,
  Globe2,
} from "lucide-react";
import Link from "next/link";
import CmsHero from "@/components/cms/CmsHero";
import EdgyGradient from "@/components/ui/EdgyGradient";
import FanzoneBenefits from "@/components/fanzone/FanzoneBenefits";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import { useAuth } from "@/context/AuthContext";

interface FanZoneClientProps {
  cmsPage?: any;
}

const SUPPORTER_CHAPTERS = [
  {
    city: "Harare & National",
    base: "Harare Sports Club / Machinery Exchange",
    members: "14,200+ Members",
    focus: "Matchday Gatherings & Clubhouse Events",
    flag: "🇿🇼",
  },
  {
    city: "Bulawayo & Southern Region",
    base: "Hartsfield Rugby Ground",
    members: "6,800+ Members",
    focus: "Regional Derbies & Youth Development",
    flag: "🇿🇼",
  },
  {
    city: "United Kingdom & Europe",
    base: "London Chapter (Twickenham & Richmond)",
    members: "8,500+ Members",
    focus: "Diaspora Tours & Overseas Test Meetups",
    flag: "🇬🇧",
  },
  {
    city: "South Africa & Regional",
    base: "Johannesburg & Cape Town",
    members: "9,100+ Members",
    focus: "Currie Cup / Mzansi Sables Watch Parties",
    flag: "🇿🇦",
  },
];

const DIGITAL_RESOURCES = [
  {
    title: "Official Matchday Digital Programmes",
    description: "Full squad bios, tactical analysis sheets, and historical match archives available for direct viewing.",
    tag: "Match Archives",
    href: "/media",
    action: "Browse Media",
  },
  {
    title: "Sables 2026 Test Calendar & Ticketing",
    description: "Sync the national team fixtures straight to your personal calendar with automatic kickoff time alerts.",
    tag: "Fixtures & Sync",
    href: "/tickets",
    action: "View Tickets",
  },
  {
    title: "ZRU Clubhouse Online Store",
    description: "Official Canterbury & Puma match jerseys, training vests, and supporter caps with member discount applied.",
    tag: "Store Discount",
    href: "/shop",
    action: "Visit Clubhouse Store",
  },
];

export default function FanZonePage({ cmsPage }: FanZoneClientProps) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);

  const memberId = user
    ? `ZRU-${(user.name.slice(0, 3) + (user.handle?.replace(/[^0-9]/g, "") || "2026")).toUpperCase().padEnd(8, "0")}`
    : "ZRU-GUEST";

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(memberId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <main className="bg-milk-white min-h-screen pb-16 text-rich-black relative overflow-hidden">
      {/* Subtle Grain / Background Gradient */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <EdgyGradient opacity={0.12} />
      </div>

      <div className="relative z-10">
        <CmsHero
          kicker={cmsPage?.hero_kicker || "OFFICIAL SUPPORTERS NETWORK"}
          title={cmsPage?.hero_title || "FAN ZONE"}
          intro={
            cmsPage?.hero_intro ||
            "The official heartbeat of Zimbabwe Rugby. Join our global supporters network, access priority ticket allocations, and unlock members-only privileges."
          }
          image={cmsPage?.hero_image || "/images/gallery/zimbabwe-sables-0350.webp"}
          breadcrumb={[{ label: "Fan Zone", href: "/fan-zone" }]}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10 space-y-12">
        <PageAnnouncements scope="media" />

        {/* Authenticated Member Passport View */}
        {isAuthenticated && user ? (
          <div className="space-y-10">
            {/* Editorial Supporter Passport Card */}
            <div className="bg-rich-black text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Left Passport Details */}
                <div className="space-y-5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="bg-zru-green/20 border border-zru-green/30 text-accent-teal text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent-teal" />
                      <span>OFFICIAL SABLES SUPPORTER</span>
                    </span>
                    <span className="text-white/40 text-[10px] font-mono tabular-nums uppercase tracking-widest">
                      SEASON 2026 PASS
                    </span>
                  </div>

                  <div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white uppercase tracking-tight leading-none">
                      Welcome, {user.name}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-white/70 font-normal leading-relaxed">
                      Your Zimbabwe Rugby Union supporter credentials are live. Use your verified supporter code for 10% Clubhouse store savings and matchday presale access.
                    </p>
                  </div>

                  {/* Quick Action Navigation Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href="/tickets"
                      className="inline-flex items-center gap-2 rounded-xl bg-zru-green px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white shadow-sm transition-[background-color] duration-200 hover:bg-[#004D2C]"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Priority Match Tickets</span>
                    </Link>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-[background-color] duration-200 border border-white/10"
                    >
                      <Percent className="w-3.5 h-3.5" />
                      <span>Clubhouse Store (10% Off)</span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="inline-flex items-center gap-2 rounded-xl bg-transparent hover:bg-red-500/10 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-red-400 transition-[background-color,color] duration-200 border border-red-500/20"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>

                {/* Right Passport Credential Box */}
                <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-5 lg:p-6 text-xs flex flex-col justify-between min-w-[280px] sm:min-w-[320px]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zru-green flex items-center justify-center text-base font-heading font-black text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-heading font-black tracking-wide text-sm">{user.name}</p>
                        <p className="text-accent-teal text-[11px] font-mono tabular-nums">{user.handle || "@supporter"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 font-mono text-[11px] tabular-nums">
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 uppercase">Supporter Team</span>
                      <span className="text-white font-bold">{user.favoriteTeam || "Zimbabwe Sables"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 uppercase">Verified ID</span>
                      <button
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 text-accent-teal hover:text-white transition-colors cursor-pointer"
                        title="Click to copy member code"
                      >
                        <span className="font-bold">{memberId}</span>
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/50" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 uppercase">Member Tier</span>
                      <span className="text-accent-teal font-bold uppercase">Active Member</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono">
                    <span>ZIMBABWE RUGBY UNION</span>
                    <span className="tabular-nums">EST. 1895</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusive Benefits Grid */}
            <FanzoneBenefits />
          </div>
        ) : (
          /* Non-authenticated Guest View */
          <div className="space-y-12">
            {/* Editorial Guest Welcome Hub */}
            <div className="bg-rich-black text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/10 shadow-xl relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-teal block">
                    Join The National Movement
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white uppercase tracking-tight leading-[1.05]">
                    Stand With Zimbabwe Rugby. Worldwide.
                  </h2>
                  <p className="text-sm text-white/70 font-normal leading-relaxed max-w-xl">
                    Whether you are in the stands at Harare Sports Club or backing the green & white from the diaspora, the ZRU Fan Zone connects you directly to our national teams, priority match allocations, and exclusive merchandise drops.
                  </p>

                  <div className="pt-3 flex flex-wrap items-center gap-4">
                    <Link
                      href="/login?redirect=/fan-zone"
                      className="inline-flex items-center gap-2 rounded-xl bg-zru-green hover:bg-[#004D2C] px-6 py-3.5 font-heading text-xs font-black uppercase tracking-wider text-white shadow-md transition-[background-color] duration-200 group"
                    >
                      <span>Join Fan Zone or Sign In</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                      href="/tickets"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-6 py-3.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-[background-color] duration-200 border border-white/10"
                    >
                      <span>Explore Fixtures</span>
                    </Link>
                  </div>
                </div>

                {/* Right Highlight Box */}
                <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 block">
                    Supporter Pass Privileges
                  </span>
                  <div className="space-y-3">
                    {[
                      "48-hour priority test match ticket windows",
                      "10% discount on official jerseys and merch",
                      "Team sheets & tactical briefings delivered direct",
                      "Entry into VIP matchday hospitality draws",
                    ].map((perk, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                        <div className="w-4 h-4 rounded-full bg-zru-green/30 border border-zru-green/50 text-accent-teal flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[11px] text-white/50">
                    Free supporter registration • No subscription fees
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Bento */}
            <FanzoneBenefits />
          </div>
        )}

        {/* Global Supporter Chapters Section */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/10 pb-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zru-green block mb-1">
                Global Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-rich-black uppercase tracking-tight">
                Supporters Chapters & Branches
              </h2>
            </div>
            <p className="text-xs text-black/60 font-normal max-w-md">
              Connect with fellow Zimbabwe Rugby supporters across our registered regional and international community hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUPPORTER_CHAPTERS.map((chapter) => (
              <div
                key={chapter.city}
                className="bg-white border border-black/10 rounded-2xl p-5 flex flex-col justify-between hover:border-zru-green/40 transition-[border-color] duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xl">{chapter.flag}</span>
                    <span className="text-[10px] font-mono tabular-nums font-bold text-zru-green bg-zru-green/10 px-2 py-0.5 rounded">
                      {chapter.members}
                    </span>
                  </div>
                  <h3 className="font-heading font-black uppercase tracking-tight text-base text-rich-black mb-1">
                    {chapter.city}
                  </h3>
                  <p className="text-xs font-medium text-black/70 mb-2">{chapter.base}</p>
                  <p className="text-[11px] text-black/50 leading-relaxed">{chapter.focus}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zru-green">
                  <span>Official Branch</span>
                  <Globe2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Digital Clubhouse & Resources */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/10 pb-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zru-green block mb-1">
                Digital Clubhouse
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-rich-black uppercase tracking-tight">
                Supporter Resources & Channels
              </h2>
            </div>
            <p className="text-xs text-black/60 font-normal max-w-md">
              Everything you need for matchday preparation, kit acquisition, and team tracking in one central hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DIGITAL_RESOURCES.map((res) => (
              <div
                key={res.title}
                className="bg-white border border-black/10 rounded-2xl p-6 flex flex-col justify-between hover:border-zru-green/40 transition-[border-color] duration-200 group"
              >
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zru-green block mb-2">
                    {res.tag}
                  </span>
                  <h3 className="font-heading font-black uppercase tracking-tight text-lg text-rich-black mb-2 group-hover:text-zru-green transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-xs text-black/60 font-normal leading-relaxed mb-6">
                    {res.description}
                  </p>
                </div>

                <Link
                  href={res.href}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zru-green hover:text-[#004D2C] transition-colors"
                >
                  <span>{res.action}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}


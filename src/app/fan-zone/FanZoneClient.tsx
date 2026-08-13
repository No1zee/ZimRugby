"use client";

import { useState } from "react";
import {
  Mail,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Ticket,
  Percent,
  Trophy,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { saveSubmission } from "@/lib/mockStorage";
import Image from "next/image";

import CmsHero from "@/components/cms/CmsHero";
import EdgyGradient from "@/components/ui/EdgyGradient";
import FanzoneBenefits from "@/components/fanzone/FanzoneBenefits";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface FanZoneClientProps {
  cmsPage?: any;
}

export default function FanZonePage({ cmsPage }: FanZoneClientProps) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Zimbabwe");
  const [favTeam, setFavTeam] = useState("Zimbabwe Sables");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const countries = [
    "Zimbabwe",
    "South Africa",
    "United Kingdom",
    "Australia",
    "United States",
    "Canada",
    "New Zealand",
    "Zambia",
    "Botswana",
    "Other",
  ];

  const teams = [
    "Zimbabwe Sables",
    "Lady Sables",
    "Junior Sables (U20)",
    "Zimbabwe Cheetahs (7s)",
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !agreed) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await saveSubmission("fan_zone_member", {
        name,
        email,
        country,
        favoriteTeam: favTeam,
        source: "Fan Zone Supporters Registration",
        submittedAt: new Date().toISOString(),
      });

      setSubmitted(true);
    } catch {
      setSubmitError("Failed to complete registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-milk-white min-h-screen pb-12 text-rich-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <EdgyGradient opacity={0.15} />
      </div>

      <div className="relative z-10">
        <CmsHero
          kicker={cmsPage?.hero_kicker || "Official Supporters Club"}
          title={cmsPage?.hero_title || "Fan Zone"}
          intro={cmsPage?.hero_intro || "The heartbeat of Zimbabwe Rugby. Join our global supporters network, get the latest inside scoops, and unlock members-only benefits."}
          image={cmsPage?.hero_image || "/images/gallery/zimbabwe-sables-0350.webp"}
          breadcrumb={[{ label: "Fan Zone", href: "/fan-zone" }]}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-12">

        {!isAuthenticated && <FanzoneBenefits />}

        {/* Authenticated Member Passport View */}
        {isAuthenticated && user ? (
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Premium Welcome Hero Card */}
            <div className="bg-[#004D2C] text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Official Supporter</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
                    Welcome to the Inner Circle, {user.name}
                  </h2>
                  <p className="mt-2 text-sm text-emerald-100 max-w-2xl font-normal leading-relaxed">
                    You have successfully authenticated your Sables supporters club profile. Enjoy priority privileges, discounts, and inner-circle updates.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2.5 shrink-0 bg-black/20 rounded-2xl p-5 border border-white/5 text-xs min-w-[220px]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sm font-black text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-bold">{user.handle || "@supporter"}</p>
                      <p className="text-white/45 text-[10px] truncate max-w-[140px]">{user.email}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-1 flex items-center justify-between">
                    <span className="text-white/45 text-[10px] uppercase tracking-wider font-mono">Status</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Active Member</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusive Benefits Grid */}
            <div className="space-y-6">
              <div className="border-b border-black/10 pb-4">
                <h3 className="font-heading text-xl font-black text-rich-black uppercase tracking-tight">
                  Your Supporter Privileges
                </h3>
                <p className="text-xs text-black/60">Here is exactly what you get as an active supporters club member.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-zru-green/45 hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-zru-green/10 flex items-center justify-center text-zru-green mb-4">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zru-green block mb-1.5">Matchday Perk</span>
                  <h4 className="text-sm font-black uppercase tracking-tight text-rich-black mb-2">Priority Tickets Presale</h4>
                  <p className="text-xs text-black/60 font-normal leading-relaxed">
                    Get exclusive access to major Sables test match tickets 48 hours before general public release. Keep an eye on your inbox for presale passwords.
                  </p>
                </div>

                <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-zru-green/45 hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-zru-green/10 flex items-center justify-center text-zru-green mb-4">
                    <Percent className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zru-green block mb-1.5">Clubhouse Store</span>
                  <h4 className="text-sm font-black uppercase tracking-tight text-rich-black mb-2">Exclusive Merch Discounts</h4>
                  <p className="text-xs text-black/60 font-normal leading-relaxed">
                    Enjoy 10% off all official Zimbabwe Rugby jerseys and gear at the ZRU Clubhouse store. Show your authenticated member badge in-store to claim.
                  </p>
                </div>

                <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-zru-green/45 hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-zru-green/10 flex items-center justify-center text-zru-green mb-4">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zru-green block mb-1.5">Direct Pressroom</span>
                  <h4 className="text-sm font-black uppercase tracking-tight text-rich-black mb-2">Insider Squad Newsletter</h4>
                  <p className="text-xs text-black/60 font-normal leading-relaxed">
                    Receive official Sables team announcements, matchday lineups, and injury updates directly to your inbox before the general media.
                  </p>
                </div>

                <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-zru-green/45 hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-zru-green/10 flex items-center justify-center text-zru-green mb-4">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zru-green block mb-1.5">Supporters Draw</span>
                  <h4 className="text-sm font-black uppercase tracking-tight text-rich-black mb-2">VIP Fan Competitions</h4>
                  <p className="text-xs text-black/60 font-normal leading-relaxed">
                    Enter monthly draws to win signed match balls, player jerseys, and VIP matchday hospitality passes for local Zimbabwe test matches.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Logout */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-black/10 pt-8 gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/match-centre"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#006747] px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white shadow-sm transition-[background-color] duration-200 hover:bg-[#004D2C]"
                >
                  Explore Fixtures <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/tickets"
                  className="inline-flex items-center gap-2 rounded-xl bg-black/5 px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-rich-black transition-[background-color] duration-200 hover:bg-black/10"
                >
                  Buy Match Tickets
                </Link>
              </div>

              <button
                onClick={() => signOut()}
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-red-500 transition-[background-color,color] duration-200 hover:bg-red-500/10 hover:text-red-600"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Non-authenticated Guest View */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24">
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-rich-black uppercase tracking-tight">
                Join the Fanzone
              </h2>
              <p className="text-xs text-black/60 font-normal leading-relaxed">
                No cost. Premium experience. Globally connected.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Priority ticket presale access",
                  "10% official merchandise discount",
                  "Insider squad newsletter",
                  "VIP fan competitions",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-xs text-black/60"
                  >
                    <CheckCircle2 className="w-4 h-4 text-zru-green shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-xl text-center space-y-6">
                <div className="w-16 h-16 bg-[#006747]/10 text-[#006747] rounded-2xl flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading uppercase tracking-wide">
                    Sables Supporters Network
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                    Sign in to your account or create a new profile with your unique handle to access pre-sales, merchandise discounts, and match alerts.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/login?redirect=/fan-zone"
                    className="w-full sm:w-auto px-6 py-3 bg-[#006747] hover:bg-[#004D2C] text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    <span>Sign In to Fan Zone</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import {
  Mail,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
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
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#004D2C] text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/15 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-black font-heading text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading tracking-wide text-white">{user.name}</h3>
                    <p className="text-sm text-emerald-300 font-mono font-medium">{user.handle || "@supporter"}</p>
                  </div>
                </div>
                <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Official Supporter</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-xs">
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                  <span className="text-white/50 font-medium block mb-1 uppercase tracking-wider text-[10px]">Email Address</span>
                  <span className="text-white font-medium text-sm truncate block">{user.email}</span>
                </div>
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                  <span className="text-white/50 font-medium block mb-1 uppercase tracking-wider text-[10px]">Favorite Squad</span>
                  <span className="text-white font-medium text-sm block">{user.favoriteTeam || "Zimbabwe Sables"}</span>
                </div>
              </div>

              <div className="border-t border-white/15 pt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Authenticated via Supabase Session</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-white/60 hover:text-white underline transition-colors"
                >
                  Sign Out
                </button>
              </div>
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

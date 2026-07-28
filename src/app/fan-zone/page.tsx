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

import PageHero from "@/components/ui/PageHero";
import EdgyGradient from "@/components/ui/EdgyGradient";
import FanzoneBenefits from "@/components/fanzone/FanzoneBenefits";

export default function FanZonePage() {
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
        <PageHero
          title="Fan Zone"
          subtitle="The heartbeat of Zimbabwe Rugby. Join our global supporters network, get the latest inside scoops, and unlock members-only benefits."
          tag="Official Supporters Club"
          backgroundImage="/images/gallery/zimbabwe-sables-0351.webp"
          breadcrumb={[{ label: "Fan Zone", href: "/fan-zone" }]}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-12">

        {!submitted && <FanzoneBenefits />}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {!submitted && (
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
          )}

          <div
            className={`${
              submitted ? "lg:col-span-5 max-w-2xl mx-auto" : "lg:col-span-3"
            }`}
          >
            <div
              className={`bg-white border rounded-2xl p-6 md:p-8 transition-[border-color,box-shadow] duration-500 ${
                submitted
                  ? "border-zru-green shadow-lg"
                  : "border-black/5 shadow-md"
              }`}
            >
              {!submitted ? (
                <>
                  <div className="border-b border-black/5 pb-5 mb-5">
                    <h3 className="text-base font-black uppercase tracking-widest text-zru-green flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Register</span>
                    </h3>
                    <p className="text-black/50 text-[10px] font-bold uppercase tracking-wider mt-1">
                      Secure your supporters card
                    </p>
                  </div>

                  <form onSubmit={handleSubscribe} className="space-y-4">
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-600 text-[11px] font-bold">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-black/60 font-black uppercase tracking-wider block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Adrian Garvey"
                        className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-rich-black placeholder-black/30 focus:outline-none focus:border-zru-green text-xs transition-[border-color] duration-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-black/60 font-black uppercase tracking-wider block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. adrian@sables.co.zw"
                        className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-rich-black placeholder-black/30 focus:outline-none focus:border-zru-green text-xs transition-[border-color] duration-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-black/60 font-black uppercase tracking-wider block">
                        Country of Residence
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-rich-black focus:outline-none focus:border-zru-green text-xs transition-[border-color] duration-300"
                      >
                        {countries.map((c) => (
                          <option
                            key={c}
                            value={c}
                            className="bg-white text-rich-black"
                          >
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-black/60 font-black uppercase tracking-wider block">
                        Favorite National Squad
                      </label>
                      <select
                        value={favTeam}
                        onChange={(e) => setFavTeam(e.target.value)}
                        className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-rich-black focus:outline-none focus:border-zru-green text-xs transition-[border-color] duration-300"
                      >
                        {teams.map((t) => (
                          <option
                            key={t}
                            value={t}
                            className="bg-white text-rich-black"
                          >
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="agreed"
                        required
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-black/20 bg-black/5 focus:ring-0 text-zru-green"
                      />
                      <label
                        htmlFor="agreed"
                        className="text-[10px] text-black/60 font-bold uppercase tracking-wider leading-relaxed cursor-pointer select-none"
                      >
                        I agree to join the Sables Supporters Club and receive
                        weekly news, updates, and commercial offerings from ZRU.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-zru-green hover:bg-[#005238] text-white font-black text-xs uppercase tracking-[0.2em] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-[background-color] duration-300 shadow-md mt-6 disabled:opacity-50"
                    >
                      <span>
                        {isSubmitting ? "Registering…" : "Register supporters card"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4 space-y-6">
                  <div className="w-full max-w-sm mx-auto p-5 rounded-2xl bg-gradient-to-br from-[#003B24] via-[#002617] to-[#00170E] border border-[#006747]/40 shadow-xl text-left relative overflow-hidden">
                    <div className="absolute -bottom-8 -right-8 opacity-10 pointer-events-none select-none">
                      <Image
                        src="/images/logos/zru-logo.svg"
                        alt=""
                        width={160}
                        height={160}
                        className="object-contain"
                      />
                    </div>

                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/logos/zru-logo.svg"
                          alt="ZRU Crest"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                        <div>
                          <h5 className="font-heading font-black text-[10px] text-[#006747] uppercase tracking-wider leading-none">
                            Zimbabwe Rugby
                          </h5>
                          <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest">
                            Official Fanzone Pass
                          </span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-[#006747]" />
                    </div>

                    <div className="space-y-2.5 relative z-10">
                      <div>
                        <span className="text-[7px] text-white/40 uppercase tracking-widest font-bold block">
                          Member Name
                        </span>
                        <span className="text-sm font-heading font-black text-white uppercase tracking-wide">
                          {name}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-white/10 text-[9px]">
                        <div>
                          <span className="text-[7px] text-white/40 uppercase tracking-widest font-bold block">
                            Squad
                          </span>
                          <span className="font-bold text-[#006747] uppercase">
                            {favTeam}
                          </span>
                        </div>
                        <div>
                          <span className="text-[7px] text-white/40 uppercase tracking-widest font-bold block">
                            Country
                          </span>
                          <span className="font-bold text-white uppercase">
                            {country}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[8px] font-body text-white/40 relative z-10">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#006747]" />
                        <span>
                          MEMBER ID: ZRU-
                          {Math.floor(100000 + Math.random() * 900000)}
                        </span>
                      </span>
                      <span className="text-[#006747] font-bold uppercase">
                        Status: Active
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 max-w-sm mx-auto">
                    <h4 className="font-black text-base text-rich-black uppercase tracking-wider leading-none">
                      Welcome to the Fanzone!
                    </h4>
                    <p className="text-black/70 text-xs leading-relaxed font-normal">
                      Your ZRU Supporter Membership has been successfully
                      activated. A confirmation email and details regarding your{" "}
                      <strong>10% Clubhouse discount</strong> have been sent to{" "}
                      <strong>{email}</strong>.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setAgreed(false);
                    }}
                    className="text-[10px] font-black uppercase text-black/50 hover:text-rich-black transition-[color] duration-300 tracking-widest block pt-2 mx-auto"
                  >
                    Create Another Supporter Account
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

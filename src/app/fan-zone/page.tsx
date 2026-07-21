"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EdgyGradient from "@/components/ui/EdgyGradient";
import { Mail, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle, RotateCcw } from "lucide-react";
import { saveSubmission } from "@/lib/mockStorage";
import Image from "next/image";

import PageHero from "@/components/ui/PageHero";
import FanzoneFlipShowcase from "@/components/fanzone/FanzoneFlipShowcase";

export default function FanZonePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Zimbabwe");
  const [favTeam, setFavTeam] = useState("Zimbabwe Sables");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCenterStage, setIsCenterStage] = useState(false);
  
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
    "Other"
  ];

  const teams = [
    "Zimbabwe Sables",
    "Lady Sables",
    "Junior Sables (U20)",
    "Zimbabwe Cheetahs (7s)"
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !agreed) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await saveSubmission("newsletter", {
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
    <main className="bg-milk-white min-h-screen pb-24 text-rich-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <EdgyGradient opacity={0.15} />
      </div>

      {/* PageHero header */}
      <div className="pt-24 relative z-10">
        <PageHero
          title="Fan Zone"
          subtitle="The heartbeat of Zimbabwe Rugby. Join our global supporters network, get the latest inside scoops, and unlock members-only benefits."
          tag="Official Supporters Club"
          backgroundImage="/images/gallery/zimbabwe-sables-0351.webp"
          breadcrumb={[{ label: "Fan Zone", href: "/fan-zone" }]}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 relative z-10">

        {/* Replay Benefits Preview Option */}
        {isCenterStage && !submitted && (
          <div className="flex justify-center pb-6">
            <button
              onClick={() => setIsCenterStage(false)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 hover:bg-black/10 text-rich-black/70 hover:text-rich-black rounded-full text-[11px] font-black tracking-widest uppercase transition-all shadow-sm border border-black/5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zru-green" />
              <span>Replay Benefits Showcase</span>
            </button>
          </div>
        )}

        {/* Dynamic Transition Grid: 3D Flip Showcase -> Form Center Stage */}
        <div className={`transition-all duration-700 ease-in-out ${
          isCenterStage
            ? "max-w-2xl mx-auto"
            : "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        }`}>
          
          {/* Column 1: 3D Continuous Flip Card Showcase */}
          <AnimatePresence mode="popLayout">
            {!isCenterStage && (
              <motion.div
                key="flip-showcase"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6 flex flex-col items-center"
              >
                <div className="text-center space-y-2 max-w-md">
                  <h2 className="text-2xl font-heading font-black text-rich-black uppercase tracking-tight">
                    WHY JOIN THE FANZONE?
                  </h2>
                  <p className="text-xs text-black/60 font-medium">
                    Hover or tap to flip through membership perks before signing up.
                  </p>
                </div>

                <FanzoneFlipShowcase onTriggerJoin={() => setIsCenterStage(true)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Column 2: Registration Form (Moves to Center Stage) */}
          <motion.div
            layout
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`bg-white border rounded-3xl p-6 md:p-10 transition-all duration-500 relative overflow-hidden ${
              isCenterStage
                ? "border-zru-green shadow-2xl ring-4 ring-zru-green/10"
                : "border-black/5 shadow-xl"
            }`}
          >
            
            <div className="border-b border-black/5 pb-6 mb-6">
              <h3 className="text-lg font-black uppercase tracking-widest text-zru-green flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>JOIN THE FANZONE</span>
              </h3>
              <p className="text-black/50 text-xs font-bold uppercase tracking-wider mt-1">No cost. Premium experience. Globally connected.</p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubscribe} className="space-y-4">
                {submitError && (
                  <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-500 text-[11px] font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-black/60 font-black uppercase tracking-wider block">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adrian Garvey"
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-rich-black placeholder-black/30 focus:outline-none focus:border-zru-green text-xs transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-black/60 font-black uppercase tracking-wider block">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. adrian@sables.co.zw"
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-rich-black placeholder-black/30 focus:outline-none focus:border-zru-green text-xs transition-colors"
                  />
                </div>

                {/* Country of Residence */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-black/60 font-black uppercase tracking-wider block">Country of Residence</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-rich-black focus:outline-none focus:border-zru-green text-xs transition-colors"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c} className="bg-white text-rich-black">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Favorite Squad */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-black/60 font-black uppercase tracking-wider block">Favorite National Squad</label>
                  <select
                    value={favTeam}
                    onChange={(e) => setFavTeam(e.target.value)}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-rich-black focus:outline-none focus:border-zru-green text-xs transition-colors"
                  >
                    {teams.map((t) => (
                      <option key={t} value={t} className="bg-white text-rich-black">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Agreement checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="agreed"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-black/20 bg-black/5 focus:ring-0 text-zru-green"
                  />
                  <label htmlFor="agreed" className="text-[10px] text-black/60 font-bold uppercase tracking-wider leading-relaxed cursor-pointer select-none">
                    I agree to join the Sables Supporters Club and receive weekly news, updates, and commercial offerings from ZRU.
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zru-green hover:bg-[#005238] text-white font-black text-xs uppercase tracking-[0.2em] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg mt-6 disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Registering…" : "Register supporters card"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                {/* Official Digital Sables Supporter Pass */}
                <div className="w-full max-w-sm mx-auto p-6 rounded-2xl bg-gradient-to-br from-[#003B24] via-[#002617] to-[#00170E] border border-[#00FF87]/40 shadow-2xl text-left relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/logos/zru-logo.svg"
                        alt="ZRU Crest"
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                      <div>
                        <h5 className="font-heading font-black text-xs text-[#00FF87] uppercase tracking-wider leading-none">ZIMBABWE RUGBY</h5>
                        <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest">OFFICIAL FANZONE PASS</span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-[#00FF87]" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold block">MEMBER NAME</span>
                      <span className="text-base font-heading font-black text-white uppercase tracking-wide">{name}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[10px]">
                      <div>
                        <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold block">SQUAD</span>
                        <span className="font-bold text-[#00FF87] uppercase">{favTeam}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold block">COUNTRY</span>
                        <span className="font-bold text-white uppercase">{country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-white/40">
                    <span>MEMBER ID: ZRU-{Math.floor(100000 + Math.random() * 900000)}</span>
                    <span className="text-[#00FF87] font-bold uppercase">STATUS: ACTIVE</span>
                  </div>
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  <h4 className="font-black text-lg text-rich-black uppercase tracking-wider leading-none">WELCOME TO THE FANZONE!</h4>
                  <p className="text-black/70 text-xs leading-relaxed font-medium">
                    Your ZRU Supporter Membership has been successfully activated. A confirmation email and details regarding your <strong>10% Clubhouse discount</strong> have been sent to <strong>{email}</strong>.
                  </p>
                </div>

                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setAgreed(false);
                    setIsCenterStage(false);
                  }}
                  className="text-[10px] font-black uppercase text-black/50 hover:text-black transition-colors tracking-widest block pt-2 mx-auto"
                >
                  Create Another Supporter Account
                </button>
              </motion.div>
            )}

          </motion.div>

        </div>

      </div>
    </main>
  );
}

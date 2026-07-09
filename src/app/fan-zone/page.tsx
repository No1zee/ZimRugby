"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, Ticket, Percent, Newspaper, Trophy, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import { saveSubmission } from "@/lib/mockStorage";

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
    "Other"
  ];

  const teams = [
    "Zimbabwe Sables",
    "Lady Sables",
    "Junior Sables (U20)",
    "Zimbabwe Cheetahs (7s)"
  ];

  const benefits = [
    { title: "Priority Tickets Presale", desc: "Get access to major test match tickets 48 hours before general release.", icon: Ticket },
    { title: "Exclusive Merch Discounts", desc: "Enjoy 10% off all official merchandise at the ZRU Clubhouse store.", icon: Percent },
    { title: "Weekly Sables Wire", desc: "Receive team announcements, matchday lineups, and injury updates first.", icon: Newspaper },
    { title: "VIP Fan Competitions", desc: "Enter monthly draws to win signed memorabilia and VIP matchday passes.", icon: Trophy }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !agreed) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const res = await saveSubmission("newsletter", { name, email, country, favoriteTeam: favTeam });
      if (res.success) {
        setSubmitted(true);
      } else {
        setSubmitError(res.message);
      }
    } catch (err) {
      setSubmitError("An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-rich-black min-h-screen pt-24 pb-24 text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Widescreen Hero Banner */}
        <section className="relative w-full h-[40vh] min-h-[300px] rounded-3xl overflow-hidden flex items-end mb-16 shadow-2xl">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[#006039] opacity-30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/40 to-transparent" />
            
            {/* Ambient gold splash */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-zru-green/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 max-w-3xl">
            <span className="text-zru-green text-xs font-black uppercase tracking-[0.4em] mb-2 block">
              OFFICIAL SUPPORTERS CLUB
            </span>
            <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-glow-green leading-none">
              SABLES FAN ZONE
            </h1>
            <p className="text-white/80 text-sm md:text-base mt-4 font-medium leading-relaxed">
              The heartbeat of Zimbabwe Rugby. Join our global supporters network, get the latest inside scoops, and unlock members-only benefits.
            </p>
          </div>
        </section>

        {/* Two-Column Grid: Benefits + Registration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Column 1: Benefits Preview */}
          <div className="space-y-8">
            <div className="border-l-4 border-zru-green pl-4">
              <h2 className="text-2xl font-black uppercase tracking-wider">MEMBERSHIP BENEFITS</h2>
              <p className="text-sm text-white/50 mt-1">What you unlock when you join the Sables Fan Club today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-6 space-y-4 hover:-translate-y-1 transition-all duration-300 shadow-md group glow-green-card"
                  >
                    <div className="w-10 h-10 bg-zru-green/20 rounded-xl flex items-center justify-center text-zru-green border border-white/5 group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-sm text-white uppercase tracking-tight">{b.title}</h3>
                    <p className="text-white/50 text-xs leading-relaxed font-medium">{b.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Newsletter Registration Form (SA Rugby Pattern) */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden glow-green-card">
            
            <div className="border-b border-white/5 pb-6 mb-6">
              <h3 className="text-lg font-black uppercase tracking-widest text-zru-green flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>JOIN THE WIRE</span>
              </h3>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mt-1">No cost. Premium experience. Globally connected.</p>
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
                  <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adrian Garvey"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-zru-green text-xs transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. adrian@sables.co.zw"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-zru-green text-xs transition-colors"
                  />
                </div>

                {/* Country of Residence - SA Rugby global fan base pattern */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">Country of Residence</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-zru-green text-xs transition-colors"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c} className="bg-rich-black text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Favorite Squad */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">Favorite National Squad</label>
                  <select
                    value={favTeam}
                    onChange={(e) => setFavTeam(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-zru-green text-xs transition-colors"
                  >
                    {teams.map((t) => (
                      <option key={t} value={t} className="bg-rich-black text-white">
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
                    className="mt-0.5 rounded border-white/10 bg-black/40 focus:ring-0 text-zru-green"
                  />
                  <label htmlFor="agreed" className="text-[10px] text-white/40 font-bold uppercase tracking-wider leading-relaxed cursor-pointer select-none">
                    I agree to join the Sables Supporters Club and receive weekly news, updates, and commercial offerings from ZRU.
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zru-green hover:bg-white hover:text-rich-black text-rich-black font-black text-xs uppercase tracking-[0.2em] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg mt-6 disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Registering…" : "Register supporters card"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="inline-flex p-4 bg-zru-green/20 rounded-full border border-zru-green/30 text-zru-green mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-black text-lg text-white uppercase tracking-wider leading-none">WELCOME TO THE TEAM!</h4>
                <p className="text-white/70 text-xs leading-relaxed max-w-sm mx-auto font-medium">
                  Congratulations, <strong>{name}</strong>! Your ZRU Supporter Membership has been successfully activated. A confirmation email and details regarding your <strong>10% Clubhouse discount</strong> have been sent to <strong>{email}</strong>.
                </p>
                
                <div className="border-t border-white/5 pt-6 mt-6 flex items-center gap-3 justify-center text-[10px] font-black uppercase tracking-widest text-zru-green">
                  <ShieldCheck className="w-5 h-5 text-zru-green" />
                  <span>MEMBER COUNTRY: {country.toUpperCase()}</span>
                </div>
                
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setAgreed(false);
                  }}
                  className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors tracking-widest block pt-4 mx-auto"
                >
                  Create Another Supporter Account
                </button>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}

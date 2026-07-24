"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function HomeNewsletterBanner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="w-full bg-milk-white py-8 lg:py-10 relative z-20 border-t border-black/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3D Glass Interactive Card with Motion Hover */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, scale: 1.005 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative overflow-hidden bg-white border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_rgba(0,103,71,0.12)] hover:border-[#006747]/30 transition-all duration-500 group"
        >
          {/* Subtle Ambient Brand Glow on Hover */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#006747]/5 rounded-full blur-3xl group-hover:bg-[#006747]/10 transition-all duration-700 pointer-events-none" />

          {/* Left Group: Logo & Headlines */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10 w-full lg:w-3/5">
            
            {/* ZRU Crest Logo with Hover Lift */}
            <div className="h-16 w-16 rounded-2xl bg-milk-white border border-black/10 p-2.5 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:border-[#006747]/30 transition-all duration-300">
              <Image
                src="/images/logos/zru-logo.svg"
                alt="ZRU Crest"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>

            {/* Headline & Paragraph */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zru-green">
                <ShieldCheck className="w-4 h-4 text-zru-green" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">
                  OFFICIAL UNION DISPATCH
                </span>
              </div>

              <h3 className="heading-2 text-black tracking-tight uppercase italic">
                STAY CONNECTED WITH THE SABLES
              </h3>

              <p className="body-base text-black/70 text-sm font-sans max-w-lg">
                Receive official team selections, matchday ticket priority, and exclusive grassroots news directly in your inbox.
              </p>
            </div>
          </div>

          {/* Right Group: Interactive Form Container */}
          <div className="w-full lg:w-2/5 relative z-10">
            {subscribed ? (
              <div className="p-6 rounded-2xl bg-zru-green/10 border border-zru-green/30 flex items-center gap-4 text-zru-green">
                <CheckCircle className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-heading text-sm font-extrabold uppercase tracking-wide">
                    Dispatch Confirmed
                  </h4>
                  <p className="text-xs text-black/70 font-sans mt-0.5">
                    Thank you for subscribing to the official ZRU newsletter.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3.5 rounded-xl bg-milk-white border border-black/15 text-black placeholder:text-black/40 text-sm font-sans focus:outline-none focus:border-zru-green shadow-inner"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-zru-green hover:bg-[#005238] text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shrink-0 shadow-md shadow-zru-green/20"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Privacy Compliance Footer */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-black/50 px-1 font-sans">
              <span>Zero spam. Unsubscribe at any time.</span>
              <Link href="/privacy-policy" className="hover:text-zru-green font-bold transition-colors">
                CDPA 2021 Compliant
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

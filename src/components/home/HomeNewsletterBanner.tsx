"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

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
    <section className="w-full bg-milk-white py-12 lg:py-16 relative z-20 border-t border-black/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Light Theme Dispatch Container */}
        <div className="rounded-3xl p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative overflow-hidden bg-white border border-black/10 shadow-xl">
          
          {/* Left Group: Logo & Headlines */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10 w-full lg:w-3/5">
            
            {/* ZRU Crest Logo */}
            <div className="h-16 w-16 rounded-2xl bg-milk-white border border-black/10 p-2.5 flex items-center justify-center shrink-0 shadow-sm">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zru-green/10 border border-zru-green/20">
                <ShieldCheck className="w-3.5 h-3.5 text-zru-green" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zru-green">
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
              <Link href="/privacy-policy" className="hover:text-zru-green underline underline-offset-2">
                CDPA 2021 Compliant
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

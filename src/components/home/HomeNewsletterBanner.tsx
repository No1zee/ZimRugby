"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

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
    <section className="w-full bg-[#FDFBF0] py-12 lg:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Container Card */}
        <div className="bg-[#006747] rounded-xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Side: Headline & Text */}
          <div className="flex items-start space-x-5 max-w-2xl">
            <div className="p-3 bg-emerald-500/20 rounded-xl hidden sm:flex items-center justify-center shrink-0">
              <Mail className="w-8 h-8 text-emerald-300" />
            </div>

            <div>
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-300 font-heading">
                OFFICIAL BULLETIN
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight mt-1 text-white">
                SUBSCRIBE TO OUR NEWSLETTER
              </h3>
              <p className="text-sm text-white/80 leading-relaxed mt-2">
                Subscribe to our newsletter and be the first to receive match updates, squad announcements, and exclusive insights from Zimbabwe Rugby.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-auto shrink-0 min-w-[320px] sm:min-w-[400px]">
            {subscribed ? (
              <div className="flex items-center space-x-3 bg-emerald-800/60 text-emerald-200 px-6 py-4 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-sm font-semibold">
                  Thank you for subscribing! Check your inbox for updates.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-5 py-3.5 bg-white text-gray-900 placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-[#003825] font-extrabold text-xs tracking-widest uppercase rounded-lg transition-colors flex items-center justify-center space-x-2 shrink-0 shadow-md"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   HomeNewsletterBanner — Exact Stitch Specification Match
   ═══════════════════════════════════════════════════════════════════ */

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
    <section className="w-full bg-[#FDFBF0] py-12 relative z-20">
      <div className="max-w-[1440px] mx-auto px-8 sm:px-8">
        
        {/* Banner Card */}
        <div
          className="rounded-xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-sm"
          style={{
            background: "radial-gradient(circle at 50% 25%, #007A50 0%, #004D2C 60%, #002D1A 100%)",
          }}
        >
          
          {/* Dot Pattern Overlay */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Left Side: Mail Icon + Headlines */}
          <div className="flex items-center gap-6 relative z-10 w-full lg:w-1/2">
            <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white" style={{ fontSize: "32px" }}>
                mail
              </span>
            </div>
            <div>
              <h2
                className="text-2xl text-white text-unison mb-2"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                }}
              >
                SUBSCRIBE TO OUR NEWSLETTER
              </h2>
              <p className="text-sm text-white/80 max-w-md font-medium leading-relaxed">
                Subscribe to our newsletter and be the first to receive insights, updates, and expert tips on all things Zimbabwe Rugby.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="relative z-10 w-full lg:w-1/2 flex flex-col lg:items-end">
            <div className="w-full max-w-md">
              <p className="text-white/80 text-sm mb-2 font-medium">Stay up to date</p>
              
              {subscribed ? (
                <div className="bg-white/10 text-white p-4 rounded-sm border border-white/20 text-sm font-semibold">
                  ✓ Thank you for subscribing to Zimbabwe Rugby updates!
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white text-black px-4 py-3 rounded-l-sm rounded-r-none focus:outline-none focus:ring-2 focus:ring-[#006747] border-none text-sm placeholder:text-gray-500"
                  />
                  <button
                    type="submit"
                    className="bg-[#b2f0ca] text-black px-8 py-3 rounded-r-sm rounded-l-none hover:bg-white transition-colors duration-300 whitespace-nowrap font-bold text-xs tracking-wider uppercase font-heading shrink-0"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      letterSpacing: "0.1em",
                    }}
                  >
                    SUBSCRIBE
                  </button>
                </form>
              )}

              <p className="text-[10px] text-white/60 mt-3 font-medium">
                By subscribing you agree to our{" "}
                <Link className="underline hover:text-white" href="/privacy-policy">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

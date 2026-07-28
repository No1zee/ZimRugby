"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { saveSubmission } from "@/lib/mockStorage";

export default function HomeNewsletterBanner() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      await saveSubmission("fan_zone_member", {
        email,
        source: "Homepage Banner",
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-milk-white py-10 sm:py-14 lg:py-20 relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="group/uiverseCard rounded-3xl p-6 sm:p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 relative overflow-hidden shadow-2xl transition-shadow duration-500 ease-in-out touch-manipulation cursor-pointer border border-white/10"
          style={{
            background: "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)",
          }}
        >
          <div className="absolute inset-0 border border-white/10 group-hover/uiverseCard:border-[#006747]/60 group-focus-within/uiverseCard:border-[#006747]/60 group-hover/uiverseCard:shadow-[inset_0_0_60px_rgba(0,103,71,0.4)] transition-shadow duration-700 pointer-events-none rounded-3xl" />
          <div className="absolute inset-0 opacity-0 group-hover/uiverseCard:opacity-20 group-focus-within/uiverseCard:opacity-20 pointer-events-none bg-gradient-to-r from-transparent via-[#006747] to-transparent transition-opacity duration-700" />

          <div className="flex items-center justify-start lg:group-hover/uiverseCard:justify-center lg:group-focus-within/uiverseCard:justify-center gap-6 relative z-10 lg:w-3/5 lg:group-hover/uiverseCard:w-1/3 lg:group-focus-within/uiverseCard:w-1/3 transition-[width,justify-content] duration-500 shrink-0">
            <div className="relative shrink-0 flex items-center justify-center transition-transform duration-500 group-hover/uiverseCard:scale-175 sm:group-hover/uiverseCard:scale-200">
              <Image
                src="/images/logos/zru-logo.svg"
                alt="ZRU Emblem"
                width={72}
                height={72}
                className="w-16 sm:w-20 h-16 sm:h-20 object-contain filter drop-shadow-[0_4px_30px_rgba(0,103,71,0.85)] group-hover/uiverseCard:drop-shadow-[0_8px_35px_rgba(52,211,153,0.6)] transition-[filter] duration-500"
              />
            </div>

            <div className="space-y-1.5 transition-[opacity,max-width,transform] duration-500 origin-left max-w-lg opacity-100 group-hover/uiverseCard:opacity-0 group-hover/uiverseCard:max-w-0 group-hover/uiverseCard:scale-95 group-hover/uiverseCard:overflow-hidden group-focus-within/uiverseCard:opacity-0 group-focus-within/uiverseCard:max-w-0 group-focus-within/uiverseCard:scale-95 group-focus-within/uiverseCard:overflow-hidden shrink min-w-0">
              <h2 className="text-2xl sm:text-3xl text-white font-heading font-black uppercase tracking-tight leading-tight">
                JOIN THE FAN ZONE
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed font-body line-clamp-2">
                Priority ticket presale, 10% merch discounts, insider squad news, and VIP competitions. Free to join.
              </p>
            </div>
          </div>

          <div className="relative z-10 w-full lg:w-2/5 lg:group-hover/uiverseCard:w-2/3 lg:group-focus-within/uiverseCard:w-2/3 flex flex-col items-center lg:items-center lg:group-hover/uiverseCard:items-end lg:group-focus-within/uiverseCard:items-end transition-[width] duration-500">
            <div className="w-full lg:w-auto lg:group-hover/uiverseCard:w-full lg:group-focus-within/uiverseCard:w-full bg-white p-3 group-hover/uiverseCard:p-5 sm:group-hover/uiverseCard:p-7 group-focus-within/uiverseCard:p-5 sm:group-focus-within/uiverseCard:p-7 rounded-2xl border border-black/5 group-hover/uiverseCard:border-[#006747]/60 group-focus-within/uiverseCard:border-[#006747]/60 transition-[width,padding,border-color] duration-500 ease-in-out shadow-lg">

              <p className="text-[#003822]/70 text-xs font-bold uppercase tracking-wider font-heading transition-[opacity,max-height,margin,color] duration-500 opacity-0 max-h-0 overflow-hidden mb-0 group-hover/uiverseCard:opacity-100 group-hover/uiverseCard:max-h-10 group-hover/uiverseCard:mb-3 group-hover/uiverseCard:text-[#006747] group-focus-within/uiverseCard:opacity-100 group-focus-within/uiverseCard:max-h-10 group-focus-within/uiverseCard:mb-3 group-focus-within/uiverseCard:text-[#006747]">
                ENTER YOUR EMAIL BELOW TO JOIN THE FAN ZONE
              </p>

              {submitted ? (
                <div className="bg-[#006747]/10 text-[#0E0E0E] p-4 rounded-xl border border-[#006747]/20 text-sm font-bold flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#006747] shrink-0" />
                  <span>Welcome to the Fan Zone! Check your inbox for benefits.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full items-center justify-center group-hover/uiverseCard:justify-end group-focus-within/uiverseCard:justify-end transition-[justify-content] duration-500">
                  <div className="w-0 opacity-0 max-w-0 overflow-hidden transition-[width,opacity,max-width] duration-500 ease-in-out group-hover/uiverseCard:w-full group-hover/uiverseCard:opacity-100 group-hover/uiverseCard:max-w-full group-focus-within/uiverseCard:w-full group-focus-within/uiverseCard:opacity-100 group-focus-within/uiverseCard:max-w-full flex-1">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-black/5 text-[#0E0E0E] px-4 py-3.5 rounded-xl border border-black/10 focus:outline-none focus:border-zru-green text-sm placeholder:text-[#0E0E0E]/40 transition-[border-color] duration-300 min-h-[46px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group/btn bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#00855B] hover:to-[#006747] text-white px-8 py-3.5 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 font-black text-xs tracking-widest uppercase font-heading shrink-0 shadow-lg shadow-[#006747]/30 min-h-[46px] w-full sm:w-auto disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "…" : "JOIN"}</span>
                    <ArrowRight className="w-0 opacity-0 -translate-x-2 transition-[width,opacity,transform] duration-300 ease-in-out group-hover/uiverseCard:w-4 group-hover/uiverseCard:opacity-100 group-hover/uiverseCard:translate-x-0 group-focus-within/uiverseCard:w-4 group-focus-within/uiverseCard:opacity-100 group-focus-within/uiverseCard:translate-x-0 shrink-0" />
                  </button>
                </form>
              )}

              {error && (
                <p className="text-[10px] text-red-500 font-bold mt-2">{error}</p>
              )}

              <div className="text-[10px] text-[#0E0E0E]/40 font-normal transition-[opacity,max-height,margin] duration-500 opacity-0 max-h-0 overflow-hidden mt-0 group-hover/uiverseCard:opacity-100 group-hover/uiverseCard:max-h-10 group-hover/uiverseCard:mt-3.5 group-focus-within/uiverseCard:opacity-100 group-focus-within/uiverseCard:max-h-10 group-focus-within/uiverseCard:mt-3.5 flex items-center justify-between w-full">
                <span>Priority tickets, discounts, and VIP access.</span>
                <Link className="underline hover:text-[#006747] transition-[color]" href="/fan-zone">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

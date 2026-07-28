"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { saveSubmission } from "@/lib/mockStorage";

interface FanZoneSignupProps {
  variant?: "compact" | "full";
  showBenefits?: boolean;
}

export default function FanZoneSignup({
  variant = "compact",
  showBenefits = false,
}: FanZoneSignupProps) {
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
        source: variant === "compact" ? "Footer/Signup" : "Fan Zone Page",
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

  if (submitted) {
    return (
      <div
        className="rounded-3xl p-6 sm:p-10 text-center space-y-2 border border-white/10"
        style={{
          background: "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)",
        }}
      >
        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
        <p className="text-xs font-black uppercase tracking-wider text-white">
          Welcome to the Fan Zone!
        </p>
        <p className="text-[10px] text-white/50">
          Check your inbox for exclusive member benefits.
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className="group/fzCard rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-2xl transition-shadow duration-500 ease-in-out touch-manipulation cursor-pointer border border-white/10"
        style={{
          background: "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)",
        }}
      >
        {/* Border glow */}
        <div className="absolute inset-0 border border-white/10 group-hover/fzCard:border-[#006747]/60 group-focus-within/fzCard:border-[#006747]/60 group-hover/fzCard:shadow-[inset_0_0_60px_rgba(0,103,71,0.4)] transition-shadow duration-700 pointer-events-none rounded-3xl" />
        {/* Green gradient sweep */}
        <div className="absolute inset-0 opacity-0 group-hover/fzCard:opacity-20 group-focus-within/fzCard:opacity-20 pointer-events-none bg-gradient-to-r from-transparent via-[#006747] to-transparent transition-opacity duration-700" />

        {/* Left: Logo + Text */}
        <div className="flex items-center justify-start group-hover/fzCard:justify-center group-focus-within/fzCard:justify-center gap-4 relative z-10 sm:w-3/5 group-hover/fzCard:w-1/3 group-focus-within/fzCard:w-1/3 transition-[width,justify-content] duration-500 shrink-0">
          <div className="relative shrink-0 flex items-center justify-center transition-transform duration-500 group-hover/fzCard:scale-150">
            <Image
              src="/images/logos/zru-logo.svg"
              alt="ZRU Emblem"
              width={40}
              height={40}
              className="w-10 h-10 object-contain filter drop-shadow-[0_4px_30px_rgba(0,103,71,0.85)] group-hover/fzCard:drop-shadow-[0_8px_35px_rgba(52,211,153,0.6)] transition-[filter] duration-500"
            />
          </div>

          <div className="space-y-0.5 transition-[opacity,max-width,transform] duration-500 origin-left max-w-lg opacity-100 group-hover/fzCard:opacity-0 group-hover/fzCard:max-w-0 group-hover/fzCard:scale-95 group-hover/fzCard:overflow-hidden group-focus-within/fzCard:opacity-0 group-focus-within/fzCard:max-w-0 group-focus-within/fzCard:scale-95 group-focus-within/fzCard:overflow-hidden shrink min-w-0">
            <h2 className="text-base sm:text-lg text-white font-heading font-black uppercase tracking-tight leading-tight">
              JOIN THE FAN ZONE
            </h2>
            <p className="text-[10px] sm:text-xs text-white/70 font-normal leading-relaxed font-body line-clamp-2">
              Priority ticket presale, 10% merch discounts, insider squad news, and VIP competitions.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="relative z-10 w-full sm:w-2/5 group-hover/fzCard:w-2/3 group-focus-within/fzCard:w-2/3 flex flex-col items-center sm:items-center group-hover/fzCard:items-end group-focus-within/fzCard:items-end transition-[width] duration-500">
          <div className="w-full sm:w-auto group-hover/fzCard:w-full group-focus-within/fzCard:w-full bg-white p-3 group-hover/fzCard:p-4 group-focus-within/fzCard:p-4 rounded-2xl border border-black/5 group-hover/fzCard:border-[#006747]/60 group-focus-within/fzCard:border-[#006747]/60 transition-[width,padding,border-color] duration-500 ease-in-out shadow-lg">

            <p className="text-[#003822]/70 text-[10px] font-bold uppercase tracking-wider font-heading transition-[opacity,max-height,margin,color] duration-500 opacity-0 max-h-0 overflow-hidden mb-0 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-10 group-hover/fzCard:mb-2 group-hover/fzCard:text-[#006747] group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-10 group-focus-within/fzCard:mb-2 group-focus-within/fzCard:text-[#006747]">
              ENTER YOUR EMAIL BELOW TO JOIN
            </p>

            {error && (
              <p className="text-[10px] text-red-500 font-bold mb-2">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center group-hover/fzCard:justify-end group-focus-within/fzCard:justify-end transition-[justify-content] duration-500">
              <div className="w-0 opacity-0 max-w-0 overflow-hidden transition-[width,opacity,max-width] duration-500 ease-in-out group-hover/fzCard:w-full group-hover/fzCard:opacity-100 group-hover/fzCard:max-w-full group-focus-within/fzCard:w-full group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-w-full flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-black/5 text-[#0E0E0E] px-3 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-zru-green text-xs placeholder:text-[#0E0E0E]/40 transition-[border-color] duration-300 min-h-[40px]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group/btn bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#00855B] hover:to-[#006747] text-white px-6 py-2.5 rounded-xl transition-colors duration-300 flex items-center justify-center gap-1.5 font-black text-[10px] tracking-widest uppercase font-heading shrink-0 shadow-lg shadow-[#006747]/30 min-h-[40px] w-full sm:w-auto disabled:opacity-50"
              >
                <span>{isSubmitting ? "…" : "JOIN"}</span>
                <ArrowRight className="w-0 opacity-0 -translate-x-2 transition-[width,opacity,transform] duration-300 ease-in-out group-hover/fzCard:w-3 group-hover/fzCard:opacity-100 group-hover/fzCard:translate-x-0 group-focus-within/fzCard:w-3 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:translate-x-0 shrink-0" />
              </button>
            </form>

            <div className="text-[9px] text-[#0E0E0E]/40 font-normal transition-[opacity,max-height,margin] duration-500 opacity-0 max-h-0 overflow-hidden mt-0 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-10 group-hover/fzCard:mt-2.5 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-10 group-focus-within/fzCard:mt-2.5 flex items-center justify-between w-full">
              <span>Free to join. No spam.</span>
              <Link className="underline hover:text-[#006747] transition-[color]" href="/fan-zone">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group/fzCard rounded-3xl p-6 sm:p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 relative overflow-hidden shadow-2xl transition-shadow duration-500 ease-in-out touch-manipulation cursor-pointer border border-white/10"
      style={{
        background: "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)",
      }}
    >
      {/* Border glow */}
      <div className="absolute inset-0 border border-white/10 group-hover/fzCard:border-[#006747]/60 group-focus-within/fzCard:border-[#006747]/60 group-hover/fzCard:shadow-[inset_0_0_60px_rgba(0,103,71,0.4)] transition-shadow duration-700 pointer-events-none rounded-3xl" />
      {/* Green gradient sweep */}
      <div className="absolute inset-0 opacity-0 group-hover/fzCard:opacity-20 group-focus-within/fzCard:opacity-20 pointer-events-none bg-gradient-to-r from-transparent via-[#006747] to-transparent transition-opacity duration-700" />

      {/* Left: Logo + Text */}
      <div className="flex items-center justify-start lg:group-hover/fzCard:justify-center lg:group-focus-within/fzCard:justify-center gap-6 relative z-10 lg:w-3/5 lg:group-hover/fzCard:w-1/3 lg:group-focus-within/fzCard:w-1/3 transition-[width,justify-content] duration-500 shrink-0">
        <div className="relative shrink-0 flex items-center justify-center transition-transform duration-500 group-hover/fzCard:scale-175 sm:group-hover/fzCard:scale-200">
          <Image
            src="/images/logos/zru-logo.svg"
            alt="ZRU Emblem"
            width={72}
            height={72}
            className="w-16 sm:w-20 h-16 sm:h-20 object-contain filter drop-shadow-[0_4px_30px_rgba(0,103,71,0.85)] group-hover/fzCard:drop-shadow-[0_8px_35px_rgba(52,211,153,0.6)] transition-[filter] duration-500"
          />
        </div>

        <div className="space-y-1.5 transition-[opacity,max-width,transform] duration-500 origin-left max-w-lg opacity-100 group-hover/fzCard:opacity-0 group-hover/fzCard:max-w-0 group-hover/fzCard:scale-95 group-hover/fzCard:overflow-hidden group-focus-within/fzCard:opacity-0 group-focus-within/fzCard:max-w-0 group-focus-within/fzCard:scale-95 group-focus-within/fzCard:overflow-hidden shrink min-w-0">
          <h2 className="text-2xl sm:text-3xl text-white font-heading font-black uppercase tracking-tight leading-tight">
            JOIN THE FAN ZONE
          </h2>
          <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed font-body line-clamp-2">
            Priority ticket presale, 10% merch discounts, insider squad news, and VIP competitions. Free to join.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="relative z-10 w-full lg:w-2/5 lg:group-hover/fzCard:w-2/3 lg:group-focus-within/fzCard:w-2/3 flex flex-col items-center lg:items-center lg:group-hover/fzCard:items-end lg:group-focus-within/fzCard:items-end transition-[width] duration-500">
        <div className="w-full lg:w-auto lg:group-hover/fzCard:w-full lg:group-focus-within/fzCard:w-full bg-white p-3 group-hover/fzCard:p-5 sm:group-hover/fzCard:p-7 group-focus-within/fzCard:p-5 sm:group-focus-within/fzCard:p-7 rounded-2xl border border-black/5 group-hover/fzCard:border-[#006747]/60 group-focus-within/fzCard:border-[#006747]/60 transition-[width,padding,border-color] duration-500 ease-in-out shadow-lg">

          <p className="text-[#003822]/70 text-xs font-bold uppercase tracking-wider font-heading transition-[opacity,max-height,margin,color] duration-500 opacity-0 max-h-0 overflow-hidden mb-0 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-10 group-hover/fzCard:mb-3 group-hover/fzCard:text-[#006747] group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-10 group-focus-within/fzCard:mb-3 group-focus-within/fzCard:text-[#006747]">
            ENTER YOUR EMAIL BELOW TO JOIN THE FAN ZONE
          </p>

          {error && (
            <p className="text-[10px] text-red-500 font-bold mb-2">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full items-center justify-center group-hover/fzCard:justify-end group-focus-within/fzCard:justify-end transition-[justify-content] duration-500">
            <div className="w-0 opacity-0 max-w-0 overflow-hidden transition-[width,opacity,max-width] duration-500 ease-in-out group-hover/fzCard:w-full group-hover/fzCard:opacity-100 group-hover/fzCard:max-w-full group-focus-within/fzCard:w-full group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-w-full flex-1">
              <input
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
              <ArrowRight className="w-0 opacity-0 -translate-x-2 transition-[width,opacity,transform] duration-300 ease-in-out group-hover/fzCard:w-4 group-hover/fzCard:opacity-100 group-hover/fzCard:translate-x-0 group-focus-within/fzCard:w-4 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:translate-x-0 shrink-0" />
            </button>
          </form>

          {showBenefits && (
            <div className="grid grid-cols-2 gap-2 py-3 opacity-0 max-h-0 overflow-hidden transition-[opacity,max-height] duration-500 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-40 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-40">
              {[
                { text: "Priority ticket presale" },
                { text: "10% merch discount" },
                { text: "Insider squad newsletter" },
                { text: "VIP fan competitions" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5 text-[10px] text-black/60">
                  <span className="w-1 h-1 rounded-full bg-[#006747] shrink-0" />
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-[10px] text-[#0E0E0E]/40 font-normal transition-[opacity,max-height,margin] duration-500 opacity-0 max-h-0 overflow-hidden mt-0 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-10 group-hover/fzCard:mt-3.5 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-10 group-focus-within/fzCard:mt-3.5 flex items-center justify-between w-full">
            <span>Priority tickets, discounts, and VIP access.</span>
            <Link className="underline hover:text-[#006747] transition-[color]" href="/fan-zone">
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

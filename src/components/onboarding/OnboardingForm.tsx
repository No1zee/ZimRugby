"use client";

import { useState } from "react";
import Image from "next/image";
import SlantedButton from "@/components/ui/SlantedButton";

interface OnboardingFormProps {
  actor: "player" | "coach" | "referee" | "club-registrar";
  title: string;
  subtitle: string;
}

export function OnboardingForm({ actor, title, subtitle }: OnboardingFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/onboarding/${actor}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, organization }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit registration");
      }

      setStatus("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMessage(msg);
      setStatus("error");
    }
  }

  return (
    <div
      className="rounded-3xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto my-8 border border-white/10 relative overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 25%, #006747 0%, #004D34 60%, #003322 100%)",
      }}
    >
      {/* Background glow sweep */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-r from-transparent via-[#006747] to-transparent" />

      <div className="text-center mb-8 relative z-10 space-y-3">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Image
            src="/images/logos/zru-logo.svg"
            alt="ZRU Emblem"
            width={48}
            height={48}
            className="w-12 h-12 object-contain filter drop-shadow-[0_4px_25px_rgba(0,103,71,0.85)]"
          />
        </div>
        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full font-heading">
          OFFICIAL ZRU PORTAL REGISTRATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight uppercase">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto font-body leading-relaxed">
          {subtitle}
        </p>
      </div>

      {status === "success" ? (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center space-y-4 relative z-10 text-white">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h3 className="text-xl font-black font-heading tracking-wide uppercase text-white">
            REGISTRATION CONFIRMED
          </h3>
          <p className="text-xs text-white/90 font-body">
            Thank you, <strong className="text-white">{fullName}</strong>! Your registration request for the{" "}
            <span className="uppercase text-emerald-400 font-bold">{actor}</span> portal has been queued under CDPA 2021 data protection rules.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setStatus("idle")}
              className="text-xs text-emerald-300 hover:text-white uppercase tracking-wider font-bold transition-colors font-heading"
            >
              Submit another registration →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-black/5 shadow-xl space-y-4">
            <div>
              <label className="block text-[11px] font-black text-[#003322] uppercase tracking-wider mb-1.5 font-heading">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Tendai Mtawarira"
                className="w-full bg-[#002216]/5 border border-[#006747]/30 rounded-xl px-4 py-3 text-[#003322] placeholder:text-[#003322]/40 focus:outline-none focus:border-[#006747] text-sm font-body transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black text-[#003322] uppercase tracking-wider mb-1.5 font-heading">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tendai@zru.co.zw"
                  className="w-full bg-[#002216]/5 border border-[#006747]/30 rounded-xl px-4 py-3 text-[#003322] placeholder:text-[#003322]/40 focus:outline-none focus:border-[#006747] text-sm font-body transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-[#003322] uppercase tracking-wider mb-1.5 font-heading">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+263 77 123 4567"
                  className="w-full bg-[#002216]/5 border border-[#006747]/30 rounded-xl px-4 py-3 text-[#003322] placeholder:text-[#003322]/40 focus:outline-none focus:border-[#006747] text-sm font-body transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-[#003322] uppercase tracking-wider mb-1.5 font-heading">
                Club / School / Organization *
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Harare Sports Club / Prince Edward School"
                className="w-full bg-[#002216]/5 border border-[#006747]/30 rounded-xl px-4 py-3 text-[#003322] placeholder:text-[#003322]/40 focus:outline-none focus:border-[#006747] text-sm font-body transition-colors"
              />
            </div>

            {status === "error" && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-body font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="pt-2">
              <SlantedButton variant="primary" size="lg" className="w-full justify-center">
                {status === "loading" ? "SUBMITTING REGISTRATION..." : "SUBMIT REGISTRATION →"}
              </SlantedButton>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

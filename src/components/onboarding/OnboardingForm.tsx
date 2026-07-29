"use client";

import { useState } from "react";
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
    <div className="bg-[#003322] border border-[#006747]/40 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto my-12">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-[#006747] text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
          OFFICIAL ZRU PORTAL REGISTRATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">{title}</h1>
        <p className="text-emerald-100/80 text-sm mt-2">{subtitle}</p>
      </div>

      {status === "success" ? (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h3 className="text-xl font-bold text-white">REGISTRATION SUBMITTED</h3>
          <p className="text-sm text-emerald-200">
            Thank you, <strong className="text-white">{fullName}</strong>! Your registration request for the{" "}
            <span className="uppercase text-emerald-400">{actor}</span> portal has been queued under CDPA 2021 data protection rules.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setStatus("idle")}
              className="text-xs text-emerald-400 hover:underline uppercase tracking-wider font-semibold"
            >
              Submit another registration →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Tendai Mtawarira"
              className="w-full bg-[#002216] border border-[#006747] rounded-lg px-4 py-3 text-white placeholder-emerald-800 focus:outline-none focus:border-emerald-400 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tendai@zru.co.zw"
                className="w-full bg-[#002216] border border-[#006747] rounded-lg px-4 py-3 text-white placeholder-emerald-800 focus:outline-none focus:border-emerald-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+263 77 123 4567"
                className="w-full bg-[#002216] border border-[#006747] rounded-lg px-4 py-3 text-white placeholder-emerald-800 focus:outline-none focus:border-emerald-400 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
              Club / School / Organization *
            </label>
            <input
              type="text"
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Harare Sports Club / Prince Edward School"
              className="w-full bg-[#002216] border border-[#006747] rounded-lg px-4 py-3 text-white placeholder-emerald-800 focus:outline-none focus:border-emerald-400 text-sm"
            />
          </div>

          {status === "error" && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="pt-2">
            <SlantedButton variant="primary" size="lg" className="w-full justify-center">
              {status === "loading" ? "SUBMITTING REGISTRATION..." : "SUBMIT REGISTRATION →"}
            </SlantedButton>
          </div>
        </form>
      )}
    </div>
  );
}

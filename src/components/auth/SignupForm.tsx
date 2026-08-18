"use client";

import { useState } from "react";
import Image from "next/image";
import SlantedButton from "@/components/ui/SlantedButton";

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isOfficialRole, setIsOfficialRole] = useState(false);
  const [role, setRole] = useState<"fan" | "player" | "coach" | "referee" | "club-registrar">("fan");
  const [organization, setOrganization] = useState("");
  const [cdpaConsent, setCdpaConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // If not checking official roles, default back to fan
    const targetRole = isOfficialRole ? role : "fan";

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fullName, 
          email, 
          phone: isOfficialRole ? phone : undefined, 
          password, 
          role: targetRole, 
          organization: isOfficialRole ? organization : "ZRU Fan Club",
          cdpaConsent
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to complete signup");
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
          OFFICIAL UNION REGISTRATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight uppercase">
          {isOfficialRole ? "Official Onboarding Portal" : "Join the ZRU Fan Club"}
        </h1>
        <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto font-body leading-relaxed">
          {isOfficialRole 
            ? "Register your credentials for official club, provincial, and national squad eligibility."
            : "Get immediate access to tickets, match streams, newsletter drops, and exclusive fan experiences."}
        </p>
      </div>

      {status === "success" ? (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center space-y-4 relative z-10 text-white">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h3 className="text-xl font-black font-heading tracking-wide uppercase text-white">
            WELCOME TO ZIM RUGBY
          </h3>
          <p className="text-xs text-white/90 font-body">
            Thank you, <strong className="text-white">{fullName}</strong>! Your ZRU account has been successfully created.
          </p>
          <div className="pt-2">
            <a
              href="/login"
              className="text-xs text-emerald-300 hover:text-white uppercase tracking-wider font-bold transition-colors font-heading"
            >
              Sign In to your Account →
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-black/5 shadow-xl space-y-4">
            
            {/* Basic Info (Common to all) */}
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
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#002216]/5 border border-[#006747]/30 rounded-xl px-4 py-3 text-[#003322] placeholder:text-[#003322]/40 focus:outline-none focus:border-[#006747] text-sm font-body transition-colors"
                />
              </div>
            </div>

            {/* Checkbox to Toggle Official Onboarding Fields */}
            <div className="flex items-center space-x-3 py-2 border-t border-b border-gray-100">
              <input
                type="checkbox"
                id="official-role-toggle"
                checked={isOfficialRole}
                onChange={(e) => {
                  setIsOfficialRole(e.target.checked);
                  if (e.target.checked && role === "fan") {
                    setRole("player");
                  }
                }}
                className="w-4 h-4 text-[#006B3F] border-gray-300 rounded focus:ring-[#006B3F]"
              />
              <label htmlFor="official-role-toggle" className="text-xs font-bold text-[#003322] uppercase tracking-wider cursor-pointer select-none">
                Register as a Player, Coach, Referee, or Club Official
              </label>
            </div>

            {/* Conditional Role Selection & Info (Only if official role checkbox is ticked) */}
            {isOfficialRole && (
              <div className="space-y-4 pt-2 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-black text-[#003322] uppercase tracking-wider mb-2 font-heading">
                    Select Official Role *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["player", "coach", "referee", "club-registrar"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-heading font-black uppercase transition-all ${
                          role === r
                            ? "bg-[#006B3F] text-white border-[#006B3F]"
                            : "bg-white text-[#003322]/80 border-[#006747]/20 hover:border-[#006B3F]"
                        }`}
                      >
                        {r.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-[11px] font-black text-[#003322] uppercase tracking-wider mb-1.5 font-heading">
                      Club / School / Association *
                    </label>
                    <input
                      type="text"
                      required={isOfficialRole}
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Old Georgians RFC"
                      className="w-full bg-[#002216]/5 border border-[#006747]/30 rounded-xl px-4 py-3 text-[#003322] placeholder:text-[#003322]/40 focus:outline-none focus:border-[#006747] text-sm font-body transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="text-red-600 text-xs font-black uppercase tracking-wider bg-red-50 p-3 rounded-xl border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* CDPA 2021 Consent (required for all signups) */}
            <div className="flex items-start space-x-3 py-2 border-t border-gray-100">
              <input
                type="checkbox"
                id="cdpa-consent"
                required
                checked={cdpaConsent}
                onChange={(e) => setCdpaConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#006B3F] border-gray-300 rounded focus:ring-[#006B3F]"
              />
              <label htmlFor="cdpa-consent" className="text-xs font-semibold text-[#003322]/80 leading-relaxed cursor-pointer select-none">
                I consent to ZRU processing my personal data for membership,
                ticketing, and match communications, and I agree to the{" "}
                <span className="font-black text-[#003322]">Zimbabwe CDPA 2021</span>{" "}
                data protection terms.
              </label>
            </div>

            <div className="pt-2">
              <SlantedButton
                variant="primary"
                type="submit"
                className="w-full justify-center py-4"
                disabled={status === "loading" || !cdpaConsent}
              >
                {status === "loading" ? "PROCESSING..." : isOfficialRole ? "SUBMIT ONBOARDING REQUEST" : "JOIN FAN CLUB"}
              </SlantedButton>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

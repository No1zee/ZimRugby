"use client";

import { useState } from "react";
import {
  Mail,
  CheckCircle2,
  Ticket,
  Percent,
  Newspaper,
  Trophy,
} from "lucide-react";
import { saveSubmission } from "@/lib/mockStorage";

interface FanZoneSignupProps {
  variant?: "compact" | "full";
  showBenefits?: boolean;
}

export default function FanZoneSignup({
  variant = "compact",
  showBenefits = false,
}: FanZoneSignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError("");

    try {
      await saveSubmission("fan_zone_member", {
        ...(variant === "full" ? { name } : {}),
        email,
        source: "Fan Zone Signup",
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-3 space-y-2">
        <CheckCircle2 className="w-8 h-8 text-zru-green mx-auto" />
        <p className="text-xs font-black uppercase tracking-wider text-rich-black">
          Welcome to the Fan Zone!
        </p>
        <p className="text-[10px] text-black/50">
          Check your inbox for exclusive member benefits.
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-zru-green" />
          <span className="text-xs font-black uppercase tracking-wider text-rich-black">
            Join the Fan Zone
          </span>
        </div>
        <p className="text-[10px] text-black/50 leading-relaxed">
          Priority tickets, 10% merch discounts, insider news, and VIP
          competitions.
        </p>

        {error && (
          <p className="text-[10px] text-red-500 font-bold">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="flex-1 bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs text-rich-black placeholder-black/30 focus:outline-none focus:border-zru-green transition-[border-color] duration-300"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-zru-green hover:bg-[#005238] text-white font-black text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-[background-color] duration-300 disabled:opacity-50 shrink-0"
          >
            {isSubmitting ? "…" : "Join"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Mail className="w-5 h-5 text-zru-green" />
        <span className="text-base font-black uppercase tracking-wider text-rich-black">
          Join the Fan Zone
        </span>
      </div>
      <p className="text-xs text-black/50 leading-relaxed">
        Priority tickets, merchandise discounts, insider news, and VIP
        competitions. Free to join.
      </p>

      {showBenefits && (
        <div className="grid grid-cols-2 gap-2 py-2">
          {[
            { icon: Ticket, text: "Priority ticket presale" },
            { icon: Percent, text: "10% merch discount" },
            { icon: Newspaper, text: "Insider squad newsletter" },
            { icon: Trophy, text: "VIP fan competitions" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-1.5 text-[10px] text-black/60">
              <b.icon className="w-3 h-3 text-zru-green shrink-0" />
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[10px] text-red-500 font-bold">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {variant === "full" && (
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-xs text-rich-black placeholder-black/30 focus:outline-none focus:border-zru-green transition-[border-color] duration-300"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-xs text-rich-black placeholder-black/30 focus:outline-none focus:border-zru-green transition-[border-color] duration-300"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-zru-green hover:bg-[#005238] text-white font-black text-xs uppercase tracking-[0.2em] py-3 rounded-xl transition-[background-color] duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Joining…" : "Join the Fan Zone"}
        </button>
      </form>
    </div>
  );
}

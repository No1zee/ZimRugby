"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-6 py-4 rounded-xl text-white font-bold text-sm">
        <CheckCircle className="w-5 h-5 text-zru-green" />
        <span>Welcome to the Sables Inner Sanctum! Check your inbox.</span>
      </div>
    );
  }

  return (
    <form className="flex w-full lg:w-auto mt-4 lg:mt-0" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="bg-white text-black px-6 py-4 w-full lg:w-80 rounded-l-md outline-none placeholder:text-gray-400 font-normal text-sm"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-zru-green/15 text-zru-green font-black tracking-widest uppercase px-8 py-4 rounded-r-md hover:bg-white transition-colors text-xs shrink-0 disabled:opacity-50"
      >
        {loading ? "JOINING..." : "SUBSCRIBE"}
      </button>
    </form>
  );
}

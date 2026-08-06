"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Trophy, Ticket, Megaphone, Mail, Lock, AlertCircle } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";
import { useAuth } from "@/context/AuthContext";
import { signInFanWithPassword, signUpFan } from "@/lib/supabase/auth";
import { signInWithProvider } from "./actions";

const benefits = [
  { icon: Ticket, label: "Priority ticket access" },
  { icon: Trophy, label: "Exclusive match content" },
  { icon: Megaphone, label: "Early announcements" },
  { icon: Shield, label: "Member-only perks" },
];

export default function LoginPage() {
  const { signInFan } = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await signUpFan({
          email,
          password,
          name: name.trim() || email.split("@")[0],
          favoriteTeam: "Sables",
        });
        signInFan(res.profile);
      } else {
        const res = await signInFanWithPassword({ email, password });
        signInFan(res.profile);
      }
      router.push("/");
    } catch {
      setError(isSignUp ? "Could not create account. Please try again." : "Could not authenticate user. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF0] flex flex-col selection:bg-zru-green selection:text-white">
      {/* Top back nav */}
      <div className="flex-none px-6 pt-6 max-w-[1440px] mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-rich-black/40 hover:text-rich-black transition-colors text-[10px] font-heading font-black uppercase tracking-[0.2em] group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to ZimRugby
        </Link>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Left — Fan Zone branding */}
          <div className="hidden md:flex flex-col gap-8 px-4">
            <div>
              <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] text-zru-green mb-3 bg-zru-green/10 px-2 py-1 rounded-sm border border-zru-green/15">
                FAN ZONE
              </span>
              <h1 className="text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-rich-black leading-[1.05]">
                Your rugby.
                <br />
                <span className="text-zru-green">Your community.</span>
              </h1>
              <p className="text-rich-black/50 text-sm font-body mt-4 leading-relaxed max-w-sm">
                Join thousands of Zimbabwe rugby fans. Priority tickets, exclusive content, and behind-the-scenes access — all in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zru-green/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-zru-green" />
                    </div>
                    <span className="text-xs font-bold text-rich-black/70 uppercase tracking-wider">
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Sign-in / Sign-up form */}
          <div className="w-full max-w-md mx-auto">
            {/* Mobile-only heading */}
            <div className="md:hidden text-center mb-6">
              <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] text-zru-green mb-2 bg-zru-green/10 px-2 py-1 rounded-sm border border-zru-green/15">
                FAN ZONE
              </span>
              <h1 className="text-3xl font-heading font-black uppercase tracking-tight text-rich-black">
                {isSignUp ? "Create Account" : "Sign In"}
              </h1>
              <p className="text-rich-black/50 text-xs font-body mt-1">
                {isSignUp ? "Join the Zimbabwe Rugby Union Fan Zone" : "Access your Zimbabwe Rugby Union Fan Zone account"}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8">
              <div className="text-center mb-6 hidden md:block">
                <h2 className="text-2xl font-heading font-black uppercase tracking-tight text-rich-black">
                  {isSignUp ? "Create Account" : "Sign In"}
                </h2>
                <p className="text-rich-black/40 text-xs font-body mt-1">
                  {isSignUp ? "Join the Fan Zone today" : "Welcome back to the Fan Zone"}
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-body">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[10px] font-heading font-extrabold text-rich-black/50 uppercase tracking-[0.2em]">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rich-black/30">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FDFBF0] border border-black/10 rounded-lg pl-10 pr-3 py-3 text-rich-black placeholder-rich-black/30 focus:border-zru-green focus:outline-none transition-[border-color] text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-[10px] font-heading font-extrabold text-rich-black/50 uppercase tracking-[0.2em]">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rich-black/30">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#FDFBF0] border border-black/10 rounded-lg pl-10 pr-3 py-3 text-rich-black placeholder-rich-black/30 focus:border-zru-green focus:outline-none transition-[border-color] text-sm"
                    />
                  </div>
                </div>

                {!isSignUp && (
                  <div className="flex justify-end -mt-1">
                    <Link
                      href="/contact"
                      className="text-[11px] text-zru-green hover:text-[#005238] transition-[color] font-heading font-bold uppercase tracking-[0.2em]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                <div className="flex flex-col gap-3 mt-3">
                  <SlantedButton type="submit" variant="primary" className="w-full justify-center" disabled={isLoading}>
                    {isLoading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
                  </SlantedButton>
                  <SlantedButton
                    type="button"
                    variant="secondary"
                    className="w-full justify-center text-[11px] px-6 py-2"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError("");
                    }}
                    disabled={isLoading}
                  >
                    {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
                  </SlantedButton>
                </div>
              </form>


              {/* Social login divider */}
              <div className="flex items-center w-full my-5">
                <div className="flex-grow border-t border-dashed border-black/10"></div>
                <span className="mx-3 text-[10px] text-black/30 font-heading font-bold uppercase tracking-[0.15em]">Or sign in with</span>
                <div className="flex-grow border-t border-dashed border-black/10"></div>
              </div>

              {/* Social login buttons */}
              <div className="flex gap-3 w-full justify-center">
                <form action={signInWithProvider} className="contents">
                  <button
                    type="submit"
                    name="provider"
                    value="google"
                    className="flex items-center justify-center w-12 h-12 rounded-xl border border-black/10 bg-[#FDFBF0] hover:bg-black/5 transition-colors grow"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                  </button>
                </form>
                <form action={signInWithProvider} className="contents">
                  <button
                    type="submit"
                    name="provider"
                    value="facebook"
                    className="flex items-center justify-center w-12 h-12 rounded-xl border border-black/10 bg-[#FDFBF0] hover:bg-black/5 transition-colors grow"
                  >
                    <img
                      src="https://www.svgrepo.com/show/448224/facebook.svg"
                      alt="Facebook"
                      className="w-5 h-5"
                    />
                  </button>
                </form>
                <form action={signInWithProvider} className="contents">
                  <button
                    type="submit"
                    name="provider"
                    value="apple"
                    className="flex items-center justify-center w-12 h-12 rounded-xl border border-black/10 bg-[#FDFBF0] hover:bg-black/5 transition-colors grow"
                  >
                    <img
                      src="https://www.svgrepo.com/show/511330/apple-173.svg"
                      alt="Apple"
                      className="w-5 h-5"
                    />
                  </button>
                </form>
              </div>
            </div>

            <p className="text-center text-[10px] text-rich-black/30 mt-4 font-body">
              By signing in you agree to our{" "}
              <Link href="/terms-of-use" className="underline hover:text-rich-black/60 transition-[color]">Terms</Link>
              {" & "}
              <Link href="/privacy-policy" className="underline hover:text-rich-black/60 transition-[color]">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Slim footer */}
      <div className="flex-none text-center px-6 py-4 border-t border-black/5">
        <p className="text-[10px] text-rich-black/30 font-body">
          &copy; {new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.
        </p>
      </div>
    </div>
  );
}

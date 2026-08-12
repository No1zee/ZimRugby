"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signUpFan, signInFanWithPassword, signInWithOAuth } from "@/lib/supabase/auth";

export default function LoginPage() {
  const { signInFan, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/fan-zone";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [handleStatus, setHandleStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  // Auto-suggest handle when name is typed
  const suggestHandle = (fullName: string) => {
    const base = fullName.trim().toLowerCase().split(" ")[0].replace(/[^a-z0-9]/g, "").slice(0, 12);
    if (base) {
      const suggested = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
      setHandle(suggested);
      setHandleStatus("idle");
    }
  };

  // Check MFA step from URL params
  const [mfaRequired, setMfaRequired] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("step") === "mfa";
  });
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState("");

  // Debounced handle uniqueness check
  useEffect(() => {
    if (!handle || handle.length < 3) { setHandleStatus("idle"); return; }
    setHandleStatus("checking");
    const t = setTimeout(async () => {
      try {
        const { data } = await import("@/lib/supabase/client").then(m =>
          m.supabase.from("fan_zone_members").select("handle").eq("handle", handle).maybeSingle()
        );
        setHandleStatus(data ? "taken" : "available");
      } catch {
        setHandleStatus("available");
      }
    }, 500);
    return () => clearTimeout(t);
  }, [handle]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  const handleAdminMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMfaError("");

    try {
      const res = await fetch("/api/admin/auth/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: mfaCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMfaError(data.error || "Invalid verification code");
        setIsLoading(false);
        return;
      }
      window.location.href = redirect.startsWith("/admin") ? redirect : "/admin";
    } catch {
      setMfaError("Connection error during verification.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (password.length < 8) {
          setError("Password must be at least 8 characters.");
          setIsLoading(false);
          return;
        }
        if (!name.trim()) {
          setError("Please enter your name.");
          setIsLoading(false);
          return;
        }
        if (handle.length < 3 || handleStatus === "taken") {
          setError("Please choose a valid unique handle.");
          setIsLoading(false);
          return;
        }

        const res = await signUpFan({
          email,
          password,
          name: name.trim(),
          handle: handle.trim(),
          favoriteTeam: "Sables",
        });
        if (res.success) {
          signInFan(res.profile);
          router.replace(redirect);
        } else {
          setError("Could not create account. Please try again.");
        }
      } else {
        // Attempt Admin/Staff Auth route first
        const adminRes = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (adminRes.ok) {
          const adminData = await adminRes.json();
          if (adminData.mfaRequired) {
            setMfaRequired(true);
            setIsLoading(false);
            return;
          }
          window.location.href = redirect.startsWith("/admin") ? redirect : "/admin";
          return;
        }

        // Fallback to Fan Zone Auth
        const fanRes = await signInFanWithPassword({ email, password });
        if (fanRes.success) {
          signInFan(fanRes.profile);
          router.replace(redirect);
        } else {
          setError("Incorrect email or password.");
        }
      }
    } catch {
      setError("Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — ZRU branded */}
      <div className="hidden lg:flex lg:w-[44%] bg-[#004D2C] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Subtle texture rings */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-white/30" />
        </div>

        <div className="relative flex flex-col items-center gap-8 text-center">
          {/* ZRU Logo */}
          <img
            src="/images/logos/zru-logo-white-text.svg"
            alt="Zimbabwe Rugby Union"
            className="w-28 h-28 object-contain drop-shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />

          <div>
            <h1 className="text-white font-heading font-black text-3xl uppercase tracking-widest leading-tight">
              Zimbabwe
            </h1>
            <h2 className="text-white font-heading font-black text-3xl uppercase tracking-widest leading-tight">
              Rugby Union
            </h2>
            <div className="mt-3 w-12 h-0.5 bg-white/40 mx-auto" />
            <p className="mt-4 text-white/60 text-sm font-sans leading-relaxed max-w-[220px]">
              One team. One nation. The Sables.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex flex-col">
        {/* Back link */}
        <div className="px-8 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to site
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-[360px]">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {mode === "signin" ? "Sign in" : "Create account"}
              </h2>
              <p className="mt-1.5 text-sm text-gray-500">
                {mode === "signin"
                  ? "Welcome back to Zimbabwe Rugby."
                  : "Join the Sables supporters network."}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Social Logins */}
            <div className="space-y-2.5 mb-6">
              <button
                type="button"
                onClick={() => signInWithOAuth("google")}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 font-medium">Or with email</span>
              </div>
            </div>

            {/* MFA Verification Form */}
            {mfaRequired ? (
              <form onSubmit={handleAdminMfa} className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Two-Factor Verification Required
                  </p>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Enter the 6-digit verification code from your authenticator app to access the ZRU Admin Portal.
                  </p>
                </div>

                {mfaError && (
                  <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {mfaError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    6-Digit Authenticator Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="••••••"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 text-base font-mono tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || mfaCode.length !== 6}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#006747] hover:bg-[#004D2C] text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {isLoading ? "Verifying Code…" : "Verify & Launch Portal"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMfaRequired(false);
                    setMfaCode("");
                    setMfaError("");
                  }}
                  className="w-full text-center text-xs text-gray-500 hover:text-gray-700 transition-colors pt-2"
                >
                  ← Back to standard login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      suggestHandle(e.target.value);
                    }}
                    placeholder="Edward Magejo"
                    autoComplete="name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-transparent transition-all"
                    required
                  />
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your handle
                    <span className="ml-1.5 text-xs font-normal text-gray-400">— how others find you</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">@</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-z0-9_]/g, "").slice(0, 20);
                        setHandle(val);
                      }}
                      placeholder="edward4821"
                      autoComplete="off"
                      className={`w-full pl-7 pr-24 py-2.5 rounded-lg border text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        handleStatus === "taken"
                          ? "border-red-300 focus:ring-red-400"
                          : handleStatus === "available"
                          ? "border-green-400 focus:ring-green-400"
                          : "border-gray-300 focus:ring-[#006747]"
                      }`}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium">
                      {handleStatus === "checking" && <span className="text-gray-400">Checking…</span>}
                      {handleStatus === "available" && <span className="text-green-600">✓ Available</span>}
                      {handleStatus === "taken" && <span className="text-red-500">✗ Taken</span>}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400">Lowercase letters, numbers and underscores only.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  {mode === "signin" && (
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#006747] hover:text-[#004D2C] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === "signup" && (
                  <p className="mt-1.5 text-xs text-gray-400">
                    Must be at least 8 characters.
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#006747] hover:bg-[#004D2C] text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-sm"
              >
                {isLoading
                  ? mode === "signin"
                    ? "Signing in…"
                    : "Creating account…"
                  : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
              </button>
              </form>
            )}

            {/* Toggle mode */}
            <p className="mt-6 text-center text-sm text-gray-500">
              {mode === "signin" ? (
                <>
                  New to Zimbabwe Rugby?{" "}
                  <button
                    onClick={() => { setMode("signup"); setError(""); }}
                    className="font-semibold text-[#006747] hover:text-[#004D2C] transition-colors"
                  >
                    Create account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => { setMode("signin"); setError(""); }}
                    className="font-semibold text-[#006747] hover:text-[#004D2C] transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>

            {/* Terms */}
            {mode === "signup" && (
              <p className="mt-4 text-center text-xs text-gray-400 leading-relaxed">
                By creating an account you agree to our{" "}
                <Link href="/terms-of-use" className="underline hover:text-gray-600">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="underline hover:text-gray-600">
                  Privacy Policy
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

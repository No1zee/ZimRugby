"use client";

import { useState } from "react";
import { Shield, KeyRound, Lock, AlertTriangle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Connection failed. Check network status.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#001A0E] flex items-center justify-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#006B3F]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#006B3F] border border-white/20 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(0,107,63,0.5)]">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wider">
            ZRU ADMIN PORTAL
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-[#002B19]/90 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {error && (
            <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200 text-xs leading-relaxed">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block uppercase tracking-wider mb-0.5">Authentication Error</span>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-white/70 mb-2">
                Administrator Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all font-mono"
                placeholder="admin@zimrugby.co.zw"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-white/70 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all font-mono"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#006B3F] hover:bg-[#007A48] active:bg-[#005B35] text-white rounded-xl font-heading font-black tracking-widest uppercase transition-all shadow-lg shadow-[#006B3F]/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <span>VERIFYING CREDENTIALS...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>SIGN IN</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Security Notice */}
        <div className="text-center space-y-1">
          <p className="text-[10px] text-white/30 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-accent-teal" />
            <span>Encrypted Session • Rate Limit Protection Active</span>
          </p>
        </div>

      </div>
    </div>
  );
}

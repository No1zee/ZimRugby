"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid password");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Connection failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#001A0E] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />
      
      {/* Radial green glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#006B3F]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#006B3F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(0,107,63,0.4)]">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-heading text-white uppercase tracking-wider">
            ZRU Admin
          </h1>
          <p className="text-white/25 text-[10px] font-subheading uppercase tracking-[0.4em] mt-2">
            Enter admin password to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 relative">
          {/* Green accent at top */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#006B3F]/50 to-transparent" />
          
          {error && (
            <div className="bg-[#FF4444]/10 border border-[#FF4444]/20 rounded-lg p-4 text-[#FF4444] text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 font-subheading">
              Password
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#006B3F]/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006B3F] text-white font-bold uppercase tracking-[0.2em] py-3 rounded-lg hover:bg-[#00A85A] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,107,63,0.3)] hover:shadow-[0_0_25px_rgba(0,107,63,0.5)] text-[11px]"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

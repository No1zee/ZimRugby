"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Lock, Unlock, Shield, KeyRound, AlertCircle, RefreshCw, LogOut } from "lucide-react";
import { useToast } from "./ToastProvider";

interface AdminInactivityLockProps {
  userEmail?: string;
  timeoutMinutes?: number;
}

export default function AdminInactivityLock({
  userEmail = "admin@zimrugby.co.zw",
  timeoutMinutes = 30,
}: AdminInactivityLockProps) {
  const { toast } = useToast();
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // In local development, avoid locking unexpectedly
  const isDev = process.env.NODE_ENV === "development";

  const resetTimer = useCallback(() => {
    if (isLocked) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Don't auto-lock in dev mode unless manually triggered
    if (isDev) return;

    timerRef.current = setTimeout(() => {
      setIsLocked(true);
      toast("Admin Studio auto-locked due to inactivity.", "info");
    }, timeoutMinutes * 60 * 1000);
  }, [isLocked, timeoutMinutes, toast, isDev]);

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    const handleActivity = () => resetTimer();

    events.forEach((ev) => window.addEventListener(ev, handleActivity));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
    };
  }, [resetTimer]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("Please enter your admin password.");
      return;
    }

    setUnlocking(true);
    setErrorMsg("");

    try {
      // Re-authenticate session against auth endpoint with entered credentials
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password }),
      });

      if (res.ok) {
        setIsLocked(false);
        setPassword("");
        setErrorMsg("");
        toast("Session unlocked. Welcome back!", "success");
        resetTimer();
      } else {
        const json = await res.json().catch(() => null);
        setErrorMsg(json?.error || "Incorrect password. Please try again.");
      }
    } catch {
      setErrorMsg("Connection error. Please try again or log in from the login page.");
    } finally {
      setUnlocking(false);
    }
  };

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#090d16] border border-white/15 rounded-3xl p-8 shadow-2xl text-white text-center flex flex-col items-center">
        {/* Shield & Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-zru-green flex items-center justify-center text-white mb-5 shadow-lg shadow-zru-green/30">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-black font-heading uppercase tracking-wider text-white">
          Session Locked
        </h2>
        <p className="text-xs text-white/50 mt-1 mb-6">
          Studio auto-locked after {timeoutMinutes} minutes of inactivity to protect matchday data.
        </p>

        {/* User Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/80 mb-6">
          <Shield className="w-4 h-4 text-zru-green" />
          <span>{userEmail}</span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="w-full mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Unlock Form */}
        <form onSubmit={handleUnlock} className="w-full space-y-4">
          <div className="relative">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to unlock..."
              disabled={unlocking}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-zru-green focus:ring-1 focus:ring-zru-green transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={unlocking || !password.trim()}
            className="w-full py-3 rounded-xl bg-zru-green hover:bg-forest-green text-white font-black font-heading text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-zru-green/20 disabled:opacity-50 cursor-pointer"
          >
            {unlocking ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Unlock Session</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 w-full flex items-center justify-between text-xs text-white/40">
          <span>Unsaved drafts preserved</span>
          <a
            href="/admin-login"
            className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch account</span>
          </a>
        </div>
      </div>
    </div>
  );
}

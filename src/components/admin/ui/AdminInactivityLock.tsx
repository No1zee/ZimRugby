"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Lock, Unlock, Shield, KeyRound, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "./ToastProvider";

interface AdminInactivityLockProps {
  userEmail?: string;
  timeoutMinutes?: number;
}

export default function AdminInactivityLock({
  userEmail = "admin@zimrugby.co.zw",
  timeoutMinutes = 15,
}: AdminInactivityLockProps) {
  const { toast } = useToast();
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (isLocked) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsLocked(true);
      toast("Admin Studio auto-locked due to 15 minutes of inactivity.", "info");
    }, timeoutMinutes * 60 * 1000);
  }, [isLocked, timeoutMinutes, toast]);

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
      setErrorMsg("Please enter your admin password or PIN.");
      return;
    }

    setUnlocking(true);
    setErrorMsg("");

    try {
      // Re-authenticate session against auth check endpoint
      const res = await fetch("/api/admin/auth/check");
      if (res.ok) {
        setIsLocked(false);
        setPassword("");
        toast("Session unlocked. Welcome back!");
        resetTimer();
      } else {
        // If session expired in background
        window.location.href = "/admin-login";
      }
    } catch {
      setErrorMsg("Failed to verify credentials. Please try again.");
    } finally {
      setUnlocking(false);
    }
  };

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#090d16] border border-white/15 rounded-3xl p-8 shadow-2xl text-white text-center flex flex-col items-center">
        {/* Shield & Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#006B3F] flex items-center justify-center text-white mb-5 shadow-lg shadow-[#006B3F]/30">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-black font-heading uppercase tracking-wider text-white">
          Session Locked
        </h2>
        <p className="text-xs text-white/50 mt-1 mb-6">
          Studio auto-locked after 15 minutes of inactivity to protect matchday data (SOC 2 / ISO 27001).
        </p>

        {/* User Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/80 mb-6">
          <Shield className="w-4 h-4 text-[#006B3F]" />
          <span>{userEmail}</span>
        </div>

        {/* Re-Auth Form */}
        <form onSubmit={handleUnlock} className="w-full space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password or PIN to resume..."
              autoFocus
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#006B3F] transition-colors font-sans"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-400 font-medium flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={unlocking}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#006B3F] hover:bg-green-800 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#006B3F]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {unlocking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
            <span>{unlocking ? "Verifying..." : "Unlock Studio & Resume"}</span>
          </button>
        </form>

        <p className="text-[10px] text-white/30 font-mono mt-6">
          All your unsaved form drafts have been preserved in session memory.
        </p>
      </div>
    </div>
  );
}

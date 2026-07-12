"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check local storage for consent state
    const consent = localStorage.getItem("zru-cookie-consent");
    if (!consent) {
      setTimeout(() => setShowBanner(true), 0);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("zru-cookie-consent", "accepted");
    setShowBanner(false);
    // Dispatch custom event to notify other scripts (e.g. root layout)
    window.dispatchEvent(new Event("zru-consent-changed"));
  };

  const handleDecline = () => {
    localStorage.setItem("zru-cookie-consent", "declined");
    setShowBanner(false);
    window.dispatchEvent(new Event("zru-consent-changed"));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-50 p-6 rounded-2xl bg-black/90 border border-white/10 text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-1" />
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider">Privacy Consent</h4>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">
              We use optional tracking cookies to measure and enhance your experience on the platform. All data is processed in accordance with CDPA 2021 and GDPR regulations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-green-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-green-500 transition-all cursor-pointer"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="px-4 py-2 border border-white/20 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            >
              Decline
            </button>
          </div>
        </div>
        <button 
          onClick={() => setShowBanner(false)}
          className="text-white/40 hover:text-white transition-colors cursor-pointer"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

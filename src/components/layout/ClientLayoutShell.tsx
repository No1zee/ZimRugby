"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";

const SmoothScrollProvider = dynamic(() => import("./SmoothScrollProvider"), { ssr: false });
const MobileDock = dynamic(() => import("./MobileDock"), { ssr: false });
const CmsBadge = dynamic(() => import("../ui/CmsBadge"), { ssr: false });
const CookieConsent = dynamic(() => import("../common/CookieConsent"), { ssr: false });

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const loadTrackingScript = () => {
      const consent = localStorage.getItem("zru-cookie-consent");
      if (consent === "accepted") {
        if (!document.getElementById("contentsquare-tracker")) {
          const script = document.createElement("script");
          script.id = "contentsquare-tracker";
          script.src = "https://t.contentsquare.net/uxa/97d0dc6c80d47.js";
          script.async = true;
          document.head.appendChild(script);
        }
      }
    };

    loadTrackingScript();

    window.addEventListener("zru-consent-changed", loadTrackingScript);
    return () => {
      window.removeEventListener("zru-consent-changed", loadTrackingScript);
    };
  }, []);

  return (
    <SmoothScrollProvider>
      {children}
      <MobileDock />
      <CmsBadge />
      <CookieConsent />
    </SmoothScrollProvider>
  );
}

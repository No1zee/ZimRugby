"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const SmoothScrollProvider = dynamic(() => import("./SmoothScrollProvider"));
const MobileDock = dynamic(() => import("./MobileDock"), { ssr: false });
const CmsBadge = dynamic(() => import("../ui/CmsBadge"), { ssr: false });
const CookieConsent = dynamic(() => import("../common/CookieConsent"), { ssr: false });

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/admin-login");

  useEffect(() => {
    const loadTrackingScript = () => {
      const consent = localStorage.getItem("zru-cookie-consent");
      if (consent === "accepted") {
        if (!document.getElementById("contentsquare-tracker")) {
          const injectScript = () => {
            const script = document.createElement("script");
            script.id = "contentsquare-tracker";
            script.src = "https://t.contentsquare.net/uxa/97d0dc6c80d47.js";
            script.async = true;
            document.head.appendChild(script);
          };
          if ("requestIdleCallback" in window) {
            window.requestIdleCallback(injectScript);
          } else {
            setTimeout(injectScript, 2000);
          }
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
      {!isAdminRoute && <MobileDock />}
      {!isAdminRoute && <CmsBadge />}
      {!isAdminRoute && <CookieConsent />}
    </SmoothScrollProvider>
  );
}

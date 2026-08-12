"use client";

import { useEffect, useState, ReactNode } from "react";
import { canAccessPanel } from "@/lib/admin/iam";

interface AdminAuthGateProps {
  children: ReactNode;
  /** Tab that must be accessible (role gate). Redirects to /admin when missing. */
  requiredTab?: string;
}

export default function AdminAuthGate({ children, requiredTab }: AdminAuthGateProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth/check")
      .then(async (res) => {
        if (!res.ok) {
          window.location.href = "/admin-login";
          return;
        }
        if (requiredTab) {
          const json = await res.json().catch(() => null);
          const perms = json?.user?.permissions ?? null;
          if (!canAccessPanel(perms, requiredTab)) {
            window.location.href = "/admin";
            return;
          }
        }
        setAuthorized(true);
      })
      .catch(() => window.location.href = "/admin-login");
  }, [requiredTab]);

  if (authorized === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-white/40 text-sm">Loading…</div>
      </div>
    );
  }

  return <>{children}</>;
}

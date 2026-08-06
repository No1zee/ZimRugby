"use client";

import { useEffect, useState, ReactNode } from "react";

export default function AdminAuthGate({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth/check")
      .then((res) => {
        if (res.ok) setAuthorized(true);
        else window.location.href = "/admin-login";
      })
      .catch(() => window.location.href = "/admin-login");
  }, []);

  if (authorized === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-white/40 text-sm">Loading…</div>
      </div>
    );
  }

  return <>{children}</>;
}

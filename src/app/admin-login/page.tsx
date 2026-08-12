"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?redirect=/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#001A0E] flex items-center justify-center text-white text-xs font-mono font-bold uppercase tracking-widest">
      Redirecting to unified ZRU login portal...
    </div>
  );
}


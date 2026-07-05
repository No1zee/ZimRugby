"use client";

import React from "react";
import dynamic from "next/dynamic";

const SmoothScrollProvider = dynamic(() => import("./SmoothScrollProvider"), { ssr: false });
const MobileDock = dynamic(() => import("./MobileDock"), { ssr: false });

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      {children}
      <MobileDock />
    </SmoothScrollProvider>
  );
}

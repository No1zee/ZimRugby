"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AdaptivePerformanceContextType {
  isLowTierDevice: boolean;
  isSlowNetwork: boolean;
  saveDataEnabled: boolean;
  shouldReduceMotion: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

const AdaptivePerformanceContext = createContext<AdaptivePerformanceContextType>({
  isLowTierDevice: false,
  isSlowNetwork: false,
  saveDataEnabled: false,
  shouldReduceMotion: false,
});

export function AdaptivePerformanceProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<AdaptivePerformanceContextType>({
    isLowTierDevice: false,
    isSlowNetwork: false,
    saveDataEnabled: false,
    shouldReduceMotion: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect CPU cores and memory
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const isLowTier = memory <= 2 || cores <= 2;

    // Detect network speed & save-data
    const connection = (navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    const effectiveType = connection?.effectiveType || "4g";
    const saveData = connection?.saveData || false;
    const isSlow = effectiveType === "2g" || effectiveType === "slow-2g" || effectiveType === "3g";

    // Detect reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceMotion = mediaQuery.matches;

    setMetrics({
      isLowTierDevice: isLowTier,
      isSlowNetwork: isSlow,
      saveDataEnabled: saveData,
      shouldReduceMotion: reduceMotion,
      deviceMemory: memory,
      hardwareConcurrency: cores,
    });
  }, []);

  return (
    <AdaptivePerformanceContext.Provider value={metrics}>
      {children}
    </AdaptivePerformanceContext.Provider>
  );
}

export function useAdaptivePerformance() {
  return useContext(AdaptivePerformanceContext);
}

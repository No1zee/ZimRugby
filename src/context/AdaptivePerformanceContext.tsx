'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface NetworkInformation extends EventTarget {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  saveData?: boolean;
}

interface NavigatorWithPerformance extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
  deviceMemory?: number;
}

interface AdaptivePerformanceContextType {
  isLowEndDevice: boolean;
  isSlowConnection: boolean;
  saveDataEnabled: boolean;
  prefersReducedMotion: boolean;
  shouldEnable3DEffects: boolean;
  shouldAutoPlayVideo: boolean;
  effectiveConnectionType: string;
}

const AdaptivePerformanceContext = createContext<AdaptivePerformanceContextType>({
  isLowEndDevice: false,
  isSlowConnection: false,
  saveDataEnabled: false,
  prefersReducedMotion: false,
  shouldEnable3DEffects: true,
  shouldAutoPlayVideo: true,
  effectiveConnectionType: '4g',
});

export const AdaptivePerformanceProvider = ({ children }: { children: ReactNode }) => {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [saveDataEnabled, setSaveDataEnabled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [effectiveConnectionType, setEffectiveConnectionType] = useState('4g');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const nav = navigator as NavigatorWithPerformance;

    // 1. Hardware Concurrency & Memory detection
    const concurrency = nav.hardwareConcurrency || 4;
    const memory = nav.deviceMemory || 4;
    const lowHardware = concurrency <= 2 || memory <= 2;
    setIsLowEndDevice(lowHardware);

    // 2. Network Speed & Connection Type detection
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (conn) {
      const type = conn.effectiveType || '4g';
      setEffectiveConnectionType(type);
      const isSlow = type === 'slow-2g' || type === '2g' || type === '3g';
      setIsSlowConnection(isSlow);
      setSaveDataEnabled(!!conn.saveData);
    }

    // 3. User Accessibility OS Reduced Motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  // Compute adaptive feature switches
  const shouldEnable3DEffects = !(isLowEndDevice || isSlowConnection || prefersReducedMotion || saveDataEnabled);
  const shouldAutoPlayVideo = !(isSlowConnection || saveDataEnabled || prefersReducedMotion);

  return (
    <AdaptivePerformanceContext.Provider
      value={{
        isLowEndDevice,
        isSlowConnection,
        saveDataEnabled,
        prefersReducedMotion,
        shouldEnable3DEffects,
        shouldAutoPlayVideo,
        effectiveConnectionType,
      }}
    >
      {children}
    </AdaptivePerformanceContext.Provider>
  );
};

export const useAdaptivePerformance = () => useContext(AdaptivePerformanceContext);

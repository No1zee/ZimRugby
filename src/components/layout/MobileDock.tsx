"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Trophy, Newspaper, Users, Menu, Shield } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "@/context/AuthContext";

const dockItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Teams", icon: Shield, href: "/teams" },
  { label: "Matches", icon: Trophy, href: "/match-centre" },
  { label: "Media", icon: Newspaper, href: "/media" },
  { label: "Fan Zone", icon: Users, href: "/fan-zone" },
  { label: "Menu", icon: Menu, href: "#menu", isMenu: true },
];

export default function MobileDock() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isHidden, setIsHidden] = useState(false);
  const isFanActive = !!user;
  const lastScrollY = useRef(0);

  // Hide on scroll down, show on scroll up — native passive listener (no framer-motion RAF)
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY.current && current > 150) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleInteraction = (item: typeof dockItems[0], e: React.MouseEvent) => {
    // Haptic feedback (supported devices only)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (item.isMenu) {
      e.preventDefault();
      // Dispatch custom event to Navigation.tsx
      window.dispatchEvent(new CustomEvent('toggleMobileMenu'));
    }
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: isHidden ? 150 : 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-[max(env(safe-area-inset-bottom),16px)] pointer-events-none"
    >
      {/* Glassmorphism Background */}
      <div className="mx-4 mt-4 sm:mx-auto sm:max-w-xl rounded-2xl bg-milk-white/95 backdrop-blur-xl border border-black/10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] flex items-center justify-around p-2 sm:p-3 pointer-events-auto">
        {dockItems.map((item) => {
          const isActive = !item.isMenu && (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));
          const Icon = item.icon;

          const LinkWrapper = item.isMenu ? motion.button : motion.create(Link);
          const linkProps = item.isMenu ? { type: "button" } : { href: item.href };

          return (
            <LinkWrapper
              key={item.label}
              {...(linkProps as Record<string, unknown>)}
              onClick={(e: React.MouseEvent) => handleInteraction(item, e)}
              whileTap={{ scale: 0.85 }}
              className="relative flex flex-col items-center justify-center p-2 sm:p-2.5 min-w-0 flex-1 outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeDock"
                  className="absolute inset-0 bg-zru-green/15 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    isActive ? "text-zru-green" : "text-black/50"
                  )}
                />
                {item.label === "Fan Zone" && isFanActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </div>
              <span className={cn(
                "text-[10px] mt-1 font-extrabold tracking-wider uppercase transition-colors font-heading",
                isActive ? "text-zru-green" : "text-black/60"
              )}>
                {item.label === "Fan Zone" && isFanActive ? "VIP Member" : item.label}
              </span>

              {isActive && (
                <motion.div 
                  className="absolute -bottom-1 w-1.5 h-1.5 bg-zru-green rounded-full"
                  layoutId="activeDot"
                />
              )}
            </LinkWrapper>
          );
        })}
      </div>
    </motion.div>
  );
}

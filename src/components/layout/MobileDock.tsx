"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Ticket, LayoutGrid, ShoppingBag, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const dockItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Tickets", icon: Ticket, href: "/tickets" },
  { label: "Matches", icon: LayoutGrid, href: "/match-centre" },
  { label: "Store", icon: ShoppingBag, href: "/store" },
  { label: "Menu", icon: Menu, href: "#menu", isMenu: true },
];

export default function MobileDock() {
  const pathname = usePathname();

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe"
    >
      {/* Glassmorphism Background */}
      <div className="mx-4 mb-4 rounded-2xl bg-rich-black/80 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-around p-2">
        {dockItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center p-2 min-w-[64px]"
            >
              {isActive && (
                <motion.div
                  layoutId="activeDock"
                  className="absolute inset-0 bg-zru-gold/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <Icon 
                className={cn(
                  "w-6 h-6 transition-colors",
                  isActive ? "text-zru-gold" : "text-gray-400"
                )} 
              />
              <span className={cn(
                "text-[10px] mt-1 font-medium tracking-tight uppercase",
                isActive ? "text-zru-gold" : "text-gray-500"
              )}>
                {item.label}
              </span>

              {isActive && (
                <motion.div 
                  className="absolute -bottom-1 w-1 h-1 bg-zru-gold rounded-full"
                  layoutId="activeDot"
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

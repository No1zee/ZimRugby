"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ChevronRight, Ticket, Users, ShoppingBag, ArrowUpRight, ShieldCheck } from "lucide-react";
import type { NavItem, NavChild } from "@/lib/navConfig";

interface HamburgerMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  pathname: string;
}

export function HamburgerMenuOverlay({
  isOpen,
  onClose,
  navItems,
  pathname,
}: HamburgerMenuOverlayProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (href: string, children?: NavChild[]) => {
    if (href === "/") return pathname === "/";
    const [hrefPath] = href.split("?");
    const pathMatches = pathname.startsWith(hrefPath);
    if (!pathMatches) return false;
    /* If this item has children, only show active when no child matches */
    if (children?.length) {
      const childMatches = children.some((child) => {
        const [childPath] = child.href.split("?");
        return pathname.startsWith(childPath);
      });
      if (childMatches) return false;
    }
    return true;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -25 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="hamburger-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] bg-[#010905]/95 backdrop-blur-2xl text-white flex flex-col justify-between overflow-hidden"
        >
          {/* Ambient Laser Background Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#006747]/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#006747]/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Unclipped ZRU Emblem Watermark Backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none">
            <Image
              src="/images/logos/zru-logo.svg"
              alt="ZRU Watermark"
              width={700}
              height={700}
              className="object-contain"
            />
          </div>

          {/* Top Header Bar */}
          <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between relative z-10 border-b border-white/10">
            <Link href="/" onClick={onClose} className="flex items-center gap-3 group">
              <Image
                src="/images/logos/zru-logo.svg"
                alt="ZRU Crest"
                width={38}
                height={38}
                className="object-contain transition-transform group-hover:scale-105"
              />
              <div>
                <span className="font-heading font-black text-sm sm:text-base text-white tracking-widest uppercase block leading-none">
                  ZIMBABWE RUGBY
                </span>
                <span className="text-[9px] font-bold text-[#006747] tracking-widest uppercase block mt-1">
                  OFFICIAL UNION NAVIGATION
                </span>
              </div>
            </Link>

            {/* Close Button with Rotation Effect */}
            <button
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-[#006747] text-white rounded-2xl border border-white/10 hover:border-[#006747]/50 transition-all duration-300 group shadow-lg"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90 text-[#006747] group-hover:text-white" />
            </button>
          </div>

          {/* Middle Body: Main Navigation Links Stack */}
          <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10 max-w-[1440px] w-full mx-auto news-scroll">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-2xl space-y-3"
            >
              {navItems.map((item) => {
                const isExpanded = expandedItems.includes(item.label);
                const active = isActive(item.href, item.children);

                return (
                  <motion.div key={item.label} variants={itemVariants} className="border-b border-white/5 pb-2">
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleExpand(item.label)}
                          className={`w-full flex items-center justify-between py-3 text-2xl sm:text-3xl font-heading font-black tracking-wide uppercase transition-all text-left ${
                            active ? "text-[#006747]" : "text-white/80 hover:text-white"
                          }`}
                        >
                          <span>{item.label}</span>
                          <div
                            className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ${
                              isExpanded ? "rotate-90 bg-[#006747] text-white border-[#006747]" : "bg-white/5 text-white/50"
                            }`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </button>

                        {/* Accordion Sub-Items */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden pl-4 py-2 space-y-2 border-l-2 border-[#006747]/50 my-2"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={onClose}
                                  className={`flex items-center justify-between text-sm sm:text-base font-bold uppercase tracking-wider py-2 px-3 rounded-xl transition-all ${
                                    isActive(child.href)
                                      ? "bg-[#006747] text-white"
                                      : "text-white/70 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  <span>{child.label}</span>
                                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`block py-3 text-2xl sm:text-3xl font-heading font-black tracking-wide uppercase transition-all ${
                          active ? "text-[#006747]" : "text-white/80 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Bottom Footer Action Strip */}
          <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md py-6 px-6">
            <div className="max-w-[1440px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Quick Access CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/tickets"
                  onClick={onClose}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#006747] text-white rounded-xl font-heading font-black text-xs tracking-widest uppercase hover:bg-white hover:text-[#006747] transition-all shadow-lg"
                >
                  <Ticket className="w-4 h-4" />
                  <span>MATCH TICKETS</span>
                </Link>

                <Link
                  href="/fan-zone"
                  onClick={onClose}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 font-heading font-black text-xs tracking-widest uppercase transition-all"
                >
                  <Users className="w-4 h-4 text-[#006747]" />
                  <span>FAN ZONE</span>
                </Link>

                <Link
                  href="/clubhouse"
                  onClick={onClose}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 font-heading font-black text-xs tracking-widest uppercase transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-[#006747]" />
                  <span>STORE</span>
                </Link>
              </div>

              {/* Copyright Tag */}
              <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-white/40 uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006747]" />
                <span>ZIMBABWE RUGBY UNION © {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

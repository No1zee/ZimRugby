/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Search, User } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Icon } from "@iconify/react";
import SlantedButton from "../ui/SlantedButton";
import GlobalAnnouncementBar from "./GlobalAnnouncementBar";
import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay";
import type { NavItem } from "@/lib/navConfig";
import { navConfig } from "@/lib/navConfig";
import type { SearchEventResult } from "@/types";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dynamicNavItems, setDynamicNavItems] = useState<NavItem[]>(navConfig);
  const [expandedMobile, setExpandedMobile] = useState<string[]>([]);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const toggleMenu = () => setIsOpen(!isOpen);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [allReports, setAllReports] = useState<any[]>([]);

  // Load search data once when search overlay is opened
  useEffect(() => {
    if (!isSearchOpen) return;
    
    async function loadSearchData() {
      try {
        const [resMatches, resReports] = await Promise.all([
          fetch("/data/matches.json"),
          fetch("/data/reports.json"),
        ]);
        if (resMatches.ok) {
          const data = await resMatches.json();
          setAllMatches(data);
        }
        if (resReports.ok) {
          const data = await resReports.json();
          setAllReports(data);
        }
      } catch (err) {
        console.error("Failed to load search data:", err);
      }
    }
    loadSearchData();
  }, [isSearchOpen]);

  // Compute search results dynamically to satisfy react-hooks/set-state-in-effect linter rule
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return { matches: [], reports: [], events: [] };
    }
    const q = searchQuery.toLowerCase();

    const filteredMatches = allMatches.filter(m => 
      m.homeTeam?.name?.toLowerCase().includes(q) || 
      m.awayTeam?.name?.toLowerCase().includes(q) ||
      m.venue?.toLowerCase().includes(q) ||
      m.competition?.toLowerCase().includes(q)
    ).slice(0, 4);

    const filteredReports = allReports.filter(r => 
      r.title?.toLowerCase().includes(q) || 
      r.excerpt?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      matches: filteredMatches,
      reports: filteredReports,
      events: [] as SearchEventResult[],
    };
  }, [searchQuery, allMatches, allReports]);

  // Escape key handler to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggleMobileMenu', handleToggle);
    return () => window.removeEventListener('toggleMobileMenu', handleToggle);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => { document.documentElement.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    async function loadDynamicNav() {
      try {
        const response = await fetch('/api/navigation');
        if (response.ok) {
          const data = await response.json();
          setDynamicNavItems(prev => prev.map(item => {
            if (item.label === "NATIONAL TEAMS" && data.teams) {
              return { ...item, children: data.teams };
            }
            if ((item.label === "DOMESTIC & MATCH CENTRE" || item.label === "DOMESTIC RUGBY") && (data.competitions || data.events)) {
              return { 
                ...item, 
                children: [
                  ...(data.competitions || []),
                  ...(data.events || [])
                ] 
              };
            }
            return item;
          }));
        }
      } catch (e) {
        console.error("Failed to load dynamic nav:", e);
      }
    }
    loadDynamicNav();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Determine if scrolled styling should apply
    if (latest > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const isTransparentAllowed = pathname === "/" || pathname === "/live" || pathname === "/world-cup-campaign" || pathname === "/fan-zone" || pathname === "/teams";
  const showOpaqueHeader = isScrolled || !isTransparentAllowed;

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    
    const [hrefPath, hrefQuery] = href.split("?");
    const pathMatches = pathname === hrefPath;
    
    if (hrefQuery) {
      if (typeof window !== "undefined") {
        const currentParams = new URLSearchParams(window.location.search);
        const targetParams = new URLSearchParams(hrefQuery);
        return pathMatches && Array.from(targetParams.entries()).every(([key, val]) => currentParams.get(key) === val);
      }
      return false;
    }
    
    return pathname.startsWith(hrefPath);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {pathname !== '/fan-zone' && <GlobalAnnouncementBar />}
      <nav 
        className={`w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showOpaqueHeader 
            ? "bg-milk-white/95 backdrop-blur-md py-3 shadow-md border-b border-black/5" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 lg:gap-4">
          
          {/* Logo Brand Block (Expands on homepage top load, shrinks smoothly on scroll) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-4 group z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0">
            <div className={`relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-6 flex items-center justify-center shrink-0 ${
              pathname === "/" && !isScrolled 
                ? "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]" 
                : "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12"
            }`}>
              <Image 
                src="/zru logo main.svg" 
                alt="Zimbabwe Rugby Union Logo" 
                width={80}
                height={80}
                priority
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className={`font-heading tracking-wider leading-none transition-all duration-500 ${
                pathname === "/" && !isScrolled 
                  ? "text-lg sm:text-2xl md:text-3xl text-white font-black drop-shadow-md" 
                  : `text-sm sm:text-lg md:text-xl ${showOpaqueHeader ? "text-black" : "text-white"}`
              }`}>
                ZIMBABWE
              </span>
              <span className={`font-subheading text-[#006747] font-black leading-none mt-1 transition-all duration-500 ${
                pathname === "/" && !isScrolled 
                  ? "text-[8px] sm:text-[10px] md:text-[12px] tracking-[0.4em]" 
                  : "text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.3em]"
              }`}>
                RUGBY UNION
              </span>
            </div>
          </Link>
 
          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-5 2xl:gap-8 flex-1 justify-center max-w-full overflow-visible px-2">
            <div className="flex items-center gap-2.5 xl:gap-5 2xl:gap-8 overflow-visible">
              {dynamicNavItems.map((item) => (
                <div 
                  key={item.label}
                  className="relative group/nav shrink-0 py-1"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link 
                    href={item.href}
                    className={`
                      flex items-center gap-1 xl:gap-1.5 py-2 font-subheading tracking-wider text-[9px] xl:text-[10px] 2xl:text-xs uppercase font-black transition-colors relative whitespace-nowrap
                      ${isActive(item.href) ? "text-zru-green" : showOpaqueHeader ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white"}
                    `}
                  >
                    {isActive(item.href) && (
                      <motion.span 
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-zru-green"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
 
                    {item.label}
                    {item.children && <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform group-hover/nav:rotate-180 shrink-0" />}
                  </Link>
 
                  {/* Dropdown Menu (Mega or Standard) */}
                  {item.children && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[#005238] backdrop-blur-2xl rounded-2xl shadow-2xl py-3 border border-white/20 overflow-hidden z-[100] ${
                            item.isMega ? 'w-[380px] xl:w-[420px] grid grid-cols-2 gap-x-2 px-3' : 'min-w-[220px] px-2'
                          }`}
                        >
                          {item.children.map((child) => (
                            <Link
                               key={child.label}
                               href={child.href}
                               className={`
                                 block px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all rounded-xl hover:bg-white/15 text-white
                                 ${isActive(child.href) ? "text-white bg-white/20 font-black" : "text-white/90"}
                                 ${item.isMega ? 'hover:pl-5' : 'hover:pl-4'}
                               `}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>
          </div>
 
          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 transition-colors cursor-pointer ${showOpaqueHeader ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white"}`}
              aria-label="Search site"
              title="Search"
            >
              <Icon icon="nimbus:search" className="w-5 h-5" />
            </button>
            <SlantedButton 
              href="/login" 
              variant="primary" 
              size="sm"
            >
              <div className="flex items-center gap-1.5">
                <Icon icon="nimbus:user" className="w-3.5 h-3.5" />
                <span className="text-xs font-black uppercase tracking-wider">Sign In</span>
              </div>
            </SlantedButton>
          </div>

          {/* Desktop Actions (Always pinned right & protected from truncation) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4 shrink-0 z-50">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 xl:p-2.5 rounded-full transition-all cursor-pointer ${showOpaqueHeader ? "text-black/70 hover:text-black hover:bg-black/5" : "text-white/70 hover:text-white hover:bg-white/10"}`}
              aria-label="Search site"
              title="Search"
            >
              <Icon icon="nimbus:search" className="w-4 h-4 xl:w-5 xl:h-5" />
            </button>
            <SlantedButton 
              href="/login" 
              variant="primary" 
              size="sm"
            >
              <div className="flex items-center gap-1.5 xl:gap-2">
                <Icon icon="nimbus:user" className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                <span className="text-[10px] xl:text-xs font-black uppercase tracking-wider whitespace-nowrap">Sign In</span>
              </div>
            </SlantedButton>
          </div>

        </div>
      </nav>

      {/* Lightswind Hamburger Menu Overlay */}
      <HamburgerMenuOverlay
        isOpen={isOpen}
        onClose={toggleMenu}
        navItems={dynamicNavItems}
        pathname={pathname}
      />

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-rich-black/98 backdrop-blur-xl z-[100] overflow-y-auto pt-16 flex flex-col items-center px-4 md:px-8"
          >
            {/* Top Bar inside Overlay */}
            <div className="w-full max-w-4xl flex justify-end py-4">
              <button 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                aria-label="Close search"
                title="Close search"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Input Box */}
            <div className="w-full max-w-4xl mt-4">
              <div className="relative border-b-2 border-white/10 focus-within:border-zru-green transition-colors py-4 flex items-center gap-4">
                <Search className="w-8 h-8 text-white/40" />
                <input 
                  type="text" 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH TEAMS, FIXTURES, ARTICLES..." 
                  className="w-full bg-transparent text-2xl md:text-4xl font-heading tracking-wider uppercase text-white placeholder:text-white/20 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Search Results Display */}
            <div className="w-full max-w-4xl mt-12 pb-24 grid grid-cols-1 md:grid-cols-3 gap-10">
              
              {/* Category: Matches */}
              <div className="space-y-4">
                <h3 className="text-zru-green text-[10px] font-black uppercase tracking-[0.3em] border-b border-zru-green/20 pb-2">Fixtures & Results</h3>
                {searchQuery && searchResults.matches.length === 0 && (
                  <p className="text-white/40 text-xs font-normal">No matching fixtures found.</p>
                )}
                <div className="space-y-3">
                  {searchResults.matches.map((m) => (
                    <Link 
                      key={m.id} 
                      href="/match-centre" 
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                      className="block p-3 rounded-lg bg-white/5 hover:bg-zru-green/10 border border-white/5 hover:border-zru-green/20 transition-all group"
                    >
                      <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">{m.competition}</div>
                      <div className="text-white group-hover:text-zru-green transition-colors text-sm font-heading tracking-wide">
                        {m.homeTeam?.name} VS {m.awayTeam?.name}
                      </div>
                      <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-1">{m.date} • {m.venue}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Category: News / Articles */}
              <div className="space-y-4">
                <h3 className="text-zru-green text-[10px] font-black uppercase tracking-[0.3em] border-b border-zru-green/20 pb-2">Latest News</h3>
                {searchQuery && searchResults.reports.length === 0 && (
                  <p className="text-white/40 text-xs font-normal">No matching articles found.</p>
                )}
                <div className="space-y-3">
                  {searchResults.reports.map((r) => (
                    <Link 
                      key={r.id} 
                      href={`/media/${r.id}`}
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                      className="block p-3 rounded-lg bg-white/5 hover:bg-zru-green/10 border border-white/5 hover:border-zru-green/20 transition-all group"
                    >
                      <div className="text-[10px] text-zru-green font-bold uppercase tracking-wider mb-1">{r.category}</div>
                      <div className="text-white group-hover:text-zru-green transition-colors text-sm font-body font-bold line-clamp-2 leading-snug">
                        {r.title}
                      </div>
                      <div className="text-[9px] text-white/40 font-bold uppercase tracking-wider mt-1">{r.date}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Category: Events */}
              {searchResults.events.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-zru-green text-[10px] font-black uppercase tracking-[0.3em] border-b border-zru-green/20 pb-2">Tournaments & Events</h3>
                  <div className="space-y-3">
                    {searchResults.events.map((e) => (
                      <Link 
                        key={e.id} 
                        href={e.href}
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                        className="block p-3 rounded-lg bg-white/5 hover:bg-zru-green/10 border border-white/5 hover:border-zru-green/20 transition-all group"
                      >
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">{e.category}</div>
                        <div className="text-white group-hover:text-zru-green transition-colors text-sm font-heading tracking-wide">
                          {e.title}
                        </div>
                        <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-1">{e.location}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

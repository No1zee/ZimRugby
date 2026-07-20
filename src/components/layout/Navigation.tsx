/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import SlantedButton from "../ui/SlantedButton";
import GlobalAnnouncementBar from "./GlobalAnnouncementBar";
import type { SearchEventResult } from "@/types";

interface NavItem {
  label: string;
  href: string;
  isMega?: boolean;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { 
    label: "TEAMS", 
    href: "/teams",
    isMega: true,
    children: [
      { label: "Sables (Men's XV)", href: "/teams/sables" },
      { label: "Lady Sables (Women's XV)", href: "/teams/lady-sables" },
      { label: "Junior Sables (U20)", href: "/teams/junior-sables" },
      { label: "National Sevens", href: "/teams" },
    ]
  },
  { 
    label: "FIXTURES & RESULTS", 
    href: "/match-centre",
    children: [
      { label: "Match Centre", href: "/match-centre" },
      { label: "Book Tickets", href: "/tickets" },
      { label: "Live Matches", href: "/live" },
    ]
  },
  { 
    label: "COMPETITIONS & EVENTS", 
    href: "/events",
    children: [
      { label: "Sevens Series", href: "/events?tab=competitions" },
      { label: "Club Championship", href: "/events?tab=competitions" },
      { label: "Schools Rugby", href: "/events?tab=competitions" },
      { label: "Coaching Courses", href: "/events?tab=events" },
      { label: "AGM & Admin", href: "/events?tab=events" },
      { label: "Gala Dinners", href: "/events?tab=events" },
    ]
  },
  { 
    label: "NEWS", 
    href: "/media",
    children: [
      { label: "Latest News", href: "/media" },
      { label: "Video Hub", href: "/video-hub" },
      { label: "Gallery", href: "/gallery" },
    ]
  },
  { 
    label: "CLUBHOUSE", 
    href: "/about/clubhouse",
    children: [
      { label: "Shop Merchandise", href: "/about/clubhouse" },
      { label: "Fan Zone", href: "/fan-zone" },
      { label: "Referees", href: "/referees" },
      { label: "Volunteer", href: "/volunteer" },
    ]
  },
  { 
    label: "ABOUT", 
    href: "/about",
    isMega: true,
    children: [
      { label: "ZRU History", href: "/about/history" },
      { label: "Board & Governance", href: "/about/governance" },
      { label: "Safeguarding", href: "/about/safeguarding" },
      { label: "Partners", href: "/partners" },
      { label: "Careers", href: "/about/careers" },
      { label: "Contact Us", href: "/contact" },
    ]
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dynamicNavItems, setDynamicNavItems] = useState<NavItem[]>(navItems);
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
            if (item.label === "TEAMS" && data.teams) {
              return { ...item, children: data.teams };
            }
            if (item.label === "COMPETITIONS & EVENTS" && (data.competitions || data.events)) {
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
      <GlobalAnnouncementBar />
      <nav 
        className={`w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled 
            ? "bg-rich-black/90 backdrop-blur-md py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-white/5" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-4">
          
          {/* Logo Brand Block */}
          <Link href="/" className="flex items-center gap-3 group z-50">
            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:rotate-12 flex items-center justify-center">
              <Image 
                src="/zru logo main.svg" 
                alt="Zimbabwe Rugby Union Logo" 
                width={48}
                height={48}
                priority
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg md:text-xl tracking-wider text-white leading-none">ZIMBABWE</span>
              <span className="font-subheading text-[8px] md:text-[9px] tracking-[0.4em] text-zru-green font-black leading-none mt-1">RUGBY UNION</span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            <div className="flex items-center gap-8 xl:gap-10">
              {dynamicNavItems.map((item) => (
                <div 
                  key={item.label}
                  className="relative group/nav"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link 
                    href={item.href}
                    className={`
                      flex items-center gap-1.5 py-2 font-subheading tracking-widest text-[10px] uppercase font-black transition-colors relative
                      ${isActive(item.href) ? "text-zru-green" : "text-white/80 hover:text-white"}
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
                    {item.children && <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover/nav:rotate-180" />}
                  </Link>

                  {/* Dropdown Menu (Mega or Standard) */}
                  {item.children && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-zru-green/95 backdrop-blur-xl rounded-xl shadow-2xl py-4 border border-white/10 overflow-hidden ${
                            item.isMega ? 'w-[400px] grid grid-cols-2 gap-x-4 px-4' : 'min-w-[220px] px-2'
                          }`}
                        >
                          {item.children.map((child) => (
                            <Link
                               key={child.label}
                               href={child.href}
                               className={`
                                 block px-4 py-3 text-sm font-medium transition-all rounded-lg hover:bg-white/10
                                 ${isActive(child.href) ? "text-zru-green bg-white/5 font-bold" : "text-white"}
                                 ${item.isMega ? 'hover:pl-6' : 'hover:pl-5'}
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
              className="p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Search site"
              title="Search"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
              aria-label="Search site"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <SlantedButton href="/tickets" variant="primary" size="sm">
              Book Tickets
            </SlantedButton>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-x-0 top-[4rem] bottom-0 z-50 bg-zru-green/95 backdrop-blur-xl border-t border-white/10 overflow-y-auto overscroll-contain"
          >
             <div className="px-6 py-8 pb-32 space-y-2 max-w-[320px] mx-auto w-full">
              {dynamicNavItems.map((item, index) => {
                const isExpanded = expandedMobile.includes(item.label);
                return (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.children ? (
                      <>
                        <button
                          onClick={() => {
                            setExpandedMobile(prev =>
                              prev.includes(item.label)
                                ? prev.filter(l => l !== item.label)
                                : [...prev, item.label]
                            );
                          }}
                          className={`
                            flex items-center justify-between w-full py-3 text-xl font-black uppercase tracking-wider transition-colors text-left
                            ${isActive(item.href) ? "text-white" : "text-white/70 hover:text-white"}
                          `}
                        >
                          {item.label}
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 mt-1 mb-2 space-y-1 border-l-2 border-white/10">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.label}
                                    href={child.href}
                                    className={`
                                      block py-2.5 px-4 text-sm font-medium transition-colors rounded-r-lg
                                      ${isActive(child.href) ? "text-white bg-white/10 border-l-2 border-white -ml-[2px]" : "text-white/70 hover:text-white hover:bg-white/5"}
                                    `}
                                    onClick={toggleMenu}
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`
                          block py-3 text-xl font-black uppercase tracking-wider transition-colors
                          ${isActive(item.href) ? "text-white" : "text-white/70 hover:text-white"}
                        `}
                        onClick={toggleMenu}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <p className="text-white/40 text-xs font-medium">No matching fixtures found.</p>
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
                  <p className="text-white/40 text-xs font-medium">No matching articles found.</p>
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
                      <div className="text-white group-hover:text-zru-green transition-colors text-sm font-body font-semibold line-clamp-2 leading-snug">
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

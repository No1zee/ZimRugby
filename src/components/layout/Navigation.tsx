"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Search, X, User } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import SlantedButton from "../ui/SlantedButton";
import GlobalAnnouncementBar from "./GlobalAnnouncementBar";
import { HamburgerMenuOverlay } from "@/components/lightswind/HamburgerMenuOverlay";
import type { NavItem } from "@/lib/navConfig";
import { navConfig } from "@/lib/navConfig";
import type { SearchEventResult } from "@/types";

/* ── Static config ── */
const TRANSPARENT_ROUTES = ["/", "/live", "/world-cup-campaign", "/fan-zone", "/teams", "/match-centre", "/schools", "/clubs", "/about", "/events", "/media", "/volunteer", "/referees"];
const SCROLL_THRESHOLD = 20;

export default function Navigation() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  /* ── Core UI state ── */
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string[]>([]);
  const [dynamicNavItems, setDynamicNavItems] = useState<NavItem[]>(navConfig);

  /* ── Search state ── */
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [allReports, setAllReports] = useState<any[]>([]);

  /* ── Derived booleans (computed once) ── */
  const isTransparentAllowed = TRANSPARENT_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );
  const isOnHero = isTransparentAllowed && !isScrolled;
  const showOpaqueHeader = !isOnHero;

  /* ── Scroll listener (single useEffect, no framer-motion dependency for this) ── */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > SCROLL_THRESHOLD;
    setIsScrolled((prev) => (prev === next ? prev : next));
  });

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [isOpen]);

  /* ── Mobile menu toggle from external trigger ── */
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggleMobileMenu", handleToggle);
    return () => window.removeEventListener("toggleMobileMenu", handleToggle);
  }, []);

  /* ── Escape key to close search ── */
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  /* ── Lazy-load search data only when search overlay opens ── */
  useEffect(() => {
    if (!isSearchOpen) return;
    let cancelled = false;
    Promise.all([
      fetch("/data/matches.json").then((r) => (r.ok ? r.json() : [])),
      fetch("/data/reports.json").then((r) => (r.ok ? r.json() : [])),
    ]).then(([matches, reports]) => {
      if (!cancelled) {
        setAllMatches(matches);
        setAllReports(reports);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [isSearchOpen]);

  /* ── Load dynamic nav items once on mount ── */
  useEffect(() => {
    fetch("/api/navigation")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setDynamicNavItems((prev) =>
          prev.map((item) => {
            if (item.label === "NATIONAL TEAMS" && data.teams) {
              return { ...item, children: data.teams };
            }
            if (
              (item.label === "DOMESTIC & MATCH CENTRE" || item.label === "DOMESTIC RUGBY") &&
              (data.competitions || data.events)
            ) {
              return { ...item, children: [...(data.competitions || []), ...(data.events || [])] };
            }
            return item;
          })
        );
      })
      .catch(() => {});
  }, []);

  /* ── Search results (memoized) ── */
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { matches: [], reports: [], events: [] };
    const q = searchQuery.toLowerCase();
    return {
      matches: allMatches
        .filter(
          (m) =>
            m.homeTeam?.name?.toLowerCase().includes(q) ||
            m.awayTeam?.name?.toLowerCase().includes(q) ||
            m.venue?.toLowerCase().includes(q) ||
            m.competition?.toLowerCase().includes(q)
        )
        .slice(0, 4),
      reports: allReports
        .filter(
          (r) =>
            r.title?.toLowerCase().includes(q) ||
            r.excerpt?.toLowerCase().includes(q) ||
            r.category?.toLowerCase().includes(q)
        )
        .slice(0, 4),
      events: [] as SearchEventResult[],
    };
  }, [searchQuery, allMatches, allReports]);

  /* ── Active route check (memoized per pathname) ── */
  const isActive = useCallback(
    (href: string) => {
      if (href === "/" && pathname !== "/") return false;
      const [hrefPath, hrefQuery] = href.split("?");
      const pathMatches = pathname === hrefPath;
      if (!hrefQuery || typeof window === "undefined") return pathMatches;
      const currentParams = new URLSearchParams(window.location.search);
      const targetParams = new URLSearchParams(hrefQuery);
      return pathMatches && Array.from(targetParams.entries()).every(([k, v]) => currentParams.get(k) === v);
    },
    [pathname]
  );

  /* ── Helpers ── */
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeSearch = () => { setIsSearchOpen(false); setSearchQuery(""); };

  const navTextClass = showOpaqueHeader ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white";
  const actionBtnClass = showOpaqueHeader
    ? "text-black/70 hover:text-black hover:bg-black/5"
    : "text-white/70 hover:text-white hover:bg-white/10";

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {pathname !== "/fan-zone" && <GlobalAnnouncementBar />}

      <nav
        className={`w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showOpaqueHeader
            ? "bg-milk-white/95 backdrop-blur-md py-3 shadow-md border-b border-black/5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="w-full pl-2 sm:pl-4 lg:pl-8 pr-2 sm:pr-4 lg:pr-8 grid grid-cols-[auto_1fr_auto] items-center gap-1.5 sm:gap-2 lg:gap-4">

          {/* ── Logo Brand Block ── */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 md:gap-4 group z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0"
          >
            {/* Emblem — large on hero, shrinks on scroll */}
            <div
              className={`relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-6 flex items-center justify-center shrink-0 ${
                isOnHero
                  ? "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                  : "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-10 lg:h-10 xl:w-12 xl:h-12"
              }`}
            >
              <Image
                src="/zru logo main.svg"
                alt="Zimbabwe Rugby Union Logo"
                width={80}
                height={80}
                priority
                className="w-full h-full object-contain"
              />
            </div>

            {/* Text — hidden on hero, shows when scrolled */}
            <div
              className={`flex flex-col justify-center items-center transition-opacity duration-500 ${
                isOnHero ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <span
                className={`font-heading font-black tracking-[0.05em] leading-none transition-all duration-500 whitespace-nowrap ${
                  isOnHero
                    ? "text-lg sm:text-2xl md:text-3xl text-white"
                    : `text-sm sm:text-lg md:text-xl ${showOpaqueHeader ? "text-black" : "text-white"}`
                }`}
              >
                ZIMBABWE
              </span>
              <span
                className={`font-subheading font-black leading-none mt-1 whitespace-nowrap transition-all duration-500 ${
                  isOnHero
                    ? "text-[0.85em] sm:text-xl md:text-2xl tracking-[-0.02em]"
                    : `text-[0.85em] sm:text-base md:text-lg tracking-[-0.05em]`
                } ${isOnHero ? "text-white" : "text-[#006747]"}`}
              >
                RUGBY UNION
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Items ── */}
          <div className="hidden lg:flex items-center justify-center gap-2 xl:gap-5 2xl:gap-8 overflow-visible px-2">
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
                      ${isActive(item.href) ? "text-zru-green" : navTextClass}
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
                    {item.children && (
                      <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform group-hover/nav:rotate-180 shrink-0" />
                    )}
                  </Link>

                  {item.children && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[#005238] backdrop-blur-2xl rounded-2xl shadow-2xl py-3 border border-white/20 overflow-hidden z-[100] ${
                            item.isMega
                              ? "w-[380px] xl:w-[420px] grid grid-cols-2 gap-x-2 px-3"
                              : "min-w-[220px] px-2"
                          }`}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className={`
                                block px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all rounded-xl hover:bg-white/15 text-white
                                ${isActive(child.href) ? "text-white bg-white/20 font-black" : "text-white/90"}
                                ${item.isMega ? "hover:pl-5" : "hover:pl-4"}
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

          {/* ── Mobile Actions ── */}
          <div className="lg:hidden flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-1.5 sm:p-2 transition-colors cursor-pointer ${navTextClass}`}
              aria-label="Search site"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>
            <SlantedButton href="/login" variant="primary" size="sm" className="px-4 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-base">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden min-[380px]:inline text-[10px] sm:text-xs font-black uppercase tracking-wider">Sign In</span>
              </div>
            </SlantedButton>
          </div>

          {/* ── Desktop Actions ── */}
          <div className="hidden lg:flex items-center justify-end gap-2 xl:gap-4 shrink-0 z-50">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 xl:p-2.5 rounded-full transition-all cursor-pointer ${actionBtnClass}`}
              aria-label="Search site"
            >
              <Search className="w-4 h-4 xl:w-5 xl:h-5" />
            </button>
            <SlantedButton href="/login" variant="primary" size="sm">
              <div className="flex items-center gap-1.5 xl:gap-2">
                <User className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                <span className="text-[10px] xl:text-xs font-black uppercase tracking-wider whitespace-nowrap">
                  Sign In
                </span>
              </div>
            </SlantedButton>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <HamburgerMenuOverlay isOpen={isOpen} onClose={toggleMenu} navItems={dynamicNavItems} pathname={pathname} />

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-rich-black/98 backdrop-blur-xl z-[100] overflow-y-auto pt-16 flex flex-col items-center px-4 md:px-8"
          >
            <div className="w-full max-w-4xl flex justify-end py-4">
              <button
                onClick={closeSearch}
                className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

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

            <div className="w-full max-w-4xl mt-12 pb-24 grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Matches */}
              <div className="space-y-4">
                <span className="block text-zru-green text-[10px] font-black uppercase tracking-[0.3em] border-b border-zru-green/20 pb-2">
                  Fixtures &amp; Results
                </span>
                {searchQuery && searchResults.matches.length === 0 && (
                  <p className="text-white/40 text-xs font-normal">No matching fixtures found.</p>
                )}
                <div className="space-y-3">
                  {searchResults.matches.map((m) => (
                    <Link
                      key={m.id}
                      href="/match-centre"
                      onClick={closeSearch}
                      className="block p-3 rounded-lg bg-white/5 hover:bg-zru-green/10 border border-white/5 hover:border-zru-green/20 transition-all group"
                    >
                      <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">
                        {m.competition}
                      </div>
                      <div className="text-white group-hover:text-zru-green transition-colors text-sm font-heading tracking-wide">
                        {m.homeTeam?.name} VS {m.awayTeam?.name}
                      </div>
                      <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-1">
                        {m.date} &bull; {m.venue}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* News */}
              <div className="space-y-4">
                <span className="block text-zru-green text-[10px] font-black uppercase tracking-[0.3em] border-b border-zru-green/20 pb-2">
                  Latest News
                </span>
                {searchQuery && searchResults.reports.length === 0 && (
                  <p className="text-white/40 text-xs font-normal">No matching articles found.</p>
                )}
                <div className="space-y-3">
                  {searchResults.reports.map((r) => (
                    <Link
                      key={r.id}
                      href={`/media/${r.id}`}
                      onClick={closeSearch}
                      className="block p-3 rounded-lg bg-white/5 hover:bg-zru-green/10 border border-white/5 hover:border-zru-green/20 transition-all group"
                    >
                      <div className="text-[10px] text-zru-green font-bold uppercase tracking-wider mb-1">
                        {r.category}
                      </div>
                      <div className="text-white group-hover:text-zru-green transition-colors text-sm font-body font-bold line-clamp-2 leading-snug">
                        {r.title}
                      </div>
                      <div className="text-[9px] text-white/40 font-bold uppercase tracking-wider mt-1">
                        {r.date}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Events */}
              {searchResults.events.length > 0 && (
                <div className="space-y-4">
                  <span className="block text-zru-green text-[10px] font-black uppercase tracking-[0.3em] border-b border-zru-green/20 pb-2">
                    Tournaments &amp; Events
                  </span>
                  <div className="space-y-3">
                    {searchResults.events.map((e) => (
                      <Link
                        key={e.id}
                        href={e.href}
                        onClick={closeSearch}
                        className="block p-3 rounded-lg bg-white/5 hover:bg-zru-green/10 border border-white/5 hover:border-zru-green/20 transition-all group"
                      >
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">
                          {e.category}
                        </div>
                        <div className="text-white group-hover:text-zru-green transition-colors text-sm font-heading tracking-wide">
                          {e.title}
                        </div>
                        <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-1">
                          {e.location}
                        </div>
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

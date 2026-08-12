"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Search, X, User, LogOut, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import SlantedButton from "../ui/SlantedButton";
import GlobalAnnouncementBar from "./GlobalAnnouncementBar";
import KineticNav from "@/components/layout/KineticNav";
import type { NavItem, NavChild } from "@/lib/navConfig";
import { mainNav, utilityNav } from "@/lib/navConfig";
import type { SearchEventResult } from "@/types";
import { useAuth } from "@/context/AuthContext";

/* ── Static config ── */
const TRANSPARENT_ROUTES = ["/", "/live", "/world-cup-campaign", "/fan-zone", "/teams", "/match-centre", "/schools", "/clubs", "/about", "/events", "/media", "/volunteer", "/referees"];
const SCROLL_THRESHOLD = 20;

export default function Navigation() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { user, signOut: authSignOut } = useAuth();

  /* ── Core UI state ── */
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dynamicNavItems, setDynamicNavItems] = useState<NavItem[]>(mainNav);
  const [showFanMenu, setShowFanMenu] = useState(false);

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
              item.label === "DOMESTIC & MATCH CENTRE" &&
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
    (href: string, children?: NavChild[]) => {
      if (href === "/" && pathname !== "/") return false;
      const [hrefPath, hrefQuery] = href.split("?");
      const pathMatches = pathname === hrefPath;
      if (!pathMatches) return false;
      if (children?.length) {
        const childMatches = children.some((child) => {
          const [childPath, childQuery] = child.href.split("?");
          if (pathname !== childPath) return false;
          if (!childQuery) return true;
          if (typeof window === "undefined") return false;
          const currentParams = new URLSearchParams(window.location.search);
          const targetParams = new URLSearchParams(childQuery);
          return Array.from(targetParams.entries()).every(([k, v]) => currentParams.get(k) === v);
        });
        if (childMatches) return false;
      }
      if (!hrefQuery || typeof window === "undefined") return true;
      const currentParams = new URLSearchParams(window.location.search);
      const targetParams = new URLSearchParams(hrefQuery);
      return Array.from(targetParams.entries()).every(([k, v]) => currentParams.get(k) === v);
    },
    [pathname]
  );

  /* ── Helpers ── */
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeSearch = () => { setIsSearchOpen(false); setSearchQuery(""); };

  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/admin-login");

  const navTextClass = showOpaqueHeader ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white";

  if (isAdminRoute) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {pathname !== "/fan-zone" && <GlobalAnnouncementBar />}

      {/* ═══ UTILITY BAR ═══ */}
      <div
        className={`w-full transition-all duration-500 ${
          showOpaqueHeader
            ? "bg-[#002D1A]/95 backdrop-blur-md border-b border-white/5"
            : "bg-[#002D1A]/80 backdrop-blur-sm"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-end gap-1 sm:gap-2 h-9">
          {/* Desktop utility items */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Live Score Ticker Pill */}
            <div className="flex items-center gap-2 bg-[#001D11] border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-heading font-black tracking-wider text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_2px_6px_rgba(0,0,0,0.45)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE: ZIMBABWE 30 - 28 NAMIBIA [FINAL]</span>
            </div>

            {utilityNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href || "#"}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Admin Portal Direct Link (#1) */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading font-black uppercase tracking-wider text-zru-green bg-white/10 hover:bg-zru-green hover:text-white transition-all shadow-sm"
              title="Launch Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ADMIN PORTAL</span>
            </Link>

            <div className="w-px h-4 bg-white/15 mx-1" />

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
              aria-label="Search site"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowFanMenu(!showFanMenu)}
                  className="flex items-center gap-2 px-4 py-1.5 bg-[#006747] hover:bg-[#006747]/80 text-white text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                  style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
                >
                  <div className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-[9px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate max-w-[120px]">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="w-3 h-3 text-white/70" />
                </button>

                {showFanMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#002D1A] border border-white/15 rounded-xl p-3 shadow-xl z-50 space-y-2 text-white text-xs">
                    <div className="border-b border-white/10 pb-2">
                      <p className="font-bold truncate text-white">{user.name}</p>
                      <p className="text-[11px] text-white/60 truncate">{user.handle || user.email}</p>
                    </div>

                    <Link
                      href="/admin"
                      onClick={() => setShowFanMenu(false)}
                      className="flex items-center gap-2 px-2 py-2 hover:bg-zru-green text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-zru-green group-hover:text-white" />
                      <span>Admin Dashboard</span>
                    </Link>

                    <Link
                      href="/fan-zone"
                      onClick={() => setShowFanMenu(false)}
                      className="flex items-center gap-2 px-2 py-2 hover:bg-white/10 rounded-lg text-xs font-medium text-white transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-white/70" />
                      <span>My Account</span>
                    </Link>

                    <button
                      onClick={async () => {
                        await authSignOut();
                        setShowFanMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-2 hover:bg-red-500/20 text-red-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-300" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <SlantedButton
                href="/login"
                variant="primary"
                size="xs"
                leftIcon={<User className="w-3.5 h-3.5" />}
              >
                SIGN IN
              </SlantedButton>
            )}
          </div>

          {/* Mobile utility: Search + Tickets */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-1.5 transition-colors cursor-pointer text-white/60 hover:text-white`}
              aria-label="Search site"
            >
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/login"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#006747] text-white text-[10px] font-heading font-black uppercase tracking-wider shadow-[inset_0_1px_0_rgba(255,255,255,0.20),inset_0_-1px_0_rgba(0,0,0,0.25),0_2px_0_#003D20,0_4px_8px_rgba(0,0,0,0.35)] hover:bg-black transition-colors"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ MAIN NAVIGATION BAR (Fully See-Through at Rest -> Milk-White on Scroll) ═══ */}
      <nav
        className={`w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showOpaqueHeader
            ? "bg-milk-white/95 backdrop-blur-md py-3 shadow-md border-b border-black/5"
            : "bg-transparent py-5 border-b border-transparent"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between lg:justify-start gap-1.5 sm:gap-2 lg:gap-4">

          {/* ── Logo Brand Block ── */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 md:gap-4 group z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0"
          >
            <div
              className={`relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-6 flex items-center justify-center shrink-0 ${
                isOnHero
                  ? "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                  : "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-10 lg:h-10 xl:w-12 xl:h-12"
              }`}
            >
              <Image
                src={isOnHero ? "/images/logos/zru-logo-white-text.svg" : "/zru logo main.svg"}
                alt="Zimbabwe Rugby Union Logo"
                width={80}
                height={80}
                priority
                className="w-full h-full object-contain"
              />
            </div>

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
          <div className="hidden lg:flex items-center justify-center gap-2 xl:gap-5 2xl:gap-8 overflow-visible px-2 flex-1">
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
                      ${isActive(item.href, item.children) ? "text-zru-green" : navTextClass}
                    `}
                  >
                    {isActive(item.href, item.children) && (
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
                          className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gradient-to-b from-[#005232] to-[#00452A] rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_6px_rgba(0,0,0,0.35),0_30px_50px_-12px_rgba(0,0,0,0.55)] py-3 overflow-hidden z-[100] ${
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
                                block px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all duration-200 rounded-xl hover:bg-zru-green/15 text-white hover:translate-x-[3px] hover:shadow-[0_2px_6px_rgba(0,0,0,0.25)]
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

          {/* ── Mobile: Hamburger (triggers KineticNav) ── */}
          <div className="lg:hidden shrink-0">
            <button
              onClick={toggleMenu}
              className="p-2 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <div className="flex flex-col gap-1.5">
                <span className={`block w-6 h-[2px] transition-all ${showOpaqueHeader ? "bg-black" : "bg-white"}`} />
                <span className={`block w-4 h-[2px] transition-all ${showOpaqueHeader ? "bg-black" : "bg-white"}`} />
                <span className={`block w-6 h-[2px] transition-all ${showOpaqueHeader ? "bg-black" : "bg-white"}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <KineticNav isOpen={isOpen} onClose={toggleMenu} navItems={dynamicNavItems} pathname={pathname} />

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

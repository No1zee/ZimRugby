"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Search, X, User, Ticket, ShoppingBag, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import KineticNav from "./KineticNav";
import { createClient } from "@/lib/supabase/client";

interface NavChild {
  label: string;
  href: string;
  badge?: string;
  badgeType?: "live" | "new" | "popular";
  description?: string;
}

interface NavItem {
  label: string;
  href?: string;
  badge?: string;
  isMega?: boolean;
  children?: NavChild[];
}

const mainNavItems: NavItem[] = [
  {
    label: "National Teams",
    children: [
      { label: "Sables (Men XV)", href: "/teams/sables", badge: "World Cup 2027 Quest", description: "Senior Men XV National Team" },
      { label: "Cheetahs (Men 7s)", href: "/teams/cheetahs", badge: "World Series", description: "Senior Men Sevens Team" },
      { label: "Lady Sables (Women XV)", href: "/teams/lady-sables", description: "Senior Women XV National Team" },
      { label: "Lady Cheetahs (Women 7s)", href: "/teams/lady-cheetahs", description: "Senior Women Sevens Team" },
      { label: "Junior Sables (U20)", href: "/teams/junior-sables", badge: "Barthes Trophy", description: "Under 20 High Performance" },
    ],
  },
  {
    label: "Domestic & Match Centre",
    children: [
      { label: "Match Centre & Scores", href: "/match-centre", badge: "LIVE", badgeType: "live", description: "Live commentary & real-time updates" },
      { label: "Fixtures & Results", href: "/matches", description: "Full schedule across all tiers" },
      { label: "Super 8 League", href: "/competitions", description: "Premier domestic XVs competition" },
      { label: "Paramount Garments League", href: "/competitions", description: "Harare & Bulawayo Metro Leagues" },
      { label: "Registered Clubs Directory", href: "/clubs", description: "Official ZRU affiliated clubs" },
    ],
  },
  {
    label: "What's On",
    children: [
      { label: "Match Tickets", href: "/tickets", badge: "Buy Online", description: "Official international & league match passes" },
      { label: "Upcoming Events & Festivals", href: "/events", description: "Tournaments, galas & community meets" },
      { label: "Official Merchandise Store", href: "/shop", badge: "New Kit", description: "Authentic Sables kit & supporter wear" },
    ],
  },
  {
    label: "Campaigns",
    children: [
      { label: "Road to Australia 2027", href: "/campaigns/road-to-australia-2027", badge: "RWC 2027", description: "Sables World Cup qualification path" },
      { label: "Rugby Africa Nations Cup 2026", href: "/campaigns/africa-cup-tour-2026", description: "Continental championship tour" },
      { label: "National Schools Festival", href: "/campaigns/schools-festival-2026", description: "Legendary annual grassroots showcase" },
    ],
  },
  {
    label: "Media",
    children: [
      { label: "News & Announcements", href: "/media", description: "Official statements & match reports" },
      { label: "Video Hub & Highlights", href: "/video-hub", description: "Match highlights & press conferences" },
      { label: "Photo Gallery", href: "/gallery", description: "HD matchday imagery & archives" },
    ],
  },
  {
    label: "About ZRU",
    children: [
      { label: "Board & Leadership", href: "/about/board", description: "Executive committee & trustees" },
      { label: "Governance & Constitution", href: "/about/governance", description: "ZRU constitution & policies" },
      { label: "History & Tradition", href: "/about/history", description: "Rich heritage of Zimbabwean rugby" },
      { label: "Safeguarding & Ethics", href: "/about/safeguarding", description: "Player welfare & integrity" },
      { label: "Careers & Tenders", href: "/about/careers", description: "Join the ZRU administration" },
    ],
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  const isHomePage = pathname === "/";
  const showOpaqueHeader = isScrolled || !isHomePage;

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* ── Top Utility Bar ── */}
      <div className="bg-[#004D2C] border-b border-white/10 text-[11px] font-bold text-white uppercase tracking-wider py-1.5 px-4 hidden md:block">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-zru-green text-white text-[9px] font-black tracking-widest rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE: ZIMBABWE 30 - 20 NAMIBIA [FINAL]
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/80">
            <Link href="/tickets" className="hover:text-white transition-colors flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-zru-green" />
              <span>Tickets</span>
            </Link>
            <Link href="/shop" className="hover:text-white transition-colors flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-zru-green" />
              <span>Shop</span>
            </Link>
            <span className="text-white/20">|</span>
            <button onClick={openSearch} className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
              <Search className="w-3.5 h-3.5" />
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="px-3 py-1 bg-zru-green text-white font-black rounded-md hover:bg-zru-green/90 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <User className="w-3 h-3" />
                  <span>Account</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-white/60 hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1 bg-zru-green text-white font-black rounded-md hover:bg-zru-green/90 transition-colors flex items-center gap-1 shadow-sm"
              >
                <User className="w-3 h-3" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar (Milk-White on Scroll) ── */}
      <nav
        className={`
          w-full transition-all duration-300 border-b z-40
          ${showOpaqueHeader
            ? "bg-white text-black border-neutral-200 shadow-md py-3"
            : "bg-black/40 backdrop-blur-md text-white border-white/10 py-4"
          }
        `}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/zru-logo.png"
                alt="Zimbabwe Rugby Union"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-heading font-black text-base sm:text-lg tracking-wider leading-none uppercase ${showOpaqueHeader ? "text-black" : "text-white"}`}>
                Zimbabwe
              </span>
              <span className="font-heading font-extrabold text-zru-green text-xs sm:text-sm tracking-widest leading-none uppercase">
                Rugby Union
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {mainNavItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-md ${
                    showOpaqueHeader
                      ? "text-neutral-800 hover:text-zru-green hover:bg-neutral-100"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === item.label && item.children && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-72 bg-rich-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 mt-1 z-50 text-white"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex flex-col p-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white group-hover:text-zru-green transition-colors">
                              {child.label}
                            </span>
                            {child.badge && (
                              <span
                                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                  child.badgeType === "live"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : "bg-zru-green/20 text-zru-green border border-zru-green/30"
                                }`}
                              >
                                {child.badge}
                              </span>
                            )}
                          </div>
                          {child.description && (
                            <span className="text-xs text-white/50 font-normal line-clamp-1 mt-0.5">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Mobile Hamburger */}
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

      {/* Mobile Menu Overlay */}
      <KineticNav isOpen={isOpen} onClose={toggleMenu} navItems={mainNavItems} pathname={pathname} />

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-rich-black/98 backdrop-blur-xl z-[100] overflow-y-auto pt-16 flex flex-col items-center px-4 md:px-8 text-white"
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

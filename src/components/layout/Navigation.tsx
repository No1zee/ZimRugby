"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Search, X, User, LogOut, ShieldCheck, UserCheck, Ticket, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import SlantedButton from "../ui/SlantedButton";
import GlobalAnnouncementBar from "./GlobalAnnouncementBar";
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
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <GlobalAnnouncementBar />

      <nav
        className={`w-full transition-all duration-300 border-b ${
          scrolled
            ? "bg-rich-black/95 backdrop-blur-md border-white/10 shadow-2xl py-3"
            : "bg-rich-black/80 backdrop-blur-sm border-white/5 py-4"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
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
              <span className="font-heading font-black text-white text-base sm:text-lg tracking-wider leading-none uppercase">
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
                    activeDropdown === item.label
                      ? "text-zru-green bg-white/5"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === item.label ? "rotate-180 text-zru-green" : "text-white/40"
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === item.label && item.children && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-72 bg-rich-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 mt-1 z-50"
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

          {/* Right Action Utility Buttons - CLEAN & NON-DUPLICATE */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tickets Link */}
            <Link
              href="/tickets"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors border border-white/10"
            >
              <Ticket className="w-3.5 h-3.5 text-zru-green" />
              <span>Tickets</span>
            </Link>

            {/* Shop Link */}
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors border border-white/10"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-zru-green" />
              <span>Shop</span>
            </Link>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Clean Single Auth Action */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-zru-green hover:bg-zru-green/90 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-md"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Account</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zru-green hover:bg-zru-green/90 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-md hover:shadow-zru-green/20"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

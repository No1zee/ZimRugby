"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NavigationItem = {
  name: string;
  href: string;
  type?: "dropdown";
  items?: { name: string; href: string }[];
};

const navigation: NavigationItem[] = [
  { name: "HOME", href: "/" },
  { name: "ABOUT ZRU", href: "/about" },
  {
    name: "TEAMS",
    href: "/teams",
    type: "dropdown",
    items: [
      { name: "The Sables (Men's 15s)", href: "/teams/sables" },
      { name: "Lady Sables (Women's 15s)", href: "/teams/lady-sables" },
      { name: "Zimbabwe 7s Men", href: "/teams/cheetahs" },
      { name: "Zimbabwe 7s Women", href: "/teams/lady-cheetahs" },
      { name: "Age Grade Teams", href: "/teams/age-grade" },
      { name: "Coaching Staff", href: "/teams/coaching" },
    ],
  },
  { name: "MATCH CENTRE", href: "/match-centre" },
  {
    name: "NEWS & MEDIA",
    href: "/news",
    type: "dropdown",
    items: [
      { name: "Latest News", href: "/news" },
      { name: "Match Reports", href: "/news/reports" },
      { name: "Features", href: "/news/features" },
      { name: "Photo Gallery", href: "/media/photos" },
      { name: "Video Hub", href: "/media/videos" },
    ],
  },
  {
    name: "FIXTURES & RESULTS",
    href: "/fixtures",
    type: "dropdown",
    items: [
      { name: "Upcoming Fixtures", href: "/fixtures/upcoming" },
      { name: "Recent Results", href: "/fixtures/results" },
      { name: "Tournament Schedule", href: "/fixtures/schedule" },
    ],
  },
  {
    name: "DOMESTIC RUGBY",
    href: "/domestic",
    type: "dropdown",
    items: [
      { name: "Clubs & Unions", href: "/domestic/clubs" },
      { name: "Schools Rugby", href: "/domestic/schools" },
      { name: "Development Programs", href: "/domestic/development" },
    ],
  },
  { name: "TICKETS", href: "/tickets" },
  { name: "CONTACT US", href: "/contact" },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-rich-black/95 backdrop-blur-md border-b border-white/10 text-white font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-sables-green rounded-full flex items-center justify-center font-heading text-xl border-2 border-white">
                ZRU
              </div>
              <span className="font-heading text-2xl tracking-wide hidden sm:block">
                ZIMBABWE RUGBY
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => item.type === "dropdown" && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div
                  className="px-3 py-2 text-sm font-bold text-gray-300 hover:text-zru-orange transition-colors duration-200 flex items-center gap-1 font-subheading tracking-wide cursor-pointer"
                >
                  <Link href={item.href} className="flex items-center gap-1">
                    {item.name}
                    {item.type === "dropdown" && (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </Link>
                </div>

                {/* Dropdown Menu */}
                {item.type === "dropdown" && (
                  <div className="absolute left-0 mt-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50 transform translate-y-2 group-hover:translate-y-0">
                     <div className="bg-rich-black border border-white/10 shadow-xl rounded-md overflow-hidden">
                        <div className="py-2">
                          {item.items?.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-zru-orange transition-colors border-b border-white/5 last:border-0"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                     </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Utilities */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 border-l border-white/20 pl-6">
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <Link href="/cart" className="text-gray-300 hover:text-white transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-zru-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
            <Link
              href="/shop"
              className="bg-zru-orange text-white px-5 py-2 rounded font-heading tracking-wide hover:bg-orange-600 transition-colors hidden lg:block"
            >
              SHOP
            </Link>
            <Link
              href="/donate"
              className="border border-zru-orange text-zru-orange px-5 py-2 rounded font-heading tracking-wide hover:bg-zru-orange hover:text-white transition-colors hidden lg:block"
            >
              DONATE
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-rich-black border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navigation.map((item) => (
                <div key={item.name} className="border-b border-white/5 last:border-0">
                  {item.type === "dropdown" ? (
                    <div className="py-2">
                       <div className="px-3 py-2 text-zru-orange font-heading text-lg">
                         {item.name}
                       </div>
                       <div className="pl-6 space-y-1">
                         {item.items?.map((subItem) => (
                           <Link
                             key={subItem.name}
                             href={subItem.href}
                             className="block px-3 py-2 text-gray-400 hover:text-white text-sm"
                             onClick={() => setIsMobileMenuOpen(false)}
                           >
                             {subItem.name}
                           </Link>
                         ))}
                       </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-3 text-base font-medium text-white hover:text-zru-orange hover:bg-white/5 font-heading"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col gap-3 px-3">
                <Link
                  href="/shop"
                  className="w-full bg-zru-orange text-center py-3 rounded font-heading text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  VISIT SHOP
                </Link>
                <Link
                  href="/donate"
                  className="w-full border border-zru-orange text-center py-3 rounded font-heading text-zru-orange"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  DONATE
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

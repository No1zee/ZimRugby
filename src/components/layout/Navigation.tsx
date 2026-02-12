"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "OUR TEAMS", href: "/teams" },
  { label: "MATCH CENTRE", href: "/match-centre" },
  { 
    label: "NEWS & EVENTS", 
    href: "/media",
    children: [
      { label: "Latest News", href: "/media" },
      { label: "What's On", href: "/events" },
    ]
  },
  { 
    label: "GET INVOLVED", 
    href: "/play-rugby",
    children: [
      { label: "Play Rugby", href: "/play-rugby" },
      { label: "Clubs", href: "/clubs" },
      { label: "Schools", href: "/schools" },
      { label: "Volunteer", href: "/volunteer" },
    ]
  },
  { label: "ABOUT", href: "/about" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header 
      className={`
        fixed w-full z-50 transition-all duration-500
        ${isScrolled 
          ? "bg-zru-green/95 backdrop-blur-md shadow-lg translate-y-0 opacity-100" 
          : "bg-transparent translate-y-0 opacity-0 pointer-events-none"
        }
      `}
    >
      
      {/* Main Navigation */}
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? "h-14" : "h-16"}`}>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              className="w-10 h-10 bg-zru-green rounded-full flex items-center justify-center border-2 border-zru-gold"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white font-black text-lg">Z</span>
            </motion.div>
            <div className="hidden md:flex flex-col">
              <span className="text-white font-black text-sm tracking-wider">ZRU</span>
              <span className="text-white/60 text-[9px] uppercase tracking-widest">Zimbabwe Rugby</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div 
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  href={item.href} 
                  className={`
                    relative px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors
                    flex items-center gap-1
                    ${isActive(item.href) 
                      ? "text-zru-gold" 
                      : "text-white hover:text-zru-gold"
                    }
                  `}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3 h-3" />}
                  
                  {/* Active indicator */}
                  {isActive(item.href) && (
                    <motion.div 
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-zru-gold"
                      layoutId="navIndicator"
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-1 bg-zru-green/95 backdrop-blur-md rounded-lg shadow-xl py-2 min-w-[180px] border border-white/10"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={`
                              block px-4 py-2 text-sm font-medium transition-colors
                              ${isActive(child.href) 
                                ? "text-zru-gold bg-white/10" 
                                : "text-white hover:text-zru-gold hover:bg-white/5"
                              }
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-white hover:text-zru-gold p-2 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-zru-green/95 backdrop-blur-md border-t border-white/10"
          >
            <div className="px-6 py-6 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className={`
                      block py-3 text-lg font-bold uppercase tracking-wider transition-colors
                      ${isActive(item.href) ? "text-zru-gold" : "text-white hover:text-zru-gold"}
                    `}
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 space-y-1 mb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={`
                            block py-2 text-sm font-medium transition-colors
                            ${isActive(child.href) ? "text-zru-gold" : "text-white/70 hover:text-zru-gold"}
                          `}
                          onClick={toggleMenu}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

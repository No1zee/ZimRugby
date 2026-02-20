"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

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
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const toggleMenu = () => setIsOpen(!isOpen);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Determine if scrolled styling should apply
    if (latest > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Determine hide/show behavior
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header 
      className={`
        fixed w-full z-50 transition-all duration-300 border-b border-transparent
        ${hidden ? "-translate-y-full" : "translate-y-0"}
        ${isScrolled 
          ? "bg-zru-green/85 backdrop-blur-xl shadow-lg border-white/10" 
          : "bg-transparent"
        }
      `}
    >
      
      {/* Main Navigation */}
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? "h-14" : "h-16"}`}>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ scale: 1.05 }} className="translate-y-10">
              <Image
                src="/zru logo monotone.svg"
                alt="ZRU Logo"
                width={90}
                height={90}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div 
                key={item.label}
                className="relative group"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  href={item.href} 
                  className={`
                    relative px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors z-10
                    flex items-center gap-1
                    ${isActive(item.href) ? "text-white" : "text-white/80 group-hover:text-white"}
                  `}
                >
                  {/* Floating Pill Background */}
                  {activeDropdown === item.label || isActive(item.href) ? (
                    <motion.div
                      layoutId="navBackground"
                      className="absolute inset-0 bg-white/10 rounded-full -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  ) : null}

                  {/* Active Indicator - Bottom Border */}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-zru-gold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {item.label}
                  {item.children && <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />}
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 bg-zru-green/95 backdrop-blur-xl rounded-xl shadow-2xl py-2 min-w-[200px] border border-white/10 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={`
                              block px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10
                              ${isActive(child.href) ? "text-zru-gold bg-white/5" : "text-white"}
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

            {/* TICKETS CTA */}
            <Link 
              href="/tickets" 
              className="ml-4 px-6 py-2 bg-white text-zru-green font-black text-sm uppercase tracking-wider rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
            >
              Tickets
            </Link>
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

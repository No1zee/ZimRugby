"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const navItems = [
  { 
    label: "OUR TEAMS", 
    href: "/teams",
    isMega: true,
    children: [
      { label: "Sables", href: "/teams/sables" },
      { label: "Lady Sables", href: "/teams/lady-sables" },
      { label: "Junior Sables", href: "/teams/junior-sables" },
      { label: "Cheetahs", href: "/teams/cheetahs" },
      { label: "U20", href: "/teams/u20" },
    ]
  },
  { 
    label: "MATCH CENTRE", 
    href: "/match-centre",
    children: [
      { label: "Fixtures & Results", href: "/match-centre/fixtures" },
      { label: "Standings", href: "/match-centre/standings" },
    ]
  },
  { 
    label: "NEWS & MEDIA", 
    href: "/media",
    children: [
      { label: "Latest News", href: "/media" },
      { label: "What's On", href: "/events" },
    ]
  },
  { 
    label: "PLAY RUGBY", 
    href: "/play-rugby",
    children: [
      { label: "Rugby Pathways", href: "/play-rugby", highlight: true },
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
      setActiveDropdown(null); // Close dropdown when hiding nav
    } else {
      setHidden(false);
    }
  });

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  if (pathname?.startsWith('/clubhouse') || pathname?.startsWith('/admin')) return null;

  return (
    <header 
      className={`
        fixed w-full z-50 transition-all duration-300 border-b border-transparent
        ${hidden ? "-translate-y-full" : "translate-y-0"}
        ${isScrolled 
          ? "bg-zru-green/95 backdrop-blur-xl shadow-lg border-white/10" 
          : "bg-transparent"
        }
      `}
    >
      
      {/* Main Navigation */}
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? "h-20 lg:h-24" : "h-24 lg:h-28"}`}>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative">
            <motion.div whileHover={{ scale: 1.05 }} className="relative z-50">
              <Image
                src="/zru logo main.svg"
                alt="ZRU Logo"
                width={81}
                height={101}
                className="object-contain drop-shadow-2xl w-auto h-16 lg:h-20"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Nav Links (Centered) */}
          <div className="hidden lg:flex flex-1 items-center justify-center px-4 xl:px-8">
            <div className="flex items-center gap-1 xl:gap-2">
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
                      relative px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors z-10
                      flex items-center gap-1
                      ${isActive(item.href) ? "text-white" : "text-white/80 hover:text-white"}
                    `}
                  >
                    {/* Floating Pill Background */}
                    {activeDropdown === item.label ? (
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
                                ${isActive(child.href) ? "text-zru-gold bg-white/5" : "text-white"}
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
          <div className="lg:hidden flex items-center gap-3">
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="text-white hover:text-zru-gold p-2 transition-colors relative z-50"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="w-8 h-8" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="w-8 h-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden absolute top-full left-0 w-full bg-zru-green/95 backdrop-blur-xl border-t border-white/10 overflow-y-auto"
            style={{ height: 'calc(100vh - 4rem)' }}
          >
            <div className="px-6 py-8 space-y-6 max-w-[320px] mx-auto w-full">
              {navItems.map((item, index) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`
                      block py-2 text-xl font-black uppercase tracking-wider transition-colors
                      ${isActive(item.href) ? "text-zru-gold" : "text-white hover:text-zru-gold"}
                    `}
                    onClick={!item.children ? toggleMenu : undefined}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 mt-2 space-y-2 border-l-2 border-white/10">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={`
                            block py-2 px-4 text-base font-medium transition-colors rounded-r-lg
                            ${isActive(child.href) ? "text-zru-gold bg-white/5 border-l-2 border-zru-gold -ml-[2px]" : "text-white/70 hover:text-zru-gold hover:bg-white/5"}
                          `}
                          onClick={toggleMenu}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

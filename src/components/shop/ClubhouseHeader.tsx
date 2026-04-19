"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const shopNavItems = [
  { label: "Shop", href: "/clubhouse" },
  { label: "Men", href: "/clubhouse/men" },
  { label: "Women", href: "/clubhouse/women" },
  { label: "Kits", href: "/clubhouse/kits" },
  { label: "Collections", href: "/clubhouse/collections" },
  { label: "Clubhouse", href: "/clubhouse/loyalty" },
  { label: "Journal", href: "/clubhouse/journal" },
];

export default function ClubhouseHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-clubhouse-charcoal/90 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setIsOpen(true)}
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Desktop Nav - Left */}
        <nav className="hidden lg:flex items-center space-x-8">
          {shopNavItems.slice(0, 4).map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logo - Center */}
        <Link href="/clubhouse" className="absolute left-1/2 -translate-x-1/2 text-center group">
          <span className="block text-xl md:text-2xl font-black uppercase tracking-[0.3em] text-white group-hover:text-clubhouse-gold transition-colors">
            ZIMRUGBY
          </span>
          <span className="block text-[8px] md:text-[10px] uppercase tracking-[0.5em] text-clubhouse-gold mt-1">
            CLUBHOUSE
          </span>
        </Link>

        {/* Desktop Nav - Right & Utility */}
        <div className="flex items-center space-x-6">
          <nav className="hidden lg:flex items-center space-x-8 mr-8">
            {shopNavItems.slice(4).map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4 md:space-x-6 text-white/80">
            <button className="hover:text-white transition-colors" aria-label="Search"><Search className="w-5 h-5" /></button>
            <button className="hidden sm:block hover:text-white transition-colors" aria-label="My Account"><User className="w-5 h-5" /></button>
            <button className="hidden sm:block hover:text-white transition-colors" aria-label="Wishlist"><Heart className="w-5 h-5" /></button>
            <button className="relative hover:text-white transition-colors" aria-label="Shopping Cart">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-clubhouse-gold text-clubhouse-charcoal text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-clubhouse-charcoal z-60 p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-clubhouse-gold">Menu</span>
              <button onClick={() => setIsOpen(false)} aria-label="Close Menu"><X className="w-8 h-8 text-white" /></button>
            </div>
            
            <div className="flex flex-col space-y-6">
              {shopNavItems.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    href={item.href}
                    className="text-4xl font-black uppercase tracking-tight text-white hover:text-clubhouse-gold transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-10 border-t border-white/10 flex justify-between items-center">
              <div className="flex space-x-6">
                <User className="w-6 h-6 text-white/60" />
                <Heart className="w-6 h-6 text-white/60" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/40">ZimRugby Clubhouse © 2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

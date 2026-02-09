"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";

const navItems = [
  { label: "TEAMS", href: "#teams" },
  { label: "MATCH CENTRE", href: "#match-centre" },
  { label: "MEDIA", href: "#media" },
  { label: "WHAT'S ON", href: "#events" },
  { label: "PLAY RUGBY", href: "#play-rugby" },
  { label: "ABOUT", href: "#about" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed w-full z-50 bg-rich-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
             <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-zru-green rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white font-heading font-bold text-xl">Z</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-heading leading-none text-xl tracking-wider">ZIMBABWE</span>
                    <span className="text-zru-gold font-heading leading-none text-sm tracking-widest">RUGBY UNION</span>
                </div>
             </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="text-white hover:text-zru-gold font-heading tracking-widest text-sm transition-colors py-2 flex items-center gap-1"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Utilities */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="primary" className="bg-zru-orange hover:bg-orange-600 border-none">
               SUPPORT ZRU
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-zru-gold focus:outline-none"
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-rich-black border-t border-white/10"
          >
            <div className="px-4 pt-4 pb-8 space-y-4">
              {navItems.map((item) => (
                <div key={item.label}>
                    <Link
                        href={item.href}
                        className="block text-white hover:text-zru-gold font-heading text-xl py-2"
                        onClick={toggleMenu}
                    >
                        {item.label}
                    </Link>
                </div>
              ))}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                 <Button variant="primary" className="w-full justify-center bg-zru-orange">
                    SUPPORT ZRU
                 </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

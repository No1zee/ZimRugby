"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Globe } from "lucide-react";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/clubhouse/new" },
      { label: "Matchday Kits", href: "/clubhouse/kits" },
      { label: "Training Wear", href: "/clubhouse/training" },
      { label: "Clubhouse Lifestyle", href: "/clubhouse/lifestyle" },
      { label: "Accessories", href: "/clubhouse/accessories" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Customer Service", href: "/support" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "Contact Us", href: "/contact" },
      { label: "Payment Methods", href: "/payments" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Rugby For Good", href: "/charity" },
      { label: "Partner Clubs", href: "/partners" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

export default function ClubhouseFooter() {
  return (
    <footer className="bg-clubhouse-charcoal border-t border-white/5 pt-20 pb-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Main Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-clubhouse-gold mb-8">
                {column.title}
              </h3>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Follow Us */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-clubhouse-gold mb-8">
              Follow Us
            </h3>
            <div className="flex space-x-6 text-white/50">
              <Link href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Youtube className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-clubhouse-gold mb-8">
              Join the Clubhouse
            </h3>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Sign up for early access to drops, exclusive kits, and members-only matchday experiences.
            </p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[10px] tracking-widest text-white focus:outline-none focus:border-clubhouse-gold transition-colors"
                required
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-clubhouse-gold hover:text-white transition-colors"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
          <div className="flex items-center space-x-2 text-[10px] tracking-widest text-white/40">
            <Globe className="w-4 h-4" />
            <span className="uppercase">Zimbabwe / English / USD</span>
          </div>

          <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
            The Clubhouse © 2026. All rights reserved.
          </div>

          <div className="flex space-x-6 text-[10px] tracking-widest text-white/30 uppercase">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

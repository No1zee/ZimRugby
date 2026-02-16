"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { ScrollReveal } from "../ui/animations";

const socialLinks = [
  { Icon: Facebook, href: "https://facebook.com/zimbabwerugby", label: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com/zimbabwerugby", label: "Twitter" },
  { Icon: Instagram, href: "https://instagram.com/zimbabwerugby", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/zimbabwerugby", label: "YouTube" },
  { Icon: Linkedin, href: "https://linkedin.com/zimbabwerugby", label: "LinkedIn" },
];

const footerLinks = {
  "About ZRU": [
    { label: "Our Story", href: "/about" },
    { label: "Leadership", href: "/about/leadership" },
    { label: "Careers", href: "/about/careers" },
    { label: "Contact", href: "/contact" },
  ],
  "Rugby": [
    { label: "Match Centre", href: "/match-centre" },
    { label: "Our Teams", href: "/teams" },
    { label: "Events", href: "/events" },
    { label: "News", href: "/media" },
  ],
  "Get Involved": [
    { label: "Play Rugby", href: "/play-rugby" },
    { label: "Find a Club", href: "/clubs" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Donate", href: "/donate" },
  ],
  "Resources": [
    { label: "Downloads", href: "/resources" },
    { label: "Laws of the Game", href: "/resources/laws" },
    { label: "Shop", href: "/shop" },
    { label: "FAQs", href: "/faqs" },
  ],
};

export default function Footer() {
  return (
    <footer 
      className="bg-zru-green text-white relative overflow-hidden"
      style={{
        backgroundImage: `repeating-linear-gradient(135deg, rgba(0, 80, 40, 0.2) 0px, rgba(0, 80, 40, 0.2) 1px, transparent 1px, transparent 100px)`
      }}
    >
      
      {/* Top Border Accent */}
      <motion.div 
        className="h-1 bg-linear-to-r from-zru-green via-white to-zru-green"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-black text-white tracking-tighter">ZRU</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              The official governing body of rugby union in Zimbabwe. Dedicated to growing the game and achieving excellence on the world stage.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-zru-green flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-white/70 hover:text-white text-xs transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Bar */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 text-xs text-white/60">
            <a href="mailto:info@zimbabwerugby.co.zw" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> info@zimbabwerugby.co.zw
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> National Sports Stadium, Harare
            </span>
            <a href="tel:+263242751234" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4" /> +263 (24) 275 1234
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/40">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

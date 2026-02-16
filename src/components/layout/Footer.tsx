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

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-zru-green font-black text-xl">Z</span>
              </div>
              <div>
                <span className="font-black text-xl">ZRU</span>
                <p className="text-white/60 text-[10px] uppercase tracking-wider">Zimbabwe Rugby Union</p>
              </div>
            </Link>
            <p className="text-white/70 text-xs leading-relaxed mb-4 max-w-xs">
              Growing rugby in Zimbabwe through passion, development, and community since 1895.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
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

          {/* Link Columns */}
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

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-[10px] uppercase tracking-wider">
          <p>
            © {new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

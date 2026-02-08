"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = [
  {
    title: "The Union",
    links: [
        { label: "About ZRU", href: "/about" },
        { label: "Our History", href: "/about/history" },
        { label: "Governance", href: "/about/governance" },
        { label: "Contact Us", href: "/contact" },
    ]
  },
  {
    title: "Teams",
    links: [
        { label: "Sables", href: "/teams/sables" },
        { label: "Lady Sables", href: "/teams/lady-sables" },
        { label: "Cheetahs", href: "/teams/cheetahs" },
        { label: "Junior Sables", href: "/teams/junior-sables" },
    ]
  },
  {
    title: "Competitions",
    links: [
        { label: "Africa Cup", href: "/competitions/africa-cup" },
        { label: "Nedbank Challenge", href: "/competitions/nedbank" },
        { label: "Paramount Garments", href: "/competitions/paramount" },
        { label: "Schools Rugby", href: "/competitions/schools" },
    ]
  },
  {
    title: "Fan Zone",
    links: [
        { label: "News & Media", href: "/news" },
        { label: "Fixtures & Results", href: "/match-centre" },
        { label: "Shop", href: "/shop" },
        { label: "Tickets", href: "/tickets" },
    ]
  },
];

export default function Footer() {
  return (
    <footer className="bg-rich-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
           
           {/* Brand Column */}
           <div className="lg:col-span-4">
              <Link href="/" className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 bg-zru-green rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white font-heading font-bold text-2xl">Z</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-white font-heading leading-none text-2xl tracking-wider">ZIMBABWE</span>
                    <span className="text-zru-gold font-heading leading-none text-sm tracking-widest">RUGBY UNION</span>
                 </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                 The official governing body of rugby union in Zimbabwe. Fostering excellence, unity, and passion from grassroots to the global stage.
              </p>
              <div className="flex gap-4">
                 <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-zru-green hover:text-white transition-all">
                    <Facebook className="w-5 h-5" />
                 </a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-zru-green hover:text-white transition-all">
                    <Twitter className="w-5 h-5" />
                 </a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-zru-green hover:text-white transition-all">
                    <Instagram className="w-5 h-5" />
                 </a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-zru-green hover:text-white transition-all">
                    <Youtube className="w-5 h-5" />
                 </a>
              </div>
           </div>

           {/* Links Columns */}
           <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerLinks.map((column) => (
                 <div key={column.title}>
                    <h4 className="text-white font-heading text-lg mb-6">{column.title}</h4>
                    <ul className="space-y-4">
                       {column.links.map((link) => (
                          <li key={link.label}>
                             <Link href={link.href} className="text-gray-400 hover:text-zru-gold text-sm transition-colors">
                                {link.label}
                             </Link>
                          </li>
                       ))}
                    </ul>
                 </div>
              ))}
           </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.
           </p>
           <div className="flex gap-6 text-gray-500 text-xs">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}

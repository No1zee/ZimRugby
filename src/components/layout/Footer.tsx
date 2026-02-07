"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-rich-black border-t border-white/10 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
               <div className="w-10 h-10 bg-sables-green rounded-full flex items-center justify-center font-heading text-xl border-2 border-white">
                 ZRU
               </div>
               <span className="font-heading text-2xl tracking-wide">
                 ZIMBABWE RUGBY
               </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Official website of the Zimbabwe Rugby Union.
              Governing body for the sport of rugby union in Zimbabwe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg mb-6 text-white border-b border-zru-orange w-fit pb-2">QUICK LINKS</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-zru-orange transition-colors">About ZRU</Link></li>
              <li><Link href="/teams" className="hover:text-zru-orange transition-colors">Teams</Link></li>
              <li><Link href="/fixtures" className="hover:text-zru-orange transition-colors">Fixtures & Results</Link></li>
              <li><Link href="/news" className="hover:text-zru-orange transition-colors">News & Media</Link></li>
              <li><Link href="/contact" className="hover:text-zru-orange transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Teams */}
          <div>
            <h4 className="font-heading text-lg mb-6 text-white border-b border-zru-orange w-fit pb-2">TEAMS</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/teams/sables" className="hover:text-zru-orange transition-colors">The Sables</Link></li>
              <li><Link href="/teams/lady-sables" className="hover:text-zru-orange transition-colors">Lady Sables</Link></li>
              <li><Link href="/teams/cheetahs" className="hover:text-zru-orange transition-colors">Zimbabwe 7s (Cheetahs)</Link></li>
              <li><Link href="/teams/lady-cheetahs" className="hover:text-zru-orange transition-colors">Lady Cheetahs</Link></li>
              <li><Link href="/teams/under-20" className="hover:text-zru-orange transition-colors">Under 20 (Junior Sables)</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-lg mb-6 text-white border-b border-zru-orange w-fit pb-2">NEWSLETTER</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get the latest news, updates and special offers directly to your inbox.
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-zru-orange transition-colors placeholder:text-gray-600"
              />
              <button 
                type="submit" 
                className="bg-zru-orange hover:bg-orange-600 text-white px-4 py-2 rounded font-heading text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                SUBSCRIBE <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
           <p>&copy; {new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.</p>
           <div className="flex gap-6">
             <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
             <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}

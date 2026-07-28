import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import FanZoneSignup from "@/components/fanzone/FanZoneSignup";

export default function SpecFooter() {
  return (
    <footer className="bg-rich-black text-black pt-16 border-t border-gray-200">
      <div className="max-w-[1600px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
        
        {/* Column 1: QUICK LINKS */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-6">QUICK LINKS</h4>
          <ul className="space-y-4">
            <li><Link href="/tickets" className="text-sm font-normal text-black/70 hover:text-zru-green transition-colors">Tickets</Link></li>
            <li><Link href="/match-centre" className="text-sm font-normal text-black/70 hover:text-zru-green transition-colors">Match Centre</Link></li>
            <li><Link href="/teams" className="text-sm font-normal text-black/70 hover:text-zru-green transition-colors">Our Teams</Link></li>
            <li><Link href="/clubhouse" className="text-sm font-normal text-black/70 hover:text-zru-green transition-colors">Official Shop</Link></li>
            <li><Link href="/news" className="text-sm font-normal text-black/70 hover:text-zru-green transition-colors">News & Media</Link></li>
          </ul>
        </div>

        {/* Column 2: ABOUT */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-6">ABOUT</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="text-sm font-normal text-black/70 hover:text-zru-green transition-colors">Our Story</Link></li>
            <li><Link href="/about/leadership" className="text-sm font-normal text-black/70 hover:text-zru-green transition-colors">Leadership</Link></li>
            <li><Link href="/play-rugby" className="text-sm font-normal text-black/70 hover:text-zru-green transition-colors">Play Rugby</Link></li>
            <li><Link href="/volunteer" className="text-sm font-normal text-black/70 hover:text-zru-green transition-colors">Volunteer</Link></li>
            <li><Link href="/contact" className="text-sm font-normal text-black/70 hover:text-zru-green transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 3: FOLLOW US */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-6">FOLLOW US</h4>
          <div className="flex gap-4">
            <a href="https://facebook.com" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black/70 hover:bg-zru-green hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="https://twitter.com" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black/70 hover:bg-zru-green hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="https://instagram.com" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black/70 hover:bg-zru-green hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="https://youtube.com" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black/70 hover:bg-zru-green hover:text-white transition-colors"><Youtube className="w-4 h-4" /></a>
            <a href="https://linkedin.com" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black/70 hover:bg-zru-green hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
          </div>
          <div className="mt-8">
             <Image src="/images/logos/zru-logo.svg" alt="ZRU" width={60} height={60} className="w-16 h-auto opacity-20 grayscale" />
          </div>
        </div>

        {/* Column 4: FAN ZONE */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-6">FAN ZONE</h4>
          <FanZoneSignup variant="compact" />
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1A1A1A] w-full py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-4">
         <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
           © 2026 ZIMBABWE RUGBY UNION. ALL RIGHTS RESERVED.
         </span>
         <div className="flex gap-6">
           <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white">PRIVACY POLICY</Link>
           <Link href="/terms" className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white">TERMS & CONDITIONS</Link>
         </div>
      </div>
    </footer>
  );
}

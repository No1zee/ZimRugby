"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";

export default function SpecHeader() {
  return (
    <header className="w-full h-24 bg-rich-black border-b border-gray-200 flex items-center justify-between px-8 z-50 sticky top-0">
      
      {/* Left Group */}
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 group hover:opacity-70 transition-opacity">
          <Menu className="w-6 h-6 text-black" />
          <span className="text-[11px] font-black tracking-widest uppercase text-black hidden md:block">
            MENU
          </span>
        </button>
        <button className="flex items-center gap-2 group hover:opacity-70 transition-opacity hidden sm:flex">
          <Search className="w-5 h-5 text-black" />
          <span className="text-[11px] font-black tracking-widest uppercase text-black hidden md:block">
            SEARCH
          </span>
        </button>
      </div>

      {/* Center Group (Logos) */}
      <div className="flex items-center justify-center gap-8 md:gap-12 absolute left-1/2 -translate-x-1/2">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image 
            src="/images/logos/zru-logo.svg" 
            alt="Sables" 
            width={60} 
            height={60} 
            className="h-12 md:h-16 w-auto object-contain"
          />
        </Link>
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image 
            src="/images/logos/zru-logo.svg" 
            alt="Zimbabwe Rugby Union" 
            width={70} 
            height={70} 
            className="h-14 md:h-20 w-auto object-contain scale-110"
          />
        </Link>
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image 
            src="/images/logos/zru-logo.svg" 
            alt="Cheetahs" 
            width={60} 
            height={60} 
            className="h-12 md:h-16 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Right Group */}
      <div className="flex items-center gap-6">
        <Link href="/clubhouse" className="flex items-center gap-2 group hover:opacity-70 transition-opacity">
          <ShoppingBag className="w-5 h-5 text-black" />
          <span className="text-[11px] font-black tracking-widest uppercase text-black hidden md:block">
            SHOP
          </span>
        </Link>
        <button className="flex items-center gap-2 group hover:opacity-70 transition-opacity">
          <User className="w-5 h-5 text-black" />
          <span className="text-[11px] font-black tracking-widest uppercase text-black hidden md:block">
            ACCOUNT
          </span>
        </button>
      </div>

    </header>
  );
}

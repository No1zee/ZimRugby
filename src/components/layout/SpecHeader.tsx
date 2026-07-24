import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";

export default function SpecHeader() {
  return (
    <header className="w-full h-20 bg-milk-white/95 backdrop-blur-md border-b border-black/10 flex items-center justify-between px-6 sm:px-8 z-50 sticky top-0 transition-all duration-300">
      
      {/* Left Group */}
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
          <Menu className="w-5 h-5 text-black group-hover:text-zru-green transition-colors" />
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-black group-hover:text-zru-green hidden md:block">
            MENU
          </span>
        </button>
        <button className="flex items-center gap-2 group hover:opacity-80 transition-opacity hidden sm:flex">
          <Search className="w-4 h-4 text-black group-hover:text-zru-green transition-colors" />
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-black group-hover:text-zru-green hidden md:block">
            SEARCH
          </span>
        </button>
      </div>

      {/* Center Group (Official Brand Logos) */}
      <div className="flex items-center justify-center gap-6 md:gap-10 absolute left-1/2 -translate-x-1/2">
        <Link href="/teams/sables" className="hover:scale-105 transition-transform" title="The Sables">
          <Image 
            src="/images/logos/zru-logo.svg" 
            alt="Sables" 
            width={48} 
            height={48} 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>
        <Link href="/" className="hover:scale-105 transition-transform" title="Zimbabwe Rugby Union">
          <Image 
            src="/images/logos/zru-logo.svg" 
            alt="Zimbabwe Rugby Union" 
            width={60} 
            height={60} 
            className="h-12 md:h-16 w-auto object-contain scale-110"
          />
        </Link>
        <Link href="/teams/cheetahs" className="hover:scale-105 transition-transform" title="Cheetahs 7s">
          <Image 
            src="/images/logos/zru-logo.svg" 
            alt="Cheetahs" 
            width={48} 
            height={48} 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Right Group */}
      <div className="flex items-center gap-6">
        <Link href="/clubhouse" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
          <ShoppingBag className="w-4 h-4 text-black group-hover:text-zru-green transition-colors" />
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-black group-hover:text-zru-green hidden md:block">
            SHOP
          </span>
        </Link>
        <button className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
          <User className="w-4 h-4 text-black group-hover:text-zru-green transition-colors" />
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-black group-hover:text-zru-green hidden md:block">
            ACCOUNT
          </span>
        </button>
      </div>

    </header>
  );
}

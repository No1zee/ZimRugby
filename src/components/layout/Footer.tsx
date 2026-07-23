"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowRight, CheckCircle } from "lucide-react";
import FooterMeteorField from "./FooterMeteorField";

const socialLinks = [
  { Icon: Facebook, href: "https://facebook.com/zimbabwerugby", label: "FB" },
  { Icon: Twitter, href: "https://twitter.com/zimbabwerugby", label: "X" },
  { Icon: Instagram, href: "https://instagram.com/zimbabwerugby", label: "IG" },
  { Icon: Youtube, href: "https://youtube.com/zimbabwerugby", label: "YT" },
  { Icon: Linkedin, href: "https://linkedin.com/zimbabwerugby", label: "IN" },
];

const footerLinks = {
  "The Union": [
    { label: "Governance & Board", href: "/about/leadership" },
    { label: "High Performance", href: "/high-performance" },
    { label: "Sables Trust", href: "/trust" },
    { label: "Commercial Partners", href: "/sponsors" },
  ],
  "National Teams": [
    { label: "The Sables", href: "/teams/sables" },
    { label: "Lady Sables", href: "/teams/lady-sables" },
    { label: "Cheetahs (7s)", href: "/teams/cheetahs" },
    { label: "Junior Sables", href: "/teams/u20" },
  ],
  "Competitions": [
    { label: "Match Centre", href: "/match-centre" },
    { label: "Nations Cup", href: "/competitions/nations-cup" },
    { label: "Domestic League", href: "/competitions/domestic" },
    { label: "Ticketing", href: "/tickets" },
  ],
  "Development": [
    { label: "Grassroots", href: "/development/grassroots" },
    { label: "Coaching", href: "/development/coaching" },
    { label: "Refereeing", href: "/development/referees" },
    { label: "Safeguarding", href: "/safeguarding" },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (pathname?.startsWith('/clubhouse') || pathname?.startsWith('/admin')) return null;

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <footer className="bg-milk-white text-black relative pt-20 pb-8 border-t-8 border-zru-green overflow-hidden">
      {/* Zero-Overhead Hardware-Accelerated 3D ZRU Crest Meteor Field */}
      <FooterMeteorField />

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Massive Typography & Embossed Logo Banner */}
        <div className="mb-16 relative min-h-[240px] md:min-h-[320px] flex items-center justify-between overflow-hidden rounded-2xl p-4 md:p-8">
           <h2 className="text-[12vw] md:text-[8vw] font-heading font-black leading-[0.85] tracking-tighter text-black/10 uppercase select-none relative z-10">
             Zimbabwe<br />Rugby
           </h2>

           {/* Unclipped Stylish Tilted ZRU Crest Watermark (Full Color Red Star & Gold Bird) */}
           <div className="absolute -right-4 sm:-right-8 md:-right-12 top-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] md:w-[540px] md:h-[540px] lg:w-[640px] lg:h-[640px] opacity-35 hover:opacity-55 -rotate-20 transition-all duration-700 pointer-events-none select-none">
             <Image
               src="/images/logos/zru-logo.svg"
               alt="Zimbabwe Rugby Union Crest Watermark"
               fill
               className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
             />
           </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Newsletter / Primary CTA */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
               <h3 className="text-3xl md:text-4xl font-heading font-black tracking-tight uppercase">
                 Join the Fan Zone
               </h3>
               <p className="text-white/60 font-body text-sm md:text-base max-w-md">
                 Exclusive squad announcements, early ticket access, and inner-sanctum content delivered straight to you.
               </p>
            </div>

            {submitted ? (
              <div className="flex items-center gap-3 text-zru-green py-4 border-l-2 border-zru-green pl-4 bg-zru-green/10">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-widest">You are in.</span>
              </div>
            ) : (
              <form className="relative flex border-b-2 border-white/20 focus-within:border-zru-green transition-colors" onSubmit={handleSubscribe}>
                 <label htmlFor="footer-email" className="sr-only">Email Address</label>
                 <input 
                   id="footer-email"
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="ENTER YOUR EMAIL" 
                   required
                   disabled={loading}
                   className="w-full bg-transparent py-4 text-white focus:outline-none placeholder:text-white/30 font-bold uppercase tracking-widest text-sm disabled:opacity-50"
                 />
                 <button 
                   type="submit"
                   disabled={loading}
                   className="p-4 text-white hover:text-zru-green transition-colors disabled:opacity-50"
                   aria-label="Subscribe"
                 >
                   <ArrowRight className="w-6 h-6" />
                 </button>
              </form>
            )}

            <div className="pt-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 block mb-4">Connect</span>
              <div className="flex gap-4">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a 
                    key={label} 
                    href={href} 
                    className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:bg-zru-green hover:text-white hover:border-zru-green transition-all"
                    aria-label={`ZRU on ${label}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.1em] text-white/40 border-b border-white/10 pb-4">{title}</h4>
                <ul className="space-y-4">
                   {links.map((link) => (
                      <li key={link.label}>
                         <Link href={link.href} className="text-sm font-bold text-white/80 hover:text-zru-green transition-colors inline-block">
                           {link.label}
                         </Link>
                      </li>
                   ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-zru-green rounded-full"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
               © {new Date().getFullYear()} Zimbabwe Rugby Union
             </span>
           </div>
           
           <div className="flex flex-wrap gap-x-8 gap-y-4">
              {['Privacy Policy', 'Terms of Use', 'Media Assets', 'Contact'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
           </div>
        </div>

      </div>
    </footer>
  );
}

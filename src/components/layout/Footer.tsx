"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const socialLinks = [
  { Icon: Facebook, href: "https://facebook.com/zimbabwerugby", label: "FB" },
  { Icon: Twitter, href: "https://twitter.com/zimbabwerugby", label: "X" },
  { Icon: Instagram, href: "https://instagram.com/zimbabwerugby", label: "IG" },
  { Icon: Youtube, href: "https://youtube.com/zimbabwerugby", label: "YT" },
  { Icon: Linkedin, href: "https://linkedin.com/zimbabwerugby", label: "IN" },
];

const footerColumns = [
  {
    title: "The Union",
    links: [
      { label: "Governance & Board", href: "/about/leadership" },
      { label: "High Performance", href: "/high-performance" },
      { label: "Sables Trust", href: "/trust" },
      { label: "Commercial Partners", href: "/partners" },
    ],
  },
  {
    title: "National Teams",
    links: [
      { label: "The Sables", href: "/teams/sables" },
      { label: "Lady Sables", href: "/teams/lady-sables" },
      { label: "Cheetahs (7s)", href: "/teams/cheetahs" },
      { label: "Junior Sables", href: "/teams/u20" },
    ],
  },
  {
    title: "Competitions",
    links: [
      { label: "Match Centre", href: "/match-centre" },
      { label: "Nations Cup", href: "/competitions/nations-cup" },
      { label: "Domestic League", href: "/competitions/domestic" },
      { label: "Ticketing", href: "/tickets" },
    ],
  },
  {
    title: "Development",
    links: [
      { label: "Grassroots Rugby", href: "/development/grassroots" },
      { label: "Coaching Education", href: "/development/coaching" },
      { label: "Match Officials", href: "/development/referees" },
      { label: "Safeguarding", href: "/safeguarding" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/clubhouse') || pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#FDFBF0] text-[#003822] border-t border-black/10 pt-16 pb-12 relative overflow-hidden">
      
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 relative z-10 space-y-16">
        
        {/* Massive Institutional Header (Greenboard Style) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#003822]/15 pb-8">
          <div>
            <h1 className="font-heading font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-[#003822] leading-none italic select-none">
              Zimbabwe Rugby
            </h1>
            <p className="text-[#003822]/70 text-xs sm:text-sm font-semibold uppercase tracking-widest mt-2">
              Official Governing Body of Rugby Union in Zimbabwe • Est. 1895
            </p>
          </div>

          {/* Social Media Link Group */}
          <div className="flex items-center gap-3 shrink-0">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#003822]/20 flex items-center justify-center text-[#003822] hover:bg-[#006747] hover:text-white hover:border-[#006747] transition-all duration-300 shadow-sm"
                aria-label={`ZRU on ${label}`}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Greenboard Editorial Columns Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-4">
          {footerColumns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h3 className="font-heading font-black text-lg sm:text-xl uppercase tracking-tight text-[#003822] border-b border-[#003822]/20 pb-3">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm font-bold text-[#003822]/80 hover:text-[#006747] transition-colors leading-relaxed inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Institutional Footnote Disclaimers */}
        <div className="pt-6 border-t border-[#003822]/10 space-y-1.5 text-[11px] font-medium text-[#003822]/60 max-w-4xl leading-relaxed">
          <p>1 • Official fixture dates and kick-off times are subject to World Rugby and Rugby Africa broadcast scheduling adjustments.</p>
          <p>2 • All personal data collection across ticketing and fan registrations complies strictly with Zimbabwe CDPA 2021 statutory data rights.</p>
          <p>3 • Official Zimbabwe Rugby Union merchandise is distributed exclusively through the flagship ZRU Clubhouse Store.</p>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-[#003822]/15 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-[#003822]/70">
          <p>© {new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6 text-[11px] font-extrabold uppercase tracking-wider">
            <Link href="/privacy-policy" className="hover:text-[#006747] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="hover:text-[#006747] transition-colors">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="hover:text-[#006747] transition-colors">
              Cookies &amp; Compliance
            </Link>
            <span className="px-2 py-0.5 bg-[#006747]/10 text-[#006747] border border-[#006747]/30 rounded-md font-mono text-[10px]">
              CDPA 2021 COMPLIANT
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

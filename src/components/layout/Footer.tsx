"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck 
} from "lucide-react";

const socialLinks = [
  { Icon: Facebook, href: "https://facebook.com/zimbabwerugby", label: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com/zimbabwerugby", label: "Twitter/X" },
  { Icon: Instagram, href: "https://instagram.com/zimbabwerugby", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/zimbabwerugby", label: "YouTube" },
  { Icon: Linkedin, href: "https://linkedin.com/zimbabwerugby", label: "LinkedIn" },
];

const footerColumns = [
  {
    title: "The Union",
    links: [
      { label: "Governance & Board", href: "/about/governance" },
      { label: "High Performance", href: "/teams/sables" },
      { label: "Sables Trust", href: "/about/history" },
      { label: "Commercial Partners", href: "/partners" },
    ],
  },
  {
    title: "National Teams",
    links: [
      { label: "The Sables (Men 15s)", href: "/teams/sables" },
      { label: "Lady Sables (Women 15s)", href: "/teams/lady-sables" },
      { label: "Cheetahs (Men 7s)", href: "/teams" },
      { label: "Junior Sables (U20)", href: "/teams/junior-sables" },
    ],
  },
  {
    title: "Match Centre",
    links: [
      { label: "Fixtures & Results", href: "/match-centre" },
      { label: "Match Tickets", href: "/tickets" },
      { label: "Nations Cup", href: "/events" },
      { label: "Live Broadcast Hub", href: "/live" },
    ],
  },
  {
    title: "Grassroots & Support",
    links: [
      { label: "Schools Rugby", href: "/schools" },
      { label: "Get Into Rugby", href: "/play-rugby" },
      { label: "Coaching & Referees", href: "/referees" },
      { label: "Safeguarding", href: "/about/safeguarding" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/clubhouse') || pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#FDFBF0] text-[#003822] border-t border-black/10 pt-12 pb-8 relative overflow-hidden">
      
      {/* Schema.org Sports Organization Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsOrganization",
            "name": "Zimbabwe Rugby Union",
            "url": "https://zimrugby.vercel.app",
            "logo": "https://zimrugby.vercel.app/images/logos/zru-logo.svg",
            "sameAs": socialLinks.map((s) => s.href)
          })
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 relative z-10 space-y-10">
        
        {/* Compact Single-Row Header: Title & Contact Pill */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-[#003822]/15 pb-8">
          <div>
            <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tighter text-[#003822] italic leading-none select-none">
              Zimbabwe Rugby
            </h2>
            <p className="text-[#003822]/70 text-[11px] sm:text-xs font-bold uppercase tracking-widest mt-1.5">
              Official Governing Body of Rugby Union in Zimbabwe • Est. 1895
            </p>
          </div>

          {/* Clean Editorial HQ Contact Details & Socials (No Pills) */}
          <div className="flex flex-wrap items-center gap-6 shrink-0 text-xs font-semibold text-[#003822]/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#006747] shrink-0" />
              <span>Harare Sports Club HQ</span>
            </div>
            <span className="text-[#003822]/20 hidden sm:inline">•</span>
            <a href="tel:+263242700100" className="hover:text-[#006747] transition-colors flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#006747]" /> 
              <span>+263 242 700 100</span>
            </a>

            <div className="flex items-center gap-2 ml-2">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#003822]/20 bg-white flex items-center justify-center text-[#003822] hover:bg-[#006747] hover:text-white hover:border-[#006747] transition-all duration-300 shadow-xs"
                  aria-label={`Official ZRU on ${label}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Compact 4-Column Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="space-y-3">
              <h3 className="font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-[#003822] border-b border-[#003822]/15 pb-2">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs font-bold text-[#003822]/80 hover:text-[#006747] transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Compact Legal & CDPA Compliance Bar */}
        <div className="pt-6 border-t border-[#003822]/15 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-[#003822]/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006747]" />
            <p>© {new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.</p>
          </div>

          <nav aria-label="Legal Links" className="flex flex-wrap items-center gap-5 text-[10px] font-extrabold uppercase tracking-wider">
            <Link href="/privacy-policy" className="hover:text-[#006747] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="hover:text-[#006747] transition-colors">
              Terms of Use
            </Link>
            <Link href="/accessibility" className="hover:text-[#006747] transition-colors">
              Cookie Policy
            </Link>
            <span className="text-[#006747] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006747]" />
              CDPA 2021 COMPLIANT
            </span>
          </nav>
        </div>

      </div>
    </footer>
  );
}

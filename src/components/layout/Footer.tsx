"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MapPin, 
  ShieldCheck 
} from "lucide-react";
import SocialCard from "@/components/ui/SocialCard";

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
      { label: "Cheetahs (Men 7s)", href: "/teams/cheetahs" },
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
    <footer className="bg-[#FDFBF0] text-[#003822] border-t border-black/10 pb-8 relative overflow-hidden">
      
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
            "sameAs": [
              "https://facebook.com/zimbabwerugby",
              "https://twitter.com/zimbabwerugby",
              "https://instagram.com/zimbabwerugby",
              "https://youtube.com/zimbabwerugby",
              "https://linkedin.com/zimbabwerugby"
            ]
          })
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-0">
        
        {/* Compact Single-Row Header: Title & Contact Pill */}
        <div className="flex flex-col items-center gap-6 pb-8">
          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
              <Image
                src="/zru logo main.svg"
                alt="Zimbabwe Rugby Union Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-full max-w-[480px]">
              <span className="block font-heading font-black text-[2.25rem] sm:text-7xl md:text-8xl uppercase text-[#003822] italic leading-[0.85] select-none w-full text-center tracking-[0.02em] sm:tracking-[0.2em] whitespace-nowrap">
                Zimbabwe
              </span>
              <span className="block font-subheading font-black text-[1.75rem] sm:text-5xl md:text-6xl uppercase text-[#006747] italic leading-[0.85] select-none w-full text-center tracking-[0.02em] sm:tracking-[0.35em] whitespace-nowrap">
                Rugby Union
              </span>
              <p className="text-[#003822]/70 text-[11px] sm:text-xs font-bold uppercase tracking-widest mt-2 text-center">
                Official Governing Body of Rugby Union in Zimbabwe • Est. 1895
              </p>
            </div>
          </div>

          {/* Contact Details + Socials — stacked and centered on mobile */}
          <div className="flex flex-col items-center gap-3 text-xs font-bold text-[#003822]/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#006747] shrink-0" />
              <span>Harare Sports Club HQ</span>
            </div>
            <SocialCard />
          </div>
        </div>

        {/* Compact 4-Column Navigation Links */}
        <div className="bg-[#006747] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {footerColumns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="space-y-3">
                <span className="block font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-white border-b border-white/20 pb-2">
                  {col.title}
                </span>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs font-bold text-white/70 hover:text-white transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Compact Legal & CDPA Compliance Bar */}
        <div className="pt-6 mt-10 border-t border-[#003822]/15 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-[#003822]/70">
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
            <span className="text-[#006747] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006747]" />
              CDPA 2021 COMPLIANT
            </span>
          </nav>
        </div>

      </div>
    </footer>
  );
}

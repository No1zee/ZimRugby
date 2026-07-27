"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
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
    <footer className="bg-[#FDFBF0] text-[#003822] border-t border-black/10 pb-8 relative overflow-hidden pt-10 lg:pt-14">
      
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
        
        {/* Statement — large typographic identity, emblem inline */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 pb-10">
          {/* Emblem */}
          <div className="shrink-0">
            <Image
              src="/zru logo main.svg"
              alt="Zimbabwe Rugby Union Logo"
              width={200}
              height={200}
              className="w-28 sm:w-36 lg:w-44 h-auto object-contain"
            />
          </div>

          {/* Large typographic statement */}
          <div className="flex-1 text-center lg:text-left">
            <span className="block font-heading font-black text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase text-[#003822] not-italic leading-[0.82] select-none tracking-[0.02em] sm:tracking-[0.12em]">
              Zimbabwe
            </span>
            <span className="block font-subheading font-black text-[1.6rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase text-[#006747] not-italic leading-[0.82] select-none tracking-[0.02em] sm:tracking-[0.25em]">
              Rugby Union
            </span>
            <p className="text-[#003822]/50 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-3 sm:mt-4">
              Official Governing Body of Rugby Union in Zimbabwe &bull; Est. 1895
            </p>
            <div className="mt-5">
              <SocialCard />
            </div>
          </div>
        </div>

        {/* Minimal nav strip — single horizontal row, all columns inline */}
        <div className="border-t border-[#003822]/10 py-6">
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3">
            {footerColumns.flatMap((col) =>
              col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#003822]/50 hover:text-[#006747] transition-colors"
                >
                  {link.label}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Legal & CDPA Compliance Bar */}
        <div className="pt-6 border-t border-[#003822]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-[#003822]/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006747]" />
            <p>&copy; {new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.</p>
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

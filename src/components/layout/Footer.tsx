"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import SocialCard from "@/components/ui/SocialCard";

const footerColumns = [
  {
    title: "The Union",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
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
    ],
  },
  {
    title: "Grassroots & Support",
    links: [
      { label: "Get Into Rugby", href: "/play-rugby" },
      { label: "Schools Rugby", href: "/schools" },
      { label: "Coaching & Referees", href: "/referees" },
    ],
  },
];

interface FooterProps {
  initialColumns?: any[];
  siteSettings?: any;
}

export default function Footer({ initialColumns, siteSettings }: FooterProps) {
  const pathname = usePathname();

  if (pathname?.startsWith('/clubhouse') || pathname?.startsWith('/admin')) return null;

  const columns: { title: string; links: { label: string; href: string }[] }[] = initialColumns && initialColumns.length > 0
    ? initialColumns.map((col: any) => ({
        title: col.column_title || "",
        links: (Array.isArray(col.links)
          ? col.links
          : JSON.parse(col.links || "[]")).map((l: any) => ({
              label: l.label || "",
              href: l.href || "#"
            })),
      }))
    : footerColumns;

  return (
    <footer className="bg-[#FDFBF0] text-[#003822] border-t border-black/10 pb-12 relative overflow-hidden pt-4 lg:pt-6">
      
      {/* Schema.org Sports Organization Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsOrganization",
            "name": "Zimbabwe Rugby Union",
            "url": "https://zimrugby.vercel.app",
            "logo": "https://zimrugby.vercel.app/logos/zru-crest.png",
            "sameAs": [
              "https://www.facebook.com/share/1BaLCkdCZ3/",
              "https://x.com/ZimRugbyZW",
              "https://www.instagram.com/zimbabwerugbyunion?igsh=NTdxbWszeDdheXpy",
              "https://youtube.com/@ZimbabweRugbyUnion"
            ]
          })
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-0">
        
        {/* Header: Emblem 1/3 + Text/CTA 2/3 */}
        <div className="grid grid-cols-3 items-center pb-3">
          {/* Left Column — Emblem (1/3) */}
          <div className="flex items-center justify-center px-[8%] py-1">
            <Image
              src="/zru logo main.svg"
              alt="Zimbabwe Rugby Union Logo"
              width={220}
              height={220}
              className="w-full max-w-[200px] sm:max-w-[240px] h-auto object-contain"
            />
          </div>

          {/* Right Column — Heading, Tagline, Location, CTA (2/3) */}
          <div className="col-span-2 flex flex-col items-center justify-center text-center px-[4%] gap-2">
            <div>
              <span className="block font-heading font-black text-[1.8rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase text-[#003822] not-italic leading-[0.85] select-none tracking-[0.02em] sm:tracking-[0.15em]">
                Zimbabwe
              </span>
              <span className="block font-subheading font-black text-[1.4rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl uppercase text-[#006747] not-italic leading-[0.85] select-none tracking-[0.02em] sm:tracking-[0.3em]">
                Rugby Union
              </span>
              <p className="text-[#003822]/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1 sm:mt-2">
                Official Governing Body of Rugby Union in Zimbabwe • Est. 1895
              </p>
            </div>
            <div className="mt-1">
              <SocialCard />
            </div>
          </div>
        </div>

        {/* 4-Column Navigation Links */}
        <div className="bg-[#006747] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="space-y-3">
                <span className="block font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-white border-b border-white/20 pb-2">
                  {col.title}
                </span>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] font-bold text-white/85 hover:text-accent-teal transition-colors inline-block"
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
            <Link href="/privacy-policy" className="hover:text-[#006747] transition-colors">
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

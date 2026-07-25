import React from "react";
import Image from "next/image";
import Link from "next/link";

type Partner = {
  name: string;
  logo: string;
  href: string;
  featured?: boolean;
  note?: string;
};

const partners: readonly Partner[] = [
  {
    name: "Nedbank Zimbabwe",
    logo: "/images/sponsors/nedbank.svg",
    href: "https://www.nedbank.co.zw/",
    featured: true,
    note: "Headline sponsor",
  },
  {
    name: "CFAO Mobility Zimbabwe",
    logo: "/images/sponsors/cfao.svg",
    href: "/partners",
  },
  {
    name: "Gilbert Rugby",
    logo: "/images/sponsors/gilbert.svg",
    href: "/partners",
  },
  {
    name: "Seed Co Zimbabwe",
    logo: "/images/sponsors/seedco.svg",
    href: "/partners",
  },
  {
    name: "BLK Sport",
    logo: "/images/sponsors/blk.svg",
    href: "/partners",
  },
];

export default function PartnersSection() {
  const featured = partners.find((partner) => partner.featured);
  const supporting = partners.filter((partner) => !partner.featured);

  return (
    <section
      aria-labelledby="partners-heading"
      className="relative overflow-hidden bg-rich-black"
    >
      {/* Faint grid structure */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-16 sm:pb-20">

        {/* ── Intro Block ── */}
        <div className="max-w-2xl mb-14 sm:mb-20 space-y-5">
          <span className="block text-[10px] sm:text-[11px] font-subheading font-black uppercase tracking-[0.3em] text-[#006747]">
            Powering Zimbabwe Rugby
          </span>

          <h2
            id="partners-heading"
            className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-black uppercase tracking-tight text-white leading-[1.05]"
          >
            Partners backing the game from grassroots to the Sables
          </h2>

          <p className="text-white/40 text-sm sm:text-base leading-relaxed max-w-lg font-body">
            From national team competition to school pathways and provincial
            development, our commercial partners help power every level of
            Zimbabwe Rugby.
          </p>

          <div className="flex flex-wrap items-center gap-5 pt-1">
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-subheading font-extrabold uppercase tracking-[0.2em] text-white/50 hover:text-[#006747] transition-colors duration-300"
            >
              <span className="border-b border-white/10 hover:border-[#006747]/50 pb-px transition-colors duration-300">
                Become an official partner
              </span>
              <span className="text-xs">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* ── Visual Stage ── */}
        <div className="relative">

          {/* Subtle frame panel behind the entire stage */}
          <div className="absolute -inset-3 sm:-inset-4 rounded-3xl border border-white/[0.04] pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-stretch gap-4 sm:gap-5">

            {/* ── Featured Partner Card ── */}
            {featured && (
              <Link
                href={featured.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-1 min-h-[220px] sm:min-h-[260px] flex flex-col justify-between rounded-2xl bg-white/[0.04] border border-white/[0.07] p-7 sm:p-9 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500"
              >
                {/* Top row: note + name */}
                <div className="space-y-3">
                  {featured.note && (
                    <span className="inline-block text-[9px] font-subheading font-black uppercase tracking-[0.25em] text-[#006747] bg-[#006747]/10 border border-[#006747]/20 px-3 py-1 rounded">
                      {featured.note}
                    </span>
                  )}
                  <h3 className="font-heading text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
                    {featured.name}
                  </h3>
                </div>

                {/* Supporting copy */}
                <p className="text-white/35 text-xs sm:text-sm leading-relaxed max-w-sm font-body mt-4">
                  Official headline sponsor powering the Sables, domestic
                  competitions, and grassroots rugby nationwide.
                </p>

                {/* Bottom: logo + link label */}
                <div className="flex items-end justify-between mt-6 sm:mt-8">
                  <div className="relative w-28 h-8 sm:w-36 sm:h-10">
                    <Image
                      src={featured.logo}
                      alt={featured.name}
                      fill
                      className="object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      sizes="144px"
                    />
                  </div>
                  <span className="text-[9px] font-subheading font-black uppercase tracking-[0.2em] text-white/25 group-hover:text-white/50 transition-colors duration-300">
                    Visit partner &rarr;
                  </span>
                </div>
              </Link>
            )}

            {/* ── Secondary Partners Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 lg:w-[340px] xl:w-[380px] gap-4 sm:gap-5">
              {supporting.map((partner) => (
                <Link
                  key={partner.name}
                  href={partner.href}
                  target={partner.href.startsWith("http") ? "_blank" : undefined}
                  rel={partner.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex flex-col items-center justify-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-5 sm:py-6 hover:bg-white/[0.06] hover:border-white/[0.10] transition-all duration-400"
                >
                  <div className="relative w-16 h-7 sm:w-20 sm:h-8">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain brightness-0 invert opacity-30 group-hover:opacity-65 transition-opacity duration-500"
                      sizes="80px"
                    />
                  </div>
                  <span className="text-[9px] font-subheading font-bold uppercase tracking-[0.15em] text-white/25 group-hover:text-white/50 transition-colors duration-300 text-center leading-tight">
                    {partner.name}
                  </span>
                </Link>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

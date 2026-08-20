"use client";

import Link from "next/link";
import { Shield, MapPin, Award, PhoneCall, ExternalLink } from "lucide-react";
import CmsHero from "@/components/cms/CmsHero";
import type { PageData } from "@/lib/api/pages";
import type { Club } from "@/lib/api/clubs";

interface ClubsClientProps {
  cmsPage: PageData | null;
  clubs: Club[];
}

export default function ClubsClient({ cmsPage, clubs }: ClubsClientProps) {
  return (
    <main className="bg-milk-white min-h-screen pb-12">
      <CmsHero
        kicker={cmsPage?.hero_kicker || "Club Directory"}
        title={cmsPage?.hero_title || "Clubs"}
        intro={cmsPage?.hero_intro || "Explore the competitive heartbeat of Zimbabwe Rugby. Browse registered clubs and join the league."}
        image={cmsPage?.hero_image || "/images/gallery/zimbabwe-sables-0351.webp"}
        breadcrumb={[{ label: "Clubs", href: "/clubs" }]}
        pageId={cmsPage?.id}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-3xl mb-8">
          <p className="text-lg text-rich-black/70 leading-relaxed font-body">
            Clubs are the foundational core of the Zimbabwe Rugby Union. Across our provinces, official registered clubs provide pathways from grassroots school levels straight into national selection camps for the **Sables**, **Lady Sables**, and **Cheetahs**.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="group flex flex-col justify-between p-5 bg-white border border-black/5 hover:border-zru-green/25 rounded-2xl shadow-md transition-all duration-300"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-zru-green/5 border border-zru-green/10 flex items-center justify-center text-zru-green">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-none bg-black/[0.03] border border-black/10 text-[9px] font-black uppercase tracking-widest text-rich-black/70">
                    {club.province}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-heading text-2xl text-rich-black font-black uppercase tracking-wide">
                    {club.name}
                  </h3>
                  <div className="flex items-center gap-2 text-zru-green text-xs font-bold uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    {club.league}
                  </div>
                  <p className="text-rich-black/60 text-sm font-body leading-relaxed pt-2">
                    {club.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-black/5 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-rich-black/50">
                  <MapPin className="w-4 h-4 text-zru-green shrink-0 mt-0.5" />
                  <span className="font-body">{club.venue}</span>
                </div>

                <a
                  href={`mailto:${club.contact}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-black/5 hover:bg-zru-green hover:text-white border border-black/10 hover:border-zru-green rounded-xl text-xs font-bold uppercase tracking-widest text-rich-black/80 transition-all duration-300"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Contact Club
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 md:p-8 bg-rich-black rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.12),transparent_70%)]" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-[10px] font-black text-zru-green uppercase tracking-[0.3em]">Union Governance</span>
            <h2 className="font-heading text-3xl md:text-4xl text-white font-black uppercase tracking-wide leading-tight">
              Register or Renew Club Affiliation
            </h2>
            <p className="text-white/60 text-sm font-body leading-relaxed">
              Ensure your club is compliant with ZRU safeguarding, referee, and medical certifications for the upcoming season. Unaffiliated clubs cannot participate in national knockout tournaments or regional qualifiers.
            </p>
            <div className="pt-4">
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-zru-green hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                Safeguarding & Rules <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

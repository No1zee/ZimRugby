import { Metadata } from "next";
import Link from "next/link";
import { Shield, MapPin, Award, PhoneCall, ExternalLink } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Clubs | Zimbabwe Rugby Union",
  description: "Browse official registered rugby clubs across Zimbabwe. Find teams, training schedules, and local leagues.",
};

const CLUBS = [
  {
    name: "Old Hararians RFC",
    province: "Mashonaland",
    league: "Super Six League",
    venue: "Old Hararians Sports Club, Milton Park, Harare",
    color: "ZRU Green / Gold Accent",
    contact: "ohrfc@zru.co.zw",
    description: "One of the most decorated clubs in Zimbabwean rugby history, boasting multiple championship trophies and producing world-class Sables.",
  },
  {
    name: "Harare Sports Club",
    province: "Mashonaland",
    league: "Super Six League",
    venue: "Harare Sports Club, Central Harare",
    color: "Red / White Accent",
    contact: "hsc@zru.co.zw",
    description: "The home of the 'Red Lions'. HSC is a cornerstone club of the national league and host to major international test fixtures.",
  },
  {
    name: "Old Georgians RFC",
    province: "Mashonaland",
    league: "Super Six League",
    venue: "Old Georgians Sports Club, Groombridge, Harare",
    color: "Red / Black Accent",
    contact: "ogrfc@zru.co.zw",
    description: "The 'Dragons' have a state-of-the-art facility and a rich history of tactical excellence in both 15s and 7s formats.",
  },
  {
    name: "Old Miltonians RFC",
    province: "Matabeleland",
    league: "Super Six League",
    venue: "Hartsfield Rugby Ground, Bulawayo",
    color: "Yellow / Black Accent",
    contact: "omrfc@zru.co.zw",
    description: "Bulawayo's premier rugby franchise, carrying the pride of Matabeleland rugby with a gritty, high-performance style.",
  },
  {
    name: "Matabeleland Warriors",
    province: "Matabeleland",
    league: "Super Six League",
    venue: "Hartsfield Rugby Ground, Bulawayo",
    color: "Blue / Black Accent",
    contact: "warriors@zru.co.zw",
    description: "A fierce competitive club based at Hartsfield Bulawayo, committed to development and regional talent growth.",
  },
  {
    name: "Mutare Sports Club",
    province: "Manicaland",
    league: "First Division",
    venue: "Mutare Sports Club, Mutare",
    color: "Green / White Accent",
    contact: "mutare@zru.co.zw",
    description: "Representing Manicaland province in the national league structure. A community hub fostering talent in the eastern regions.",
  },
];

export default function ClubsPage() {
  return (
    <main className="bg-milk-white min-h-screen pb-24">
      {/* PageHero header */}
      <div className="pt-24">
        <PageHero
          title="Club Directory"
          subtitle="Explore the competitive heartbeat of Zimbabwe Rugby. Browse registered clubs and join the league."
          tag="National Ecosystem"
          backgroundImage="/images/gallery/zimbabwe-sables-0351.webp"
          breadcrumb={[{ label: "Clubs", href: "/clubs" }]}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Intro */}
        <div className="max-w-3xl mb-16">
          <p className="text-lg text-rich-black/70 leading-relaxed font-body">
            Clubs are the foundational core of the Zimbabwe Rugby Union. Across our provinces, official registered clubs provide pathways from grassroots school levels straight into national selection camps for the **Sables**, **Lady Sables**, and **Cheetahs**.
          </p>
        </div>

        {/* Clubs Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CLUBS.map((club) => (
            <div 
              key={club.name}
              className="group flex flex-col justify-between p-8 bg-white border border-black/5 hover:border-zru-green/25 rounded-2xl shadow-md transition-all duration-300"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-zru-green/5 border border-zru-green/10 flex items-center justify-center text-zru-green">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[9px] font-black uppercase tracking-wider text-rich-black/60">
                    {club.province}
                  </span>
                </div>

                {/* Details */}
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

              {/* Footer info & CTA */}
              <div className="pt-8 mt-8 border-t border-black/5 space-y-4">
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

        {/* Registration Promo */}
        <div className="mt-20 p-8 md:p-12 bg-rich-black rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
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
import { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Trophy, Users, ShieldCheck, Mail } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Schools Rugby | Zimbabwe Rugby Union",
  description: "Explore Zimbabwe school rugby structures, the Super 8 League, youth pathways, and tag rugby initiatives.",
};

const INITIATIVES = [
  {
    title: "The Super 8 League",
    description: "The elite first- XV schools competition in Zimbabwe, featuring historic rivals like Prince Edward School, St George's College, Falcon College, and Peterhouse. Spans May to August annually.",
    icon: Trophy,
    stat: "8 Elite Schools",
  },
  {
    title: "Co-Ed Development",
    description: "Expanding the game beyond traditional rugby schools. ZRU supports public schools and co-educational institutions with gear, coaching clinics, and structured B-Leagues.",
    icon: Users,
    stat: "120+ Schools Active",
  },
  {
    title: "Safeguarding & Coaching",
    description: "Every school coach must hold a minimum World Rugby Level 1 Coaching Certificate and complete the ZRU child safety and safeguarding compliance flow.",
    icon: ShieldCheck,
    stat: "100% Certified Coaches",
  },
];

export default function SchoolsPage() {
  return (
    <main className="bg-milk-white min-h-screen pb-24">
      {/* PageHero header */}
      <div className="pt-24">
        <PageHero
          title="School Rugby"
          subtitle="The historic breeding ground of Zimbabwe Sables champions. Discover school leagues and development structures."
          tag="Youth Development"
          backgroundImage="/images/hero/zim-u20s.webp"
          breadcrumb={[{ label: "Schools", href: "/schools" }]}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Intro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl text-rich-black font-black uppercase tracking-wide">
              The Foundation of National Excellence
            </h2>
            <p className="text-rich-black/70 text-sm md:text-base font-body leading-relaxed">
              Zimbabwe school rugby is globally renowned for its exceptional quality, intense rivalry, and passionate support. Schools rugby serves as the primary pipeline feeding our **Junior Sables (U20)** and elite senior squads. 
            </p>
            <p className="text-rich-black/70 text-sm md:text-base font-body leading-relaxed">
              ZRU oversees school structures across all ten provinces, organizing leagues, certifying schoolmasters, enforcing strict age-grade regulations, and ensuring medical safety compliance at all schoolboy fixtures.
            </p>
          </div>
          <div className="lg:col-span-5 p-8 bg-zru-green/5 border border-zru-green/10 rounded-3xl space-y-6">
            <div className="w-12 h-12 rounded-xl bg-zru-green/10 border border-zru-green/20 flex items-center justify-center text-zru-green">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl text-rich-black font-black uppercase tracking-wide">
              Schoolboys Pathway
            </h3>
            <ul className="space-y-3 text-sm text-rich-black/70 font-body">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zru-green shrink-0" />
                Under-14: Foundation & Skills
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zru-green shrink-0" />
                Under-16: Tactical Development
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zru-green shrink-0" />
                Under-18: Elite (Craven Week & Academy)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zru-green shrink-0" />
                Under-20: Junior Sables Selection
              </li>
            </ul>
          </div>
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {INITIATIVES.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="p-8 bg-white border border-black/5 rounded-2xl shadow-sm space-y-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-xl bg-zru-green/5 border border-zru-green/10 flex items-center justify-center text-zru-green">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-zru-green bg-zru-green/5 border border-zru-green/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.stat}
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-heading text-xl text-rich-black font-black uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-rich-black/60 text-sm font-body leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="p-8 md:p-12 bg-rich-black rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.12),transparent_70%)]" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-[10px] font-black text-zru-green uppercase tracking-[0.3em]">Schools Association</span>
            <h2 className="font-heading text-3xl md:text-4xl text-white font-black uppercase tracking-wide leading-tight">
              Get Your School Involved
            </h2>
            <p className="text-white/60 text-sm font-body leading-relaxed">
              Register your school with the ZRU Schools Rugby Association to receive training equipment, gain access to coaching certifications, and enter regional festivals and leagues.
            </p>
            <div className="pt-4">
              <a 
                href="mailto:schools@zru.co.zw"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-zru-green hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                Register School <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
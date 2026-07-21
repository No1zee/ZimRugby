import { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, ShieldCheck, Award, UserCheck, Mail, ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Volunteer & Officiate | Zimbabwe Rugby Union",
  description: "Become a certified referee, youth coach, or team manager with the Zimbabwe Rugby Union.",
};

const PATHWAYS = [
  {
    title: "Refereeing",
    subtitle: "ZRU Referees Association",
    description: "Join the official ZRU match officiating panel. Take World Rugby Level 1 officiating courses and progress from school fixtures to national test matches.",
    icon: Award,
    cta: "Join Referees Panel",
    href: "mailto:referees@zru.co.zw",
  },
  {
    title: "Coaching",
    subtitle: "Youth & Club Coaching",
    description: "Gain World Rugby accredited coaching certifications. Help develop skills, tactics, and sportsmanship across schools and community clubs.",
    icon: UserCheck,
    cta: "Coaching Accreditation",
    href: "mailto:coaching@zru.co.zw",
  },
  {
    title: "Matchday Operations",
    subtitle: "Team & Event Support",
    description: "Assist with fixture management, team logistics, medical support, and fan activations at national fixtures and provincial tournaments.",
    icon: HeartHandshake,
    cta: "Volunteer at Fixtures",
    href: "mailto:volunteer@zru.co.zw",
  },
];

export default function VolunteerPage() {
  return (
    <main className="bg-milk-white min-h-screen pb-24">
      {/* PageHero header */}
      <div className="pt-24">
        <PageHero
          title="Volunteer & Officiate"
          subtitle="Be the backbone of Zimbabwe Rugby. Certified refereeing, coaching accreditations, and matchday operations."
          tag="Community & Officiating"
          backgroundImage="/images/gallery/zimbabwe-sables-0351.webp"
          breadcrumb={[{ label: "Volunteer", href: "/volunteer" }]}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Intro */}
        <div className="max-w-3xl mb-16 space-y-4">
          <h2 className="font-heading text-3xl md:text-4xl text-rich-black font-black uppercase tracking-wide">
            Powering Every Kickoff
          </h2>
          <p className="text-rich-black/70 text-base font-body leading-relaxed">
            Without dedicated volunteers, certified referees, and certified coaches, rugby cannot exist. The Zimbabwe Rugby Union provides accredited pathways for individuals passionate about growing the sport safely and professionally.
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {PATHWAYS.map((path) => {
            const Icon = path.icon;
            return (
              <div 
                key={path.title}
                className="group flex flex-col justify-between p-8 bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-md hover:border-zru-green/25 transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-zru-green/5 border border-zru-green/10 flex items-center justify-center text-zru-green">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-zru-green uppercase tracking-wider block">
                      {path.subtitle}
                    </span>
                    <h3 className="font-heading text-2xl text-rich-black font-black uppercase tracking-wide">
                      {path.title}
                    </h3>
                  </div>
                  <p className="text-rich-black/60 text-sm font-body leading-relaxed">
                    {path.description}
                  </p>
                </div>

                <div className="pt-8 border-t border-black/5 mt-8">
                  <a 
                    href={path.href}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-black/5 hover:bg-zru-green hover:text-white border border-black/10 hover:border-zru-green rounded-xl text-xs font-bold uppercase tracking-widest text-rich-black/80 transition-all duration-300"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {path.cta}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Safeguarding Policy Section */}
        <div className="p-8 md:p-12 bg-rich-black rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.12),transparent_70%)]" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zru-green/10 border border-zru-green/20 flex items-center justify-center text-zru-green">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-zru-green uppercase tracking-[0.3em]">Mandatory Policy</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl text-white font-black uppercase tracking-wide leading-tight">
              Safeguarding & Player Welfare
            </h2>
            <p className="text-white/60 text-sm font-body leading-relaxed">
              ZRU enforces zero-tolerance player welfare policies. All volunteers, coaches, and match officials interacting with Under-18 teams must complete a criminal background check, adhere to the World Rugby Code of Conduct, and hold valid World Rugby Rugby Ready certifications.
            </p>
            <div className="pt-4">
              <Link 
                href="/about/safeguarding"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-zru-green hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                Read Safeguarding Guidelines <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
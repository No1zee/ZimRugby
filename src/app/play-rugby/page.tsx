import { Metadata } from "next";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { MapPin, Users, Calendar, Trophy, Search, ArrowRight, Heart, GraduationCap, Volleyball } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Play Rugby | Zimbabwe Rugby Union",
  description: "Find a club, join a programme, or start playing rugby in Zimbabwe.",
};

const programmes = [
  {
    title: "Find a Club",
    description: "Join one of over 50 registered rugby clubs across Zimbabwe. From social rugby to competitive leagues.",
    icon: MapPin,
    link: "/clubs",
    color: "bg-zru-green"
  },
  {
    title: "Schools Programme",
    description: "Over 200 schools participate in ZRU development programmes, from tag rugby to full contact.",
    icon: GraduationCap,
    link: "/schools",
    color: "bg-blue-600"
  },
  {
    title: "Women's Rugby",
    description: "Join the Lady Sables pathway. Women's rugby is thriving with opportunities at all levels.",
    icon: Heart,
    link: "/womens-rugby",
    color: "bg-pink-600"
  },
  {
    title: "Youth Development",
    description: "Age-grade programmes from U13 to U20, developing the next generation of Sables.",
    icon: Users,
    link: "/youth",
    color: "bg-orange-600"
  },
];

const clubs = [
  { name: "Old Hararians RFC", location: "Harare", league: "Super League" },
  { name: "Harare Sports Club", location: "Harare", league: "Super League" },
  { name: "Old Georgians RFC", location: "Harare", league: "Super League" },
  { name: "Old Miltonians RFC", location: "Bulawayo", league: "Super League" },
  { name: "Matabeleland Warriors", location: "Bulawayo", league: "Super League" },
  { name: "UZ Wolves", location: "Harare", league: "First Division" },
];

export default function PlayRugbyPage() {
  return (
    <main className="bg-rich-black min-h-screen">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-zru-green relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='4' fill='%23fff'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase mb-4">
            Play Rugby
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Whether you're picking up a ball for the first time or returning to the game, there's a place for you in Zimbabwe Rugby.
          </p>
        </div>
      </section>

      {/* Programmes Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-zru-green uppercase mb-8">Find Your Path</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programmes.map((prog) => (
              <Link key={prog.title} href={prog.link} className="group block">
                <div className="bg-gray-50 rounded-lg p-6 h-full hover:shadow-lg transition-all duration-300 border border-transparent hover:border-zru-gold/30">
                  <div className={`${prog.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                    <prog.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-zru-green mb-2 group-hover:text-zru-gold transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {prog.description}
                  </p>
                  <span className="text-zru-green text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Club Finder */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-black text-zru-green uppercase mb-2">Find a Club</h2>
              <p className="text-gray-600">Join one of our registered clubs near you.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by city or club name..."
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg w-full md:w-80 focus:outline-none focus:border-zru-green"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((club) => (
              <div key={club.name} className="bg-white rounded-lg p-5 border border-gray-100 hover:border-zru-green/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-zru-green">{club.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      {club.location}
                    </div>
                  </div>
                  <span className="bg-zru-gold/20 text-zru-green text-[10px] font-bold px-2 py-1 rounded uppercase">
                    {club.league}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/clubs" className="inline-flex items-center gap-2 text-zru-green font-bold hover:text-zru-gold transition-colors">
              View All Clubs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-zru-green">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-4">
            Ready to Start?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Contact your nearest club or get in touch with ZRU to find the right programme for you.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 bg-zru-gold text-zru-green px-8 py-4 font-bold uppercase tracking-wider rounded hover:bg-yellow-400 transition-colors"
          >
            Get in Touch <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

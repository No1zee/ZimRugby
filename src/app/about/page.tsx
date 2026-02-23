import { Metadata } from "next";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Users, Target, Award, Heart, ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | Zimbabwe Rugby Union",
  description: "Learn about the Zimbabwe Rugby Union, our history, mission, and leadership.",
};

const stats = [
  { label: "Years of Rugby", value: "130+" },
  { label: "Registered Clubs", value: "50+" },
  { label: "Active Players", value: "5,000+" },
  { label: "Provinces", value: "10" },
];

const leadership = [
  { name: "Paddy Zhanda", role: "Chairman (Interim Management Committee)", image: null },
  { name: "Brendan Dawson", role: "Head Coach (Sables)", image: null },
];

export default function AboutPage() {
  return (
    <main className="bg-rich-black min-h-screen">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-zru-green relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 L40 0' stroke='%23fff' stroke-width='1' fill='none'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase mb-4">
            About ZRU
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Building rugby excellence in Zimbabwe since 1895. From grassroots to international glory.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-zru-gold" />
                <h2 className="text-2xl font-black text-zru-green uppercase">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To develop, promote, and govern the game of rugby union in Zimbabwe, fostering excellence at all levels while using the sport to positively impact communities across the nation.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-zru-gold" />
                <h2 className="text-2xl font-black text-zru-green uppercase">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To be the leading rugby nation in Africa, renowned for competitive excellence, inclusive development, and the positive transformation of lives through the values of rugby.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-zru-green">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-black text-zru-gold mb-2">{stat.value}</div>
                <div className="text-white/80 text-sm font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-zru-green uppercase mb-8">Our History</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Rugby in Zimbabwe has a rich history dating back to 1895 when the first matches were played in Salisbury (now Harare). The Zimbabwe Rugby Union was officially formed in 1895, making it one of the oldest rugby unions in Africa.
            </p>
            <p>
              The national team, known as the Sables, made their first major international appearance in the 1987 Rugby World Cup and have been a consistent force in African rugby. In 2024, the Sables achieved their greatest triumph by winning the Africa Cup, cementing their position as continental champions.
            </p>
            <p>
              Today, Zimbabwe Rugby Union continues to develop the game at all levels, from schools and clubs to the elite international programme, with a particular focus on growing women's rugby through the Lady Sables programme.
            </p>
          </div>
        </div>
      </section>

      {/* In Memoriam Tribute */}
      <section className="py-16 bg-linear-to-br from-zru-green to-rich-black relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 text-zru-gold">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase mb-8">In Memoriam</h2>
          <div className="w-48 h-48 mx-auto mb-6 relative rounded-full overflow-hidden border-4 border-zru-gold shadow-2xl">
            <Image 
              src="/images/leadership/aaron-jani.png"
              alt="Aaron Jani"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-4xl font-black text-zru-gold uppercase mb-6 drop-shadow-lg">Aaron Jani</h3>
          <p className="text-xl text-white/80 font-medium mb-8 italic">
            Former President, Zimbabwe Rugby Union (2017 &ndash; May 2024)<br />
            Rugby Africa Treasurer
          </p>
          <div className="w-24 h-1 bg-zru-gold mx-auto mb-8 rounded-full opacity-50"></div>
          <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto mb-4">
            The Zimbabwe Rugby Union honors the extraordinary life and legacy of Aaron Jani, who passed away on February 26, 2025, after a courageous battle with cancer. 
          </p>
          <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
            A true pioneer of the sport, Aaron was one of the first Black players to proudly wear the Sables jersey in the early 1990s. He later transitioned into a visionary administrator, dedicating his life to the growth and development of rugby not only in Zimbabwe but across the entire African continent. His passion, leadership, and unyielding commitment to the game will forever echo through the halls of Zimbabwe Rugby.
          </p>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-zru-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-zru-gold/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Leadership */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-zru-green uppercase mb-8">Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((person) => (
              <div key={person.name} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-24 h-24 bg-zru-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-zru-green" />
                </div>
                <h3 className="font-bold text-lg text-zru-green">{person.name}</h3>
                <p className="text-gray-500 text-sm">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-rich-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white uppercase mb-8">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <a href="mailto:info@zimbabwerugby.co.zw" className="flex items-center gap-4 text-white/80 hover:text-zru-gold transition-colors">
              <Mail className="w-6 h-6" />
              <span>info@zimbabwerugby.co.zw</span>
            </a>
            <div className="flex items-center gap-4 text-white/80">
              <MapPin className="w-6 h-6" />
              <span>National Sports Stadium, Harare</span>
            </div>
            <a href="tel:+263242751234" className="flex items-center gap-4 text-white/80 hover:text-zru-gold transition-colors">
              <Phone className="w-6 h-6" />
              <span>+263 (24) 275 1234</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

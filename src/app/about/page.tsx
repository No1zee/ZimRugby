import { Metadata } from "next";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Users, Target, Award, Heart, ArrowRight, Mail, MapPin, Phone } from "lucide-react";

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
  { name: "Aaron Jani", role: "President", image: null },
  { name: "Losson Mtongwiza", role: "Vice President", image: null },
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

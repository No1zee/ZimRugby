import { Target, Award, Mail, MapPin, Phone } from "lucide-react";

export default function AboutOverviewPage() {
  const stats = [
    { label: "Years of Rugby", value: "130+" },
    { label: "Registered Clubs", value: "50+" },
    { label: "Active Players", value: "5,000+" },
    { label: "Provinces", value: "10" }
  ];

  return (
    <div className="space-y-12">
      
      {/* 1. overview summary */}
      <div className="border-l-4 border-zru-green pl-4 mb-8">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">UNION OVERVIEW</h2>
        <p className="text-sm text-white/50 mt-1">Introduction and core details of the Zimbabwe Rugby Union.</p>
      </div>

      <p className="text-white/80 leading-relaxed text-lg font-medium">
        Established in 1895, the Zimbabwe Rugby Union (ZRU) is the official governing body for rugby union in Zimbabwe. We manage national representative squads, including the Sables, Lady Sables, Cheetahs, and youth development academies, while fostering domestic leagues and grassroots initiatives.
      </p>

      {/* 2. Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
        <div className="card-green border rounded-2xl p-6 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-zru-green" />
            <h3 className="text-lg font-black uppercase tracking-wide text-white">OUR MISSION</h3>
          </div>
          <p className="text-white/60 text-sm leading-relaxed font-medium">
            To develop, promote, and govern the game of rugby union in Zimbabwe, fostering excellence at all levels while using the sport to positively impact communities across the nation.
          </p>
        </div>

        <div className="card-green border rounded-2xl p-6 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-zru-green" />
            <h3 className="text-lg font-black uppercase tracking-wide text-white">OUR VISION</h3>
          </div>
          <p className="text-white/60 text-sm leading-relaxed font-medium">
            To be the leading rugby nation in Africa, renowned for competitive excellence, inclusive development, and the positive transformation of lives through the values of rugby.
          </p>
        </div>
      </div>

      {/* 3. Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/5 text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="card-green border rounded-2xl p-4">
            <div className="text-3xl font-black text-zru-green italic mb-1">{stat.value}</div>
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 4. Contact Us */}
      <div className="pt-8 border-t border-white/5 space-y-6">
        <h3 className="text-lg font-black uppercase tracking-wide text-white">Contact & Enquiries</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <a href="mailto:info@zimbabwerugby.co.zw" className="flex items-center gap-3 text-white/60 hover:text-zru-green transition-colors font-medium">
            <Mail className="w-5 h-5 text-zru-green shrink-0" />
            <span>info@zimbabwerugby.co.zw</span>
          </a>
          <div className="flex items-center gap-3 text-white/60 font-medium">
            <MapPin className="w-5 h-5 text-zru-green shrink-0" />
            <span>National Sports Stadium, Harare</span>
          </div>
          <a href="tel:+263242751234" className="flex items-center gap-3 text-white/60 hover:text-zru-green transition-colors font-medium">
            <Phone className="w-5 h-5 text-zru-green shrink-0" />
            <span>+263 (24) 275 1234</span>
          </a>
        </div>
      </div>

    </div>
  );
}

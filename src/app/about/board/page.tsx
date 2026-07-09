import Image from "next/image";
import { Users, Heart } from "lucide-react";

export default function BoardPage() {
  const leaders = [
    { name: "Paddy Zhanda", role: "Chairman (Interim Management Committee)", status: "Active" },
    { name: "Ricky Chirengende", role: "Committee Member & Coach Representative", status: "Active" },
    { name: "TJ Chifokoyo", role: "General Secretary", status: "Active" }
  ];

  return (
    <div className="space-y-12">
      
      {/* Overview header */}
      <div className="border-l-4 border-zru-green pl-4">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">BOARD & LEADERSHIP</h2>
        <p className="text-sm text-white/50 mt-1">Members governing the strategic decisions of the union.</p>
      </div>

      {/* Active board grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
        {leaders.map((person) => (
          <div key={person.name} className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center group hover:border-white/10 transition-colors">
            <div className="w-16 h-16 bg-zru-green/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <Users className="w-6 h-6 text-zru-green" />
            </div>
            <h3 className="font-black text-base text-white uppercase tracking-tight">{person.name}</h3>
            <p className="text-white/50 text-xs font-bold uppercase mt-1 tracking-wider leading-relaxed">{person.role}</p>
            <span className="inline-block bg-zru-green/20 text-zru-green text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mt-4">
              {person.status}
            </span>
          </div>
        ))}
      </div>

      {/* Special Memorial Section for ZRU President Aaron Jani */}
      <div className="pt-10 border-t border-white/5">
        <div className="bg-linear-to-br from-zru-green/30 to-rich-black border border-zru-green/20 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-zru-green/20">
            <Heart className="w-24 h-24 fill-current" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-36 h-36 relative rounded-full overflow-hidden border-4 border-zru-green/50 shadow-xl shrink-0">
              <Image 
                src="/images/leadership/aaron-jani.png"
                alt="Aaron Jani Tribute"
                fill
                sizes="144px"
                className="object-cover grayscale"
              />
            </div>
            
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <span className="text-zru-green text-[9px] font-black uppercase tracking-[0.3em] block">
                IN MEMORIAM & TRIBUTE
              </span>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
                Aaron Jani
              </h3>
              <p className="text-white/80 text-sm font-semibold italic">
                Former President of the Zimbabwe Rugby Union (2017 – May 2024)<br />
                Rugby Africa Treasurer & Sables Legend
              </p>
              <p className="text-white/60 text-xs leading-relaxed font-medium">
                The Zimbabwe Rugby Union honors the extraordinary life and legacy of Aaron Jani. Aaron was a true pioneer of the sport, representing the Sables in the early 1990s as one of the first Black players, and later dedicating his life to rugby administration. His leadership laid the foundations for the Sables&apos; 2024 Africa Cup victory. His spirit continues to inspire the game across the continent.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

import { Hourglass, Trophy, Calendar } from "lucide-react";

export default function HistoryPage() {
  const milestones = [
    { year: "1895", title: "Union Founded", desc: "The first rugby union matches are played in Bulawayo and Salisbury (Harare), and the Rhodesia Rugby Football Union (now ZRU) is officially formed." },
    { year: "1987", title: "Inaugural World Cup Participation", desc: "Zimbabwe is invited to participate in the first-ever Rugby World Cup held in New Zealand and Australia, representing African rugby." },
    { year: "1991", title: "Second World Cup Campaign", desc: "Clad in the iconic green and white hoops, the Sables qualify and compete in the 1991 Rugby World Cup in Europe, battling Scotland, Ireland, and Japan." },
    { year: "2024", title: "Africa Cup Champions", desc: "The Sables reclaim continental supremacy, defeating Algeria 29-3 in the final to lift the Rugby Africa Cup and launch a new era of competitiveness." }
  ];

  return (
    <div className="space-y-12">
      
      {/* Overview header */}
      <div className="border-l-4 border-zru-green pl-4">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">HISTORY & HERITAGE</h2>
        <p className="text-sm text-white/50 mt-1">Revisiting 130 years of rugby tradition and Sables milestones.</p>
      </div>

      {/* Narrative */}
      <p className="text-white/80 leading-relaxed text-sm font-medium">
        Rugby has been played in Zimbabwe since the late 19th century. From the historic tours of the early 1900s to competing in the first two Rugby World Cups in 1987 and 1991, the Sables have consistently represented the highest standards of athleticism and passion. We celebrate our rugby heritage, honoring the veterans who paved the way and the rising talent writing the next chapters of our story.
      </p>

      {/* Timeline list */}
      <div className="pt-6 border-t border-white/5 space-y-8">
        <h3 className="text-lg font-black uppercase tracking-wide text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-zru-green" />
          <span>HISTORICAL MILESTONES</span>
        </h3>

        <div className="relative border-l border-white/10 pl-6 ml-4 space-y-8">
          {milestones.map((item, idx) => (
            <div key={idx} className="relative">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-zru-green rounded-full border-4 border-rich-black" />
              
              <div className="space-y-1.5">
                <span className="text-zru-green text-lg font-black italic tracking-tighter block">{item.year}</span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h4>
                <p className="text-white/60 text-xs leading-relaxed font-medium max-w-2xl">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

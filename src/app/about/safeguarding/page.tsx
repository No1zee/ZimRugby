import { Metadata } from "next";
import { Shield, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Safeguarding & Player Welfare | Zimbabwe Rugby Union",
  description: "ZRU's safeguarding policies, child protection procedures, and player welfare commitments.",
};

export default function SafeguardingPage() {
  const policies = [
    { title: "Child Protection Policy Statement", desc: "ZRU enforces strict vetting procedures for all coaches, referees, and team administrators working with minors." },
    { title: "Player Welfare & Concussion Protocols", desc: "We prioritize player health with mandatory 'Recognise and Remove' concussion guidelines and first-aid response on all club/school match days." },
    { title: "Code of Conduct & Anti-Bullying", desc: "Guidelines detailing the expected behavior of players, spectators, and officials, with zero tolerance for discrimination, abuse, or bullying." }
  ];

  return (
    <div className="space-y-10">
      
      {/* Overview header */}
      <div className="border-l-4 border-zru-green pl-4">
        <h2 className="text-2xl font-black uppercase tracking-wider text-rich-black">SAFEGUARDING & PLAYER WELFARE</h2>
        <p className="text-sm text-rich-black/50 mt-1">Inspired by SA Rugby safeguarding principles to protect our youth and players.</p>
      </div>

      <p className="text-rich-black/80 leading-relaxed text-sm font-normal">
        Zimbabwe Rugby Union treats the safety of every child, adolescent, and adult player as a non-negotiable. In alignment with World Rugby safeguarding standards, we maintain frameworks to prevent, report, and address abuse, harassment, and unsafe practice.
      </p>

      {/* Policies grid */}
      <div className="pt-5 border-t border-black/5 space-y-5">
        <h3 className="text-lg font-black uppercase tracking-wide text-rich-black flex items-center gap-2">
          <Shield className="w-5 h-5 text-zru-green" />
          <span>SAFEGUARDING PRINCIPLES</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {policies.map((p, idx) => (
            <div key={idx} className="bg-milk-white border border-black/5 rounded-2xl p-5 space-y-4 transition-[border-color,box-shadow] hover:border-zru-green/30 hover:shadow-md">
              <div className="w-10 h-10 bg-zru-green/10 rounded-xl flex items-center justify-center border border-zru-green/10 text-zru-green">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-rich-black uppercase tracking-tight leading-tight">{p.title}</h4>
              <p className="text-rich-black/60 text-xs leading-relaxed font-normal">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Reporting Form shell */}
      <div className="pt-7 border-t border-black/5">
        <div className="bg-[#004D2C] text-white rounded-3xl p-6 md:p-7 space-y-5 border border-white/10 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-300 border border-white/10 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white uppercase tracking-wide">CONFIDENTIAL REPORTING PORTAL</h3>
              <p className="text-emerald-100 text-xs mt-1 font-normal leading-relaxed">
                If you have witnessed or suspect any safeguarding violations, child abuse, or player welfare issues, please report it immediately using our confidential channels.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider">
            <a 
              href="mailto:safeguarding@zimbabwerugby.co.zw" 
              className="bg-white/10 border border-white/10 hover:bg-white/15 text-white rounded-xl p-4 flex items-center justify-between transition-all"
            >
              <span>Email Confidential Officer</span>
              <Shield className="w-4 h-4 text-emerald-300" />
            </a>
            <div className="bg-black/10 border border-white/5 text-emerald-100 rounded-xl p-4 flex items-center justify-between">
              <span>Hotline: +263 (24) 275 9999</span>
              <HelpCircle className="w-4 h-4 text-emerald-300" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

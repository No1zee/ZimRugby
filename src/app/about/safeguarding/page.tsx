import { Shield, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

export default function SafeguardingPage() {
  const policies = [
    { title: "Child Protection Policy Statement", desc: "ZRU enforces strict vetting procedures for all coaches, referees, and team administrators working with minors." },
    { title: "Player Welfare & Concussion Protocols", desc: "We prioritize player health with mandatory 'Recognise and Remove' concussion guidelines and first-aid response on all club/school match days." },
    { title: "Code of Conduct & Anti-Bullying", desc: "Guidelines detailing the expected behavior of players, spectators, and officials, with zero tolerance for discrimination, abuse, or bullying." }
  ];

  return (
    <div className="space-y-12">
      
      {/* Overview header */}
      <div className="border-l-4 border-zru-green pl-4">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">SAFEGUARDING & PLAYER WELFARE</h2>
        <p className="text-sm text-white/50 mt-1">Inspired by SA Rugby safeguarding principles to protect our youth and players.</p>
      </div>

      <p className="text-white/80 leading-relaxed text-sm font-medium">
        Zimbabwe Rugby Union believes that the safety and well-being of all children, adolescents, and adult players is of paramount importance. In alignment with global safeguarding standards, we maintain strict compliance frameworks to prevent, report, and address any forms of abuse, harassment, or unsafe practice.
      </p>

      {/* Policies grid */}
      <div className="pt-6 border-t border-white/5 space-y-6">
        <h3 className="text-lg font-black uppercase tracking-wide text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-zru-green" />
          <span>SAFEGUARDING PRINCIPLES</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {policies.map((p, idx) => (
            <div key={idx} className="card-green border rounded-2xl p-6 space-y-4 transition-all">
              <div className="w-10 h-10 bg-zru-green/20 rounded-xl flex items-center justify-center border border-zru-green/20 text-zru-green">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-white uppercase tracking-tight leading-tight">{p.title}</h4>
              <p className="text-white/60 text-xs leading-relaxed font-medium">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Reporting Form shell */}
      <div className="pt-8 border-t border-white/5">
        <div className="card-green border rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-zru-red/20 rounded-xl flex items-center justify-center text-zru-red border border-zru-red/10 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white uppercase tracking-wide">CONFIDENTIAL REPORTING PORTAL</h3>
              <p className="text-white/50 text-xs mt-1 font-medium leading-relaxed">
                If you have witnessed or suspect any safeguarding violations, child abuse, or player welfare issues, please report it immediately using our confidential channels.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider">
            <a 
              href="mailto:safeguarding@zimbabwerugby.co.zw" 
              className="card-green border hover:border-zru-green hover:bg-zru-green/10 text-white rounded-xl p-4 flex items-center justify-between transition-all"
            >
              <span>Email Confidential Officer</span>
              <Shield className="w-4 h-4 text-zru-green" />
            </a>
            <div className="card-green border text-white/60 rounded-xl p-4 flex items-center justify-between">
              <span>Hotline: +263 (24) 275 9999</span>
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

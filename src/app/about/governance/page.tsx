import { Landmark, FileText, Download } from "lucide-react";

export default function GovernancePage() {
  const documents = [
    { title: "ZRU Constitution (2020 Amendment)", type: "PDF Document", size: "2.4 MB" },
    { title: "Strategic Vision Plan 2024 - 2028", type: "PDF Document", size: "4.1 MB" },
    { title: "ZRU Code of Conduct & Integrity Guidelines", type: "PDF Document", size: "1.2 MB" },
    { title: "Anti-Doping Compliance Policy Statement", type: "PDF Document", size: "850 KB" }
  ];

  return (
    <div className="space-y-12">
      
      {/* Overview header */}
      <div className="border-l-4 border-zru-green pl-4">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">GOVERNANCE & COMPLIANCE</h2>
        <p className="text-sm text-white/50 mt-1">Official constitution, transparency reports, and administrative files.</p>
      </div>

      <p className="text-white/80 leading-relaxed text-sm font-medium">
        The Zimbabwe Rugby Union is committed to the highest standards of transparency, integrity, and ethical governance. We operate in alignment with the guidelines established by World Rugby, Rugby Africa, and the Sports and Recreation Commission (SRC) of Zimbabwe.
      </p>

      {/* Constitution downloads */}
      <div className="pt-6 border-t border-white/5 space-y-6">
        <h3 className="text-lg font-black uppercase tracking-wide text-white flex items-center gap-2">
          <Landmark className="w-5 h-5 text-zru-green" />
          <span>OFFICIAL CONSTITUTIONAL DOCUMENTS</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc, idx) => (
            <div 
              key={idx} 
              className="card-green border rounded-xl p-5 flex items-center justify-between group transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zru-green/10 rounded-lg flex items-center justify-center shrink-0 border border-zru-green/10">
                  <FileText className="w-5 h-5 text-zru-green" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white uppercase tracking-tight">{doc.title}</h4>
                  <span className="text-[10px] text-white/40 font-bold uppercase block mt-0.5">{doc.type} • {doc.size}</span>
                </div>
              </div>
              
              <button 
                className="p-2.5 rounded-full bg-white/10 border border-white/10 hover:bg-zru-green hover:text-rich-black transition-all group-hover:scale-105"
                title="Download Document"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

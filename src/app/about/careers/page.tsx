import { Metadata } from "next";
import { Briefcase, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers & Vacancies | Zimbabwe Rugby Union",
  description: "Join the Zimbabwe Rugby Union team. View current job openings and internship opportunities.",
};

export default function CareersPage() {
  const jobs = [
    { title: "High-Performance Analyst (Internship)", department: "Elite Sables Program", location: "Harare", type: "Full-Time (6 Months)" },
    { title: "Youth Development Officer", department: "Grassroots Development", location: "Bulawayo & Midlands", type: "Full-Time" },
    { title: "Provincial Referee Coordinator", department: "ZRU Referees Committee", location: "National", type: "Part-Time" }
  ];

  return (
    <div className="space-y-12">
      
      {/* Overview header */}
      <div className="border-l-4 border-zru-green pl-4">
        <h2 className="text-2xl font-black uppercase tracking-wider text-rich-black">CAREERS & VACANCIES</h2>
        <p className="text-sm text-rich-black/50 mt-1">Join the team building the future of rugby in Zimbabwe.</p>
      </div>

      <p className="text-rich-black/80 leading-relaxed text-sm font-normal">
        At the Zimbabwe Rugby Union, we believe in professionalism, innovation, and passion. We look for dedicated professionals and aspiring sports administrators who want to make a difference in African rugby. Check out our open roles below.
      </p>

      {/* Jobs list */}
      <div className="pt-6 border-t border-black/5 space-y-6">
        <h3 className="text-lg font-black uppercase tracking-wide text-rich-black flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-zru-green" />
          <span>CURRENT VACANCIES</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job, idx) => (
            <div 
              key={idx} 
              className="bg-milk-white border border-black/5 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group transition-[border-color,box-shadow] duration-300 hover:border-zru-green/30 hover:shadow-md"
            >
              <div>
                <h4 className="font-black text-sm text-rich-black uppercase tracking-tight">{job.title}</h4>
                <span className="text-[10px] text-rich-black/45 font-bold uppercase block mt-0.5">{job.department} • {job.location} • {job.type}</span>
              </div>
              
              <a 
                href="mailto:careers@zimbabwerugby.co.zw" 
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zru-green hover:text-zru-green/80 transition-colors group-hover:gap-3 shrink-0"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
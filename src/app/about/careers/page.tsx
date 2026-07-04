import { Briefcase, ArrowRight } from "lucide-react";

export default function CareersPage() {
  const jobs = [
    { title: "High-Performance Analyst (Internship)", department: "Elite Sables Program", location: "Harare", type: "Full-Time (6 Months)" },
    { title: "Youth Development Officer", department: "Grassroots Development", location: "Bulawayo & Midlands", type: "Full-Time" },
    { title: "Provincial Referee Coordinator", department: "ZRU Referees Committee", location: "National", type: "Part-Time" }
  ];

  return (
    <div className="space-y-12">
      
      {/* Overview header */}
      <div className="border-l-4 border-zru-gold pl-4">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">CAREERS & VACANCIES</h2>
        <p className="text-sm text-white/50 mt-1">Join the team building the future of rugby in Zimbabwe.</p>
      </div>

      <p className="text-white/80 leading-relaxed text-sm font-medium">
        At the Zimbabwe Rugby Union, we believe in professionalism, innovation, and passion. We look for dedicated professionals and aspiring sports administrators who want to make a difference in African rugby. Check out our open roles below.
      </p>

      {/* Jobs list */}
      <div className="pt-6 border-t border-white/5 space-y-6">
        <h3 className="text-lg font-black uppercase tracking-wide text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-zru-gold" />
          <span>CURRENT VACANCIES</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group transition-colors duration-300"
            >
              <div>
                <h4 className="font-black text-sm text-white uppercase tracking-tight">{job.title}</h4>
                <span className="text-[10px] text-white/40 font-bold uppercase block mt-0.5">{job.department} • {job.location} • {job.type}</span>
              </div>
              
              <a 
                href="mailto:careers@zimbabwerugby.co.zw" 
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zru-gold hover:text-white transition-colors group-hover:gap-3 shrink-0"
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
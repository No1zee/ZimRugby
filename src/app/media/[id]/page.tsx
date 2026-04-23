import { getReportById, getLatestReports } from "@/lib/data-fetcher";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Calendar } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ReportPage({ params }: { params: { id: string } }) {
  const report = await getReportById(params.id);
  
  if (!report) {
    notFound();
  }

  const reports = await getLatestReports();
  const relatedReports = reports
    .filter(r => r.id !== report.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-rich-black text-white selection:bg-clubhouse-gold selection:text-black">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        <Image
          src={report.image}
          alt={report.title}
          fill
          priority
          className="object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 md:pb-24 max-w-7xl mx-auto w-full">
          <Link 
            href="/media" 
            className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-10 transition-all hover:gap-5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to The Wire
          </Link>
          
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <span className="bg-clubhouse-gold text-black px-6 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              {report.category}
            </span>
            <div className="flex items-center gap-3 text-white/40 text-[10px] font-bold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 text-clubhouse-gold" />
              <span>{report.date}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>5 Min Read</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic mb-4 max-w-5xl text-glow-heavy">
            {report.title}
          </h1>
        </div>
      </div>

      {/* Article Content */}
      <section className="relative z-10 px-6 py-24 bg-rich-black">
        <div className="max-w-4xl mx-auto">
          {/* Author / Social Meta */}
          <div className="flex items-center justify-between py-10 border-y border-white/5 mb-20">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-clubhouse-gold/20 to-transparent flex items-center justify-center border border-clubhouse-gold/20 group">
                <span className="text-clubhouse-gold font-black text-xl group-hover:scale-110 transition-transform">ZR</span>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Zimbabwe Rugby Media</p>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Department of Heritage & Communication</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center group">
                <Share2 className="w-4 h-4 text-white/40 group-hover:text-clubhouse-gold" />
              </button>
            </div>
          </div>

          {/* Body Typography */}
          <div className="space-y-12">
            <p className="text-2xl md:text-3xl font-medium text-white/90 leading-relaxed italic border-l-4 border-clubhouse-gold pl-10 mb-16 py-2">
              {report.excerpt}
            </p>
            
            <div className="prose prose-invert prose-2xl max-w-none text-white/70 leading-[1.8] font-medium tracking-tight whitespace-pre-wrap">
              {report.content}
            </div>
            
            {/* Call to action for the jersey */}
            {report.id === 'heritage-1991' && (
              <div className="mt-20 p-1 bg-linear-to-r from-clubhouse-gold/50 via-clubhouse-gold/20 to-transparent rounded-3xl">
                <div className="bg-rich-black rounded-[22px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 border border-white/5">
                  <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                     <Image 
                        src="/images/media/1991-jersey-original.jpg" 
                        alt="1991 Jersey Detail" 
                        fill 
                        className="object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all opacity-80"
                     />
                     <div className="absolute inset-0 border-2 border-clubhouse-gold/20 rounded-2xl" />
                  </div>
                  <div className="space-y-6 text-center md:text-left">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Own a Piece of <span className="text-clubhouse-gold">History</span></h2>
                    <p className="text-white/60 text-lg">The 1991 Heritage Jersey is available now in limited quantities. Every stitch tells a story of pride, passion, and the indestructible Sable spirit.</p>
                    <Link href="/shop" className="inline-flex items-center gap-4 bg-clubhouse-gold text-black px-10 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-full hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
                      Visit Clubhouse Store <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Tags */}
          <div className="mt-32 pt-12 border-t border-white/5 flex flex-wrap gap-4">
             {["Sables", "Heritage", "World Cup", "History", "The 1991 Era"].map(tag => (
               <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:border-clubhouse-gold/40 transition-colors cursor-default">
                 #{tag}
               </span>
             ))}
          </div>
        </div>
      </section>

      {/* More from The Wire */}
      <section className="py-32 px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              KEEP <br /><span className="text-stroke-white text-transparent">READING</span>
            </h2>
            <Link href="/media" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors pb-2">
              View All News
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {relatedReports.map(item => (
              <Link key={item.id} href={`/media/${item.id}`} className="group block space-y-6">
                <div className="relative aspect-video overflow-hidden rounded-3xl bg-neutral-900 border border-white/5 transition-all group-hover:border-clubhouse-gold/30 group-hover:-translate-y-2">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-50 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-clubhouse-gold">{item.category}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{item.date}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight leading-none group-hover:text-clubhouse-gold transition-colors italic">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
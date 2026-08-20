import Image from "next/image";
import { Calendar, Clock } from "lucide-react";

interface ArticleHeroProps {
  title: string;
  image: string;
  category: string;
  date: string;
  readingMinutes: number;
}

export default function ArticleHero({
  title,
  image,
  category,
  date,
  readingMinutes,
}: ArticleHeroProps) {
  return (
    <section className="relative min-h-[44vh] md:min-h-[50vh] flex items-end pt-40 md:pt-48 pb-14 bg-rich-black rounded-b-[40px] overflow-hidden">
      {/* Background Image / Ambient Gradient with Noise */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src={image}
          alt={title}
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-60"
          unoptimized={image.startsWith("/images/legacy-articles/")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/70 to-rich-black/30" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-15" />
        
        {/* Subtle decorative green glow line matching PageHero */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-zru-green/50 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-4xl space-y-4">
          {/* Category Tag Pill */}
          <div className="inline-block bg-zru-green text-white font-black text-[10px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-full shadow-md">
            {category}
          </div>

          {/* Headline (Clean official typography, no italic slant, high legibility) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05] drop-shadow-sm">
            {title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-white/60 text-xs font-bold uppercase tracking-widest pt-2">
            <span className="flex items-center gap-1.5 text-white/80">
              <Calendar className="w-4 h-4 text-zru-green" />
              {date}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5 text-white/80">
              <Clock className="w-4 h-4 text-zru-green" />
              {readingMinutes} MIN READ
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

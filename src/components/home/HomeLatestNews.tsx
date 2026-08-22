"use client";

import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { KineticHeading } from "@/components/ui/KineticHeading";
import type { Report } from "@/lib/data-fetcher";

interface HomeLatestNewsProps {
  news: Report[];
}

export default function HomeLatestNews({ news = [] }: HomeLatestNewsProps) {
  if (!news || news.length === 0) return null;

  const featured = news[0];
  const secondary = news.slice(1, 4);

  return (
    <section className="py-12 sm:py-16 bg-milk-white text-black relative select-none border-b border-black/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <div className="heading-plate">
              <KineticHeading
                text="LATEST"
                accentText="NEWS & STORIES"
                as="h2"
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase text-rich-black tracking-tight leading-[1.05]"
                accentClassName="text-zru-green ml-2 sm:ml-3"
              />
            </div>
          </div>

          <Link
            href="/media"
            className="group inline-flex items-center gap-2 text-xs font-heading font-black tracking-widest uppercase text-zru-green hover:text-black transition-colors self-start sm:self-auto py-1"
          >
            <span>VIEW ALL NEWS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* News Grid Layout: 1 Large Spotlight Hero Card + 3 Stacked Secondary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Featured Article (Span 7) */}
          {featured && (
            <Link
              href={featured.url}
              className="lg:col-span-7 group relative bg-white rounded-3xl border border-black/10 overflow-hidden shadow-md hover:shadow-2xl hover:border-zru-green/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-rich-black/40">
                {featured.image ? (
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <Newspaper className="w-12 h-12 text-black/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Categories & Date Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="flex flex-wrap gap-1.5">
                    {(featured.categories && featured.categories.length > 0
                      ? featured.categories
                      : [featured.category || "ZRU"]
                    ).map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-zru-green text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {featured.date && (
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                      {featured.date}
                    </span>
                  )}
                </div>

                {/* Bottom title preview on image for mobile */}
                <div className="absolute bottom-4 left-4 right-4 z-10 md:hidden">
                  <h3 className="font-heading font-black text-xl text-white leading-tight line-clamp-2 drop-shadow-md">
                    {featured.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-3 hidden md:block">
                <h3 className="font-heading font-black text-2xl lg:text-3xl text-black uppercase leading-snug group-hover:text-zru-green transition-colors line-clamp-2">
                  {featured.title}
                </h3>
                <p className="text-black/70 text-sm leading-relaxed line-clamp-3">
                  {featured.excerpt || featured.content}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-black text-zru-green uppercase tracking-wider">
                  <span>Read Full Coverage</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          )}

          {/* Secondary Stack (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {secondary.map((article) => {
              const cats = article.categories && article.categories.length > 0
                ? article.categories
                : [article.category || "ZRU"];

              return (
                <Link
                  key={article.id}
                  href={article.url}
                  className="group bg-white rounded-2xl border border-black/10 p-4 sm:p-5 hover:border-zru-green/40 hover:shadow-lg transition-all duration-300 flex items-center gap-4 flex-1"
                >
                  <div className="relative w-28 sm:w-32 h-24 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-rich-black/40">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 120px, 150px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Newspaper className="w-6 h-6 text-black/20" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {cats.map((cat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-zru-green/10 text-zru-green border border-zru-green/20"
                        >
                          {cat}
                        </span>
                      ))}
                      {article.date && (
                        <span className="text-black/40 text-[10px] font-bold uppercase tracking-wider ml-1">
                          {article.date}
                        </span>
                      )}
                    </div>

                    <h4 className="font-heading font-black text-sm sm:text-base text-black uppercase leading-snug group-hover:text-zru-green transition-colors line-clamp-2">
                      {article.title}
                    </h4>

                    <span className="text-[11px] font-black text-zru-green uppercase tracking-wider flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

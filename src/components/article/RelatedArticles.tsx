import Link from "next/link";
import Image from "next/image";
import type { Report } from "@/lib/data-fetcher";

interface RelatedArticlesProps {
  items: Report[];
}

export default function RelatedArticles({ items }: RelatedArticlesProps) {
  if (!items.length) return null;

  return (
    <section className="bg-[#f5f3ef] py-20 px-6 border-t border-neutral-200">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none text-neutral-900">
            Keep{" "}
            <span className="text-stroke-zru-green text-transparent [-webkit-text-stroke:2px_#006B3F]">
              Reading
            </span>
          </h2>
          <Link
            href="/media"
            className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-zru-green transition-colors pb-1"
          >
            View All News →
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/media/${item.id}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-zru-green/40 hover:shadow-md transition-all"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-neutral-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={item.image.includes("zru.co.zw")}
                />
              </div>

              {/* Meta */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zru-green">
                    {item.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    {item.date}
                  </span>
                </div>
                <h3 className="text-base font-black uppercase tracking-tight leading-snug text-neutral-900 group-hover:text-zru-green transition-colors line-clamp-3">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

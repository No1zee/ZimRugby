import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const mockStories = [
  {
    id: "featured-1",
    title: "Sables Prepare For Africa Cup Defense",
    excerpt: "Zimbabwe's senior men's national team enters a pivotal block of preparation as they look to retain the Africa Cup title.",
    image: "/images/gallery/zimbabwe-sables-0351.webp",
    category: "SABLES",
    date: "OCTOBER 12, 2026",
  },
  {
    id: "mini-1",
    title: "U20 Barthes Trophy Squad Announced",
    excerpt: "The Junior Sables squad for the upcoming Barthes Trophy has been finalized.",
    image: "/images/gallery/zimbabwe-sables-0350.webp",
    category: "U20",
    date: "OCTOBER 8, 2026",
  },
  {
    id: "mini-2",
    title: "New Grassroots Pathway Partnership",
    excerpt: "ZRU signs landmark partnership to develop rugby at the provincial level.",
    image: "/images/gallery/zimbabwe-sables-0349.webp",
    category: "DEVELOPMENT",
    date: "OCTOBER 3, 2026",
  },
];

export default function NewsBentoBrief() {
  const featured = mockStories[0];
  const smaller = mockStories.slice(1);

  return (
    <section className="px-6 lg:px-12 py-16 bg-milk-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green">
              LATEST NEWS
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase text-rich-black tracking-tight mt-2">
              BRIEFING
            </h2>
          </div>
          <Link
            href="/media"
            className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zru-green hover:underline"
          >
            VIEW ALL NEWS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Story (spans 2 cols) */}
          <Link
            href={`/media/${featured.id}`}
            className="md:col-span-2 relative group overflow-hidden rounded-2xl min-h-[400px]"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rich-black/90 via-rich-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
              <span className="bg-zru-green text-white px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm inline-block mb-4">
                {featured.category}
              </span>
              <h3 className="font-heading text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight mb-3">
                {featured.title}
              </h3>
              <p className="text-white/70 text-sm max-w-xl line-clamp-2">{featured.excerpt}</p>
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zru-green mt-4 group-hover:gap-3 transition-all">
                READ FULL STORY <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Side Stories Stack */}
          <div className="flex flex-col gap-6">
            {smaller.map((story) => (
              <Link
                key={story.id}
                href={`/media/${story.id}`}
                className="relative group overflow-hidden rounded-2xl flex-1 min-h-[180px]"
              >
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rich-black/90 via-rich-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="bg-zru-green text-white px-3 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-sm inline-block mb-2">
                    {story.category}
                  </span>
                  <h4 className="font-heading text-lg font-black uppercase tracking-tight text-white leading-tight group-hover:text-zru-green transition-colors">
                    {story.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/media"
          className="md:hidden flex items-center justify-center gap-2 mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-zru-green"
        >
          VIEW ALL NEWS <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

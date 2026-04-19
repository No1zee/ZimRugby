"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * JournalStrip
 * 
 * A high-end, directorial editorial strip.
 * Uses clip-path reveals and staggered grid layout.
 */

const journalPosts = [
  {
    tag: "The Long Read",
    title: "The Golden Era: Sables 1991",
    excerpt: "A deep dive into the squad that defined a decade of Zimbabwean rugby dominance, from the dusty pitches of Harare to the global stage.",
    image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=1200",
    alt: "Zimbabwe Sables historic match action",
    date: "MAR 15, 2026",
    readTime: "8 MIN READ",
    isFeatured: true,
  },
  {
    tag: "Inside the Camp",
    title: "The Bulawayo Bullet",
    excerpt: "Meet the winger who&apos;s clocked the fastest 40m in the history of the Sables academy.",
    image: "https://images.unsplash.com/photo-1544691371-314f9da7d62a?auto=format&fit=crop&q=80&w=800",
    alt: "Sables player in training",
    date: "APR 02, 2026",
    readTime: "3 MIN READ",
  },
  {
    tag: "Tactical Analysis",
    title: "The Hartsfield Fortress",
    excerpt: "Why the Bulawayo ground remains the most intimidating fixture in African rugby.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
    alt: "Hartsfield Rugby Ground atmosphere",
    date: "APR 10, 2026",
    readTime: "5 MIN READ",
  },
];

export default function JournalStrip() {
  return (
    <section className="bg-white py-32 px-6 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header: Directorial Entrance */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-[1.5px] bg-clubhouse-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold">
              Editorial Volume 04 • Our Rugby Magazine
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-clubhouse-charcoal leading-none"
          >
            THE <span className="text-stroke-charcoal text-transparent">JOURNAL</span>
          </motion.h2>
        </div>

        {/* The Grid: Featured + Secondary */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Featured Post */}
          <div className="lg:w-7/12">
            {journalPosts.filter(p => p.isFeatured).map((post) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer"
              >
                <Link href="/journal" className="block">
                  <div className="relative aspect-video mb-12 overflow-hidden bg-neutral-100 rounded-lg">
                    <div className="absolute top-6 left-6 z-30 bg-clubhouse-charcoal text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded">
                      Featured Story
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="relative w-full h-full transition-transform"
                    >
                      <Image 
                        src={post.image} 
                        alt={post.alt || post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1200px) 100vw, 60vw"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="space-y-6 max-w-2xl">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-clubhouse-gold">
                        {post.tag}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-clubhouse-gold/30" />
                      <span className="text-[9px] font-bold text-clubhouse-charcoal/40 uppercase tracking-widest">{post.date} • {post.readTime}</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-clubhouse-charcoal group-hover:text-clubhouse-gold transition-colors leading-[0.9]">
                      {post.title}
                    </h3>
                    <p className="text-lg md:text-xl text-clubhouse-charcoal/60 font-medium leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="pt-4 flex items-center gap-4 group-hover:gap-6 transition-all">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-charcoal">Read Analysis</span>
                       <div className="h-px flex-1 bg-clubhouse-charcoal/10" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Secondary Posts Stack */}
          <div className="lg:w-5/12 space-y-20">
            {journalPosts.filter(p => !p.isFeatured).map((post) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer"
              >
                <Link href="/journal" className="flex flex-col sm:flex-row gap-8">
                  <div className="relative w-full sm:w-40 aspect-square shrink-0 overflow-hidden rounded bg-neutral-100">
                    <Image 
                      src={post.image} 
                      alt={post.alt || post.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                      sizes="160px"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black uppercase tracking-widest text-clubhouse-gold">{post.tag}</span>
                       <div className="w-1 h-1 rounded-full bg-clubhouse-gold/30" />
                       <span className="text-[9px] font-bold text-clubhouse-charcoal/40 uppercase tracking-widest">{post.date} • {post.readTime}</span>
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight text-clubhouse-charcoal group-hover:text-clubhouse-gold transition-colors leading-tight">
                      {post.title}
                    </h4>
                    <p className="text-sm text-clubhouse-charcoal/60 font-medium line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-10 border-t border-neutral-100"
            >
              <Link href="/journal" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-charcoal hover:text-clubhouse-gold transition-colors">
                All Stories <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform inline-block" />
              </Link>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}

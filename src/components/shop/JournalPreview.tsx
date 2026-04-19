"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const journalPosts = [
  {
    tag: "Feature",
    title: "The Sables No. 10: Behind the Jersey",
    excerpt: "An intimate look at the preparation and passion of Zimbabwe's leading fly-half.",
    image: "/images/clubhouse/journal-1.jpg",
  },
  {
    tag: "Guide",
    title: "Kit Care: Preserving Elite Performance",
    excerpt: "How to maintain the breathability and structural integrity of your matchday gear.",
    image: "/images/clubhouse/journal-2.jpg",
  },
  {
    tag: "BTS",
    title: "From Harare to Bulawayo: The Tour",
    excerpt: "Behind the scenes of the national team's regional development series.",
    image: "/images/clubhouse/journal-3.jpg",
  },
];

export default function JournalPreview() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-16">
          <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-4">
            Editorial
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-clubhouse-charcoal mb-4">
            The Journal
          </h2>
          <Link href="/clubhouse/journal" className="text-[10px] font-black uppercase tracking-widest text-clubhouse-charcoal/40 border-b border-clubhouse-charcoal/20 pb-1 hover:text-clubhouse-gold transition-colors">
            View All Stories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {journalPosts.map((post, idx) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-video bg-gray-100 overflow-hidden mb-8 relative">
                <div className="absolute inset-0 bg-clubhouse-charcoal/5 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute inset-0 bg-gray-200 transition-transform duration-700 group-hover:scale-105" />
              </div>
              
              <div className="space-y-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-clubhouse-gold">
                  {post.tag}
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-clubhouse-charcoal group-hover:text-clubhouse-gold transition-colors leading-[1.2]">
                  {post.title}
                </h3>
                <p className="text-sm text-clubhouse-charcoal/60 leading-relaxed font-medium">
                  {post.excerpt}
                </p>
                <div className="pt-2">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-clubhouse-charcoal pb-1 border-b border-clubhouse-charcoal/10">
                    Read More
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

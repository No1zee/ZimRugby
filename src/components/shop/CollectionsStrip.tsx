"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const collections = [
  {
    id: "match-kits",
    title: "Authentic Match Kits",
    subtitle: "PRO-VENT MESH TECHNOLOGY",
    image: "/images/hero/lady-sables.webp",
    aspect: "md:col-span-8 h-96",
    href: "/clubhouse/kits",
  },
  {
    id: "lifestyle",
    title: "Clubhouse Lifestyle",
    subtitle: "HEAVYWEIGHT OXFORD COTTON",
    image: "/images/shop/2.webp",
    aspect: "md:col-span-4 h-96",
    href: "/clubhouse/lifestyle",
  },
  {
    id: "travel-gear",
    title: "Travel & Gear",
    subtitle: "CORDURA WATERPROOF DENSITY",
    image: "/images/shop/3.webp",
    aspect: "md:col-span-5 h-96",
    href: "/clubhouse/gear",
  },
  {
    id: "accessories",
    title: "Accessories & Crests",
    subtitle: "WOVEN SCARVES & EMBROIDERED PINS",
    image: "/images/shop/1.webp",
    aspect: "md:col-span-7 h-96",
    href: "/clubhouse/accessories",
  },
];

export default function CollectionsStrip() {
  return (
    <section id="collections-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto bg-milk-white">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <span className="label block mb-2">CURATED COLLECTIONS</span>
          <h2 className="heading-1 text-black">FLAGSHIP CATEGORIES</h2>
        </div>
        <p className="body-base text-black/70 max-w-md">
          Explore official union gear, engineered for world-class performance on the pitch and timeless elegance off it.
        </p>
      </div>

      {/* Asymmetric 4-Tile Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {collections.map((col, idx) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`relative group overflow-hidden rounded-xl border border-black/10 hover:border-zru-green/60 shadow-md hover:shadow-xl transition-all duration-500 bg-white ${col.aspect}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={col.image}
                alt={col.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
            </div>

            {/* Tile Label & Arrow */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zru-green block mb-1">
                  {col.subtitle}
                </span>
                <h3 className="heading-2 text-white">{col.title}</h3>
              </div>
              <Link
                href={col.href}
                className="w-12 h-12 rounded-full bg-zru-green text-white flex items-center justify-center group-hover:bg-white group-hover:text-zru-green transition-all duration-300 transform group-hover:scale-110 shadow-lg"
              >
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

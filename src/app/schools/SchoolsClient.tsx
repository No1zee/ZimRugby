"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Trophy, Users, ShieldCheck, Mail } from "lucide-react";
import CmsHero from "@/components/cms/CmsHero";
import type { PageData } from "@/lib/api/pages";
import type { SchoolInitiative } from "@/lib/api/schools";

const iconMap: Record<string, React.ElementType> = {
  Trophy, Users, ShieldCheck, GraduationCap,
};

interface SchoolsClientProps {
  cmsPage: PageData | null;
  initiatives: SchoolInitiative[];
}

export default function SchoolsClient({ cmsPage, initiatives }: SchoolsClientProps) {
  return (
    <main className="bg-milk-white min-h-screen pb-12">
      <CmsHero
        kicker={cmsPage?.hero_kicker || "Youth Development"}
        title={cmsPage?.hero_title || "School Rugby"}
        intro={cmsPage?.hero_intro || "The historic breeding ground of Zimbabwe Sables champions. Discover school leagues and development structures."}
        image={cmsPage?.hero_image || "/images/schools/schoolboy-action-1.jpg"}
        breadcrumb={[{ label: "Schools", href: "/schools" }]}
        pageId={cmsPage?.id}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl text-rich-black font-black uppercase tracking-wide">
              The Foundation of National Excellence
            </h2>
            <p className="text-rich-black/70 text-sm md:text-base font-body leading-relaxed">
              Zimbabwe school rugby is recognised for its intensity and depth, and has produced generations of Sables players. Schools rugby serves as the primary pipeline feeding our Junior Sables (U20) and elite senior squads.
            </p>
            <p className="text-rich-black/70 text-sm md:text-base font-body leading-relaxed">
              ZRU oversees school structures across all ten provinces, organizing leagues, certifying schoolmasters, enforcing strict age-grade regulations, and ensuring medical safety compliance at all schoolboy fixtures.
            </p>
          </div>
          <div className="lg:col-span-5 p-5 bg-zru-green/5 border border-zru-green/10 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-zru-green/10 border border-zru-green/20 flex items-center justify-center text-zru-green">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl text-rich-black font-black uppercase tracking-wide">
              Schoolboys Pathway
            </h3>
            <ul className="space-y-3 text-sm text-rich-black/70 font-body">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zru-green shrink-0" />
                Under-14: Foundation & Skills
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zru-green shrink-0" />
                Under-16: Tactical Development
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zru-green shrink-0" />
                Under-18: Elite (Craven Week & Academy)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zru-green shrink-0" />
                Under-20: Junior Sables Selection
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-zru-green font-heading block mb-1">
                NATIONAL SCHOOLS CHAMPIONSHIPS
              </span>
              <h2 className="font-heading text-2xl md:text-3xl text-rich-black font-black uppercase tracking-wide">
                Live Schoolboy Rugby Action
              </h2>
            </div>
            <p className="text-sm text-rich-black/60 font-body max-w-md">
              High-intensity action and sportsmanship from the national schoolboy rugby tournaments across Zimbabwe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { src: "/images/schools/schoolboy-action-1.jpg", label: "National Super 8 Fixtures", tag: "MATCH ACTION", alt: "Schoolboy Rugby Action - Breakaway Play" },
              { src: "/images/schools/schoolboy-team-group.jpg", label: "Combined Schools Squad", tag: "UNITY & CAMARADERIE", alt: "Schoolboy Rugby Squad - Post Match Group Photo" },
              { src: "/images/schools/schoolboy-lineout.jpg", label: "Set Piece Lineout Mastery", tag: "AIRBORNE INTENSITY", alt: "Schoolboy Rugby Lineout Jump Action" },
            ].map((img) => (
              <div key={img.src} className="group relative h-72 rounded-2xl overflow-hidden shadow-md border border-black/5">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-zru-green block">{img.tag}</span>
                    <h4 className="font-heading text-lg text-white font-black uppercase italic">{img.label}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {initiatives.map((item) => {
            const Icon = iconMap[item.icon || ""] || GraduationCap;
            return (
              <div
                key={item.id}
                className="p-5 bg-white border border-black/5 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-xl bg-zru-green/5 border border-zru-green/10 flex items-center justify-center text-zru-green">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-zru-green bg-zru-green/5 border border-zru-green/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.stat}
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-heading text-xl text-rich-black font-black uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-rich-black/60 text-sm font-body leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 md:p-7 bg-rich-black rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.12),transparent_70%)]" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-[10px] font-black text-zru-green uppercase tracking-[0.3em]">Schools Association</span>
            <h2 className="font-heading text-3xl md:text-4xl text-white font-black uppercase tracking-wide leading-tight">
              Get Your School Involved
            </h2>
            <p className="text-white/60 text-sm font-body leading-relaxed">
              Register your school with the ZRU Schools Rugby Association to receive training equipment, gain access to coaching certifications, and enter regional festivals and leagues.
            </p>
            <div className="pt-4">
              <a
                href="mailto:schools@zru.co.zw"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-zru-green hover:bg-zru-green/90 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                Register School <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Briefcase, Mail, Phone, ExternalLink, Award, Sparkles, ShieldAlert } from "lucide-react";

export default function PartnersPage() {
  const principalSponsors = [
    {
      name: "Nedbank Zimbabwe",
      role: "Official Principal Sponsor & Banking Partner",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Nedbank_Logo.svg",
      desc: "Nedbank Zimbabwe is the headline sponsor of the Zimbabwe Sables senior men's rugby program, funding elite training campaigns, coaching staff, and developmental pathway clinics.",
      siteUrl: "https://www.nedbank.co.zw"
    }
  ];

  const officialPartners = [
    {
      name: "Delta Corporation",
      role: "Official Beverage Partner",
      logo: "https://flagcdn.com/w160/zw.png", // Placeholder or logo if available
      desc: "Supporting national tournament naming rights, club leagues, and spectator experiences across major test venues.",
      siteUrl: "#"
    },
    {
      name: "Gold Leaf Tobacco",
      role: "Commercial Partner",
      logo: "https://flagcdn.com/w160/zw.png",
      desc: "Funding regional development academies and domestic club league operations in Bulawayo and Harare.",
      siteUrl: "#"
    }
  ];

  const technicalSuppliers = [
    { name: "Canterbury", role: "Official Kit Supplier" },
    { name: "Harare Sports Club", role: "Official Facility Partner" },
    { name: "Cimas", role: "Official Medical Partner" }
  ];

  const sponsorshipOpps = [
    { title: "National Team Sponsorship", desc: "Front-of-jersey branding, stadium signage, and media association with the reigning Africa Cup Champions (Sables)." },
    { title: "Grassroots & Schools Rugby", desc: "Title sponsorship of the prestigious Schools Rugby Festival, supporting over 120 schools nationwide." },
    { title: "Digital & Broadcast Rights", desc: "Corporate sponsorship of ZRU TV highlights, social media streams, and live match broadcasts." }
  ];

  return (
    <main className="bg-rich-black min-h-screen pt-24 pb-24 text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Widescreen Hero Banner */}
        <section className="bg-zru-green relative overflow-hidden py-16 border border-white/10 rounded-3xl mb-16 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-pattern-diagonal-lines" />
          <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-zru-gold/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl pl-6 sm:pl-10">
            <span className="text-zru-gold text-xs font-black uppercase tracking-[0.4em] mb-3 block">
              CORPORATE SYNERGY
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              PARTNERS & SPONSORS
            </h1>
            <p className="text-white/80 text-sm md:text-base mt-4 font-medium leading-relaxed">
              Powering the game from grassroots to global success. ZRU proudly works with corporate leaders to sustain high-performance programs and grow rugby throughout Zimbabwe.
            </p>
          </div>
        </section>

        {/* 1. Principal Sponsors Section */}
        <section className="mb-20">
          <div className="border-l-4 border-zru-gold pl-4 mb-8">
            <h2 className="text-xl font-black uppercase tracking-wider text-white">PRINCIPAL PARTNER</h2>
            <p className="text-sm text-white/50 mt-1">Our headline sponsor funding the elite Sables campaigns.</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {principalSponsors.map((sponsor) => (
              <div 
                key={sponsor.name} 
                className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 hover:border-zru-gold/30 transition-all duration-500 glow-green-card"
              >
                {/* Logo wrapper */}
                <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center p-6 shrink-0 relative shadow-xl">
                  {sponsor.logo ? (
                    <div className="relative w-full h-full">
                      <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain" />
                    </div>
                  ) : (
                    <span className="text-black font-black text-2xl">{sponsor.name}</span>
                  )}
                </div>
                
                {/* Description */}
                <div className="space-y-4 flex-1">
                  <span className="bg-zru-gold text-rich-black px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider w-fit block">
                    {sponsor.role}
                  </span>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white">{sponsor.name}</h3>
                  <p className="text-white/70 text-base leading-relaxed font-medium">
                    {sponsor.desc}
                  </p>
                  
                  {sponsor.siteUrl !== "#" && (
                    <a 
                      href={sponsor.siteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-black uppercase text-zru-gold hover:text-white transition-colors tracking-widest pt-2"
                    >
                      <span>Visit Corporate Website</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Official Partners Grid */}
        <section className="mb-20">
          <div className="border-l-4 border-zru-gold pl-4 mb-8">
            <h2 className="text-xl font-black uppercase tracking-wider text-white">OFFICIAL PARTNERS</h2>
            <p className="text-sm text-white/50 mt-1">Corporate brands supporting domestic leagues and tournaments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {officialPartners.map((partner) => (
              <div 
                key={partner.name} 
                className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl group glow-green-card"
              >
                <div className="space-y-4">
                  <span className="bg-white/10 text-white px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider w-fit block">
                    {partner.role}
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-zru-gold transition-colors duration-300">
                    {partner.name}
                  </h3>
                  <p className="text-white/55 text-xs leading-relaxed font-medium">
                    {partner.desc}
                  </p>
                </div>
                
                {partner.siteUrl !== "#" && (
                  <a 
                    href={partner.siteUrl}
                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-zru-gold hover:text-white transition-colors tracking-widest pt-6 border-t border-white/5 mt-6"
                  >
                    <span>Visit Partner</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3. Technical Suppliers */}
        <section className="mb-20">
          <div className="border-l-4 border-zru-gold pl-4 mb-8">
            <h2 className="text-xl font-black uppercase tracking-wider text-white">SUPPLIERS & VENDORS</h2>
            <p className="text-sm text-white/50 mt-1">Brands supplying training gear, services, and facility access.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {technicalSuppliers.map((supplier) => (
              <div 
                key={supplier.name} 
                className="bg-white/5 border border-white/5 rounded-xl p-5 flex items-center gap-4 hover:border-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-zru-green/20 rounded-lg flex items-center justify-center border border-white/5 text-zru-gold shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white uppercase tracking-tight leading-tight">{supplier.name}</h4>
                  <span className="text-[10px] text-white/40 font-bold uppercase block mt-0.5">{supplier.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Sponsorship Opportunities Callout */}
        <section className="pt-8 border-t border-white/5">
          <div className="bg-linear-to-br from-zru-green/20 to-rich-black border border-white/10 rounded-3xl p-8 md:p-12 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-zru-gold/25 rounded-2xl flex items-center justify-center text-zru-gold border border-zru-gold/10 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">PARTNER WITH ZIMBABWE RUGBY</h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed max-w-2xl">
                  Align your brand with sports excellence. We provide tailored marketing associations, brand exposures, naming rights, and community development partnerships.
                </p>
              </div>
            </div>

            {/* Opportunities list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
              {sponsorshipOpps.map((opp, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-sm font-black text-zru-gold uppercase tracking-wide">{opp.title}</h4>
                  <p className="text-white/50 text-xs leading-relaxed font-medium">{opp.desc}</p>
                </div>
              ))}
            </div>

            {/* Contact details */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-zru-gold shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider text-white">ZRU Commercial Partnerships & Sponsorship Committee</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 text-xs font-black uppercase tracking-widest text-zru-gold">
                <a href="mailto:partnerships@zimbabwerugby.co.zw" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  <span>partnerships@zimbabwerugby.co.zw</span>
                </a>
                <span className="text-white/20 hidden sm:inline">|</span>
                <a href="tel:+263242751234" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  <span>+263 (24) 275 1234</span>
                </a>
              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}

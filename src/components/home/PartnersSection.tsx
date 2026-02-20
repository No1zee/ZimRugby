"use client";

import { motion } from "framer-motion";
import { Plus, Sparkles, Building2 } from "lucide-react";
import Link from "next/link";
import { ScrollReveal, StaggerContainer, staggerItemVariants, GlowButton } from "../ui/animations";

import Image from "next/image";

// Sponsor data with actual logos
const principalSponsors = [
  { name: "NEDBANK", color: "#00A651", logo: "/images/sponsors/nedbank.jpeg" },
  { name: "WORLD RUGBY", color: "#003DA5", logo: "/images/sponsors/world-rugby.png" },
  { name: "RUGBY AFRICA", color: "#ED1C24", logo: "/images/sponsors/rugby-africa.png" },
];

const partners = [
  { name: "ZOC", initial: "ZOC", logo: "/images/sponsors/zoc.png" },
  { name: "SRC", initial: "SRC", logo: "/images/sponsors/src.png" },
];

export default function PartnersSection() {
  return (
    <section className="bg-white py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-zru-gold" />
              <span className="text-zru-green text-xs font-bold uppercase tracking-widest">Our Supporters</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-zru-green uppercase mb-4">
              Sponsors & Partners
            </h2>
            <p className="text-gray-600 text-base max-w-lg mx-auto">
              Thank you to the organisations who support Zimbabwe Rugby and help grow the game nationwide.
            </p>
          </div>
        </ScrollReveal>

        {/* Principal Sponsors */}
        <ScrollReveal delay={0.1}>
          <div className="mb-12">
            <h3 className="text-center text-gray-500 font-bold tracking-widest text-xs uppercase mb-8">
              PRINCIPAL SPONSORS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {principalSponsors.map((sponsor, i) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <div 
                    className="h-24 rounded-xl flex items-center justify-center transition-all duration-300 border-2 border-gray-100 hover:border-gray-300 bg-linear-to-br from-gray-50 to-gray-100 hover:shadow-xl relative overflow-hidden"
                  >
                    {/* Colored accent line on hover */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                      style={{ backgroundColor: sponsor.color }}
                    />
                    {/* Logo or text */}
                    {sponsor.logo ? (
                       <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain p-4 mix-blend-multiply" />
                    ) : (
                      <span 
                        className="text-lg font-black text-gray-400 group-hover:text-gray-700 transition-colors tracking-wide"
                      >
                        {sponsor.name}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Partners & Suppliers */}
        <ScrollReveal delay={0.2}>
          <div className="mb-12">
            <h3 className="text-center text-gray-500 font-bold tracking-widest text-xs uppercase mb-8">
              PARTNERS AND SUPPLIERS
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {partners.map((partner, i) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="group cursor-pointer"
                >
                  <div className="h-20 px-8 rounded-lg flex items-center justify-center transition-all duration-300 border border-gray-100 hover:border-zru-gold/50 hover:shadow-md bg-white relative overflow-hidden">
                    {/* Official logo cutout */}
                    {partner.logo ? (
                      <div className="w-24 h-12 relative flex items-center justify-center">
                         <Image src={partner.logo} alt={partner.name} fill className="object-contain" />
                      </div>
                    ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 group-hover:bg-zru-gold/20 flex items-center justify-center transition-colors">
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-zru-green">
                          {partner.initial}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-500 group-hover:text-zru-green transition-colors hidden md:block">
                        {partner.name}
                      </span>
                    </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.3}>
          <div className="text-center">
            <Link href="/partners">
              <GlowButton 
                className="bg-zru-red hover:bg-red-700 text-white px-8 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mx-auto rounded transition-colors"
                glowColor="rgba(215, 25, 32, 0.3)"
              >
                <Building2 className="w-4 h-4" />
                Become a Partner
              </GlowButton>
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}

import React from 'react';
import { PartnerTier } from '../../data/partners';
import PartnerLogo from './PartnerLogo';

interface PartnerTierSectionProps {
  tier: PartnerTier;
  isAlternate: boolean;
}

export default function PartnerTierSection({ tier, isAlternate }: PartnerTierSectionProps) {
  return (
    <section className={`py-14 md:py-20 ${isAlternate ? 'bg-black/5' : 'bg-transparent'}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Category Badge */}
        <div className="mb-10 md:mb-14 flex flex-col items-center">
          <span className="text-zru-green font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-3">
            {tier.id.toUpperCase()}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-rich-black uppercase tracking-tight text-center">
            {tier.title}
          </h2>
          <div className="w-24 h-1 bg-zru-green mt-4 rounded-full" />
        </div>

        {/* Logos Grid */}
        <div className="w-full flex flex-wrap justify-center gap-8 md:gap-12 items-center">
          {tier.partners.map((partner) => (
            <PartnerLogo key={partner.id} partner={partner} />
          ))}
        </div>

      </div>
    </section>
  );
}

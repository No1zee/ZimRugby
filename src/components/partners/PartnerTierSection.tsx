import React from 'react';
import { PartnerTier } from '../../data/partners';
import PartnerLogo from './PartnerLogo';

interface PartnerTierSectionProps {
  tier: PartnerTier;
  isAlternate: boolean;
}

export default function PartnerTierSection({ tier, isAlternate }: PartnerTierSectionProps) {
  return (
    <section className={`py-20 md:py-32 ${isAlternate ? 'bg-zru-green/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Category Badge */}
        <div className="mb-16 md:mb-24 flex flex-col items-center">
          <span className="text-zru-green font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-4">
            Tier
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight text-glow-heavy text-center">
            {tier.title}
          </h2>
          <div className="w-24 h-1 bg-zru-green mt-6 rounded-full" />
        </div>

        {/* Logos Grid */}
        <div className="w-full flex flex-wrap justify-center gap-12 md:gap-20 items-center">
          {tier.partners.map((partner) => (
            <PartnerLogo key={partner.id} partner={partner} />
          ))}
        </div>

      </div>
    </section>
  );
}

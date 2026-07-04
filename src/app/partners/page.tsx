import React from 'react';
import { Metadata } from 'next';
import PartnersHero from '../../components/partners/PartnersHero';
import PartnerTierSection from '../../components/partners/PartnerTierSection';
import { partnerData } from '../../data/partners';
import Navigation from '../../components/layout/Navigation';

export const metadata: Metadata = {
  title: 'Partners | Zimbabwe Rugby Union',
  description: 'Meet the principal partners, official partners, sponsors and supporters of the Zimbabwe Rugby Union.',
};

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-rich-black overflow-hidden selection:bg-zru-green selection:text-white">
      <Navigation />
      
      <PartnersHero />

      <div className="relative z-10 w-full pb-20">
        {partnerData.map((tier, index) => (
          <PartnerTierSection 
            key={tier.id} 
            tier={tier} 
            isAlternate={index % 2 !== 0} 
          />
        ))}
      </div>
    </main>
  );
}

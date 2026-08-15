import React from 'react';
import { Metadata } from 'next';
import PageHero from '../../components/ui/PageHero';
import PartnerTierSection from '../../components/partners/PartnerTierSection';
import { partnerData } from '../../data/partners';
export const metadata: Metadata = {
  title: 'Partners | Zimbabwe Rugby Union',
  description: 'Meet the principal partners, official partners, sponsors and supporters of the Zimbabwe Rugby Union.',
};

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-milk-white overflow-hidden selection:bg-zru-green selection:text-rich-black">
      
      <PageHero
        title="Our"
        accentTitle="Partners"
        subtitle="Proudly partnered with the brands that fuel Zimbabwe Rugby."
        breadcrumb={[{ label: "Partners", href: "/partners" }]}
      />

      <div className="relative z-10 w-full pb-8 md:pb-10">
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

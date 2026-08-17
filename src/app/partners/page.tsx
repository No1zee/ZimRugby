import React from 'react';
import { Metadata } from 'next';
import PageHero from '../../components/ui/PageHero';
import PartnerTierSection from '../../components/partners/PartnerTierSection';
import { getPartners, PartnerTierKey } from '../../lib/api/partners';

export const metadata: Metadata = {
  title: 'Partners | Zimbabwe Rugby Union',
  description: 'Meet the principal partners, official partners, sponsors and supporters of the Zimbabwe Rugby Union.',
};

export const revalidate = 300;

const TIER_ORDER: PartnerTierKey[] = ["title", "gold", "silver", "bronze"];

const TIER_TITLES: Record<PartnerTierKey, { id: string; title: string }> = {
  title: { id: "principal", title: "PRINCIPAL PARTNERS" },
  gold: { id: "gold", title: "GOLD PARTNERS" },
  silver: { id: "silver", title: "SILVER PARTNERS" },
  bronze: { id: "bronze", title: "BRONZE & GRASSROOTS PARTNERS" },
};

export default async function PartnersPage() {
  const partners = await getPartners();
  const active = partners.filter((p) => p.is_active).sort((a, b) => a.sort - b.sort);

  const tiers = TIER_ORDER
    .map((key) => ({ key, ...TIER_TITLES[key], partners: active.filter((p) => p.tier === key) }))
    .filter((t) => t.partners.length > 0);

  return (
    <main className="min-h-screen bg-milk-white overflow-hidden selection:bg-zru-green selection:text-rich-black">

      <PageHero
        title="Our"
        accentTitle="Partners"
        subtitle="Proudly partnered with the brands that fuel Zimbabwe Rugby."
        breadcrumb={[{ label: "Partners", href: "/partners" }]}
      />

      <div className="relative z-10 w-full pb-8 md:pb-10">
        {tiers.length === 0 ? (
          <p className="text-center text-black/40 text-sm py-16">
            Partner information coming soon.
          </p>
        ) : (
          tiers.map((tier, index) => (
            <PartnerTierSection
              key={tier.key}
              tier={tier}
              isAlternate={index % 2 !== 0}
            />
          ))
        )}
      </div>
    </main>
  );
}
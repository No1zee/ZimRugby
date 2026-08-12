import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getActiveCampaigns } from "@/lib/api/campaigns";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import SlantedButton from "@/components/ui/SlantedButton";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Active Campaigns | Zimbabwe Rugby Union",
  description: "Official campaigns supporting the Sables, youth development, and international rugby tours.",
};

const CAMPAIGN_FALLBACK_IMAGES: Record<string, string> = {
  "road-to-australia-2027": "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1200&q=80",
  "africa-cup-tour-2026": "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1200&q=80",
  "schools-festival-2026": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
};

const GLOBAL_DEFAULT_IMAGE = "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1200&q=80";

export default async function CampaignsPage() {
  const campaigns = await getActiveCampaigns();

  return (
    <div className="min-h-screen bg-[#FDFBF0]">
      {/* Centralized PageHero banner */}
      <PageHero
        title="ACTIVE"
        accentTitle="CAMPAIGNS"
        subtitle="Supporting the Sables, youth development, and rugby infrastructure across Zimbabwe."
        tag="ZRU FLAGSHIP INITIATIVES"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Campaigns", href: "/campaigns" },
        ]}
      />

      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <SectionTitle
            text="EXPLORE OUR"
            accent="INITIATIVES"
            subtitle="Support national teams and community rugby growth"
            variant="dark"
            size="md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {
            const resolvedImage =
              campaign.hero_image && (campaign.hero_image.startsWith("http") || campaign.hero_image.startsWith("/"))
                ? campaign.hero_image
                : CAMPAIGN_FALLBACK_IMAGES[campaign.slug] || GLOBAL_DEFAULT_IMAGE;

            return (
              <div
                key={campaign.id}
                className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:border-[#006747] transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-xl"
              >
                <div>
                  <div className="aspect-[16/9] relative overflow-hidden bg-black">
                    <Image
                      src={resolvedImage}
                      alt={campaign.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md shadow-md bg-[#006747] text-white">
                      {campaign.status || "ACTIVE"}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-heading font-black text-2xl text-rich-black uppercase tracking-tight group-hover:text-[#006747] transition-colors leading-tight">
                      {campaign.name}
                    </h3>
                    {campaign.subtitle && (
                      <p className="text-[#006747] text-xs font-bold uppercase tracking-wider">
                        {campaign.subtitle}
                      </p>
                    )}
                    {campaign.description && (
                      <p className="text-neutral-mid text-sm line-clamp-3 leading-relaxed font-normal">
                        {campaign.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <SlantedButton
                    href={campaign.cta_url || `/campaigns/${campaign.slug}`}
                    variant="primary"
                    size="md"
                    className="w-full justify-center text-xs tracking-widest font-heading font-black"
                  >
                    <span>EXPLORE CAMPAIGN</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </SlantedButton>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

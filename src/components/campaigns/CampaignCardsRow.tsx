import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import { getActiveCampaigns } from "@/lib/api/campaigns";
import { assetUrl } from "@/lib/directus/assets";

export default async function CampaignCardsRow() {
  const campaigns = await getActiveCampaigns();
  const active = campaigns.filter(c => c.status === "active" || c.status === "published");
  if (active.length === 0) return null;

  return (
    <section className="bg-rich-black py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle text="Active" accent="Campaigns" variant="light" size="sm" className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.slice(0, 3).map((campaign) => {
            const resolvedImage =
              campaign.hero_image && (campaign.hero_image.startsWith("http") || campaign.hero_image.startsWith("/"))
                ? campaign.hero_image
                : null;

            return (
              <Link
                key={campaign.id}
                href={campaign.cta_url || `/campaigns/${campaign.slug}`}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-zru-green/40 transition-all duration-300 shadow-xl"
              >
                <div className="aspect-[16/9] relative overflow-hidden bg-black/60">
                  {resolvedImage ? (
                    <Image
                      src={resolvedImage}
                      alt={campaign.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-rich-black/40">
                      <span className="text-white/20 font-heading font-black text-xs uppercase tracking-widest">
                        No Image
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-rich-black/90 via-rich-black/30 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-zru-green text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-md">
                    Active
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-white font-heading font-bold text-lg leading-tight group-hover:text-zru-green transition-colors">
                    {campaign.name}
                  </h3>
                  {campaign.subtitle && (
                    <p className="text-white/70 text-xs font-body line-clamp-2">{campaign.subtitle}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

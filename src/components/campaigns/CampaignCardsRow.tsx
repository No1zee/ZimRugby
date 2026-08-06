import Link from "next/link";
import Image from "next/image";
import { getActiveCampaigns } from "@/lib/api/campaigns";
import { assetUrl } from "@/lib/directus/assets";

export default async function CampaignCardsRow() {
  const campaigns = await getActiveCampaigns();
  const active = campaigns.filter(c => c.status === "active" || c.status === "published");
  if (active.length === 0) return null;

  return (
    <section className="bg-rich-black py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-zru-green/30" />
          <h2 className="text-white font-heading text-xl sm:text-2xl font-black tracking-wider uppercase">
            Active Campaigns
          </h2>
          <div className="h-px flex-1 bg-zru-green/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.slice(0, 3).map((campaign) => (
            <Link
              key={campaign.id}
              href={campaign.cta_url || `/campaigns/${campaign.slug}`}
              className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-zru-green/40 transition-all duration-300"
            >
              <div className="aspect-[16/9] relative overflow-hidden">
                {campaign.hero_image ? (
                  <Image
                    src={assetUrl(campaign.hero_image, { width: 600, height: 338, fit: "cover" }) || ""}
                    alt={campaign.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-zru-green/20 flex items-center justify-center">
                    <span className="text-white/40 font-heading text-lg font-black">ZRU</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-rich-black/80 via-rich-black/20 to-transparent" />
                <span className="absolute top-3 left-3 px-2 py-1 bg-zru-green text-white text-[8px] font-black uppercase tracking-widest rounded">
                  Active
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-white font-heading font-bold text-lg leading-tight group-hover:text-zru-green transition-colors">
                  {campaign.name}
                </h3>
                {campaign.subtitle && (
                  <p className="text-white/60 text-xs font-body line-clamp-2">{campaign.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

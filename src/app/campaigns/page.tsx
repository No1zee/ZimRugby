import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getActiveCampaigns } from "@/lib/api/campaigns";
import { assetUrl } from "@/lib/directus/assets";
import { getPageBySlug } from "@/lib/directus/fetch";
import PageHero from "@/components/common/PageHero";
import CleanBreadcrumb from "@/components/layout/CleanBreadcrumb";

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
  const cmsPage = await getPageBySlug("campaigns");
  const campaigns = await getActiveCampaigns();

  const heroData = {
    title: cmsPage?.title || "ZRU CAMPAIGNS",
    subtitle: cmsPage?.subtitle || "Supporting the Sables, youth development, and rugby infrastructure across Zimbabwe.",
    badge: "Official Initiatives",
    bgImage: cmsPage?.hero_image
      ? assetUrl(cmsPage.hero_image, { width: 1920, height: 1080, fit: "cover" }) || "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1920&q=80"
      : "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1920&q=80",
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Campaigns" },
  ];

  return (
    <div className="min-h-screen bg-rich-black text-white">
      <PageHero
        title={heroData.title}
        subtitle={heroData.subtitle}
        badge={heroData.badge}
        bgImage={heroData.bgImage}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <CleanBreadcrumb items={breadcrumbs} />
      </div>

      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {
            const resolvedImage =
              campaign.hero_image && (campaign.hero_image.startsWith("http") || campaign.hero_image.startsWith("/"))
                ? campaign.hero_image
                : CAMPAIGN_FALLBACK_IMAGES[campaign.slug] || GLOBAL_DEFAULT_IMAGE;

            return (
              <div
                key={campaign.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-zru-green/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="aspect-[16/9] relative overflow-hidden bg-black/60">
                    <Image
                      src={resolvedImage}
                      alt={campaign.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rich-black/90 via-rich-black/20 to-transparent" />
                    <span className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md shadow-md ${
                      campaign.status === "active" || campaign.status === "published"
                        ? "bg-zru-green text-white"
                        : "bg-white/20 text-white/70"
                    }`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-heading font-bold text-xl text-white group-hover:text-zru-green transition-colors">
                      {campaign.name}
                    </h3>
                    {campaign.subtitle && (
                      <p className="text-zru-green text-xs font-semibold uppercase tracking-wider">
                        {campaign.subtitle}
                      </p>
                    )}
                    {campaign.description && (
                      <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
                        {campaign.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={campaign.cta_url || `/campaigns/${campaign.slug}`}
                    className="block w-full py-3 bg-zru-green hover:bg-zru-green/90 text-white text-center font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                  >
                    {campaign.cta_text || "Explore Campaign"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

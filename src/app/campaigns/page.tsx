import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getActiveCampaigns } from "@/lib/api/campaigns";
import { assetUrl } from "@/lib/directus/assets";
import { Calendar, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Campaigns | Zimbabwe Rugby Union",
  description: "Explore Zimbabwe Rugby Union's active campaigns — from World Cup qualification to grassroots development.",
};

export const revalidate = 60;

export default async function CampaignsIndexPage() {
  const campaigns = await getActiveCampaigns();

  const active = campaigns.filter((c) => c.status === "active" || c.status === "published");
  const archived = campaigns.filter((c) => c.status === "archived");

  return (
    <main className="min-h-screen bg-milk-white pt-28 pb-20">
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-zru-green text-xs font-black uppercase tracking-widest">
            ZRU Campaigns
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-black text-rich-black leading-tight mt-2">
            Our Campaigns
          </h1>
          <p className="text-black/60 text-base md:text-lg font-body max-w-2xl mt-3">
            From World Cup qualification to grassroots development &mdash; follow every campaign
            that drives Zimbabwe rugby forward.
          </p>
        </div>

        {active.length > 0 && (
          <div className="space-y-6 mb-20">
            <h2 className="text-xs font-black uppercase tracking-widest text-zru-green flex items-center gap-3">
              <span className="w-4 h-0.5 bg-zru-green" />
              Active Campaigns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {active.map((campaign) => {
                const isExpired = campaign.auto_archive && campaign.end_date && new Date(campaign.end_date) < new Date();
                return (
                  <Link
                    key={campaign.id}
                    href={`/campaigns/${campaign.slug}`}
                    className="group relative bg-white border border-black/10 rounded-2xl overflow-hidden hover:border-zru-green/40 hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="aspect-[16/9] relative overflow-hidden bg-zru-green/10">
                      {campaign.hero_image ? (
                        <Image
                          src={assetUrl(campaign.hero_image, { width: 600, height: 338, fit: "cover" }) || ""}
                          alt={campaign.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/40 font-heading text-2xl font-black">ZRU</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-rich-black/70 via-transparent to-transparent" />
                      <span
                        className={`absolute top-3 left-3 px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded ${
                          isExpired
                            ? "bg-amber-900/90 text-amber-200"
                            : "bg-zru-green text-white"
                        }`}
                      >
                        {isExpired ? "Ended" : "Active"}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      {campaign.subtitle && (
                        <span className="text-zru-green text-[9px] font-black uppercase tracking-widest mb-1">
                          {campaign.subtitle}
                        </span>
                      )}
                      <h3 className="font-heading font-bold text-lg text-rich-black group-hover:text-zru-green transition-colors">
                        {campaign.name}
                      </h3>
                      {campaign.description && (
                        <p className="text-black/50 text-sm font-body mt-2 line-clamp-2 flex-1">
                          {campaign.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5">
                        {campaign.start_date && (
                          <span className="flex items-center gap-1.5 text-[10px] text-black/40 font-bold uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            {new Date(campaign.start_date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                          </span>
                        )}
                        <span className="text-zru-green text-[10px] font-black uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Campaign <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {archived.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-black/30 flex items-center gap-3">
              <span className="w-4 h-0.5 bg-black/20" />
              Past Campaigns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archived.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.slug}`}
                  className="group relative bg-white/60 border border-black/5 rounded-2xl overflow-hidden hover:border-black/20 transition-all duration-300 flex flex-col opacity-70 hover:opacity-100"
                >
                  <div className="aspect-[16/9] relative overflow-hidden bg-zru-green/5">
                    {campaign.hero_image ? (
                      <Image
                        src={assetUrl(campaign.hero_image, { width: 600, height: 338, fit: "cover" }) || ""}
                        alt={campaign.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" />
                    )}
                    <span className="absolute top-3 left-3 px-2 py-1 bg-black/40 text-white/60 text-[8px] font-black uppercase tracking-widest rounded">
                      Archived
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-base text-rich-black/60 group-hover:text-rich-black transition-colors">
                      {campaign.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {active.length === 0 && archived.length === 0 && (
          <div className="text-center py-20">
            <p className="text-black/40 font-heading font-bold text-lg">No campaigns yet.</p>
            <p className="text-black/30 text-sm mt-2">Campaigns will appear here once published.</p>
          </div>
        )}
      </section>
    </main>
  );
}

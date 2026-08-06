import Link from "next/link";
import { getActiveCampaigns } from "@/lib/api/campaigns";
import { heroAssetUrl } from "@/lib/directus/assets";

export default async function CampaignAnnouncementBar() {
  const campaigns = await getActiveCampaigns();
  if (!campaigns.length) return null;

  const top = campaigns.reduce((a, b) => (a.priority || 0) >= (b.priority || 0) ? a : b);
  if (!top.start_date && !top.end_date && top.priority === 0) return null;

  return (
    <Link
      href={top.cta_url || `/campaigns/${top.slug}`}
      className="block w-full bg-gradient-to-r from-zru-green via-emerald-700 to-zru-green text-white hover:from-emerald-700 hover:to-zru-green transition-all duration-300"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-3">
        <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/20 shrink-0">
          CAMPAIGN
        </span>
        <span className="text-xs font-bold tracking-wide truncate">{top.name}</span>
        {top.subtitle && (
          <span className="hidden md:inline text-xs text-white/80 truncate">{top.subtitle}</span>
        )}
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 shrink-0">
          View
        </span>
      </div>
    </Link>
  );
}

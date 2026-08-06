import Link from "next/link";

interface CampaignMatchBadgeProps {
  campaignSlug: string;
  campaignName: string;
}

export default function CampaignMatchBadge({ campaignSlug, campaignName }: CampaignMatchBadgeProps) {
  return (
    <Link
      href={`/campaigns/${campaignSlug}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-zru-green/10 border border-zru-green/30 rounded text-[9px] font-black uppercase tracking-wider text-zru-green hover:bg-zru-green/20 transition-colors"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-zru-green animate-pulse" />
      {campaignName}
    </Link>
  );
}

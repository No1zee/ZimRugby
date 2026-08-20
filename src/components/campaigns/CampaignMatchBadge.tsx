import Link from "next/link";

interface CampaignMatchBadgeProps {
  campaignSlug: string;
  campaignName: string;
}

export default function CampaignMatchBadge({ campaignSlug, campaignName }: CampaignMatchBadgeProps) {
  return (
    <Link
      href={`/campaigns/${campaignSlug}`}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-zru-green/10 border border-zru-green/30 rounded-none text-[9px] font-black uppercase tracking-widest text-zru-green hover:bg-zru-green/20 transition-colors"
    >
      <span className="w-1 h-1 bg-zru-green" />
      {campaignName}
    </Link>
  );
}

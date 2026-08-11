"use client";

import Link from "next/link";
import { Edit2, Flag } from "lucide-react";
import type { Campaign } from "@/lib/api/campaigns";

export default function CampaignsPanel({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="mb-6 font-heading text-xl font-black uppercase text-rich-black">
        Campaigns ({initialCampaigns.length})
      </h2>

      {initialCampaigns.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/10 py-16 text-center">
          <Flag className="mx-auto mb-3 h-10 w-10 text-black/10" />
          <h3 className="font-heading text-sm font-black uppercase text-black/40">No campaigns yet</h3>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-black/10 text-xs font-black uppercase text-black/50">
                <th className="py-2">Campaign</th>
                <th className="py-2">Status</th>
                <th className="py-2">Players</th>
                <th className="py-2">Matches</th>
                <th className="py-2">Media</th>
                <th className="py-2">Dates</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-sm">
              {initialCampaigns.map((campaign) => (
                <tr key={campaign.id} className="transition-colors hover:bg-black/[0.02]">
                  <td className="py-3">
                    <div className="font-heading font-black uppercase text-rich-black">{campaign.name}</div>
                    {campaign.subtitle && (
                      <div className="text-[10px] uppercase tracking-wider text-black/50">{campaign.subtitle}</div>
                    )}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        campaign.status === "active"
                          ? "bg-zru-green/10 text-zru-green"
                          : campaign.status === "published"
                            ? "bg-black/5 text-black/60"
                            : "bg-amber-900/10 text-amber-700"
                      }`}
                    >
                      {campaign.status || "draft"}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-black/70">{campaign.players?.length || 0}</td>
                  <td className="py-3 font-bold text-black/70">{campaign.matches?.length || 0}</td>
                  <td className="py-3 font-bold text-black/70">{campaign.media?.length || 0}</td>
                  <td className="py-3 text-[11px] text-black/60">
                    {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
                    {campaign.end_date ? ` – ${new Date(campaign.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/campaigns/${campaign.slug}`}
                        target="_blank"
                        className="flex items-center gap-1 rounded-lg bg-zru-green/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-zru-green transition-colors hover:bg-zru-green/20"
                      >
                        View <Edit2 className="h-3 w-3" />
                      </Link>
                      <a
                        href={`${directusUrl}/admin/content/campaigns/${campaign.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg bg-black/5 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-black/50 transition-colors hover:bg-black/10"
                      >
                        Data <Edit2 className="h-3 w-3" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

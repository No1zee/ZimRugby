"use client";

import { useState } from "react";
import { Flag, Plus } from "lucide-react";
import CollectionManager from "@/components/admin/CollectionManager";
import type { Campaign } from "@/lib/api/campaigns";

export default function CampaignsPanel({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const [createRequest, setCreateRequest] = useState(0);
  const [creating, setCreating] = useState(false);
  const isEmpty = initialCampaigns.length === 0;

  if (isEmpty && !creating) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zru-green/10">
            <Flag className="h-7 w-7 text-zru-green" strokeWidth={1.75} />
          </div>
          <h2 className="mt-5 font-heading text-xl font-black uppercase tracking-wide text-rich-black">
            No active campaigns
          </h2>
          <p className="mt-2 max-w-sm text-sm text-black/50">
            Campaigns drive the homepage hero and campaign pages. Create your first one to get started.
          </p>
          <button
            onClick={() => {
              setCreating(true);
              setCreateRequest((n) => n + 1);
            }}
            className="mt-6 flex items-center gap-2 rounded-lg bg-zru-green px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800"
          >
            <Plus className="h-4 w-4" /> Create New Campaign
          </button>
        </div>
      </div>
    );
  }

  return (
    <CollectionManager
      collection="campaigns"
      title="Campaigns"
      description="Campaigns shown on the homepage and campaign pages (e.g. World Cup journeys, tours)."
      fields={[
        { key: "name", label: "Campaign name", type: "text", placeholder: "e.g. Road to Australia 2027", required: true, colSpan: "full" },
        { key: "slug", label: "Web address (slug)", type: "text", placeholder: "e.g. road-to-australia-2027", colSpan: "full" },
        { key: "subtitle", label: "Subtitle", type: "text", placeholder: "e.g. The journey to the World Cup", colSpan: "full" },
        { key: "description", label: "Description", type: "textarea", colSpan: "full" },
        { key: "status", label: "Status", type: "select", options: ["active", "published", "draft"] },
        { key: "start_date", label: "Start date", type: "date" },
        { key: "end_date", label: "End date", type: "date" },
        { key: "countdown_target", label: "Countdown target", type: "date" },
        { key: "priority", label: "Priority", type: "number", placeholder: "e.g. 10 (higher shows first)" },
        { key: "sort", label: "Sort order", type: "number", placeholder: "e.g. 1" },
        { key: "hero_image", label: "Hero image", type: "image" },
        { key: "cta_label", label: "Button label", type: "text", placeholder: "e.g. Support the Campaign" },
        { key: "cta_url", label: "Button link", type: "text", placeholder: "e.g. /world-cup-campaign" },
        { key: "auto_archive", label: "Auto-archive when finished", type: "boolean" },
      ]}
      items={initialCampaigns as unknown as Record<string, unknown>[]}
      displayField="name"
      subtitleField="start_date"
      badgeField="status"
      statusField="status"
      searchable={["name", "subtitle", "slug"]}
      singularLabel="campaign"
      createRequest={createRequest}
    />
  );
}
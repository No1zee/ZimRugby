"use client";

import CollectionManager from "@/components/admin/CollectionManager";
import type { Campaign } from "@/lib/api/campaigns";

export default function CampaignsPanel({
  initialCampaigns,
  canReview = false,
  currentUserEmail,
}: {
  initialCampaigns: Campaign[];
  canReview?: boolean;
  currentUserEmail?: string;
}) {
  return (
    <CollectionManager
      collection="campaigns"
      title="Campaigns"
      description="Campaigns shown on the homepage and campaign pages (e.g. World Cup journeys, tours). Status is the editorial workflow; the start/end window decides when it's visible."
      fields={[
        { key: "name", label: "Campaign name", type: "text", placeholder: "e.g. Road to Australia 2027", required: true, colSpan: "full" },
        { key: "slug", label: "Web address (slug)", type: "text", placeholder: "e.g. road-to-australia-2027", colSpan: "full" },
        { key: "subtitle", label: "Subtitle", type: "text", placeholder: "e.g. The journey to the World Cup", colSpan: "full" },
        { key: "description", label: "Description", type: "textarea", colSpan: "full" },
        { key: "status", label: "Status", type: "select", options: ["draft", "in_review", "approved", "running", "published"] },
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
      scheduleField={{ starts: "start_date", ends: "end_date" }}
      reviewable
      canReview={canReview}
      currentUserEmail={currentUserEmail}
    />
  );
}

import { supabase } from "@/lib/supabase/client";
import { publishToQueue } from "@/lib/qstash/client";

export interface SupporterData {
  name: string;
  email: string;
  oneClick?: boolean;
}

/**
 * Registers interest for a specific ticketed fixture into Supabase.
 */
export async function registerTicketingInterest(fixtureId: string, data: SupporterData) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zimrugby.vercel.app";
  
  const record = {
    fixture_id: fixtureId,
    name: data.name,
    email: data.email,
    registered_at: new Date().toISOString(),
  };

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await supabase.from("ticket_interest").insert([record]);
    } catch {}
  }

  await publishToQueue(`${baseUrl}/api/queue/worker`, {
    formType: "ticket_interest",
    data: record,
  });

  return { success: true, message: "Interest registered successfully." };
}

/**
 * Adds a new supporter to ZRU Nation (Supabase persistence).
 */
export async function joinZRUNation(data: SupporterData) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zimrugby.vercel.app";
  
  const memberData = {
    name: data.name,
    email: data.email,
    registered_at: new Date().toISOString(),
    vip_code: "SABLES2027",
  };

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await supabase.from("fan_zone_members").insert([memberData]);
    } catch {}
  }

  await publishToQueue(`${baseUrl}/api/queue/worker`, {
    formType: "fan_zone_member",
    data: memberData,
  });

  return { success: true, memberId: Math.random().toString(36).substring(2, 11).toUpperCase() };
}

/**
 * Records a pledge impact for the World Cup Campaign into Supabase.
 */
export async function recordCampaignPledge(email: string, tierId: string) {
  const pledgeData = {
    email,
    tier_id: tierId,
    campaign_slug: "road-to-australia-2027",
    created_at: new Date().toISOString(),
  };

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await supabase.from("campaign_pledges").insert([pledgeData]);
    } catch {}
  }

  return { success: true };
}

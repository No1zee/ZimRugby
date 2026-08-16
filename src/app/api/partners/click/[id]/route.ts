import { NextRequest, NextResponse } from "next/server";
import { directusFetch } from "@/lib/directus/fetch";
import { logAuditEvent } from "@/lib/admin/iam";

interface SponsorRecord {
  id: string | number;
  name: string;
  website_url?: string;
  tier?: string;
}

const DEFAULT_PARTNER_URLS: Record<string, string> = {
  "nedbank": "https://www.nedbank.co.zw",
  "macron": "https://www.macron.com",
  "delta": "https://www.delta.co.zw",
  "dairibord": "https://www.dairibord.com",
  "old-mutual": "https://www.oldmutual.co.zw",
  "econet": "https://www.econet.co.zw",
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const referer = req.headers.get("referer") || "direct";

  let targetUrl = DEFAULT_PARTNER_URLS[id.toLowerCase()] || "https://zimrugby.co.zw/partners";
  let partnerName = id;

  try {
    // 1. Attempt to fetch partner website from Directus CMS
    const partners = await directusFetch<SponsorRecord>("partners", {
      filter: {
        _or: [
          { id: { _eq: isNaN(Number(id)) ? 0 : Number(id) } },
          { name: { _icontains: id } },
        ],
      },
      limit: 1,
    });

    if (partners && partners.length > 0 && partners[0].website_url) {
      targetUrl = partners[0].website_url;
      partnerName = partners[0].name;
    }

    // 2. Log ROI Analytics Event
    logAuditEvent({
      actorEmail: "public-fan@analytics",
      actorRole: "viewer",
      action: "PAGE_UPDATE",
      resource: `/partners/click/${id}`,
      details: `Sponsor click-through: ${partnerName} -> ${targetUrl} (Referrer: ${referer})`,
      ipAddress: ip,
    });
  } catch {
    // Fallback gracefully to default target URL
  }

  // 3. Safe 302 Redirect to Sponsor destination
  return NextResponse.redirect(targetUrl, 302);
}

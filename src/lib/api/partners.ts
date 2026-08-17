import { directusFetch } from "@/lib/directus/fetch";
import { assetUrl } from "@/lib/directus/assets";

export type PartnerTierKey = "title" | "gold" | "silver" | "bronze";

export interface Partner {
  id: number;
  name: string;
  role: string;
  logo: string;
  blurb: string;
  href: string;
  badge: string;
  sort: number;
  tier: PartnerTierKey;
  is_active: boolean;
}

interface DirectusPartner {
  id: number;
  name: string;
  role?: string;
  logo?: string | null;
  logo_url?: string;
  description?: string;
  website_url?: string;
  badge?: string;
  tier?: string | null;
  sort?: number;
  status?: string;
}

const TIER_ALIASES: Record<string, PartnerTierKey> = {
  title: "title",
  gold: "gold",
  silver: "silver",
  bronze: "bronze",
  "1": "title",
  "2": "gold",
  "3": "silver",
  "4": "bronze",
};

function normalizeTier(tier?: string | null): PartnerTierKey {
  if (!tier) return "gold";
  return TIER_ALIASES[String(tier).toLowerCase().trim()] || "gold";
}

const MOCK_PARTNERS: Partner[] = [
  {
    id: 1,
    name: "Nedbank",
    role: "HEADLINE SPONSOR",
    logo: "/images/sponsors/nedbank.jpeg",
    blurb: "Official headline sponsor powering the Sables national team, domestic competitions, and grassroots rugby nationwide.",
    href: "https://www.nedbank.co.zw",
    badge: "PRIMARY PARTNER",
    sort: 1,
    tier: "title",
    is_active: true,
  },
  {
    id: 2,
    name: "Rugby Africa",
    role: "CONTINENTAL BODY",
    logo: "/images/sponsors/Rugby Africa.png",
    blurb: "The administrative body for rugby union within Africa.",
    href: "https://www.rugbyafrique.com",
    badge: "GOVERNING BODY",
    sort: 2,
    tier: "title",
    is_active: true,
  },
  {
    id: 3,
    name: "World Rugby",
    role: "GLOBAL BODY",
    logo: "/images/sponsors/World_Rugby_logo.png",
    blurb: "The world governing body for the sport of rugby union.",
    href: "https://www.world.rugby",
    badge: "GOVERNING BODY",
    sort: 3,
    tier: "title",
    is_active: true,
  },
  {
    id: 4,
    name: "Zimbabwean Olympic Committee",
    role: "NATIONAL COMMITTEE",
    logo: "/images/sponsors/Zimbabwean Olympic Comitte-Logo.png",
    blurb: "The National Olympic Committee representing Zimbabwe.",
    href: "#",
    badge: "NATIONAL PARTNER",
    sort: 4,
    tier: "gold",
    is_active: true,
  },
  {
    id: 5,
    name: "Sports and Recreation Commission",
    role: "SPORTS COMMISSION",
    logo: "/images/sponsors/src.png",
    blurb: "Governing sports and recreation across Zimbabwe.",
    href: "#",
    badge: "NATIONAL PARTNER",
    sort: 5,
    tier: "gold",
    is_active: true,
  },
];

const LOCAL_LOGO_FALLBACKS: Record<string, string> = {
  nedbank: "/images/sponsors/nedbank.jpeg",
  africa: "/images/sponsors/Rugby Africa.png",
  world: "/images/sponsors/World_Rugby_logo.png",
  olympic: "/images/sponsors/Zimbabwean Olympic Comitte-Logo.png",
  "sports and recreation": "/images/sponsors/src.png",
};

function getFallbackLogo(name: string): string {
  const lower = name.toLowerCase();
  for (const key of Object.keys(LOCAL_LOGO_FALLBACKS)) {
    if (lower.includes(key)) {
      return LOCAL_LOGO_FALLBACKS[key];
    }
  }
  return "/images/logos/zru-logo.svg"; // Fallback to main union logo if completely unknown
}

export async function getPartners(): Promise<Partner[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directusFetch<DirectusPartner>("partners", {
        fields: ["id", "name", "role", "logo", "description", "website_url", "badge", "tier", "sort", "status"],
        filter: { status: { _eq: "published" } },
        sort: ["sort"],
        limit: 20,
      }, 300);

      if (response && response.length > 0) {
        return response.map((p) => {
          const localLogo = getFallbackLogo(p.name);
          const directusLogo = assetUrl(p.logo ?? undefined);
          const directusLogoOk =
            directusLogo &&
            !directusLogo.includes("undefined") &&
            !directusLogo.startsWith("/api/assets/");
          return {
            id: p.id,
            name: p.name,
            role: p.role || "PARTNER",
            logo: localLogo !== "/images/logos/zru-logo.svg"
              ? localLogo
              : directusLogoOk
                ? directusLogo
                : localLogo,
            blurb: p.description || "",
            href: p.website_url || "#",
            badge: p.badge || "PARTNER",
            sort: p.sort || 0,
            tier: normalizeTier(p.tier),
            is_active: true,
          };
        });
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for partners, using mock data:", error);
  }

  return MOCK_PARTNERS;
}

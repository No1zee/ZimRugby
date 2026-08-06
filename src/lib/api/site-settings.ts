import { directusFetch } from "@/lib/directus/fetch";

export interface SiteSettings {
  id?: number;
  site_name?: string;
  site_tagline?: string;
  hero_title?: string;
  hero_strapline?: string;
  primary_cta_label?: string;
  primary_cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
  seo_title?: string;
  seo_description?: string;
  facebook_url?: string;
  x_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
}

const fallbackSettings: SiteSettings = {
  site_name: "Zimbabwe Rugby Union",
  site_tagline: "Official Home of the Sables",
  hero_title: "ZIMBABWE RUGBY",
  hero_strapline: "The heartbeat of Zimbabwean rugby. Home of the Sables, Lady Sables, Junior Sables, and Cheetahs.",
  primary_cta_label: "TICKETS",
  primary_cta_url: "/tickets",
  secondary_cta_label: "THE SQUAD",
  secondary_cta_url: "/teams",
  seo_title: "Zimbabwe Rugby Union | Official Home of the Sables",
  seo_description: "Official website of the Zimbabwe Rugby Union. Follow the Sables, Lady Sables, and all Zimbabwe rugby teams. Fixtures, results, news, and tickets.",
  facebook_url: "https://facebook.com/ZimbabweRugby",
  x_url: "https://x.com/ZimRugby",
  instagram_url: "https://instagram.com/zimrugbyunion",
  youtube_url: "https://youtube.com/@ZimbabweRugbyUnion",
  linkedin_url: "https://linkedin.com/company/zimbabwe-rugby-union",
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackSettings;

    const settings = await directusFetch<SiteSettings>("site_settings", { limit: 1 });

    if (settings && settings.length > 0) return settings[0];

    return fallbackSettings;
  } catch {
    console.warn("Failed to fetch site settings from Directus, using fallback");
    return fallbackSettings;
  }
}

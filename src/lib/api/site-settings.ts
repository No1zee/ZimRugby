import { directusFetch } from "@/lib/directus/fetch";

export interface SiteSettings {
  id?: string;
  site_name?: string;
  site_tagline?: string;
  logo?: string | null;
  // Hero / CTA
  hero_title?: string;
  hero_strapline?: string;
  primary_cta_label?: string;
  primary_cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
  // External links
  tickets_url?: string;
  shop_url?: string;
  sign_in_url?: string;
  // SEO
  seo_title?: string;
  seo_description?: string;
  // Compliance
  compliance_label?: string;
  privacy_policy_url?: string;
  terms_url?: string;
  cookie_policy_url?: string;
  // Contact & Location
  phone?: string;
  address?: string;
  maps_url?: string;
  // Social
  facebook_url?: string;
  x_url?: string;
  instagram_url?: string;
  youtube_url?: string;
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
  tickets_url: "https://tickets.zimrugby.co.zw",
  shop_url: "https://shop.zimrugby.co.zw",
  sign_in_url: "/auth/signin",
  seo_title: "Zimbabwe Rugby Union | Official Home of the Sables",
  seo_description: "Official website of the Zimbabwe Rugby Union. Follow the Sables, Lady Sables, and all Zimbabwe rugby teams. Fixtures, results, news, and tickets.",
  compliance_label: "CDPA 2021 COMPLIANT",
  phone: "+263 78 782 8474",
  address: "36 Walmer Drive, Newlands, Harare",
  maps_url: "https://www.google.com/maps/search/?api=1&query=36+Walmer+Drive,+Newlands,+Harare,+Zimbabwe",
  facebook_url: "https://www.facebook.com/share/1BaLCkdCZ3/",
  x_url: "https://x.com/ZimRugbyZW",
  instagram_url: "https://www.instagram.com/zimbabwerugbyunion?igsh=NTdxbWszeDdheXpy",
  youtube_url: "https://youtube.com/@ZimbabweRugbyUnion",
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackSettings;

    // Directus has `global_settings` — no `site_settings` collection exists
    const settings = await directusFetch<SiteSettings>("global_settings", { limit: 1 });

    if (settings && settings.length > 0) {
      // Merge with fallback so any missing CMS fields degrade gracefully
      return { ...fallbackSettings, ...settings[0] };
    }

    return fallbackSettings;
  } catch {
    console.warn("Failed to fetch site settings from Directus, using fallback");
    return fallbackSettings;
  }
}

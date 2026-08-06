import { z } from "zod";

export interface DirectusCollectionSchema {
  collection: string;
  fields: Array<{ field: string; type: string; meta?: Record<string, unknown> }>;
}

export const zruCollections: DirectusCollectionSchema[] = [
  {
    collection: "announcements",
    fields: [
      { field: "id", type: "integer" },
      { field: "title", type: "string" },
      { field: "body", type: "text" },
      { field: "category", type: "string" },
      { field: "date", type: "dateTime" },
      { field: "urgent", type: "boolean" },
    ],
  },
  {
    collection: "clubs",
    fields: [
      { field: "id", type: "integer" },
      { field: "name", type: "string" },
      { field: "slug", type: "string" },
      { field: "province", type: "string" },
      { field: "league", type: "string" },
      { field: "venue", type: "string" },
      { field: "color", type: "string" },
      { field: "contact", type: "string" },
      { field: "description", type: "text" },
      { field: "status", type: "string" },
      { field: "sort", type: "integer" },
    ],
  },
  {
    collection: "school_initiatives",
    fields: [
      { field: "id", type: "integer" },
      { field: "title", type: "string" },
      { field: "description", type: "text" },
      { field: "icon", type: "string" },
      { field: "stat", type: "string" },
      { field: "status", type: "string" },
      { field: "sort", type: "integer" },
    ],
  },
  {
    collection: "campaigns",
    fields: [
      { field: "id", type: "integer" },
      { field: "name", type: "string" },
      { field: "slug", type: "string" },
      { field: "description", type: "text" },
      { field: "countdown_target", type: "dateTime" },
      { field: "hero_image", type: "string" },
      { field: "cta_label", type: "string" },
      { field: "cta_url", type: "string" },
      { field: "items", type: "json" },
      { field: "status", type: "string" },
      { field: "sort", type: "integer" },
    ],
  },
  {
    collection: "site_settings",
    fields: [
      { field: "id", type: "integer" },
      { field: "site_name", type: "string" },
      { field: "site_tagline", type: "string" },
      { field: "hero_title", type: "string" },
      { field: "hero_strapline", type: "string" },
      { field: "primary_cta_label", type: "string" },
      { field: "primary_cta_url", type: "string" },
      { field: "secondary_cta_label", type: "string" },
      { field: "secondary_cta_url", type: "string" },
      { field: "seo_title", type: "string" },
      { field: "seo_description", type: "text" },
      { field: "facebook_url", type: "string" },
      { field: "x_url", type: "string" },
      { field: "instagram_url", type: "string" },
      { field: "youtube_url", type: "string" },
      { field: "linkedin_url", type: "string" },
    ],
  },
  {
    collection: "players",
    fields: [
      { field: "id", type: "integer" },
      { field: "name", type: "string" },
      { field: "slug", type: "string" },
      { field: "position", type: "string" },
      { field: "team", type: "string" },
      { field: "team_id", type: "integer" },
      { field: "caps", type: "integer" },
      { field: "age", type: "integer" },
      { field: "photo", type: "string" },
      { field: "bio", type: "text" },
      { field: "featured", type: "boolean" },
      { field: "status", type: "string" },
      { field: "sort", type: "integer" },
    ],
  },
];

export const siteSettingsSchema = z.object({
  site_name: z.string().optional(),
  site_tagline: z.string().optional(),
  hero_title: z.string().optional(),
  hero_strapline: z.string().optional(),
  primary_cta_label: z.string().optional(),
  primary_cta_url: z.string().optional(),
  secondary_cta_label: z.string().optional(),
  secondary_cta_url: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  facebook_url: z.string().optional(),
  x_url: z.string().optional(),
  instagram_url: z.string().optional(),
  youtube_url: z.string().optional(),
  linkedin_url: z.string().optional(),
});

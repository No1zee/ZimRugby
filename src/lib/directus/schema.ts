import { z } from "zod";

export interface DirectusCollectionSchema {
  collection: string;
  fields: Array<{ field: string; type: string; meta?: Record<string, unknown> }>;
}

export const zruCollections: DirectusCollectionSchema[] = [
  {
    collection: "announcements",
    fields: [
      { field: "id", type: "string" },
      { field: "title", type: "string" },
      { field: "body", type: "text" },
      { field: "category", type: "string" },
      { field: "date", type: "dateTime" },
      { field: "urgent", type: "boolean" },
    ],
  },
  {
    collection: "fixtures",
    fields: [
      { field: "id", type: "string" },
      { field: "home_team", type: "string" },
      { field: "away_team", type: "string" },
      { field: "home_score", type: "integer" },
      { field: "away_score", type: "integer" },
      { field: "status", type: "string" },
      { field: "kickoff_time", type: "dateTime" },
      { field: "venue", type: "string" },
    ],
  },
  {
    collection: "fan_zone_members",
    fields: [
      { field: "id", type: "string" },
      { field: "name", type: "string" },
      { field: "email", type: "string" },
      { field: "favorite_team", type: "string" },
      { field: "vip_code", type: "string" },
      { field: "cdpa_consent", type: "boolean" },
      { field: "registered_at", type: "dateTime" },
    ],
  },
  {
    collection: "onboarding_submissions",
    fields: [
      { field: "id", type: "string" },
      { field: "full_name", type: "string" },
      { field: "email", type: "string" },
      { field: "phone", type: "string" },
      { field: "role", type: "string" },
      { field: "organization", type: "string" },
      { field: "submitted_at", type: "dateTime" },
    ],
  },
];

import matchesJson from "../../public/data/matches.json";
import reportsJson from "../../public/data/reports.json";
import socialJson from "../../public/data/social.json";
import eventsJson from "../../public/data/events.json";

/**
 * Build-time bundled copies of the static fallback JSON in public/data.
 * Bundled at build time so they are ALWAYS readable on any runtime
 * (local dev, Vercel serverless) — unlike fs reads of public/ which
 * fail in serverless (ENOENT) and VERCEL_URL fetches which can return
 * the HTML index page instead of the JSON.
 */
export const staticData: Record<string, unknown[]> = {
  "matches.json": matchesJson as unknown[],
  "reports.json": reportsJson as unknown[],
  "social.json": socialJson as unknown[],
  "events.json": eventsJson as unknown[],
};

import crypto from "crypto";
import { NormalizedMatch, MatchSyncResult, MatchSource } from "./types";

interface DirectusRecord {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  [key: string]: unknown;
}

export class DirectusMatchSyncEngine {
  private directusUrl: string;
  private adminToken: string;

  constructor() {
    this.directusUrl =
      process.env.DIRECTUS_API_URL ||
      process.env.NEXT_PUBLIC_DIRECTUS_URL ||
      "https://zru-directus-cms-production.up.railway.app";
    this.adminToken =
      process.env.DIRECTUS_TOKEN ||
      process.env.DIRECTUS_ADMIN_TOKEN ||
      "";
  }

  private async fetchDirectus<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.directusUrl}${path}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.adminToken}`,
      ...(options.headers || {}),
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Directus API error [${res.status}] ${path}: ${errText}`);
    }

    const data = await res.json();
    return data.data;
  }

  private async findOrCreateEntity(
    collection: "teams" | "opponents" | "competitions" | "venues",
    name: string,
    extraFields: Record<string, unknown> = {}
  ): Promise<string> {
    const cleanName = name.trim();
    const slug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Search existing
    const filter = encodeURIComponent(JSON.stringify({ name: { _eq: cleanName }, deleted_at: { _null: true } }));
    const existing = await this.fetchDirectus<DirectusRecord[]>(`/items/${collection}?filter=${filter}&limit=1`);

    if (existing && existing.length > 0) {
      return existing[0].id;
    }

    // Auto-create with UUID for text-PK collections
    const newId = crypto.randomUUID();
    const payload = {
      id: newId,
      name: cleanName,
      slug,
      status: "published",
      ...extraFields,
    };

    await this.fetchDirectus(`/items/${collection}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return newId;
  }

  async syncMatches(
    matches: NormalizedMatch[],
    source: MatchSource = "api_sports"
  ): Promise<MatchSyncResult> {
    const result: MatchSyncResult = {
      source,
      totalFetched: matches.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      matches: [],
    };

    if (!this.adminToken) {
      result.errors.push("Directus admin token (DIRECTUS_TOKEN) is not configured.");
      return result;
    }

    for (const m of matches) {
      try {
        // Resolve Team ID (default to Sables if national match)
        const teamId = await this.findOrCreateEntity("teams", m.teamName, {
          team_type: m.matchType === "sevens" ? "sevens" : "senior",
        });

        // Resolve Opponent ID
        const opponentId = await this.findOrCreateEntity("opponents", m.opponentName);

        // Resolve Competition ID
        const competitionId = await this.findOrCreateEntity("competitions", m.competitionName);

        // Resolve Venue ID if provided
        let venueId: string | null = null;
        if (m.venueName) {
          venueId = await this.findOrCreateEntity("venues", m.venueName);
        }

        // Check if match already exists by slug or (team_id + opponent_id + kickoff date)
        const kickoffDate = m.kickoffAt.split("T")[0];
        const matchFilter = encodeURIComponent(
          JSON.stringify({
            _or: [
              { slug: { _eq: m.slug } },
              {
                _and: [
                  { team_id: { _eq: teamId } },
                  { opponent_id: { _eq: opponentId } },
                  { kickoff_at: { _starts_with: kickoffDate } },
                ],
              },
            ],
            deleted_at: { _null: true },
          })
        );

        const existingMatches = await this.fetchDirectus<DirectusRecord[]>(
          `/items/matches?filter=${matchFilter}&limit=1`
        );

        if (existingMatches && existingMatches.length > 0) {
          const existing = existingMatches[0];
          // Update status, scores, venue if changed
          const updatePayload: Record<string, unknown> = {};
          if (m.status !== existing.status) updatePayload.status = m.status;
          if (m.homeScore !== undefined && m.homeScore !== existing.home_score) updatePayload.home_score = m.homeScore;
          if (m.awayScore !== undefined && m.awayScore !== existing.away_score) updatePayload.away_score = m.awayScore;
          if (venueId && venueId !== existing.venue_id) updatePayload.venue_id = venueId;

          if (Object.keys(updatePayload).length > 0) {
            await this.fetchDirectus(`/items/matches/${existing.id}`, {
              method: "PATCH",
              body: JSON.stringify(updatePayload),
            });
            result.updated++;
            result.matches.push({ title: m.title, action: "updated", id: existing.id });
          } else {
            result.skipped++;
            result.matches.push({ title: m.title, action: "skipped", id: existing.id });
          }
        } else {
          // Create new match with UUID
          const newMatchId = crypto.randomUUID();
          const createPayload = {
            id: newMatchId,
            title: m.title,
            slug: m.slug,
            match_type: m.matchType,
            team_id: teamId,
            opponent_id: opponentId,
            competition_id: competitionId,
            venue_id: venueId,
            kickoff_at: m.kickoffAt,
            status: m.status,
            home_score: m.homeScore ?? null,
            away_score: m.awayScore ?? null,
            is_home: m.isHome,
          };

          await this.fetchDirectus("/items/matches", {
            method: "POST",
            body: JSON.stringify(createPayload),
          });

          result.created++;
          result.matches.push({ title: m.title, action: "created", id: newMatchId });
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        result.errors.push(`Failed to sync match "${m.title}": ${errorMsg}`);
      }
    }

    return result;
  }
}

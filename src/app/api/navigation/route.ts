import { NextResponse } from "next/server";
import { directusFetch } from "@/lib/directus/fetch";

// Fallback static nav items used when Directus is unreachable or not configured
const fallbacks = {
  teams: [
    { label: "Sables (Men's XV)", href: "/teams/sables" },
    { label: "Lady Sables (Women's XV)", href: "/teams/lady-sables" },
    { label: "Junior Sables (U20)", href: "/teams/junior-sables" },
    { label: "Cheetahs (Men's 7s)", href: "/teams/cheetahs" },
  ],
  competitions: [
    { label: "Sevens Series", href: "/events?tab=competitions" },
    { label: "Club Championship", href: "/events?tab=competitions" },
    { label: "Schools Rugby", href: "/events?tab=competitions" },
  ],
  events: [
    { label: "Coaching Courses", href: "/events?tab=events" },
    { label: "AGM & Admin Documents", href: "/events?tab=events" },
    { label: "Gala Dinners", href: "/events?tab=events" },
  ],
};

export async function GET() {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

  if (!directusUrl) {
    // No CMS configured – serve static defaults immediately
    return NextResponse.json(fallbacks);
  }

  // Parallel fetch – each block falls back independently if it fails
  const [teams, competitions, events] = await Promise.all([
    directusFetch<Record<string, string>>("teams", { fields: ["id", "name"], limit: 6 }, 60)
      .then((rows) =>
        rows.length > 0
          ? rows.map((t) => ({ label: t.name, href: `/teams/${t.id}` }))
          : fallbacks.teams
      )
      .catch(() => fallbacks.teams),

    directusFetch<Record<string, string>>("competitions", { fields: ["id", "title"], limit: 4 }, 60)
      .then((rows) =>
        rows.length > 0
          ? rows.map((c) => ({ label: c.title, href: "/events?tab=competitions" }))
          : fallbacks.competitions
      )
      .catch(() => fallbacks.competitions),

    directusFetch<Record<string, string>>("events", { fields: ["id", "title"], limit: 4 }, 60)
      .then((rows) =>
        rows.length > 0
          ? rows.map((e) => ({ label: e.title, href: "/events?tab=events" }))
          : fallbacks.events
      )
      .catch(() => fallbacks.events),
  ]);

  return NextResponse.json({ teams, competitions, events });
}

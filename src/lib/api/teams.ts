/* eslint-disable @typescript-eslint/no-explicit-any */
import { Team } from "@/types";
import { directusFetch } from "@/lib/directus/fetch";
import { photoAssetUrl, logoAssetUrl, headshotAssetUrl } from "@/lib/directus/assets";
import type { Team as BentoTeam } from "@/types/team";

const MOCK_TEAMS: Record<string, Team> = {
    "sables": {
      id: "sables",
      name: "Zimbabwe Sables",
      tagline: "The flagship senior men's XV side, Africa Cup Champions.",
      history: "The Sables are one of Africa's most historic rugby teams, having competed in the 1987 and 1991 Rugby World Cups. In 2024, they won the Africa Cup, reclaiming their status as one of the top rugby nations on the continent.",
      stats: [
        { label: "Africa Cup Titles", value: "2" },
        { label: "World Cup Apps", value: "2" },
        { label: "WR Ranking", value: "#28" }
      ],
      coachingStaff: [
        { name: "Piet Benade", role: "Head Coach", image: "/images/teams/headshots/Pieter Benade.jpg" },
        { name: "Ricky Chirengende", role: "Assistant Coach", image: "/images/teams/headshots/Ricky Chirengende.jpg" },
        { name: "TJ Chifokoyo", role: "Team Manager" }
      ],
      squad: [
        { name: "Hilton Mudariki", position: "Scrum-half (C)", club: "Old Hararians", caps: 48, image: "/images/teams/headshots/Hilton Mudariki.jpg" },
        { name: "Tapfuma Parirenyatwa", position: "Flanker", club: "Old Georgians", caps: 35, image: "/images/teams/player-placeholder.webp" },
        { name: "Cleopas Kundiona", position: "Prop", club: "Nevers (France)", caps: 18, image: "/images/teams/player-placeholder.webp" },
        { name: "Kudzai Mashawi", position: "Centre", club: "Harare Sports Club", caps: 28, image: "/images/teams/headshots/Kudzai Mashawi.jpg" },
        { name: "Connor Pritchard", position: "Flanker", club: "Griffiths (Australia)", caps: 22, image: "/images/teams/player-placeholder.webp" },
        { name: "Edward Sigauke", position: "Winger", club: "Old Hararians", caps: 10, image: "/images/teams/headshots/Edward Sigauke.jpg" },
        { name: "Victor Mupunga", position: "Prop", club: "US Bourg-En-Bresse", caps: 12, image: "/images/teams/player-placeholder.webp" },
        { name: "Simbarashe Mandioma", position: "Hooker", club: "C.P. Les Abelles", caps: 55, image: "/images/teams/headshots/Simbarashe Mandioma.jpg" },
        { name: "Bryan Chiang", position: "Hooker", club: "Old Hararians", caps: 2, image: "/images/teams/headshots/Bryan Chiang.jpg" },
        { name: "Brian Makamure", position: "Prop", club: "Old Georgians", caps: 30, image: "/images/teams/headshots/Brian Makamure.jpg" },
        { name: "Godfrey Muzanargwo", position: "Lock", club: "Valke", caps: 27, image: "/images/teams/headshots/Godfrey Muzanargwo.jpg" },
        { name: "Kudakwashe Nyakufaringwa", position: "Lock", club: "Budowlani Lublin", caps: 9, image: "/images/teams/headshots/Kudakwashe Nyakufaringwa.jpg" },
        { name: "Brendon Marume", position: "Flanker", club: "Harare Sports Club", caps: 40, image: "/images/teams/headshots/Brendon Marume.jpg" },
        { name: "Dylan Utete", position: "Flanker", club: "Villagers RFC", caps: 7, image: "/images/teams/headshots/Dylan Utete.jpg" },
        { name: "Munashe Mhere", position: "Flanker", club: "The Bulls", caps: 5, image: "/images/teams/headshots/Munashe Mhere.jpg" },
        { name: "Dion Khumalo", position: "Fly-half", club: "Cobras", caps: 8, image: "/images/teams/headshots/Dion Khumalo.jpg" },
        { name: "Ian Prior", position: "Scrum-half", club: "Associates", caps: 8, image: "/images/teams/headshots/Ian Prior.jpg" },
        { name: "Keegan Jourbert", position: "Scrum-half", club: "DHL Stormers", caps: 5, image: "/images/teams/headshots/Keegan Jourbert.jpg" },
        { name: "Kyle Godwin", position: "Centre", club: "Brumbies", caps: 12, image: "/images/teams/headshots/Kyle Godwin.jpg" },
        { name: "Andrew Tandy", position: "Wing", club: "Old Hararians", caps: 8, image: "/images/teams/player-placeholder.webp" },
        { name: "David Makamba", position: "Wing", club: "Harare Sports Club", caps: 3, image: "/images/teams/headshots/David Makamba.jpg" },
        { name: "Lynton Nembaware", position: "Utility Back", club: "Harare Sports Club", caps: 4, image: "/images/teams/player-placeholder.webp" },
        { name: "Bornwell Gwinji", position: "Prop", club: "Nice (France)", caps: 11, image: "/images/teams/headshots/Bornwell Gwinji.jpg" },
        { name: "Brandan Mudzekenyedzi", position: "Centre", club: "Harare Sports Club", caps: 6, image: "/images/teams/headshots/Brandan Mudzekenyedzi.jpg" },
        { name: "Simbarashe Siraha", position: "Lock", club: "Gernika Rugby Club", caps: 9, image: "/images/teams/headshots/Simbarashe Siraha.jpg" },
        { name: "Tadius Hwata", position: "Flanker", club: "Harare Sports Club", caps: 10, image: "/images/teams/headshots/Tadius Hwata.jpg" },
        { name: "Trevor Gurwe", position: "Flanker", club: "Old Georgians", caps: 7, image: "/images/teams/headshots/Trevor Gurwe copy.jpg" }
      ],
      matches: [
        { opponent: "Algeria", opponentLogo: "https://flagcdn.com/w160/dz.png", date: "27 July 2025", venue: "Tunis", score: "29 - 3", status: "completed" },
        { opponent: "Zambia", opponentLogo: "https://flagcdn.com/w160/zm.png", date: "25 April 2026", venue: "Harare Sports Club", status: "upcoming" },
        { opponent: "USA", opponentLogo: "https://flagcdn.com/w160/us.png", date: "4 July 2026", venue: "Denver, Colorado", status: "upcoming" }
      ],
      gallery: [
        "/images/media/vid1.jpg",
        "/images/media/vid2.jpg",
        "/images/events/africa-cup.jpg"
      ]
    },
    "lady-sables": {
      id: "lady-sables",
      name: "Lady Sables",
      tagline: "Zimbabwe's senior women's XV team.",
      history: "The Lady Sables represent the top tier of women's 15s rugby in Zimbabwe. They compete in Rugby Africa tournaments and are key drivers of female sport development in the nation.",
      stats: [
        { label: "Africa Cup Apps", value: "4" },
        { label: "Registered Players", value: "1,200+" },
        { label: "WR Ranking", value: "#48" }
      ],
      coachingStaff: [
        { name: "Lindiwe Ndlela", role: "Head Coach" },
        { name: "Sikhumbuzo Mabuza", role: "Assistant Coach" }
      ],
      squad: [
        { name: "Constance Ngwende", position: "Scrum-half / Captain", club: "Harare Sports Club", caps: 18, image: "/images/teams/player-placeholder.webp" },
        { name: "Delight Mukomondo", position: "Hooker", club: "Old Georgians", caps: 12, image: "/images/teams/player-placeholder.webp" },
        { name: "Chiara Gwasira", position: "Fly-half", club: "Harare Sports Club", caps: 15, image: "/images/teams/player-placeholder.webp" }
      ],
      matches: [
        { opponent: "Madagascar", opponentLogo: "https://flagcdn.com/w160/mg.png", date: "15 Oct 2025", venue: "Antananarivo", score: "10 - 24", status: "completed" },
        { opponent: "Kenya", opponentLogo: "https://flagcdn.com/w160/ke.png", date: "18 May 2026", venue: "Nairobi", status: "upcoming" }
      ],
      gallery: [
        "/images/teams/lady-sables.jpg",
        "/images/events/schools-fest.jpg"
      ]
    },
    "junior-sables": {
      id: "junior-sables",
      name: "Junior Sables (U20)",
      tagline: "The reigning Barthes Trophy U20 champions.",
      history: "The Junior Sables are one of Africa's powerhouse age-grade teams, having secured multiple Barthes Trophy titles. They serve as the direct pipeline to the senior Sables squad.",
      stats: [
        { label: "Barthes Cup Titles", value: "3" },
        { label: "World Trophy Apps", value: "4" },
        { label: "Graduated Players", value: "35+" }
      ],
      coachingStaff: [
        { name: "Shaun De Souza", role: "Head Coach" },
        { name: "Marvin Chirume", role: "Team Manager" }
      ],
      squad: [
        { name: "Shingi Manyarara", position: "Number 8 / Captain", club: "Sharks Academy (SA)", caps: 15, image: "/images/teams/player-placeholder.webp" },
        { name: "Benoni Nsubuga", position: "Winger", club: "Old Georgians", caps: 10, image: "/images/teams/player-placeholder.webp" },
        { name: "Huntley Masterson", position: "Flanker", club: "Falcon College", caps: 12, image: "/images/teams/player-placeholder.webp" }
      ],
      matches: [
        { opponent: "Namibia U20", opponentLogo: "https://flagcdn.com/w160/na.png", date: "22 April 2025", venue: "Harare", score: "28 - 20", status: "completed" },
        { opponent: "Kenya U20", opponentLogo: "https://flagcdn.com/w160/ke.png", date: "20 May 2026", venue: "Harare Sports Club", status: "upcoming" }
      ],
      gallery: [
        "/images/teams/junior-sables.jpg",
        "/images/events/super-league.jpg"
      ]
    },
    "cheetahs": {
      id: "cheetahs",
      name: "Zimbabwe Cheetahs",
      tagline: "The national men's sevens team.",
      history: "The Cheetahs compete globally in sevens rugby, participating in World Rugby Sevens Challenger series and Olympic qualification events. They are known for speed, flair, and high-tempo play.",
      stats: [
        { label: "Africa 7s Titles", value: "2" },
        { label: "World Series Apps", value: "12" },
        { label: "Sevens Ranking", value: "#5 in Africa" }
      ],
      coachingStaff: [
        { name: "Ricky Chirengende", role: "Head Coach" },
        { name: "Tafadzwa Mhende", role: "Physiotherapist" }
      ],
      squad: [
        { name: "Ryan Musumhi", position: "Playmaker / Captain", club: "Old Georgians", caps: 30, image: "/images/teams/player-placeholder.webp" },
        { name: "Godwin Mangenje", position: "Forward", club: "Harare Sports Club", caps: 25, image: "/images/teams/player-placeholder.webp" },
        { name: "Shadreck Mandaza", position: "Utility", club: "Old Hararians", caps: 15, image: "/images/teams/player-placeholder.webp" }
      ],
      matches: [
        { opponent: "Uganda 7s", opponentLogo: "https://flagcdn.com/w160/ug.png", date: "12 Nov 2025", venue: "Dubai", score: "19 - 14", status: "completed" },
        { opponent: "Namibia 7s", opponentLogo: "https://flagcdn.com/w160/na.png", date: "15 April 2026", venue: "Harare", status: "upcoming" }
      ],
      gallery: [
        "/images/teams/cheetahs.jpg",
        "/images/media/vid1.jpg"
      ]
    },
    "u20": {
      id: "u20",
      name: "Zimbabwe U20 Development",
      tagline: "Under-20 Academy and Development side.",
      history: "Representing the development and academy tier of our U20 group, this side plays crucial bilateral fixtures and serves as a testing ground for domestic talent preparing for the Junior Sables.",
      stats: [
        { label: "Active Pool", value: "45 Players" },
        { label: "Tournaments", value: "Barthes Plate" },
        { label: "Domestic Grads", value: "10/yr" }
      ],
      coachingStaff: [
        { name: "Gordon Pangeti", role: "Head Coach" }
      ],
      squad: [
        { name: "Tino Mwasangwale", position: "Prop", club: "Peterhouse", caps: 5, image: "/images/teams/player-placeholder.webp" },
        { name: "Kuda Nyamushanya", position: "Lock", club: "St George's College", caps: 8, image: "/images/teams/player-placeholder.webp" }
      ],
      matches: [
        { opponent: "Botswana U20", opponentLogo: "https://flagcdn.com/w160/bw.png", date: "10 Aug 2025", venue: "Gaborone", score: "34 - 12", status: "completed" },
        { opponent: "Zambia U20", opponentLogo: "https://flagcdn.com/w160/zm.png", date: "29 April 2026", venue: "Harare", status: "upcoming" }
      ],
      gallery: [
        "/images/teams/junior-sables.jpg",
        "/images/events/super-league.jpg"
      ]
    }
  };

export async function getTeamData(slug: string): Promise<Team | null> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directusFetch<any>('teams', {
        filter: {
          slug: { _eq: slug }
        },
        limit: 1
      });
      if (response?.[0]) {
        const team = response[0];
        const mock = MOCK_TEAMS[slug];

        const parseJson = (value: any, fallback: any): any => {
          if (Array.isArray(value)) return value;
          if (value) {
            try {
              const parsed = JSON.parse(value);
              if (Array.isArray(parsed)) return parsed;
            } catch {
              // malformed JSON — fall through to fallback
            }
          }
          return fallback;
        };

        return {
          id: team.slug || team.id,
          name: team.name || mock?.name || "",
          tagline: team.tagline || mock?.tagline || "",
          history: team.history || mock?.history || "",
          stats: parseJson(team.stats, mock?.stats || []),
          coachingStaff: parseJson(team.coaching_staff, mock?.coachingStaff || []),
          squad: parseJson(team.squad, mock?.squad || []).map((s: any) => ({
            name: s.name,
            position: s.position,
            club: s.club,
            caps: s.caps ? Number(s.caps) : undefined,
            image: s.image || "/images/teams/player-placeholder.webp"
          })),
          matches: parseJson(team.matches, mock?.matches || []).map((m: any) => ({
            opponent: m.opponent,
            opponentLogo: m.opponentLogo || "",
            date: m.date || "",
            venue: m.venue || "TBA",
            score: m.score,
            status: m.status || "upcoming"
          })),
          gallery: parseJson(team.gallery, mock?.gallery || [])
        };
      }
    }
  } catch (error) {
    console.warn(`Directus fetch failed for team ${slug}, falling back to mock data:`, error);
  }

  return MOCK_TEAMS[slug] || null;
}

export async function getAllTeamFixtures(): Promise<any[]> {
  const slugs = ["sables", "lady-sables", "junior-sables", "cheetahs", "u20"];
  const teamDataList = await Promise.all(slugs.map(slug => getTeamData(slug)));
  const allFixtures: any[] = [];
  
  const CATEGORY_MAP: Record<string, string> = {
    "u20": "U20",
    "junior-sables": "Junior Sables",
    "cheetahs": "Cheetahs",
    "lady-sables": "Lady Sables",
    "sables": "Sables"
  };

  teamDataList.forEach((team, teamIdx) => {
    if (!team) return;
    const slug = slugs[teamIdx];
    const teamName = team.name;

    team.matches.forEach((m: any, idx: number) => {
      let matchDate = new Date();
      let isInvalidDate = false;
      try {
        matchDate = new Date(m.date);
        if (isNaN(matchDate.getTime())) {
          isInvalidDate = true;
        }
      } catch {
        isInvalidDate = true;
      }

      if (isInvalidDate) {
        console.warn(`Skipping invalid match date formatting for team ${slug}: "${m.date}"`);
        return; // skip match with parsing failure rather than defaulting to today
      }

      const rawScores = m.score ? m.score.split("-").map((s: string) => parseInt(s.trim())) : [];
      const homeScore = (rawScores[0] !== undefined && !isNaN(rawScores[0])) ? rawScores[0] : undefined;
      const awayScore = (rawScores[1] !== undefined && !isNaN(rawScores[1])) ? rawScores[1] : undefined;

      allFixtures.push({
        id: `team-match-${slug}-${idx}`,
        competition: teamName,
        round: m.status === "completed" ? "Result" : "Fixture",
        date: matchDate,
        time: "15:00",
        venue: m.venue || "TBA",
        homeTeam: {
          name: teamName,
          score: m.status === "completed" ? homeScore : undefined,
          logo: "/logo.png"
        },
        awayTeam: {
          name: m.opponent,
          score: m.status === "completed" ? awayScore : undefined,
          logo: m.opponentLogo
        },
        status: m.status || "upcoming",
        teamCategory: CATEGORY_MAP[slug] || "Sables"
      });
    });
  });

  return allFixtures;
}

const BENTO_TEAMS: BentoTeam[] = [
  {
    id: "sables", slug: "sables", shortName: "SABLES", fullName: "ZIMBABWE SABLES",
    category: "Senior Men's 15s National Team", format: "15s", formatLabel: "XV-A-Side Union",
    accent: "#006747", jerseyColors: ["#006747", "#D4A843"],
    tagline: "Reigning Africa Champions driving towards the global stage.",
    description: "The flagship men's 15s national team representing Zimbabwe on the world rugby stage.",
    ranking: "#28 World", rankingValue: "#28", worldRankingTier: "Tier 2 Nation",
    keyHonour: "Africa Cup Champions", recentRecord: ["W", "W", "W", "W", "L"],
    pathway: "From Junior Sables", squadSize: 36,
    heroImage: "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp",
    featuredImage: "/images/gallery/sables-0351.webp", featuredPlayer: "Tinotenda Masekere",
    stats: [{ label: "Africa Cup Titles", value: "2" }, { label: "RWC Appearances", value: "2" }, { label: "Senior Roster", value: "36" }],
    href: "/teams/sables"
  },
  {
    id: "lady-sables", slug: "lady-sables", shortName: "LADY SABLES", fullName: "LADY SABLES",
    category: "Senior Women's National Team", format: "15s", formatLabel: "XV-A-Side Union",
    accent: "#00C88C", jerseyColors: ["#006747", "#FFFFFF"],
    tagline: "The pride of women's rugby in Zimbabwe, competing across Africa.",
    description: "Zimbabwe's senior women's national team.",
    ranking: "Africa Top 8", rankingValue: "Top 8", worldRankingTier: "Continental Contender",
    keyHonour: "Continental Contenders", recentRecord: ["L", "W", "L", "W", "L"],
    pathway: "Schools & Clubs Pipeline", squadSize: 30,
    heroImage: "/images/hero/lady-sables.webp",
    featuredImage: "/images/gallery/sables-women-9.webp", featuredPlayer: "Paidashe Kambanje",
    stats: [{ label: "Africa Cup Apps", value: "4" }, { label: "Registered Players", value: "1.2K+" }, { label: "Senior Roster", value: "30" }],
    href: "/teams/lady-sables"
  },
  {
    id: "cheetahs", slug: "cheetahs", shortName: "CHEETAHS", fullName: "ZIMBABWE CHEETAHS",
    category: "Senior Men's Sevens Team", format: "7s", formatLabel: "Sevens Series",
    accent: "#00704D", jerseyColors: ["#006747", "#D4A843"],
    tagline: "High-octane sevens with pace, flair, and Olympic ambition.",
    description: "High-octane sevens squad representing Zimbabwe on the World Rugby Sevens Challenger Series.",
    ranking: "WR Challenger Series", rankingValue: "Challenger", worldRankingTier: "Sevens Circuit",
    keyHonour: "Africa 7s Podium", recentRecord: ["W", "W", "L", "W", "L"],
    pathway: "Crossover from Sables", squadSize: 18,
    heroImage: "/images/teams/cheetahs.jpg",
    featuredImage: "/images/teams/cheetahs.jpg", featuredPlayer: "Shane Makombe",
    stats: [{ label: "Circuit", value: "WR 7s" }, { label: "Speed Tier", value: "Elite" }, { label: "Squad Roster", value: "18" }],
    href: "/teams/cheetahs"
  },
  {
    id: "junior-sables", slug: "junior-sables", shortName: "JUNIOR SABLES", fullName: "JUNIOR SABLES",
    category: "U20 Men's 15s National Team", format: "15s", formatLabel: "XV-A-Side Union",
    accent: "#00452A", jerseyColors: ["#006747", "#FFFFFF"],
    tagline: "Back-to-back Barthes Trophy champions building the future.",
    description: "Back-to-back Barthes Trophy African U20 Champions and World Rugby Junior Trophy contenders.",
    ranking: "Africa U20 #1", rankingValue: "#1 Africa", worldRankingTier: "U20 Continental Elite",
    keyHonour: "Barthes Trophy Champions", recentRecord: ["W", "W", "W", "W", "W"],
    pathway: "Feeds Senior Sables", squadSize: 32,
    heroImage: "/images/hero/zim-u20s.webp",
    featuredImage: "/images/hero/zim-u20s.webp", featuredPlayer: "Tendai Mawara",
    stats: [{ label: "Barthes Cup", value: "1st" }, { label: "World Trophy", value: "Finalists" }, { label: "U20 Roster", value: "32" }],
    href: "/teams/junior-sables"
  }
];

export async function getTeamsList(): Promise<BentoTeam[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const items = await directusFetch<any>('teams', {
        filter: { is_national_team: { _eq: true } },
        sort: ['display_order'],
        limit: 10
      }, 300);

      if (items.length > 0) {
        return items.map((t) => {
          const slug = t.slug || "";
          const bento = BENTO_TEAMS.find(b => b.slug === slug);
          return {
            id: slug,
            slug,
            shortName: t.short_name || bento?.shortName || t.name,
            fullName: t.name || bento?.fullName || "",
            category: bento?.category || "",
            format: bento?.format || "15s",
            formatLabel: bento?.formatLabel || "",
            accent: t.primary_color || bento?.accent || "#006747",
            jerseyColors: [t.primary_color || "#006747", t.secondary_color || "#D4A843"] as [string, string],
            tagline: t.tagline || bento?.tagline || "",
            description: bento?.description || "",
            ranking: bento?.ranking || "",
            rankingValue: bento?.rankingValue || "",
            worldRankingTier: bento?.worldRankingTier || "",
            keyHonour: bento?.keyHonour || "",
            recentRecord: bento?.recentRecord || [],
            pathway: bento?.pathway || "",
            squadSize: (Array.isArray(t.squad) && t.squad.length > 0) ? t.squad.length : (bento?.squadSize || 0),
            heroImage: t.hero_image || bento?.heroImage || "",
            featuredImage: bento?.featuredImage || "",
            featuredPlayer: bento?.featuredPlayer || "",
            stats: Array.isArray(t.stats) ? t.stats : JSON.parse(t.stats || "[]"),
            href: `/teams/${slug}`
          };
        });
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for teams list, falling back to mock data:", error);
  }

  return BENTO_TEAMS;
}


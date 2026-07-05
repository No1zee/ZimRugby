import { Team } from "@/types";
import directus from "@/lib/directus/client";
import { readItems } from "@directus/sdk";

export async function getTeamData(slug: string): Promise<Team | null> {
  const teams: Record<string, Team> = {
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
        { name: "Piet Benade", role: "Head Coach" },
        { name: "Ricky Chirengende", role: "Assistant Coach" },
        { name: "TJ Chifokoyo", role: "Team Manager" }
      ],
      squad: [
        { name: "Hilton Mudariki", position: "Scrum-half / Captain", club: "Harare Sports Club", caps: 42, image: "/images/teams/player-placeholder.webp" },
        { name: "Tapfuma Parirenyatwa", position: "Flanker", club: "Old Georgians", caps: 35, image: "/images/teams/player-placeholder.webp" },
        { name: "Cleopas Kundiona", position: "Prop", club: "Nevers (France)", caps: 18, image: "/images/teams/player-placeholder.webp" },
        { name: "Kudzai Mashawi", position: "Centre", club: "Harare Sports Club", caps: 28, image: "/images/teams/player-placeholder.webp" },
        { name: "Connor Pritchard", position: "Flanker", club: "Griffiths (Australia)", caps: 22, image: "/images/teams/player-placeholder.webp" },
        { name: "Edward Sigauke", position: "Winger", club: "Old Hararians", caps: 10, image: "/images/teams/player-placeholder.webp" }
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

  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directus.request(
        readItems('teams', {
          filter: {
            slug: { _eq: slug }
          },
          fields: ['*', 'coaching_staff.*', 'squad.*', 'matches.*', 'gallery.*'],
          limit: 1
        })
      );
      if (response?.[0]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const team = response[0] as any;
        
        return {
          id: team.slug || team.id,
          name: team.name || "",
          tagline: team.tagline || "",
          history: team.history || "",
          stats: (team.stats || []).map((s: any) => ({ label: s.label, value: s.value })),
          coachingStaff: (team.coaching_staff || []).map((c: any) => ({ name: c.name, role: c.role })),
          squad: (team.squad || []).map((s: any) => ({
            name: s.name,
            position: s.position,
            club: s.club,
            caps: s.caps ? Number(s.caps) : undefined,
            image: s.image ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${s.image}` : (s.image_url || "/images/teams/player-placeholder.webp")
          })),
          matches: (team.matches || []).map((m: any) => ({
            opponent: m.opponent,
            opponentLogo: m.opponent_logo ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${m.opponent_logo}` : m.opponent_logo_url,
            date: m.date_label || new Date(m.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            venue: m.venue || "TBA",
            score: m.score,
            status: m.status || "upcoming"
          })),
          gallery: (team.gallery || []).map((img: any) => 
            img.image ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${img.image}` : img.image_url
          )
        };
      }
    }
  } catch (error) {
    console.warn(`Directus fetch failed for team ${slug}, falling back to mock data:`, error);
  }

  return teams[slug] || null;
}

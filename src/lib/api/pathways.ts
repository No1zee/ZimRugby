import { directusFetch } from "@/lib/directus/fetch";

export interface RugbyPathwayStage {
  id: number;
  title: string;
  category: string;
  age_group: string;
  description: string;
  icon_name?: string;
  link_url?: string;
  cta_label?: string;
  badge_text?: string;
  sort: number;
}

export async function getRugbyPathways(): Promise<RugbyPathwayStage[]> {
  try {
    const response = await directusFetch<any>("pathways", {
      filter: { is_active: { _eq: 1 } },
      sort: ["sort"],
    });

    if (response && response.length > 0) {
      return response.map((item: any) => ({
        id: Number(item.id),
        title: item.title,
        category: item.category,
        age_group: item.age_group,
        description: item.description,
        icon_name: item.icon_name,
        link_url: item.link_url,
        cta_label: item.cta_label,
        badge_text: item.badge_text,
        sort: Number(item.sort || 0),
      }));
    }
  } catch (error) {
    console.warn("Directus fetch failed for pathways:", error);
  }

  // Fallback default pathways if Directus is offline
  return [
    {
      id: 1,
      title: "Get Into Rugby (GIR)",
      category: "Grassroots",
      age_group: "U6 - U12",
      description: "Introducing rugby fundamentals, safety, sportsmanship, and teamwork to young boys and girls in schools across all 10 provinces of Zimbabwe.",
      icon_name: "Sprout",
      link_url: "/play-rugby",
      cta_label: "JOIN GRASSROOTS",
      badge_text: "ENTRY LEVEL",
      sort: 1,
    },
    {
      id: 2,
      title: "Schoolboy & Schoolgirl Leagues",
      category: "Youth & Schools",
      age_group: "U13 - U18",
      description: "Competitive inter-school leagues building match discipline, tactical understanding, and physical conditioning.",
      icon_name: "GraduationCap",
      link_url: "/schools",
      cta_label: "EXPLORE LEAGUES",
      badge_text: "PRIMARY & SECONDARY",
      sort: 2,
    },
    {
      id: 3,
      title: "Junior Sables (U20)",
      category: "High Performance",
      age_group: "U19 - U20",
      description: "National age-grade elite squad competing in the Barthes U20 Trophy and World Rugby U20 Trophy tournament pathways.",
      icon_name: "Trophy",
      link_url: "/teams/junior-sables",
      cta_label: "VIEW U20 SQUAD",
      badge_text: "NATIONAL TEAM",
      sort: 3,
    },
    {
      id: 4,
      title: "Provincial Club Rugby",
      category: "Senior Domestic",
      age_group: "18+ Years",
      description: "Harare Metropolitan, Bulawayo Metro, and Inter-Provincial club competitions developing club talent.",
      icon_name: "Shield",
      link_url: "/clubs",
      cta_label: "FIND A CLUB",
      badge_text: "DOMESTIC LEAGUE",
      sort: 4,
    },
    {
      id: 5,
      title: "Senior National Teams",
      category: "Elite Senior",
      age_group: "Open",
      description: "Representing Zimbabwe globally: Zimbabwe Sables (15s XVs), Lady Sables (Women's XVs), and Cheetahs (Sevens 7s).",
      icon_name: "Crown",
      link_url: "/teams",
      cta_label: "MEET THE SABLES",
      badge_text: "INTERNATIONAL ELITE",
      sort: 5,
    },
    {
      id: 6,
      title: "Coaching & Match Officiating",
      category: "Technical IAM",
      age_group: "All Levels",
      description: "World Rugby accredited Level 1, 2 & 3 coaching certifications and referee academy courses.",
      icon_name: "Award",
      link_url: "/portal",
      cta_label: "BECOME AN OFFICIAL",
      badge_text: "TECHNICAL ROLES",
      sort: 6,
    },
  ];
}

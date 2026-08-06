import { directusFetch } from "@/lib/directus/fetch";
import { assetUrl } from "@/lib/directus/assets";
import { getSchoolInitiatives } from "@/lib/api/schools";

export interface GrassrootsInitiative {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  stats: string;
  image: string;
  link: string;
  btnText: string;
  gradient: string;
  accentGlow: string;
}

interface DirectusGrassrootsInitiative {
  id: string | number;
  title?: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  stat?: string;
  stat_label?: string;
  image?: string;
  link?: string;
  sort?: number | null;
  status?: string;
}

const FALLBACK_INITIATIVES: GrassrootsInitiative[] = [
  {
    id: "schools-league",
    title: "Schoolboy & Schoolgirl Leagues",
    badge: "YOUTH PATHWAYS",
    subtitle: "PRIMARY & SECONDARY SCHOOLS",
    description: "Connecting provincial primary and high school rugby leagues directly to national age-grade squad selection.",
    stats: "120+ Participating Schools",
    image: "/images/schools/schoolboy-team-group.jpg",
    link: "/schools",
    btnText: "EXPLORE",
    gradient: "from-[#003822] via-[#002B19] to-[#001D11]",
    accentGlow: "rgba(0,200,83,0.25)",
  },
  {
    id: "get-into-rugby",
    title: "World Rugby 'Get Into Rugby'",
    badge: "GRASSROOTS DEVELOPMENT",
    subtitle: "PROVINCIAL PARTICIPATION",
    description: "Introducing try, play, and stay rugby principles to young boys and girls across all 10 provinces of Zimbabwe.",
    stats: "15,000+ Active Children",
    image: "/images/events/super-league.jpg",
    link: "/play-rugby",
    btnText: "PLAY GRASSROOTS RUGBY",
    gradient: "from-[#00301D] via-[#002315] to-[#00170E]",
    accentGlow: "rgba(16,185,129,0.25)",
  },
  {
    id: "provincial-academies",
    title: "Provincial High-Performance Hubs",
    badge: "COACHING & REFEREES",
    subtitle: "REGIONAL DEVELOPMENT HUBS",
    description: "Empowering local coaches, match officials, and club academies in Harare, Bulawayo, Mutare, Gweru & Masvingo.",
    stats: "10 Regional Hubs",
    image: "/images/events/africa-cup.jpg",
    link: "/clubs",
    btnText: "FIND A LOCAL HUB",
    gradient: "from-[#002D1A] via-[#001F12] to-[#00120B]",
    accentGlow: "rgba(5,150,105,0.25)",
  },
];

export async function getGrassrootsInitiatives(): Promise<GrassrootsInitiative[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const items = await directusFetch<DirectusGrassrootsInitiative>(
        "grassroots_initiatives",
        { filter: { status: { _eq: "published" } }, sort: ["sort"] },
        60
      );
      if (items.length > 0) {
        return items.map((item) => ({
          id: String(item.id),
          title: item.title || "",
          badge: item.badge || "GRASSROOTS DEVELOPMENT",
          subtitle: item.subtitle || "",
          description: item.description || "",
          stats: [item.stat, item.stat_label].filter(Boolean).join(" "),
          image: assetUrl(item.image) || item.image || "/images/schools/schoolboy-team-group.jpg",
          link: item.link || "/schools",
          btnText: "EXPLORE",
          gradient: "from-[#003822] via-[#002B19] to-[#001D11]",
          accentGlow: "rgba(0,200,83,0.25)",
        }));
      }
    }
  } catch {
    /* fall through to school_initiatives / fallback */
  }

  try {
    const schoolInitiatives = await getSchoolInitiatives();
    if (schoolInitiatives.length > 0) {
      return schoolInitiatives.map((si, i) => {
        const f = FALLBACK_INITIATIVES[i] || FALLBACK_INITIATIVES[0];
        return {
          id: String(si.id),
          title: si.title,
          badge: f.badge,
          subtitle: f.subtitle,
          description: si.description || f.description,
          stats: si.stat || f.stats,
          image: f.image,
          link: f.link,
          btnText: f.btnText,
          gradient: f.gradient,
          accentGlow: f.accentGlow,
        };
      });
    }
  } catch {
    /* fall through to fallback */
  }
  return FALLBACK_INITIATIVES;
}

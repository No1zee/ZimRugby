/**
 * Standardized Team & Federation Logo Resolver
 * Zero-latency local asset resolver for national teams and federations.
 */

const TEAM_LOGOS: Record<string, string> = {
  // Zimbabwe National Teams
  zimbabwe: "/images/logos/zru-logo.svg",
  zim: "/images/logos/zru-logo.svg",
  sables: "/images/logos/zru-logo.svg",
  "zimbabwe sables": "/images/logos/zru-logo.svg",
  "lady sables": "/images/logos/zru-logo.svg",
  cheetahs: "/images/logos/zru-logo.svg",
  "zimbabwe cheetahs": "/images/logos/zru-logo.svg",
  "junior sables": "/images/logos/zru-logo.svg",

  // African Opponents & Unions
  namibia: "/images/teams/namibia.png",
  nam: "/images/teams/namibia.png",
  "namibia welwitschias": "/images/teams/namibia.png",

  kenya: "/images/teams/kenya.png",
  ken: "/images/teams/kenya.png",
  "kenya simbas": "/images/teams/kenya.png",
  "kenya u20": "/images/teams/kenya.png",

  uganda: "/images/teams/uganda.png",
  uga: "/images/teams/uganda.png",
  "uganda cranes": "/images/teams/uganda.png",

  zambia: "/images/teams/zambia.png",
  zam: "/images/teams/zambia.png",

  algeria: "/images/teams/algeria.png",
  alg: "/images/teams/algeria.png",

  tunisia: "/images/teams/tunisia.png",
  tun: "/images/teams/tunisia.png",
  "tunisia u20": "/images/teams/tunisia.png",

  botswana: "/images/teams/botswana.jpg",
  bot: "/images/teams/botswana.jpg",
  "botswana u20": "/images/teams/botswana.jpg",

  "ivory coast": "/images/teams/ivory-coast.png",
  "côte d'ivoire": "/images/teams/ivory-coast.png",
  civ: "/images/teams/ivory-coast.png",

  senegal: "/images/teams/senegal.png",
  sen: "/images/teams/senegal.png",

  "south africa": "/images/teams/south-africa.png",
  rsa: "/images/teams/south-africa.png",
  springboks: "/images/teams/south-africa.png",

  // International Tier 2 / Global Opponents
  usa: "/images/teams/usa.svg",
  "united states": "/images/teams/usa.svg",
  "usa eagles": "/images/teams/usa.svg",

  canada: "/images/teams/canada.svg",
  can: "/images/teams/canada.svg",

  tonga: "/images/teams/tonga.png",
  ton: "/images/teams/tonga.png",
  "ikale tahi": "/images/teams/tonga.png",

  samoa: "/images/teams/samoa.png",
  sam: "/images/teams/samoa.png",
  "manu samoa": "/images/teams/samoa.png",

  uruguay: "/images/teams/uruguay.png",
  uru: "/images/teams/uruguay.png",
  "los teros": "/images/teams/uruguay.png",

  chile: "/images/teams/chile.png",
  chi: "/images/teams/chile.png",
  "los cóndores": "/images/teams/chile.png",

  // Governing Bodies
  "world rugby": "/images/teams/world-rugby.svg",
  "rugby africa": "/images/teams/world-rugby.svg",
};

/**
 * Returns the standardized local logo path for a team name, country code, or Directus crest URL.
 */
export function getTeamEmblem(teamNameOrCode?: string | null, customCrest?: string | null): string {
  if (customCrest && (customCrest.startsWith("http") || customCrest.startsWith("/"))) {
    return customCrest;
  }

  if (!teamNameOrCode) {
    return "/images/logos/zru-logo.svg";
  }

  const key = teamNameOrCode.toLowerCase().trim();
  if (TEAM_LOGOS[key]) {
    return TEAM_LOGOS[key];
  }

  // Partial match search
  for (const [name, logoPath] of Object.entries(TEAM_LOGOS)) {
    if (key.includes(name) || name.includes(key)) {
      return logoPath;
    }
  }

  return "/images/logos/zru-logo.svg";
}

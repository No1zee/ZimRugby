/**
 * Standardized Team & Federation Logo Resolver
 * Zero-latency local asset resolver for national teams and federations.
 */

import { getTeamCrestUrl } from "./flags";

const TEAM_LOGOS: Record<string, string> = {
  // Zimbabwe National Teams
  zimbabwe: "/images/crests/zru-sables.svg",
  zim: "/images/crests/zru-sables.svg",
  sables: "/images/crests/zru-sables.svg",
  "zimbabwe sables": "/images/crests/zru-sables.svg",
  "lady sables": "/images/crests/lady-sables.svg",
  "zimbabwe lady sables": "/images/crests/lady-sables.svg",
  cheetahs: "/images/crests/cheetahs-7s.svg",
  "zimbabwe cheetahs": "/images/crests/cheetahs-7s.svg",
  "cheetahs 7s": "/images/crests/cheetahs-7s.svg",
  "junior sables": "/images/crests/junior-sables.svg",
  "zimbabwe junior sables": "/images/crests/junior-sables.svg",
  "zimbabwe u20": "/images/crests/junior-sables.svg",
  goshawks: "/images/crests/goshawks.svg",
  "zimbabwe goshawks": "/images/crests/goshawks.svg",

  // International & African Unions (Official Federation Shields)
  england: "/images/crests/england-rfu.svg",
  "england rugby": "/images/crests/england-rfu.svg",
  wales: "/images/crests/wales-feathers.svg",
  "wales rugby": "/images/crests/wales-feathers.svg",
  uganda: "/images/teams/uganda.svg",
  "uganda lady cranes": "/images/teams/uganda.svg",
  "uganda cranes": "/images/teams/uganda.svg",
  "south africa": "/images/teams/south-africa.svg",
  "south africa a": "/images/teams/south-africa.svg",
  springboks: "/images/teams/south-africa.svg",
  "new zealand": "/images/crests/all-blacks-fern.svg",
  "all blacks": "/images/crests/all-blacks-fern.svg",
  kenya: "/images/teams/kenya.svg",
  "kenya simbas": "/images/teams/kenya.svg",
  "kenya u20": "/images/teams/kenya.svg",
  simbas: "/images/teams/kenya.svg",
  namibia: "/images/teams/namibia.svg",
  "namibia welwitschias": "/images/teams/namibia.svg",
  welwitschias: "/images/teams/namibia.svg",
  zambia: "/images/teams/zambia.svg",
  algeria: "/images/teams/algeria.svg",
  botswana: "/images/teams/botswana.svg",
  chile: "/images/teams/chile.svg",
  canada: "/images/teams/canada.svg",
  usa: "/images/teams/usa.svg",
  "united states": "/images/teams/usa.svg",
  france: "/images/crests/france-coq.svg",
  ireland: "/images/crests/ireland-shamrock.svg",
  scotland: "/images/crests/scotland-thistle.svg",
  "scotland u20": "/images/crests/scotland-thistle.svg",
  australia: "/images/crests/australia-wallaby.svg",
  wallabies: "/images/crests/australia-wallaby.svg",
};

/**
 * Returns the standardized local logo path for a team name, country code, or Directus crest URL.
 */
export function getTeamEmblem(teamNameOrCode?: string | null, customCrest?: string | null): string {
  if (customCrest && (customCrest.startsWith("http") || customCrest.startsWith("/")) && !customCrest.includes("flagcdn.com")) {
    return customCrest;
  }

  if (!teamNameOrCode) {
    return "/images/crests/zru-sables.png";
  }

  const key = teamNameOrCode.toLowerCase().trim();
  if (TEAM_LOGOS[key]) {
    return TEAM_LOGOS[key];
  }

  // Partial match search in TEAM_LOGOS
  for (const [name, logoPath] of Object.entries(TEAM_LOGOS)) {
    if (key.includes(name) || name.includes(key)) {
      return logoPath;
    }
  }

  // Fallback to official Rugby Union Crest & ISO Flag Engine
  return getTeamCrestUrl(teamNameOrCode);
}

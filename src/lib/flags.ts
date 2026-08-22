export const UNION_CRESTS_MAP: Record<string, string> = {
  // Zimbabwe National Squads (Official Sable Antelope Crest)
  "Zimbabwe": "/images/teams/zimbabwe.png",
  "Zimbabwe Sables": "/images/teams/zimbabwe.png",
  "Sables": "/images/teams/zimbabwe.png",
  "Zimbabwe Lady Sables": "/images/teams/zimbabwe.png",
  "Lady Sables": "/images/teams/zimbabwe.png",
  "Zimbabwe U20": "/images/teams/zimbabwe.png",
  "Zimbabwe Junior Sables": "/images/teams/zimbabwe.png",
  "Junior Sables": "/images/teams/zimbabwe.png",
  "Zimbabwe Cheetahs 7s": "/images/teams/zimbabwe.png",
  "Cheetahs 7s": "/images/teams/zimbabwe.png",
  "Zimbabwe Goshawks": "/images/teams/zimbabwe.png",
  "Goshawks": "/images/teams/zimbabwe.png",

  // International & African Rugby Unions (Official Federation Shields)
  "South Africa": "/images/teams/south-africa.svg",
  "South Africa A": "/images/teams/south-africa.svg",
  "South Africa 'A'": "/images/teams/south-africa.svg",
  "Springboks": "/images/teams/south-africa.svg",
  "Namibia": "/images/teams/namibia.svg",
  "Namibia Welwitschias": "/images/teams/namibia.svg",
  "Welwitschias": "/images/teams/namibia.svg",
  "Kenya": "/images/teams/kenya.svg",
  "Kenya Simbas": "/images/teams/kenya.svg",
  "Kenya U20": "/images/teams/kenya.svg",
  "Simbas": "/images/teams/kenya.svg",
  "Uganda": "/images/teams/uganda.svg",
  "Uganda Lady Cranes": "/images/teams/uganda.svg",
  "Uganda Cranes": "/images/teams/uganda.svg",
  "Zambia": "/images/teams/zambia.svg",
  "Algeria": "/images/teams/algeria.svg",
  "Botswana": "/images/teams/botswana.svg",
  "Chile": "/images/teams/chile.svg",
  "Canada": "/images/teams/canada.svg",
  "USA": "/images/teams/usa.svg",
  "United States": "/images/teams/usa.svg",
  // European & Global Unions (Official Shields)
  "England": "/images/crests/england-rfu.svg",
  "England Rugby": "/images/crests/england-rfu.svg",
  "Wales": "/images/crests/wales-feathers.svg",
  "Wales Rugby": "/images/crests/wales-feathers.svg",
  "Scotland": "/images/crests/scotland-thistle.svg",
  "Scotland U20": "/images/crests/scotland-thistle.svg",
  "Ireland": "/images/crests/ireland-shamrock.svg",
  "France": "/images/crests/france-coq.svg",
  "New Zealand": "/images/crests/all-blacks-fern.svg",
  "All Blacks": "/images/crests/all-blacks-fern.svg",
  "Australia": "/images/crests/australia-wallaby.svg",
  "Wallabies": "/images/crests/australia-wallaby.svg",
  "Fiji": "/images/crests/fiji-drua.png",
  "Italy": "/images/crests/italy-fir.png",
  "Japan": "/images/crests/japan-blossoms.png",
  "Georgia": "/images/crests/georgia-lelos.png",
  "Portugal": "/images/crests/portugal-lobos.png",
  "Spain": "/images/crests/spain-leones.png",
  "Netherlands": "/images/crests/netherlands-rugby.png",
};

export const COUNTRY_ISO_MAP: Record<string, string> = {
  // Zimbabwe
  "Zimbabwe": "zw",
  "Zimbabwe Sables": "zw",
  "Zimbabwe U20": "zw",
  "Zimbabwe Lady Sables": "zw",
  "Zimbabwe Junior Sables": "zw",
  "Zimbabwe Cheetahs 7s": "zw",
  "Zimbabwe Goshawks": "zw",

  // Africa Cup & Regional
  "Namibia": "na",
  "Namibia Welwitschias": "na",
  "Kenya": "ke",
  "Kenya Simbas": "ke",
  "Kenya U20": "ke",
  "Uganda": "ug",
  "Uganda Lady Cranes": "ug",
  "South Africa": "za",
  "South Africa A": "za",
  "South Africa 'A'": "za",
  "Algeria": "dz",
  "Cote D'Ivoire": "ci",
  "Ivory Coast": "ci",
  "Zambia": "zm",
  "Botswana": "bw",
  "Botswana U20": "bw",
  "Morocco": "ma",
  "Tunisia": "tn",
  "Tunisia U20": "tn",
  "Madagascar": "mg",
  "Senegal": "sn",
  "Ghana": "gh",
  "Nigeria": "ng",
  "Cameroon": "cm",

  // International & World Cup
  "Netherlands": "nl",
  "Scotland": "gb-sct",
  "Scotland U20": "gb-sct",
  "England": "gb-eng",
  "Wales": "gb-wls",
  "Ireland": "ie",
  "France": "fr",
  "Italy": "it",
  "United States": "us",
  "USA": "us",
  "USA U20": "us",
  "Canada": "ca",
  "Canada 7s": "ca",
  "Uruguay": "uy",
  "Uruguay U20": "uy",
  "Tonga": "to",
  "Samoa": "ws",
  "Fiji": "fj",
  "Georgia": "ge",
  "Romania": "ro",
  "Portugal": "pt",
  "Spain": "es",
  "Germany": "de",
  "Belgium": "be",
  "Switzerland": "ch",
  "Argentina": "ar",
  "Australia": "au",
  "New Zealand": "nz",
  "Hong Kong": "hk",
  "Hong Kong China": "hk",
  "Hong Kong 7s": "hk",
  "Japan": "jp",
  "Korea": "kr",
  "South Korea": "kr",
  "South Korea 7s": "kr",
  "Jamaica": "jm",
  "Jamaica 7s": "jm",
  "United Arab Emirates": "ae",
  "UAE": "ae",
  "Brazil": "br",
  "Chile": "cl",
};

/**
 * Returns the authentic official rugby union crest (e.g. Sables, England Rose, Springbok, All Blacks, Wales Feathers)
 * falling back to the national ISO country flag if a union crest is unindexed.
 */
export function getTeamCrestUrl(teamName: string, customLogo?: string): string {
  const normalized = (teamName || "").trim();

  // If customLogo is an authentic uploaded crest (and NOT a flagcdn fallback), honor it
  if (customLogo && !customLogo.includes("flagcdn.com")) {
    return customLogo;
  }

  // 1. Direct Union Crest Map match
  if (UNION_CRESTS_MAP[normalized]) {
    return UNION_CRESTS_MAP[normalized];
  }

  // 2. Partial Union Crest match (e.g. "Wales" -> Wales Feathers)
  const foundUnion = Object.keys(UNION_CRESTS_MAP).find((k) =>
    normalized.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(normalized.toLowerCase())
  );
  if (foundUnion) {
    return UNION_CRESTS_MAP[foundUnion];
  }

  // 3. Fallback to ISO Country Flag
  const iso = COUNTRY_ISO_MAP[normalized];
  if (iso) {
    return `https://flagcdn.com/w160/${iso}.png`;
  }

  const foundIso = Object.keys(COUNTRY_ISO_MAP).find((k) =>
    normalized.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(normalized.toLowerCase())
  );
  if (foundIso) {
    return `https://flagcdn.com/w160/${COUNTRY_ISO_MAP[foundIso]}.png`;
  }

  return "/images/crests/zru-sables.png";
}

/**
 * Alias to getTeamCrestUrl for backwards compatibility across all components.
 */
export function getFlagUrl(countryName: string, customLogo?: string): string {
  return getTeamCrestUrl(countryName, customLogo);
}

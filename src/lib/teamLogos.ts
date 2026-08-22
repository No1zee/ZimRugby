/**
 * Standardized World Rugby National Shield & Team Logo Resolver
 * Uses official World Rugby high-res national team shields as primary source.
 */

// ISO Alpha-3 / World Rugby Code to Shield Path mapping
const WR_SHIELDS: Record<string, string> = {
  // Zimbabwe
  zim: "/images/shields/zim.webp",
  zimbabwe: "/images/shields/zim.webp",
  sables: "/images/shields/zim.webp",
  "zimbabwe sables": "/images/shields/zim.webp",
  "lady sables": "/images/shields/zim.webp",
  "zimbabwe lady sables": "/images/shields/zim.webp",
  "junior sables": "/images/shields/zim.webp",
  "zimbabwe junior sables": "/images/shields/zim.webp",
  "zimbabwe u20": "/images/shields/zim.webp",
  cheetahs: "/images/shields/zim.webp",
  "zimbabwe cheetahs": "/images/shields/zim.webp",
  goshawks: "/images/shields/zim.webp",
  "zimbabwe goshawks": "/images/shields/zim.webp",

  // Major Rugby Nations & Competitors
  rsa: "/images/shields/rsa.webp",
  "south africa": "/images/shields/rsa.webp",
  "south africa a": "/images/shields/rsa.webp",
  springboks: "/images/shields/rsa.webp",
  nzl: "/images/shields/nzl.webp",
  "new zealand": "/images/shields/nzl.webp",
  "all blacks": "/images/shields/nzl.webp",
  "black ferns": "/images/shields/nzl.webp",
  "black ferns xv": "/images/shields/nzl.webp",
  fji: "/images/shields/fji.webp",
  fij: "/images/shields/fij.webp",
  fiji: "/images/shields/fji.webp",
  "flying fijians": "/images/shields/fji.webp",
  aus: "/images/shields/aus.webp",
  australia: "/images/shields/aus.webp",
  wallabies: "/images/shields/aus.webp",
  eng: "/images/shields/eng.webp",
  england: "/images/shields/eng.webp",
  "england rugby": "/images/shields/eng.webp",
  wal: "/images/shields/wal.webp",
  wales: "/images/shields/wal.webp",
  "wales rugby": "/images/shields/wal.webp",
  sco: "/images/shields/sco.webp",
  scotland: "/images/shields/sco.webp",
  "scotland u20": "/images/shields/sco.webp",
  ire: "/images/shields/ire.webp",
  ireland: "/images/shields/ire.webp",
  fra: "/images/shields/fra.webp",
  france: "/images/shields/fra.webp",
  jpn: "/images/shields/jpn.webp",
  japan: "/images/shields/jpn.webp",
  "brave blossoms": "/images/shields/jpn.webp",
  ita: "/images/shields/ita.webp",
  italy: "/images/shields/ita.webp",
  geo: "/images/shields/geo.webp",
  georgia: "/images/shields/geo.webp",
  lelos: "/images/shields/geo.webp",
  sam: "/images/shields/sam.webp",
  samoa: "/images/shields/sam.webp",
  "manu samoa": "/images/shields/sam.webp",
  "samoa u20": "/images/shields/sam.webp",
  ton: "/images/shields/ton.webp",
  tga: "/images/shields/tga.webp",
  tonga: "/images/shields/ton.webp",
  "ikali tahi": "/images/shields/ton.webp",
  can: "/images/shields/can.webp",
  canada: "/images/shields/can.webp",
  usa: "/images/shields/usa.webp",
  "united states": "/images/shields/usa.webp",
  "usa eagles": "/images/shields/usa.webp",
  "usa u20": "/images/shields/usa.webp",
  uru: "/images/shields/uru.webp",
  uruguay: "/images/shields/uru.webp",
  "uruguay u20": "/images/shields/uru.webp",
  teros: "/images/shields/uru.webp",
  chl: "/images/shields/chl.webp",
  chile: "/images/shields/chl.webp",
  condores: "/images/shields/chl.webp",
  esp: "/images/shields/esp.webp",
  spain: "/images/shields/esp.webp",
  por: "/images/shields/por.webp",
  portugal: "/images/shields/por.webp",
  ned: "/images/shields/ned.webp",
  netherlands: "/images/shields/ned.webp",
  "netherlands u20": "/images/shields/ned.webp",

  // African Nations
  nam: "/images/shields/nam.webp",
  namibia: "/images/shields/nam.webp",
  welwitschias: "/images/shields/nam.webp",
  "namibia welwitschias": "/images/shields/nam.webp",
  ken: "/images/shields/ken.webp",
  kenya: "/images/shields/ken.webp",
  "kenya simbas": "/images/shields/ken.webp",
  "kenya u20": "/images/shields/ken.webp",
  simbas: "/images/shields/ken.webp",
  chipu: "/images/shields/ken.webp",
  uga: "/images/shields/uga.webp",
  uganda: "/images/shields/uga.webp",
  "uganda cranes": "/images/shields/uga.webp",
  "uganda lady cranes": "/images/shields/uga.webp",
  alg: "/images/shields/alg.webp",
  dza: "/images/shields/dza.webp",
  algeria: "/images/shields/alg.webp",
  civ: "/images/shields/civ.webp",
  "ivory coast": "/images/shields/civ.webp",
  "côte d'ivoire": "/images/shields/civ.webp",
  sen: "/images/shields/sen.webp",
  senegal: "/images/shields/sen.webp",
  tun: "/images/shields/tun.webp",
  tunisia: "/images/shields/tun.webp",
  mad: "/images/shields/mad.webp",
  madagascar: "/images/shields/mad.webp",
  gha: "/images/shields/gha.webp",
  ghana: "/images/shields/gha.webp",
  ngr: "/images/shields/ngr.webp",
  nigeria: "/images/shields/ngr.webp",
  zambia: "/images/shields/default.webp",
  botswana: "/images/shields/default.webp",
  
  // Governing Bodies
  "world rugby": "/images/teams/world-rugby.svg",
  "rugby africa": "/images/teams/rugby-africa.svg",
};

/**
 * Returns the official World Rugby national team shield for any team name or code.
 */
export function getTeamEmblem(teamNameOrCode?: string | null, customCrest?: string | null): string {
  if (customCrest && (customCrest.startsWith("http") || customCrest.startsWith("/")) && !customCrest.includes("flagcdn.com")) {
    return customCrest;
  }

  if (!teamNameOrCode) {
    return "/images/shields/zim.webp";
  }

  const key = teamNameOrCode.toLowerCase().trim();

  // Exact Match in World Rugby Shield Library
  if (WR_SHIELDS[key]) {
    return WR_SHIELDS[key];
  }

  // Partial Match in World Rugby Shield Library
  for (const [name, shieldPath] of Object.entries(WR_SHIELDS)) {
    if (key.includes(name) || name.includes(key)) {
      return shieldPath;
    }
  }

  // Fallback to World Rugby Default Shield
  return "/images/shields/default.webp";
}

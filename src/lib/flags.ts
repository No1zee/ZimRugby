
export const COUNTRY_ISO_MAP: Record<string, string> = {
  "Zimbabwe": "zw",
  "Zambia": "zm",
  "South Africa": "za",
  "South Africa 'A'": "za",
  "Uganda": "ug",
  "Kenya": "ke",
  "Namibia": "na",
  "Tonga": "to",
  "USA": "us",
  "Canada": "ca",
  "Hong Kong": "hk",
  "Japan": "jp",
  "Georgia": "ge",
  "Portugal": "pt",
  "Spain": "es",
  "Netherlands": "nl",
  "Germany": "de",
  "Brazil": "br",
  "Chile": "cl",
  "Uruguay": "uy",
};

export function getFlagUrl(countryName: string): string {
  const iso = COUNTRY_ISO_MAP[countryName];
  if (!iso) return "";
  return `https://flagcdn.com/w160/${iso}.png`;
}

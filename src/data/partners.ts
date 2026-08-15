export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
}

export interface PartnerTier {
  id: string;
  title: string;
  partners: Partner[];
}

export const partnerData: PartnerTier[] = [
  {
    id: "principal",
    title: "PRINCIPAL PARTNERS",
    partners: [
      { id: "nedbank", name: "Nedbank", logoUrl: "/images/sponsors/nedbank.jpeg", websiteUrl: "https://www.nedbank.co.zw" },
      { id: "zoc", name: "Zimbabwean Olympic Committee", logoUrl: "/images/sponsors/Zimbabwean Olympic Comitte-Logo.png", websiteUrl: "#" },
      { id: "src", name: "Sports and Recreation Commission", logoUrl: "/images/sponsors/src.png", websiteUrl: "#" },
    ]
  },
  {
    id: "official",
    title: "OFFICIAL PARTNERS",
    partners: [
      { id: "rugby-africa", name: "Rugby Africa", logoUrl: "/images/sponsors/Rugby Africa.png", websiteUrl: "https://www.rugbyafrique.com" },
      { id: "world-rugby", name: "World Rugby", logoUrl: "/images/sponsors/World_Rugby_logo.png", websiteUrl: "https://www.world.rugby" },
    ]
  }
];

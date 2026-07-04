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

// Helper to generate a sleek, premium SVG placeholder as a data URI
const generatePlaceholder = (text: string, width = 300, height = 150) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#1a1a1a" rx="8" />
    <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" letter-spacing="2">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

export const partnerData: PartnerTier[] = [
  {
    id: "principal",
    title: "PRINCIPAL PARTNERS",
    partners: [
      { id: "p1", name: "Brand Alpha", logoUrl: generatePlaceholder("BRAND ALPHA", 400, 150), websiteUrl: "#" },
      { id: "p2", name: "Omega Corp", logoUrl: generatePlaceholder("OMEGA CORP", 400, 150), websiteUrl: "#" },
    ]
  },
  {
    id: "official",
    title: "OFFICIAL PARTNERS",
    partners: [
      { id: "o1", name: "Tech Solutions", logoUrl: generatePlaceholder("TECH SOLUTIONS", 300, 120), websiteUrl: "#" },
      { id: "o2", name: "Global Finance", logoUrl: generatePlaceholder("GLOBAL FINANCE", 300, 120), websiteUrl: "#" },
      { id: "o3", name: "Airways", logoUrl: generatePlaceholder("AIRWAYS", 300, 120), websiteUrl: "#" },
      { id: "o4", name: "Energy Co", logoUrl: generatePlaceholder("ENERGY CO", 300, 120), websiteUrl: "#" },
    ]
  },
  {
    id: "sponsors",
    title: "OFFICIAL SPONSORS",
    partners: [
      { id: "s1", name: "Brewing Co", logoUrl: generatePlaceholder("BREWING CO", 250, 100), websiteUrl: "#" },
      { id: "s2", name: "Motors", logoUrl: generatePlaceholder("MOTORS", 250, 100), websiteUrl: "#" },
      { id: "s3", name: "Logistics", logoUrl: generatePlaceholder("LOGISTICS", 250, 100), websiteUrl: "#" },
      { id: "s4", name: "Telecom", logoUrl: generatePlaceholder("TELECOM", 250, 100), websiteUrl: "#" },
    ]
  },
  {
    id: "supporters",
    title: "OFFICIAL SUPPORTERS",
    partners: [
      { id: "sup1", name: "Fitness Group", logoUrl: generatePlaceholder("FITNESS", 200, 80), websiteUrl: "#" },
      { id: "sup2", name: "Medical", logoUrl: generatePlaceholder("MEDICAL", 200, 80), websiteUrl: "#" },
      { id: "sup3", name: "Media", logoUrl: generatePlaceholder("MEDIA", 200, 80), websiteUrl: "#" },
      { id: "sup4", name: "Retail", logoUrl: generatePlaceholder("RETAIL", 200, 80), websiteUrl: "#" },
      { id: "sup5", name: "Food", logoUrl: generatePlaceholder("FOOD", 200, 80), websiteUrl: "#" },
      { id: "sup6", name: "Apparel", logoUrl: generatePlaceholder("APPAREL", 200, 80), websiteUrl: "#" },
    ]
  }
];

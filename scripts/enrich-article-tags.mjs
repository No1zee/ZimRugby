import fs from "fs";
import path from "path";

const reportsPath = path.resolve(process.cwd(), "public/data/reports.json");
const reports = JSON.parse(fs.readFileSync(reportsPath, "utf8"));

// Comprehensive taxonomy for each article
// Primary categories supported in filter bar: "SABLES", "LADY SABLES", "JUNIOR SABLES", "ZRU", "DOMESTIC", "WOMEN'S RUGBY", "GRASSROOTS"
const articleTaxonomy = [
  {
    id: "0",
    category: "Sables",
    categories: ["Sables", "Nations Cup", "International", "Match Day", "Senior Men"]
  },
  {
    id: "1",
    category: "ZRU",
    categories: ["ZRU", "Governance", "Code of Conduct", "Referees", "Schools"]
  },
  {
    id: "2",
    category: "Sables",
    categories: ["Sables", "International", "Zambezi Challenge", "Match Series", "Senior Men"]
  },
  {
    id: "3",
    category: "Sables",
    categories: ["Sables", "International", "Double Header", "South Africa A", "Senior Men"]
  },
  {
    id: "4",
    category: "Sables",
    categories: ["Sables", "Squad Update", "Player Feature", "Battle of the Zambezi", "Senior Men"]
  },
  {
    id: "5",
    category: "Lady Sables",
    categories: ["Lady Sables", "Women's Rugby", "Africa Cup", "International", "Senior Women"]
  },
  {
    id: "6",
    category: "Lady Sables",
    categories: ["Lady Sables", "Player Feature", "Women's Rugby", "Grassroots", "Senior Women"]
  },
  {
    id: "7",
    category: "Women's Rugby",
    categories: ["Women's Rugby", "ZRU", "Lady Sables", "Development", "Africa Cup"]
  },
  {
    id: "8",
    category: "Sables",
    categories: ["Sables", "Coaching", "ANSA Awards", "Pieter Benade", "Senior Men"]
  },
  {
    id: "9",
    category: "Women's Rugby",
    categories: ["Women's Rugby", "Lady Sables", "Grassroots", "Domestic", "Rising Stars"]
  },
  {
    id: "10",
    category: "Sables",
    categories: ["Sables", "ANSA Awards", "National Pride", "ZRU", "Senior Men"]
  },
  {
    id: "11",
    category: "Domestic",
    categories: ["Domestic", "Club Rugby", "Nedbank Cup", "Harare", "ZRU"]
  },
  {
    id: "12",
    category: "Sables",
    categories: ["Sables", "Technical Team", "Africa Cup", "Coaching", "Senior Men"]
  },
  {
    id: "13",
    category: "Lady Sables",
    categories: ["Lady Sables", "Squad Update", "Player Feature", "Women's Rugby", "Senior Women"]
  },
  {
    id: "14",
    category: "Domestic",
    categories: ["Domestic", "Zim A", "Harare Sports Club", "Manicaland", "Club Rugby"]
  },
  {
    id: "15",
    category: "ZRU",
    categories: ["ZRU", "Olympic Committee", "Announcement", "Governance"]
  },
  {
    id: "16",
    category: "Junior Sables",
    categories: ["Junior Sables", "U20", "International", "Hartsfield", "Barbarians"]
  },
  {
    id: "17",
    category: "Lady Sables",
    categories: ["Lady Sables", "Squad Announcement", "Africa Cup", "Women's Rugby", "Senior Women"]
  },
  {
    id: "18",
    category: "Grassroots",
    categories: ["Grassroots", "Tag Rugby", "Women's Rugby", "Women's Month", "Development"]
  },
  {
    id: "19",
    category: "Sables",
    categories: ["Sables", "World Rugby Rankings", "Milestone", "International", "Senior Men"]
  },
  {
    id: "20",
    category: "Sables",
    categories: ["Sables", "Africa Cup Champions", "Historic Win", "International", "Senior Men"]
  },
  {
    id: "21",
    category: "Sables",
    categories: ["Sables", "Squad Announcement", "Africa Cup", "Uganda", "Senior Men"]
  }
];

reports.forEach((report) => {
  const tax = articleTaxonomy.find((t) => t.id === String(report.id));
  if (tax) {
    report.category = tax.category;
    report.categories = tax.categories;
  }
});

fs.writeFileSync(reportsPath, JSON.stringify(reports, null, 2), "utf8");
console.log(`Updated all ${reports.length} articles with complete cross-referenced multi-tag categories.`);

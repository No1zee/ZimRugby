import fs from "fs";
import path from "path";

const reportsPath = path.resolve(process.cwd(), "public/data/reports.json");
const reports = JSON.parse(fs.readFileSync(reportsPath, "utf8"));

// Category mapping rules based on thorough reading of title, content, and context
const categoryMappings = [
  { id: "0", category: "Sables", categories: ["Sables", "Match Day", "Nations Cup"] },
  { id: "1", category: "ZRU", categories: ["ZRU", "Governance", "Code of Conduct"] },
  { id: "2", category: "Sables", categories: ["Sables", "International", "Zambezi Challenge"] },
  { id: "3", category: "Sables", categories: ["Sables", "International", "Double Header"] },
  { id: "4", category: "Sables", categories: ["Sables", "Squad Update", "Player Feature"] },
  { id: "5", category: "Lady Sables", categories: ["Lady Sables", "Women's Rugby", "Africa Cup"] },
  { id: "6", category: "Lady Sables", categories: ["Lady Sables", "Player Feature", "Women's Rugby"] },
  { id: "7", category: "Women's Rugby", categories: ["Women's Rugby", "ZRU", "Development"] },
  { id: "8", category: "Sables", categories: ["Sables", "Coaching", "ANSA Awards"] },
  { id: "9", category: "Women's Rugby", categories: ["Women's Rugby", "Lady Sables", "Rising Stars"] },
  { id: "10", category: "Sables", categories: ["Sables", "ANSA Awards", "National Pride"] },
  { id: "11", category: "Domestic", categories: ["Domestic", "Club Rugby", "Nedbank Cup"] },
  { id: "12", category: "Sables", categories: ["Sables", "Technical Team", "Africa Cup"] },
  { id: "13", category: "Lady Sables", categories: ["Lady Sables", "Squad Update", "Player Feature"] },
  { id: "14", category: "Domestic", categories: ["Domestic", "Zim A", "Harare Sports Club"] },
  { id: "15", category: "ZRU", categories: ["ZRU", "Olympic Committee", "Announcement"] },
  { id: "16", category: "Junior Sables", categories: ["Junior Sables", "U20", "International"] },
  { id: "17", category: "Lady Sables", categories: ["Lady Sables", "Squad Announcement", "Africa Cup"] },
  { id: "18", category: "Grassroots", categories: ["Grassroots", "Tag Rugby", "Women's Month"] },
  { id: "19", category: "Sables", categories: ["Sables", "World Rugby Rankings", "Milestone"] },
  { id: "20", category: "Sables", categories: ["Sables", "Africa Cup Champions", "Historic Win"] },
  { id: "21", category: "Sables", categories: ["Sables", "Squad Announcement", "Africa Cup"] }
];

let updatedCount = 0;

reports.forEach((report) => {
  const map = categoryMappings.find((m) => m.id === String(report.id));
  if (map) {
    report.category = map.category;
    report.categories = map.categories;
    updatedCount++;
  }
});

fs.writeFileSync(reportsPath, JSON.stringify(reports, null, 2), "utf8");
console.log(`Successfully updated categories and tags for ${updatedCount} articles!`);

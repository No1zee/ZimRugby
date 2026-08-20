import fs from "fs";
import path from "path";

const reportsPath = path.resolve(process.cwd(), "public/data/reports.json");
const reports = JSON.parse(fs.readFileSync(reportsPath, "utf8"));

console.log(`Total articles found: ${reports.length}\n`);

reports.forEach((r, i) => {
  const plainText = (r.content || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  console.log(`--- [Article ${i}] ---`);
  console.log(`ID: ${r.id}`);
  console.log(`Slug: ${r.slug}`);
  console.log(`Current Category: ${r.category}`);
  console.log(`Title: ${r.title}`);
  console.log(`Excerpt: ${r.excerpt ? r.excerpt.slice(0, 120) : "N/A"}`);
  console.log(`Content Preview: ${plainText.slice(0, 200)}...`);
  console.log("");
});

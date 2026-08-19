import { MetadataRoute } from "next";
import { getNewsArticles } from "@/lib/api/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zimrugby.vercel.app";

  // Approved public static routes
  const staticRoutes = [
    "",
    "/teams",
    "/teams/sables",
    "/teams/lady-sables",
    "/teams/junior-sables",
    "/teams/cheetahs",
    "/match-centre",
    "/tickets",
    "/campaigns",
    "/campaigns/road-to-australia-2027",
    "/campaigns/africa-cup-tour-2026",
    "/media",
    "/video-hub",
    "/gallery",
    "/about",
    "/contact",
    "/partners",
    "/play-rugby",
    "/fan-zone",
    "/privacy-policy",
    "/terms-of-use",
    "/accessibility",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/teams") || route === "/match-centre" ? 0.9 : 0.7,
  }));

  // Dynamic news articles from Directus
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await getNewsArticles(100);
    newsRoutes = articles
      .filter((a) => a.url && a.url.startsWith("/media/"))
      .map((a) => ({
        url: `${baseUrl}${a.url}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
  } catch {
    // Graceful fallback if CMS is unavailable
  }

  return [...staticRoutes, ...newsRoutes];
}

import { NextResponse } from "next/server";
import { directusFetch } from "@/lib/directus/fetch";
import { assetUrl } from "@/lib/directus/assets";

export const dynamic = "force-dynamic";

interface DirectusNewsItem {
  id: string | number;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  image?: string;
  category?: string;
  date?: string;
  status?: string;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = "https://zimrugby.co.zw";
  let articles: DirectusNewsItem[] = [];

  try {
    articles = await directusFetch<DirectusNewsItem>("news", {
      filter: { status: { _eq: "published" } },
      sort: ["-date"],
      limit: 30,
    });
  } catch (err) {
    console.warn("Failed to fetch news for RSS feed:", err);
  }

  const itemsXml = articles
    .map((item) => {
      const title = escapeXml(item.title || "Zimbabwe Rugby Union Announcement");
      const link = `${baseUrl}/media/${item.slug || item.id}`;
      const description = escapeXml(item.excerpt || item.title || "");
      const pubDate = item.date ? new Date(item.date).toUTCString() : new Date().toUTCString();
      const category = escapeXml(item.category || "Rugby");
      const imageUrl = item.image ? (item.image.startsWith("http") ? item.image : `${baseUrl}${assetUrl(item.image)}`) : "";

      return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <category>${category}</category>
      ${imageUrl ? `<enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" length="0" />` : ""}
    </item>`;
    })
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Zimbabwe Rugby Union (ZRU) - Official News &amp; Statements</title>
    <link>${baseUrl}</link>
    <description>Latest match reports, squad announcements, tournament fixtures, and official press statements from the Zimbabwe Rugby Union.</description>
    <language>en-ZW</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <copyright>© ${new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.</copyright>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  });
}

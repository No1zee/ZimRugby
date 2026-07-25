import { NextResponse } from "next/server";

export const revalidate = 3600; // Revalidate every 1 hour

// YouTube RSS feeds — free, no API key needed
const RSS_FEEDS = [
  {
    channelName: "World Rugby",
    channelId: "UCE28rwYoaV7jvU6GVzdu_GQ",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCE28rwYoaV7jvU6GVzdu_GQ",
  },
];

// Match patterns: title must mention Zimbabwe or Sables to be included
const ZIM_MATCH_PATTERNS = [
  /\bzimbabwe\b/i,
  /\bsables\b/i,
  /\bzim\b/i,
];

// Hardcoded fallback if RSS fails
const FALLBACK_HIGHLIGHTS = [
  {
    id: "yt-canada-v-zim-2026",
    videoId: "kf33dibu7f0",
    title: "Canada v Zimbabwe | Nations Cup 2026 Extended Highlights",
    thumbnail: "https://img.youtube.com/vi/kf33dibu7f0/hqdefault.jpg",
    category: "NATIONS CUP",
    publishedAt: "JULY 2026",
    channelName: "World Rugby",
  },
  {
    id: "yt-usa-v-zim-2026",
    videoId: "2koQbsHjg14",
    title: "USA v Zimbabwe | Nations Cup 2026 Extended Highlights",
    thumbnail: "https://img.youtube.com/vi/2koQbsHjg14/hqdefault.jpg",
    category: "NATIONS CUP",
    publishedAt: "JULY 2026",
    channelName: "World Rugby",
  },
  {
    id: "yt-tonga-v-zim-2026",
    videoId: "h3iy3mTIhs4",
    title: "Tonga v Zimbabwe | Nations Cup 2026 Extended Highlights",
    thumbnail: "https://img.youtube.com/vi/h3iy3mTIhs4/hqdefault.jpg",
    category: "NATIONS CUP",
    publishedAt: "JULY 2026",
    channelName: "World Rugby",
  },
  {
    id: "yt-canada-replay",
    videoId: "kf33dibu7f0",
    title: "Sables Nations Cup Opener | Canada v Zimbabwe Full Match Replay",
    thumbnail: "https://img.youtube.com/vi/kf33dibu7f0/hqdefault.jpg",
    category: "MATCHDAY REPLAY",
    publishedAt: "JULY 2026",
    channelName: "World Rugby",
  },
];

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
  return match ? match[1].trim() : "";
}

function parseFeed(xml: string, channelName: string) {
  const entries = xml.split("<entry>").slice(1); // skip the feed header
  return entries.map((entry) => {
    const videoId = extractTag(entry, "yt:videoId");
    const title = extractTag(entry, "title");
    const published = extractTag(entry, "published");
    const thumbnailMatch = entry.match(/url="([^"]*hqdefault[^"]*)"/);
    const thumbnail = thumbnailMatch
      ? thumbnailMatch[1]
      : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    const date = published
      ? new Date(published).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).toUpperCase()
      : "RECENT";

    // Auto-categorize based on title keywords
    let category = "HIGHLIGHTS";
    const t = title.toLowerCase();
    if (t.includes("full match") || t.includes("replay")) category = "FULL MATCH";
    else if (t.includes("every") && t.includes("try")) category = "TRIES";
    else if (t.includes("highlight") || t.includes("extended")) category = "HIGHLIGHTS";
    else if (t.includes("shorts")) category = "SHORTS";
    else if (t.includes("nations cup")) category = "NATIONS CUP";
    else if (t.includes("nations championship")) category = "NATIONS CHAMPIONSHIP";
    else if (t.includes("junior") || t.includes("u20")) category = "JUNIORS";

    return {
      id: `yt-${videoId}`,
      videoId,
      title,
      thumbnail,
      category,
      publishedAt: date,
      channelName,
    };
  });
}

function isZimRelevant(title: string): boolean {
  return ZIM_MATCH_PATTERNS.some((pat) => pat.test(title));
}

export async function GET() {
  try {
    const allVideos: Awaited<ReturnType<typeof parseFeed>[number]>[] = [];

    for (const feed of RSS_FEEDS) {
      try {
        const res = await fetch(feed.url, {
          next: { revalidate: 3600 },
        });
        if (!res.ok) {
          console.warn(`[youtube] RSS feed failed for ${feed.channelName}: ${res.status}`);
          continue;
        }
        const xml = await res.text();
        const videos = parseFeed(xml, feed.channelName);
        allVideos.push(...videos);
      } catch (err) {
        console.warn(`[youtube] Error fetching ${feed.channelName}:`, err);
      }
    }

    if (allVideos.length > 0) {
      // ONLY Zimbabwe-related videos
      const zimVideos = allVideos.filter((v) => isZimRelevant(v.title));

      if (zimVideos.length > 0) {
        return NextResponse.json(zimVideos);
      }

      // No Zim videos found in feed — use hardcoded Zim-specific fallbacks
      console.warn("[youtube] No Zimbabwe videos found in RSS feed, using fallback");
      return NextResponse.json(FALLBACK_HIGHLIGHTS);
    }

    // All feeds failed
    console.warn("[youtube] All RSS feeds failed, using fallback data");
    return NextResponse.json(FALLBACK_HIGHLIGHTS);
  } catch (error) {
    console.error("[youtube] Error:", error);
    return NextResponse.json(FALLBACK_HIGHLIGHTS);
  }
}

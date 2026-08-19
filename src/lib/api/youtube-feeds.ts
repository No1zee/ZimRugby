/* eslint-disable @typescript-eslint/no-explicit-any */

// YouTube RSS feeds — free, no API key needed
// official: the channel is the union's own — all its uploads are relevant
const RSS_FEEDS = [
  {
    channelName: "Zimbabwe Rugby",
    channelId: "UC8kw8cZGkae9cMxChhp2tAA",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC8kw8cZGkae9cMxChhp2tAA",
    official: true,
  },
  {
    channelName: "World Rugby",
    channelId: "UCE28rwYoaV7jvU6GVzdu_GQ",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCE28rwYoaV7jvU6GVzdu_GQ",
    official: false,
  },
];

// Match patterns: title must mention Zimbabwe or Sables to be included
const ZIM_MATCH_PATTERNS = [
  /\bzimbabwe\b/i,
  /\bsables\b/i,
  /\bzim\b/i,
];

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
  return match ? match[1].trim() : "";
}

function parseFeed(xml: string, channelName: string, channelId: string, official: boolean) {
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
    else if (t.includes("sable tale") || t.includes("episode") || /\bep\b|\bep\.?\s*\d/.test(t)) category = "SABLE TALE";

    return {
      id: `yt-${videoId}`,
      videoId,
      title,
      thumbnail,
      category,
      publishedAt: date,
      channelName,
      channelId,
      official,
    };
  });
}

function isZimRelevant(title: string): boolean {
  return ZIM_MATCH_PATTERNS.some((pat) => pat.test(title));
}

/** Exclude channel trailers / generic intros that aren't real content */
function isTrailerLike(video: { title: string; channelName: string }): boolean {
  const t = video.title.trim().toLowerCase();
  const c = video.channelName.trim().toLowerCase();
  if (t === c) return true;
  if (/trailer|intro|welcome|teaser|coming soon/i.test(t)) return true;
  if (!/\d{4}/.test(t) && t.length < 24) return true;
  return false;
}

/** Lenient trailer check for official channels — only drop a bare channel trailer */
function isBareTrailer(video: { title: string; channelName: string }): boolean {
  const t = video.title.trim().toLowerCase();
  const c = video.channelName.trim().toLowerCase();
  return t === c;
}

export interface YoutubeFeedVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  category: string;
  publishedAt: string;
  channelName: string;
  channelId: string;
  official: boolean;
}

/**
 * Fetch Zimbabwe rugby videos from the official @ZimRugby channel plus
 * Zimbabwe-relevant uploads from World Rugby. Merged with confirmed
 * Nations Cup highlights and deduplicated by videoId.
 */
export async function fetchZimbabweVideos(): Promise<YoutubeFeedVideo[]> {
  const allVideos: YoutubeFeedVideo[] = [];

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
      const videos = parseFeed(xml, feed.channelName, feed.channelId, feed.official);
      allVideos.push(...videos);
    } catch (err) {
      console.warn(`[youtube] Error fetching ${feed.channelName}:`, err);
    }
  }

  // Official ZRU channel: include everything except bare trailers.
  // External channels (World Rugby): only Zimbabwe-related videos, strict trailer filter.
  const included = allVideos.filter((v) =>
    v.official ? !isBareTrailer(v) : isZimRelevant(v.title) && !isTrailerLike(v)
  );

  return Array.from(new Map(included.map((v) => [v.videoId, v])).values());
}

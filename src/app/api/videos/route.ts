import { NextResponse } from "next/server";
import { Video } from "@/types";
import { directusFetch } from "@/lib/directus/fetch";
import { thumbnailAssetUrl } from "@/lib/directus/assets";
import { fetchZimbabweVideos } from "@/lib/api/youtube-feeds";

export const revalidate = 300;

function youtubeIdFromEmbed(url: string): string {
  const match = url.match(/\/([\w-]{11})(?:\?|$)/);
  return match ? match[1] : "";
}

function liveToVideo(v: { videoId?: string; title?: string; category?: string; publishedAt?: string; thumbnail?: string; channelName?: string }): Video {
  const videoId = v.videoId || "";
  return {
    id: `live-${videoId}`,
    title: v.title || "",
    category: v.category || "Match Highlights",
    duration: "",
    date: v.publishedAt || "RECENT",
    thumbnail: v.thumbnail || "",
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
    description: v.channelName ? `Uploaded by ${v.channelName}` : "",
  };
}

export async function GET() {
  // 1. Curated Directus videos (server-side, no CORS)
  let directusVideos: Video[] = [];
  try {
    const response = await directusFetch<any>("videos", { sort: ["-date"] });
    if (response && response.length > 0) {
      directusVideos = response.map((video: any) => ({
        id: String(video.id),
        title: video.title || "",
        category: video.category || "General",
        duration: video.duration || "0:00",
        date:
          video.date_label ||
          new Date(video.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }).toUpperCase(),
        thumbnail: thumbnailAssetUrl(video.thumbnail) || video.thumbnail_url,
        embedUrl: video.embed_url || "",
        description: video.description || "",
      }));
    }
  } catch (error) {
    console.warn("Directus fetch failed for videos list:", error);
  }

  // 2. Live uploads from the official @ZimRugby channel + World Rugby highlights
  let liveVideos: Video[] = [];
  try {
    const live = await fetchZimbabweVideos();
    liveVideos = live.map(liveToVideo);
  } catch (error) {
    console.warn("Live YouTube feed merge failed for videos:", error);
  }

  // 3. Merge — curated first, then live videos not already present
  const directusIds = new Set(directusVideos.map((v) => youtubeIdFromEmbed(v.embedUrl)).filter(Boolean));
  const merged = [...directusVideos];
  for (const v of liveVideos) {
    const vid = youtubeIdFromEmbed(v.embedUrl);
    if (vid && !directusIds.has(vid)) {
      merged.push(v);
      directusIds.add(vid);
    }
  }

  return NextResponse.json(merged);
}

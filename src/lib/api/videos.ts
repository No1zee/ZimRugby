/* eslint-disable @typescript-eslint/no-explicit-any */
import { Video } from "@/types";

const mockVideos: Video[] = [
  {
    id: "yt-canada-v-zim-2026",
    title: "CANADA v ZIMBABWE | Nations Cup 2026 | Match Highlights",
    category: "Match Highlights",
    duration: "11:27",
    date: "18 JUL 2026",
    thumbnail: "https://img.youtube.com/vi/kf33dibu7f0/hqdefault.jpg",
    embedUrl: "https://www.youtube-nocookie.com/embed/kf33dibu7f0?rel=0&modestbranding=1",
    description: "Full extended highlights of Canada v Zimbabwe from the 2026 Nations Cup, courtesy of World Rugby. The Sables fought to the final whistle in a physical encounter."
  },
  {
    id: "yt-usa-v-zim-2026",
    title: "USA v ZIMBABWE | Nations Cup 2026 | Match Highlights",
    category: "Match Highlights",
    duration: "11:38",
    date: "11 JUL 2026",
    thumbnail: "https://img.youtube.com/vi/2koQbsHjg14/hqdefault.jpg",
    embedUrl: "https://www.youtube-nocookie.com/embed/2koQbsHjg14?rel=0&modestbranding=1",
    description: "Extended highlights of USA v Zimbabwe from the 2026 Nations Cup, courtesy of World Rugby."
  },
  {
    id: "yt-tonga-v-zim-2026",
    title: "TONGA v ZIMBABWE | Nations Cup 2026 | Match Highlights",
    category: "Match Highlights",
    duration: "04:07",
    date: "04 JUL 2026",
    thumbnail: "https://img.youtube.com/vi/h3iy3mTIhs4/hqdefault.jpg",
    embedUrl: "https://www.youtube-nocookie.com/embed/h3iy3mTIhs4?rel=0&modestbranding=1",
    description: "Highlights of Tonga v Zimbabwe from the 2026 Nations Cup opener, courtesy of World Rugby. The Sables kicked off the campaign with a 22-15 win."
  }
];

/**
 * Fetch the merged video library (curated Directus entries + live uploads
 * from the official @ZimRugby channel and World Rugby). Runs through a
 * same-origin API route so browsers never call Directus directly.
 */
export async function getVideos(): Promise<Video[]> {
  try {
    const res = await fetch("/api/videos", { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data as Video[];
      }
    }
  } catch (error) {
    console.warn("Failed to fetch videos, using mock data:", error);
  }
  return mockVideos;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Video } from "@/types";

export async function getVideos(): Promise<Video[]> {
  try {
    const res = await fetch("/api/videos", { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data as Video[];
      }
    }
  } catch (error) {
    console.warn("Failed to fetch videos:", error);
  }
  return [];
}

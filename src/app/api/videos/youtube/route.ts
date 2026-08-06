import { NextResponse } from "next/server";
import { fetchZimbabweVideos } from "@/lib/api/youtube-feeds";

export const revalidate = 3600; // Revalidate every 1 hour

export async function GET() {
  const videos = await fetchZimbabweVideos();
  return NextResponse.json(videos);
}

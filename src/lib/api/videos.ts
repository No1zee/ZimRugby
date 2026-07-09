import { Video } from "@/types";
import directus from "@/lib/directus/client";
import { readItems } from "@directus/sdk";

export async function getVideos(): Promise<Video[]> {
  const mockVideos: Video[] = [
    {
      id: "vid-sables-namibia-2025",
      title: "HIGHLIGHTS: Zimbabwe Sables vs Namibia | Africa Cup Final",
      category: "Match Highlights",
      duration: "12:45",
      date: "22 JUL 2025",
      thumbnail: "/images/media/vid1.jpg",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Catch all the thrilling action, tries, and celebrations from the Sables' historic victory over Namibia to claim the 2025 Rugby Africa Cup title."
    },
    {
      id: "vid-press-benade-squad-2026",
      title: "PRESS CONFERENCE: Piet Benade on Victoria Cup Squad Selection",
      category: "Press Conferences",
      duration: "05:30",
      date: "20 APR 2026",
      thumbnail: "/images/media/vid2.jpg",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Sables head coach Piet Benade addresses the media regarding the squad selection, captaincy choices, and training camp updates ahead of the Victoria Cup."
    },
    {
      id: "vid-feature-mudariki-2026",
      title: "PLAYER FEATURE: Hilton Mudariki's Journey to 40 Caps",
      category: "Player Features",
      duration: "08:15",
      date: "18 APR 2026",
      thumbnail: "/images/media/vid3.jpg",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "A deep dive into the career of Sables captain Hilton Mudariki, exploring his rise through the ranks, international milestones, and leadership philosophy."
    },
    {
      id: "vid-explain-scrum-2026",
      title: "RUGBY EXPLAINED: The Mechanics of the Scrum",
      category: "Rugby Explained",
      duration: "04:50",
      date: "10 APR 2026",
      thumbnail: "/images/media/vid4.jpg",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Assistant coach Ricky Chirengende breaks down the technical rules, safety requirements, and strategic nuances of the scrum in modern rugby union."
    },
    {
      id: "vid-lady-sables-camp-2026",
      title: "TRAINING: Inside Camp with the Lady Sables",
      category: "Player Features",
      duration: "06:40",
      date: "05 APR 2026",
      thumbnail: "/images/teams/lady-sables.jpg",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Go behind the scenes at Harare Sports Club to see how the Lady Sables are preparing for their upcoming Rugby Africa Cup qualifiers."
    },
    {
      id: "vid-press-chirengende-2026",
      title: "PRESS CONFERENCE: Assistant Coach Ricky Chirengende Post-Match",
      category: "Press Conferences",
      duration: "04:15",
      date: "28 MAR 2026",
      thumbnail: "/images/media/vid1.jpg",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Assistant coach Ricky Chirengende analyzes the team's tactical performance, defensive adjustments, and areas of improvement following the international friendly."
    }
  ];

  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directus.request(
        readItems('videos', {
          sort: ['-date']
        })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any[];
      if (response && response.length > 0) {
        return response.map((video) => ({
          id: String(video.id),
          title: video.title || "",
          category: video.category || "General",
          duration: video.duration || "0:00",
          date: video.date_label || new Date(video.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
          thumbnail: video.thumbnail ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${video.thumbnail}` : video.thumbnail_url,
          embedUrl: video.embed_url || "",
          description: video.description || ""
        }));
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for videos list, falling back to mock data:", error);
  }

  return mockVideos;
}

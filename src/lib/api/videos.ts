import { Video } from "@/types";

/**
 * CMS_SWAP_TODO: Replace mock implementation with actual REST/GraphQL endpoints once backend is available.
 * Fully compatible with React Native / Mobile platforms for direct cross-platform consumption.
 */
export async function getVideos(): Promise<Video[]> {
  return [
    {
      id: "vid-sables-namibia-2025",
      title: "HIGHLIGHTS: Zimbabwe Sables vs Namibia | Africa Cup Final",
      category: "Match Highlights",
      duration: "12:45",
      date: "22 JUL 2025",
      thumbnail: "/images/media/vid1.jpg",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder video url
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
}

import { Photo } from "@/types";
import directus from "@/lib/directus/client";
import { readItems } from "@directus/sdk";
import { directusAsset, fetchFromDirectus, formatShortDate } from "@/lib/directus/helpers";

export async function getPhotos(): Promise<Photo[]> {
  const mockPhotos: Photo[] = [
    {
      id: "photo-africa-cup-2025",
      title: "Africa Cup Triumph",
      album: "Match Day",
      image: "/images/events/africa-cup.jpg",
      date: "27 JUL 2025",
      description: "Zimbabwe Sables lift the Africa Cup trophy after defeating Algeria in the final."
    },
    {
      id: "photo-jersey-unveil-1991",
      title: "Heritage Unveiling",
      album: "Historical Collections",
      image: "/images/media/1991-jersey-original.jpg",
      date: "23 APR 2026",
      description: "Details of the iconic 1991 Rugby World Cup recreation jersey."
    },
    {
      id: "photo-schools-fest-2025",
      title: "Schoolboy Rugby Action",
      album: "Community Rugby",
      image: "/images/events/schools-fest.jpg",
      date: "05 MAY 2025",
      description: "Intensity and passion at the annual Schools Rugby Festival."
    },
    {
      id: "photo-cheetahs-training-2026",
      title: "Sevens Conditioning",
      album: "Training Camps",
      image: "/images/teams/cheetahs.jpg",
      date: "12 APR 2026",
      description: "Cheetahs squad members pushing boundaries during sand dune sprint training."
    },
    {
      id: "photo-lady-sables-lineout-2025",
      title: "Perfect Lineout Drill",
      album: "Match Day",
      image: "/images/teams/lady-sables.jpg",
      date: "15 OCT 2025",
      description: "Lady Sables secure clean ball off the top in their Africa Cup qualifier."
    },
    {
      id: "photo-super-league-scrum-2025",
      title: "Domestic League Showdown",
      album: "Community Rugby",
      image: "/images/events/super-league.jpg",
      date: "10 JUN 2025",
      description: "Heavy contact during the ZRU Super League club championship final."
    }
  ];

  return fetchFromDirectus<Photo[]>(async () => {
    const response = await directus.request(
      readItems('photos' as any, {
        sort: ['-date' as any]
      })
    );
    if (!response || response.length === 0) return null;
    return response.map((photo: any) => ({
      id: String(photo.id),
      title: photo.title || "",
      album: photo.album || "General",
      image: directusAsset(photo.image) ?? photo.image_url,
      date: photo.date_label || formatShortDate(photo.date),
      description: photo.description || ""
    }));
  }, mockPhotos, "photo gallery");
}

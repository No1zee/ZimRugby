/* eslint-disable @typescript-eslint/no-explicit-any */
import { Photo } from "@/types";
import { directusFetch } from "@/lib/directus/fetch";

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

  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directusFetch<any>('photos', {
        sort: ['-date']
      });
      if (response && response.length > 0) {
        return response.map((photo: any) => ({
          id: String(photo.id),
          title: photo.title || "",
          album: photo.album || "General",
          image: photo.image ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${photo.image}` : photo.image_url,
          date: photo.date_label || new Date(photo.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
          description: photo.description || ""
        }));
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for photo gallery, falling back to mock data:", error);
  }

  return mockPhotos;
}

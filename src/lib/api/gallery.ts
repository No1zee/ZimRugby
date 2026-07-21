/* eslint-disable @typescript-eslint/no-explicit-any */
import { Photo } from "@/types";
import { directusFetch } from "@/lib/directus/fetch";

import manifestData from "../../../public/data/media-manifest.json";

export async function getPhotos(): Promise<Photo[]> {
  try {
    const galleryAssets = manifestData.assets.filter((a: any) => a.category === 'gallery');
    
    if (galleryAssets.length > 0) {
      return galleryAssets.map((asset: any) => {
        // Map tags/event to album categories
        let album: "Match Day" | "Historical Collections" | "Community Rugby" | "Training Camps" = "Match Day";
        const fullPathLower = (asset.src_original || "").toLowerCase();
        
        if (fullPathLower.includes("women")) {
          album = "Match Day";
        } else if (fullPathLower.includes("training") || fullPathLower.includes("gym")) {
          album = "Training Camps";
        }
        
        // Format date or default
        let dateStr = "2026";
        if (fullPathLower.includes("battle of zambezi 2026") || fullPathLower.includes("zambezi")) {
          dateStr = "12 JUL 2026";
        } else if (fullPathLower.includes("nations cup")) {
          dateStr = "JUN 2026";
        }
        
        // Clean up titles
        let title = asset.label
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c: string) => c.toUpperCase())
          .replace(/\d+$/, '')
          .trim();
          
        if (!title) {
          title = album === "Training Camps" ? "Sables Training Camp" : "Sables Match Action";
        }

        // Resolve clean folders based on original asset layout
        let folder = "General Sables Archive";
        if (fullPathLower.includes("battle of zambezi 2026") || fullPathLower.includes("zambezi")) {
          folder = "Battle of the Zambezi (2026)";
        } else if (fullPathLower.includes("nations cup")) {
          folder = "Nations Cup (2026)";
        } else if (fullPathLower.includes("sables women")) {
          folder = "Sables Women";
        }

        return {
          id: asset.id,
          title: title,
          album: album,
          image: asset.src_web,
          date: dateStr,
          folder: folder,
          photographer: asset.photographer || "ZRU Media Staff",
          license: asset.license || "All Rights Reserved (C) Zim Rugby Union",
          description: `Official ZRU high-performance media coverage: ${title} from the national squad campaign.`
        };
      });
    }
  } catch (err) {
    console.warn("Local manifest read failed, using Directus/Mock fallback:", err);
  }

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
          date: photo.date_label || new Date(photo.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase(),
          description: photo.description || ""
        }));
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for photo gallery, falling back to mock data:", error);
  }

  return mockPhotos;
}

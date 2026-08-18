/* eslint-disable @typescript-eslint/no-explicit-any */
import { Photo } from "@/types";
import { directusFetch } from "@/lib/directus/fetch";
import { photoAssetUrl } from "@/lib/directus/assets";

// Static gallery manifest — 313 photos pre-sorted by folder from /public/images/gallery/
import galleryPhotosData from "../../../public/data/gallery-photos.json";

/** Fetch any photos added via the Directus admin CMS. Returns [] on failure. */
async function getCmsPhotos(): Promise<Photo[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return [];

    const response = await directusFetch<any>("photos", {
      filter: { status: { _eq: "published" } },
      sort: ["-date_created"],
      fields: [
        "id", "title", "album", "folder", "date_label", "date",
        "description", "photographer", "license", "image_url", "directus_image.*",
      ],
    });

    if (!response || response.length === 0) return [];

    return response
      .map((photo: any) => {
        const imageUrl = photo.directus_image?.id
          ? photoAssetUrl(photo.directus_image.id)
          : photo.image_url || null;

        const dateDisplay =
          photo.date_label ||
          (photo.date
            ? new Date(photo.date)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                })
                .toUpperCase()
            : "2026");

        return {
          id: String(photo.id),
          title: photo.title || "ZRU Gallery",
          album: photo.album || "Match Day",
          folder: photo.folder || "General Sables Archive",
          image: imageUrl,
          date: dateDisplay,
          photographer: photo.photographer || "ZRU Media Staff",
          license:
            photo.license || "All Rights Reserved (C) Zimbabwe Rugby Union",
          description: photo.description || "",
        };
      })
      .filter((p: any) => p.image); // only photos with an actual image
  } catch {
    return [];
  }
}

export async function getPhotos(): Promise<Photo[]> {
  const staticPhotos = galleryPhotosData as Photo[];

  if (staticPhotos.length > 0) {
    // Merge CMS-added photos (appear first) with the 313 static local photos
    const cmsPhotos = await getCmsPhotos();
    return [...cmsPhotos, ...staticPhotos];
  }

  // Fallback — should never reach here with 313 photos in the manifest
  return [
    {
      id: "photo-africa-cup-2025",
      title: "Africa Cup Triumph",
      album: "Match Day",
      folder: "General Sables Archive",
      image: "/images/events/africa-cup.jpg",
      date: "27 JUL 2025",
      photographer: "ZRU Media Staff",
      license: "All Rights Reserved (C) Zimbabwe Rugby Union",
      description:
        "Zimbabwe Sables lift the Africa Cup trophy after defeating Algeria in the final.",
    },
  ];
}

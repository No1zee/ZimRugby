import { Metadata } from "next";
import GalleryPageClient from "./GalleryPageClient";
import { getPhotos } from "@/lib/api/gallery";

export const metadata: Metadata = {
  title: "Photo Gallery | Zimbabwe Rugby Union",
  description: "Photos and galleries from Zimbabwe rugby matches, events, and training sessions.",
};

export const revalidate = 3600; // ISR cache revalidation every 1 hour (on-demand revalidated via Directus webhook)

export default async function GalleryPage() {
  const photos = await getPhotos();

  return <GalleryPageClient initialPhotos={photos} />;
}

import GalleryPageClient from "./GalleryPageClient";
import { getPhotos } from "@/lib/api/gallery";

export const revalidate = 300; // ISR cache revalidation every 5 minutes

export default async function GalleryPage() {
  const photos = await getPhotos();

  return <GalleryPageClient initialPhotos={photos} />;
}

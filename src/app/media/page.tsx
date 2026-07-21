import { getSocialPosts } from "@/lib/data-fetcher";
import MediaPageClient from "./MediaPageClient";

export const revalidate = 300; // ISR cache revalidation window: 5 minutes

export default async function MediaPage() {
  const socialPosts = await getSocialPosts();

  return <MediaPageClient initialSocialPosts={socialPosts} />;
}

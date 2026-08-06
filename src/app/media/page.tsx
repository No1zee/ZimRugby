import { Metadata } from "next";
import { getSocialPosts, getLatestReports } from "@/lib/data-fetcher";
import MediaPageClient from "./MediaPageClient";
import { getPageBySlug } from "@/lib/api/pages";

export const metadata: Metadata = {
  title: "News & Media | Zimbabwe Rugby Union",
  description: "Latest news, match reports, and media coverage from Zimbabwe Rugby Union.",
};

export const revalidate = 300;

export default async function MediaPage() {
  const [socialPosts, cmsPage, latestNews] = await Promise.all([
    getSocialPosts(),
    getPageBySlug("media"),
    getLatestReports(),
  ]);

  return (
    <MediaPageClient
      initialSocialPosts={socialPosts}
      cmsPage={cmsPage}
      initialNews={latestNews}
    />
  );
}


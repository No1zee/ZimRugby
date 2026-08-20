import { Metadata } from "next";
import { getNewsArticles } from "@/lib/api/news";
import MediaPageClient from "./MediaPageClient";
import { getPageBySlug } from "@/lib/api/pages";

export const metadata: Metadata = {
  title: "News & Media | Zimbabwe Rugby Union",
  description: "Latest news, match reports, and video highlights from Zimbabwe Rugby Union.",
};

export const revalidate = 3600;

export default async function MediaPage() {
  const [cmsPage, latestNews] = await Promise.all([
    getPageBySlug("media"),
    getNewsArticles(30),
  ]);

  return (
    <MediaPageClient
      cmsPage={cmsPage}
      initialNews={latestNews}
    />
  );
}


import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Hub & Sables News | Zimbabwe Rugby Union",
  description: "Stay updated with the latest Sables announcements, match summaries, video highlights, and official union newsletters.",
  openGraph: {
    title: "News & Media - Zimbabwe Rugby Union",
    description: "Get real-time updates and highlights from rugby matches across Zimbabwe.",
  },
};

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

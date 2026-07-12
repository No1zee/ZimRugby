import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Gallery | Zimbabwe Rugby Union",
  description: "Relive Sables match highlights, training camps, and community milestones in our official photo archive.",
  openGraph: {
    title: "Official Photo Gallery - Zimbabwe Rugby Union",
    description: "Visual history and archive of Zimbabwe rugby heritage, Sables tournaments, and national events.",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

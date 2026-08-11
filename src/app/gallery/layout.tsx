import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Zimbabwe Rugby Union",
  description: "Browse photos from Zimbabwe Rugby matches, training sessions, and events.",
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Hub | Zimbabwe Rugby Union",
  description: "Watch match highlights, press conferences, and behind-the-scenes content from Zimbabwe Rugby.",
};

export default function VideoHubLayout({ children }: { children: React.ReactNode }) {
  return children;
}

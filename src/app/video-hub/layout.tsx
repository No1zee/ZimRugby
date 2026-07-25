import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Hub | Zimbabwe Rugby Union",
  description: "Match highlights, analysis videos, and media content from Zimbabwe Rugby.",
};

export default function VideoHubLayout({ children }: { children: React.ReactNode }) {
  return children;
}

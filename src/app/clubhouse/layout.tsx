import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Clubhouse | ZRU Official Shop",
  description: "Official Zimbabwe Rugby Union merchandise, jerseys, and fan gear.",
};

export default function ClubhouseLayout({ children }: { children: React.ReactNode }) {
  return children;
}

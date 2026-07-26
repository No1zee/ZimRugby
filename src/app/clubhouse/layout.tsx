import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clubhouse | Zimbabwe Rugby Union",
  description: "Shop official ZimRugby merchandise, jerseys, and apparel. Support the Sables with authentic team gear.",
};

export default function ClubhouseLayout({ children }: { children: React.ReactNode }) {
  return children;
}

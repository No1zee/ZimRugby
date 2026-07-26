import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History | Zimbabwe Rugby Union",
  description: "Explore the rich history of Zimbabwe Rugby, from the founding of the Union in 1895 through to the modern era of the Sables.",
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

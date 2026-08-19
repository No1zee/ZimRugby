import { Metadata } from "next";

export const metadata: Metadata = {
  title: "History & Heritage | Zimbabwe Rugby Union",
  description: "Explore the rich history and heritage of Zimbabwe rugby since 1895.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Matches | Zimbabwe Rugby Union",
  description: "Manage match scores, fixtures, and results.",
};

export default function AdminMatchesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

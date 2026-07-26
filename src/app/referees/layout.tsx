import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referees | Zimbabwe Rugby Union",
  description: "Referee resources, courses, and notices for Zimbabwe Rugby officials.",
};

export default function RefereesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

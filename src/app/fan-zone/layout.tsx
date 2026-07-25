import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fan Zone | Zimbabwe Rugby Union",
  description: "Interactive fan experiences, quizzes, and community features for Zimbabwe rugby supporters.",
};

export default function FanZoneLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referees & Match Officials | Zimbabwe Rugby Union",
  description: "Access resources, course schedules, and notices for rugby referees and match officials in Zimbabwe.",
};

export default function RefereesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

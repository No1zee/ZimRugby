import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referees & Match Officials | Zimbabwe Rugby Union",
  description: "Access resources, course schedules, and notices for rugby referees and match officials in Zimbabwe.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RefereesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

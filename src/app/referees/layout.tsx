import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referees & Officials | Zimbabwe Rugby Union",
  description: "ZRU refereeing programme, official appointments, and referee development.",
};

export default function RefereesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

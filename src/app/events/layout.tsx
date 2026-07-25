import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitions & Events | Zimbabwe Rugby Union",
  description: "Upcoming rugby competitions, tournaments, and events across Zimbabwe.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

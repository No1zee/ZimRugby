import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Zimbabwe Rugby Union",
  description: "Upcoming rugby events, tournaments, and community gatherings hosted by the Zimbabwe Rugby Union.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

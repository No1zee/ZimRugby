import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official Tickets | Zimbabwe Rugby Union",
  description: "Buy official tickets for Zimbabwe rugby matches, international fixtures, and events.",
};

export default function TicketsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tickets | Zimbabwe Rugby Union",
  description: "Buy tickets for upcoming Zimbabwe Rugby matches. Secure your seats for the Sables, Lady Sables, and Cheetahs.",
};

export default function TicketsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

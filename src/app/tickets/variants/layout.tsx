import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticket Variants | Zimbabwe Rugby Union",
  description: "View available ticket options and pricing for Zimbabwe Rugby matches.",
};

export default function TicketVariantsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

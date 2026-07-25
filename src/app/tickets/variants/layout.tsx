import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fixture Card Variants | ZRU Internal",
  description: "Internal fixture card component variants for development and testing.",
};

export default function TicketVariantsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

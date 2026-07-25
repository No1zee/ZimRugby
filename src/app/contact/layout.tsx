import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact ZRU | Zimbabwe Rugby Union",
  description: "Get in touch with the Zimbabwe Rugby Union. Contact details, office locations, and enquiry forms.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

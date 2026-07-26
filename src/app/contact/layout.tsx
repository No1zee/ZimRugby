import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Zimbabwe Rugby Union",
  description: "Get in touch with the Zimbabwe Rugby Union. Reach us by phone, email, or visit our offices in Harare.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

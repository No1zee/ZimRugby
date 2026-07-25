import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Fixture Management | ZRU Portal",
  description: "Internal fixture management dashboard for ZRU administrators.",
};

export default function AdminMatchesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

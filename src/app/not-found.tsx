import type { Metadata } from "next";
import KnockOnAnimation from "@/components/KnockOnAnimation";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Zimbabwe Rugby Union",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return <KnockOnAnimation />;
}

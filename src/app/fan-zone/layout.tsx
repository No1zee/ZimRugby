import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fan Zone | Zimbabwe Rugby Union",
  description: "Join the ZRU Fan Zone. Register for exclusive updates, giveaways, and community events.",
};

export default function FanZoneLayout({ children }: { children: React.ReactNode }) {
  return children;
}

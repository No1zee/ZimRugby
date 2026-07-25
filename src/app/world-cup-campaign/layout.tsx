import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Road to RWC 2027 | Zimbabwe Rugby Union",
  description: "Zimbabwe's campaign to qualify and compete at the 2027 Rugby World Cup in Australia.",
};

export default function WorldCupCampaignLayout({ children }: { children: React.ReactNode }) {
  return children;
}

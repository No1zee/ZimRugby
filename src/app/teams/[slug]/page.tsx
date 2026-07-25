import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeamData } from "@/lib/api/teams";
import TeamPageClient from "@/components/teams/TeamPageClient";

const SLUG_TITLES: Record<string, string> = {
  sables: "Sables",
  "lady-sables": "Lady Sables",
  "junior-sables": "Junior Sables",
  cheetahs: "Cheetahs",
  u20: "U20",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = SLUG_TITLES[slug];
  if (!title) return { title: "Team Not Found | Zimbabwe Rugby Union" };
  return {
    title: `${title} | Zimbabwe Rugby Union`,
    description: `Official ${title} squad, fixtures, and results — Zimbabwe Rugby Union.`,
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "sables" },
    { slug: "lady-sables" },
    { slug: "junior-sables" },
    { slug: "cheetahs" },
    { slug: "u20" }
  ];
}

export default async function TeamDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const teamData = await getTeamData(slug);

  if (!teamData) {
    notFound();
  }

  return <TeamPageClient team={teamData} />;
}

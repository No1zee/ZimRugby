import { notFound } from "next/navigation";
import { getTeamData } from "@/lib/api/teams";
import TeamPageClient from "@/components/teams/TeamPageClient";

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

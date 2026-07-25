import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLiveMatches } from "@/lib/data-fetcher";
import { getMatchDetail } from "@/lib/api/matchDetail";
import MatchDetailClient from "@/components/matches/MatchDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const detail = await getMatchDetail(id);
  if (!detail) return { title: "Match Not Found | Zimbabwe Rugby Union" };
  return {
    title: `${detail.match.homeTeam} vs ${detail.match.awayTeam} | Zimbabwe Rugby Union`,
    description: `Match details for ${detail.match.homeTeam} vs ${detail.match.awayTeam}.`,
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const matches = await getLiveMatches();
  return matches.map((m) => ({
    id: m.id
  }));
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const detailData = await getMatchDetail(id);

  if (!detailData) {
    notFound();
  }

  return <MatchDetailClient data={detailData} />;
}

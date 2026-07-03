import { notFound } from "next/navigation";
import { getLiveMatches } from "@/lib/data-fetcher";
import { getMatchDetail } from "@/lib/api/matchDetail";
import MatchDetailClient from "@/components/matches/MatchDetailClient";

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

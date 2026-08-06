import { Metadata } from "next";
import nextDynamic from "next/dynamic";
import {
  getMatchCentrePage,
  getMatchCentreSettings,
  getFanBulletin,
  getActiveTeams,
  getDirectusMatches,
  getStandings,
  getActiveAnnouncementStrip,
} from "@/lib/match-centre/api";
import { getActiveCampaigns } from "@/lib/api/campaigns";

const MatchCentreClient = nextDynamic(() => import("./MatchCentreClient"), {
  loading: () => (
    <main className="bg-milk-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10 md:pb-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-black/5 rounded" />
          <div className="h-4 w-80 bg-black/5 rounded" />
          <div className="h-[400px] bg-black/5 rounded-2xl" />
        </div>
      </div>
    </main>
  ),
});

export const metadata: Metadata = {
  title: "Match Centre | Zimbabwe Rugby Union",
  description: "Fixtures, results, and league standings for Zimbabwe rugby teams.",
};

export const dynamic = "force-dynamic";

export default async function MatchCentre() {
  const [
    pageConfig,
    settings,
    bulletin,
    teams,
    allMatches,
    standingsTables,
    announcementStrip,
    campaigns,
  ] = await Promise.all([
    getMatchCentrePage(),
    getMatchCentreSettings(),
    getFanBulletin(),
    getActiveTeams(),
    getDirectusMatches(),
    getStandings(),
    getActiveAnnouncementStrip(),
    getActiveCampaigns(),
  ]);

  const initialFixtures = allMatches.filter((m) => m.status === "upcoming" || m.status === "live");
  const initialResults = allMatches.filter((m) => m.status === "completed");
  const nextUnionMatch = initialFixtures[0] || null;

  return (
    <MatchCentreClient
      pageConfig={pageConfig}
      settings={settings}
      bulletin={bulletin}
      teams={teams}
      initialFixtures={initialFixtures}
      initialResults={initialResults}
      standingsTables={standingsTables}
      nextUnionMatch={nextUnionMatch}
      announcementStrip={announcementStrip}
      campaigns={campaigns}
    />
  );
}

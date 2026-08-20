import { Metadata } from "next";
import MatchList from "@/components/matches/MatchList";
import { getAllMatches } from "@/lib/api/fixtures";
import { Calendar, Radio } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Live Scores | Zimbabwe Rugby Union",
  description: "Live match scores and real-time updates from Zimbabwe rugby fixtures.",
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 60;

export default async function LiveScoresPage() {
  const allMatches = await getAllMatches();
  const live = allMatches.filter(m => m.status === "live");
  const upcoming = allMatches.filter(m => m.status === "upcoming").slice(0, 3);
  const recent = allMatches.filter(m => m.status === "completed").slice(0, 6);

  return (
    <main className="min-h-screen bg-milk-white">
      <PageHero
        kicker="Match Day Center"
        title="Live Scores"
        subtitle="Real-time scores, match updates, and results from every Zimbabwe Rugby fixture."
        breadcrumb={[{ label: "Live Scores", href: "/live" }]}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {live.length > 0 && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-rich-black mb-6 not-italic flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              Live Now
            </h2>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <Radio className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-wider">Action underway</span>
              </div>
              <MatchList matches={live} />
            </div>
          </section>
        )}

        {upcoming.length > 0 && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-rich-black mb-6 not-italic flex items-center gap-3">
              <Calendar className="w-6 h-6 text-zru-green" />
              Next Up
            </h2>
            <MatchList matches={upcoming} />
          </section>
        )}

        <section>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-rich-black mb-6 not-italic">
            Latest Results
          </h2>
          <MatchList matches={recent} />
        </section>
      </div>
    </main>
  );
}

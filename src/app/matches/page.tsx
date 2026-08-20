import { Metadata } from "next";
import MatchList from "@/components/matches/MatchList";
import { getAllMatches } from "@/lib/api/fixtures";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Fixtures & Results | Zimbabwe Rugby Union",
  description: "Full schedule of Zimbabwe Rugby Union matches including the Sables, Lady Sables, and all national teams.",
};

export const revalidate = 3600;

export default async function MatchesPage() {
  const allMatches = await getAllMatches();
  const upcoming = allMatches.filter(m => m.status === "upcoming");
  const completed = allMatches.filter(m => m.status === "completed");

  return (
    <main className="min-h-screen bg-milk-white">
      <PageHero
        kicker="Schedule & Results"
        title="Fixtures & Results"
        subtitle="Follow the Sables and all Zimbabwe national teams through their season — from pool stages to finals."
        breadcrumb={[{ label: "Matches", href: "/matches" }]}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {upcoming.length > 0 && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-rich-black mb-8 not-italic flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-zru-green animate-pulse shrink-0" />
              Upcoming Fixtures
            </h2>
            <MatchList matches={upcoming} />
          </section>
        )}

        <section>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-rich-black mb-8 not-italic">
            Results
          </h2>
          <MatchList matches={completed} />
        </section>
      </div>
    </main>
  );
}
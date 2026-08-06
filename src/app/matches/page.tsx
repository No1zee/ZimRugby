import { Metadata } from "next";
import MatchList from "@/components/matches/MatchList";
import { getAllMatches } from "@/lib/api/fixtures";

export const metadata: Metadata = {
  title: "Fixtures & Results | Zimbabwe Rugby Union",
  description: "Full schedule of Zimbabwe Rugby Union matches including the Sables, Lady Sables, and all national teams.",
};

export const revalidate = 120;

export default async function MatchesPage() {
  const allMatches = await getAllMatches();
  const upcoming = allMatches.filter(m => m.status === "upcoming");
  const completed = allMatches.filter(m => m.status === "completed");

  return (
    <main className="min-h-screen bg-milk-white">
      <div className="bg-rich-black border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white leading-none not-italic">
            Fixtures & Results
          </h1>
          <p className="text-white/50 text-lg mt-4 max-w-2xl font-normal">
            Follow the Sables and all Zimbabwe national teams through their season — from pool stages to finals.
          </p>
        </div>
      </div>

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
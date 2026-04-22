"use client";

import React from "react";
import { FixtureCard, type Fixture } from "@/components/tickets/FixtureCard";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const VARIANT_MATCHES: Fixture[] = [
  {
    id: "v1",
    competition: "World Cup Qualifier",
    teams: "Sables vs Ivory Coast",
    date: "Sat 24 August 2026",
    time: "16:00 CAT",
    venue: "National Sports Stadium",
    city: "Harare",
    status: "ON_SALE",
    url: "https://tickets.example.com",
    isWorldCupPathway: true,
    category: "Sables"
  },
  {
    id: "v2",
    competition: "International Test",
    teams: "Sables vs Namibia",
    date: "Sat 15 July 2026",
    time: "15:30 CAT",
    venue: "Hartsfield",
    city: "Bulawayo",
    status: "ON_SALE",
    isWorldCupPathway: true,
    category: "Sables"
  },
  {
    id: "v3",
    competition: "Africa Cup",
    teams: "Lady Sables vs Uganda",
    date: "Sun 12 September 2026",
    time: "14:00 CAT",
    venue: "Old Hararians",
    city: "Harare",
    status: "COMING_SOON",
    category: "Lady Sables"
  },
  {
    id: "v4",
    competition: "Nations Cup",
    teams: "Sables vs Kenya",
    date: "Sat 5 October 2026",
    time: "16:00 CAT",
    venue: "National Sports Stadium",
    city: "Harare",
    status: "SOLD_OUT",
    isWorldCupPathway: true,
    category: "Sables"
  },
  {
    id: "v5",
    competition: "Super Six League",
    teams: "Old Hararians vs Old Georgians",
    date: "Sat 21 September 2026",
    time: "15:00 CAT",
    venue: "Police Grounds",
    city: "Harare",
    status: "CANCELLED",
    category: "Domestic"
  },
  {
    id: "v6",
    competition: "Sevens Circuit",
    teams: "Cheetahs Invitational",
    date: "Fri 10 Oct - Sun 12 Oct",
    time: "All Day",
    venue: "Vic Falls",
    status: "POSTPONED",
    category: "Sevens"
  }
];

export default function VariantsPage() {
  return (
    <main className="bg-rich-black min-h-screen">
      <Navigation />
      
      <div className="pt-40 pb-24 max-w-[1440px] mx-auto px-6 md:px-12">
        <header className="mb-16 border-l-4 border-clubhouse-gold pl-8">
          <span className="text-[10px] font-black text-clubhouse-gold uppercase tracking-[0.4em] mb-4 block">Design System / Core Components</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">FixtureCard Variants</h1>
          <p className="text-gray-500 max-w-2xl font-medium">
            This internal preview showcases the FixtureCard component across all possible match states. 
            Ensure consistent typography, color-coded status chips, and functional variant-specific primary actions.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VARIANT_MATCHES.map((fixture) => (
            <div key={fixture.id} className="space-y-4">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest pl-2">
                Scenario: {fixture.status} {fixture.isWorldCupPathway ? "+ Pathway" : ""} {(!fixture.url && fixture.status === 'ON_SALE') ? "(No URL)" : ""}
              </span>
              <FixtureCard 
                fixture={fixture} 
                onRegister={(f) => console.log("Registering for:", f.teams)} 
              />
            </div>
          ))}
        </div>

        <div className="mt-32 p-12 bg-white/2 border border-white/5 rounded-2xl">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Logic Implementation Checklist</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-clubhouse-gold uppercase tracking-widest">Happy Path (On Sale)</h3>
              <ul className="text-sm text-gray-500 space-y-2 font-medium list-disc ml-4">
                <li>Primary Gold Button with &quot;ExternalLink&quot; icon if URl present</li>
                <li>Green pulsing status chip</li>
                <li>Full opacity / No grayscale</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black text-clubhouse-gold uppercase tracking-widest">Fail-States (Sold Out / Cancelled)</h3>
              <ul className="text-sm text-gray-500 space-y-2 font-medium list-disc ml-4">
                <li>Cards set to 60% opacity + Grayscale filter</li>
                <li>Buttons replaced with static, disabled badges</li>
                <li>Hover border effect preserved but subtle</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

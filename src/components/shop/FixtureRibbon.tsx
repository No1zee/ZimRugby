"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Match } from "../matches/MatchList";

export default function FixtureRibbon() {
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNextFixture() {
      try {
        const response = await fetch("/api/fixtures");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        
        // Find the earliest upcoming fixture
        if (data.fixtures && data.fixtures.length > 0) {
          const sorted = data.fixtures.sort((a: Match, b: Match) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setNextMatch(sorted[0]);
        }
      } catch (err) {
        console.error("Fixture Ribbon Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNextFixture();
  }, []);

  if (loading) return null; // Don't show while loading to prevent layout shift

  return (
    <AnimatePresence>
      {nextMatch && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-clubhouse-gold text-clubhouse-charcoal overflow-hidden relative z-[60]"
        >
          <div className="max-w-[1440px] mx-auto px-6 py-2 flex items-center justify-between">
            
            {/* Left: Match Alert */}
            <div className="flex items-center space-x-4">
              <span className="bg-clubhouse-charcoal text-white text-[8px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded-xs">
                Next Match
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  {nextMatch.homeTeam.name} VS {nextMatch.awayTeam.name}
                </span>
                <span className="hidden md:inline text-[9px] font-bold opacity-60 uppercase tracking-widest">
                  {"// " + nextMatch.date + " // " + nextMatch.time}
                </span>
              </div>
            </div>

            {/* Right: CTA */}
            <Link 
              href="/match-centre"
              className="group flex items-center space-x-2 text-[9px] font-black uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
            >
              <span>Match Centre</span>
              <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>

          </div>
          
          {/* Animated Progress Line (Simulating excitement) */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="h-[1px] bg-clubhouse-charcoal/20 w-full origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

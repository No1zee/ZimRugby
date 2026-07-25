"use client";

import { useEffect, useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";

interface NextUnionMatchHeroProps {
  match: {
    id: string | number;
    homeTeam: { name: string };
    awayTeam: { name: string };
    venue: string;
    competition: string;
    teamCategory?: string;
    dateIso: string;
    time: string;
    ticketUrl?: string;
  } | null;
}

function getCountdown(targetIso: string) {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = target - now;

  if (isNaN(target) || diff <= 0) return { days: 0, hrs: 0, min: 0, expired: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hrs, min, expired: false };
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-heading text-lg bg-zru-green w-14 h-14 flex items-center justify-center rounded-lg font-black text-white">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1 block font-bold">
        {label}
      </span>
    </div>
  );
}

export default function NextUnionMatchHero({ match }: NextUnionMatchHeroProps) {
  const [countdown, setCountdown] = useState(() =>
    match ? getCountdown(match.dateIso) : { days: 0, hrs: 0, min: 0, expired: true }
  );

  useEffect(() => {
    if (!match) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(match.dateIso));
    }, 60_000);
    return () => clearInterval(interval);
  }, [match]);

  if (!match) {
    return (
      <section aria-label="Next Union Match" className="mb-10">
        <div className="bg-milk-white border border-black/10 rounded-2xl p-8 text-center">
          <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-zru-green mb-4">
            NEXT UNION MATCH
          </span>
          <p className="font-heading text-xl text-rich-black mb-2">
            No upcoming fixtures are currently scheduled
          </p>
          <p className="text-sm text-black/50">
            Explore recent results and Nations Cup standings below.
          </p>
        </div>
      </section>
    );
  }

  const matchDetailHref = `/matches/${match.id}`;

  return (
    <section aria-label="Next Union Match" className="mb-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#010B07] to-[#002a1a] border border-white/10 shadow-xl">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/events/africa-cup.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10">
          {/* Top row: badge + status */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-heading text-xs font-bold text-zru-green bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wider">
              {match.teamCategory || match.competition}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zru-green">
              <span className="w-1.5 h-1.5 rounded-full bg-zru-green animate-pulse" />
              UPCOMING
            </span>
          </div>

          {/* Teams */}
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-white uppercase font-black mb-2 tracking-tight">
            {match.homeTeam.name}{" "}
            <span className="text-zru-green font-anybody">VS</span>{" "}
            {match.awayTeam.name}
          </h2>

          {/* Venue */}
          <p className="font-body text-sm text-white/70 mb-8 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zru-green shrink-0" />
            {match.venue}
            {match.dateIso && (
              <span className="text-white/40">
                &middot;{" "}
                {new Date(match.dateIso).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                }).toUpperCase()}
              </span>
            )}
          </p>

          {/* Countdown + CTAs */}
          <div className="flex flex-wrap items-end justify-between gap-6">
            {/* Countdown */}
            <div className="flex gap-3">
              <CountdownBlock value={countdown.days} label="Days" />
              <CountdownBlock value={countdown.hrs} label="Hrs" />
              <CountdownBlock value={countdown.min} label="Min" />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <SlantedButton href={matchDetailHref} variant="primary" size="sm">
                <span className="flex items-center gap-2">
                  VIEW MATCH DETAILS
                  <ArrowRight className="w-4 h-4" />
                </span>
              </SlantedButton>
              {match.ticketUrl && (
                <SlantedButton href={match.ticketUrl} variant="secondary" size="sm">
                  MATCH TICKETS
                </SlantedButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

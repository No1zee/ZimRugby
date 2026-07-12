"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Trophy, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Match } from "./MatchList";

interface HeroMatchSpotlightProps {
  match: Match;
}

export default function HeroMatchSpotlight({ match }: HeroMatchSpotlightProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isOver: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false });

  useEffect(() => {
    const matchDateStr = match.dateIso || match.date;
    const targetDate = new Date(matchDateStr);

    if (isNaN(targetDate.getTime())) {
      setTimeLeft(prev => ({ ...prev, isOver: true }));
      return;
    }

    const calculateTime = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false
      };
    };

    setTimeLeft(calculateTime());

    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [match.date, match.dateIso]);

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-green border rounded-3xl overflow-hidden relative mb-12 shadow-2xl"
    >
      {/* Cinematic Stadium Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zru-green/15 via-rich-black/90 to-rich-black -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay -z-10 pointer-events-none bg-[url('/images/stadium-lights-placeholder.webp')]" />

      <div className="p-8 lg:p-12">
        {/* Header Badging */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="bg-zru-green/20 text-zru-green text-[10px] font-black uppercase px-3 py-1 rounded border border-zru-green/30 tracking-widest">
              NEXT UP CLASH
            </span>
            {match.teamCategory && (
              <span className="bg-white/5 text-white/70 text-[10px] font-bold uppercase px-3 py-1 rounded border border-white/10 tracking-wider">
                {match.teamCategory}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Trophy className="w-4 h-4 text-zru-green" />
            <span className="font-heading font-semibold uppercase tracking-wider">{match.competition}</span>
          </div>
        </div>

        {/* The Duel Match Arena */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-8 mb-10">
          {/* Home Team */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-rich-black rounded-full flex items-center justify-center p-3 border-2 border-zru-green/40 shadow-lg relative overflow-hidden">
              {match.homeTeam.logo ? (
                <Image
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  fill
                  sizes="96px"
                  priority={true}
                  className="object-contain p-3"
                />
              ) : (
                <span className="text-white font-heading font-black text-2xl">
                  {match.homeTeam.name.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <h3 className="text-white font-heading text-xl md:text-2xl mt-4 font-bold tracking-tight">
              {match.homeTeam.name}
            </h3>
          </div>

          {/* Countdown Clock / VS */}
          <div className="flex flex-col items-center justify-center">
            {timeLeft.isOver ? (
              <div className="text-center">
                <span className="text-3xl font-heading text-white/60 uppercase tracking-widest font-black">
                  MATCH LIVE
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-xs text-white/40 uppercase font-black tracking-widest mb-3">
                  KICKOFF COUNTDOWN
                </span>
                <div className="flex gap-2.5">
                  {timeBlocks.map((block) => (
                    <div key={block.label} className="flex flex-col items-center">
                      <div className="bg-black/50 border border-white/10 rounded-xl w-14 h-14 flex items-center justify-center font-heading text-2xl font-black text-white shadow-inner">
                        {String(block.value).padStart(2, "0")}
                      </div>
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1.5">
                        {block.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-rich-black rounded-full flex items-center justify-center p-3 border-2 border-white/10 shadow-lg relative overflow-hidden">
              {match.awayTeam.logo ? (
                <Image
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  fill
                  sizes="96px"
                  priority={true}
                  className="object-contain p-3"
                />
              ) : (
                <span className="text-white font-heading font-black text-2xl">
                  {match.awayTeam.name.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <h3 className="text-white font-heading text-xl md:text-2xl mt-4 font-bold tracking-tight">
              {match.awayTeam.name}
            </h3>
          </div>
        </div>

        {/* Venue, Date, Time & CTAs */}
        <div className="border-t border-white/5 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zru-green" />
              <span className="font-semibold uppercase tracking-wider">{match.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zru-green" />
              <span className="font-semibold">{match.time} CAT</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zru-green" />
              <span className="font-semibold uppercase tracking-wider">{match.venue}</span>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <Link href="/tickets" className="flex-1 lg:flex-initial">
              <button className="w-full bg-zru-green hover:bg-zru-green/90 text-rich-black font-heading font-black text-xs uppercase px-8 py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,107,63,0.3)] hover:shadow-[0_4px_30px_rgba(0,107,63,0.5)] flex items-center justify-center gap-2">
                <Ticket className="w-4 h-4" />
                GET TICKETS
              </button>
            </Link>
            <Link href={`/match-centre/${match.id}`} className="flex-1 lg:flex-initial">
              <button className="w-full card-green border text-white hover:text-zru-green hover:border-zru-green/50 font-heading font-black text-xs uppercase px-8 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center">
                MATCH DETAILS
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

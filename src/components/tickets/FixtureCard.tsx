"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  AlertCircle,
  Ticket,
  CheckCircle2,
  XCircle
} from "lucide-react";
import Button from "@/components/common/Button";

export type FixtureStatus = 
  | 'ON_SALE' 
  | 'COMING_SOON' 
  | 'SOLD_OUT' 
  | 'CANCELLED' 
  | 'POSTPONED' 
  | 'ENDED';

export interface Fixture {
  id: string;
  competition: string;
  teams: string;
  date: string;
  time: string;
  venue: string;
  city?: string;
  status: FixtureStatus;
  url?: string;
  tags?: string[];
  category?: string;
  isWorldCupPathway?: boolean;
}

interface FixtureCardProps {
  fixture: Fixture;
  onRegister?: (fixture: Fixture) => void;
}

export const FixtureCard = ({ fixture, onRegister }: FixtureCardProps) => {
  const isWorldCupPathway = fixture.isWorldCupPathway || fixture.tags?.includes("World Cup Pathway Fixture");
  
  const renderStatus = () => {
    switch (fixture.status) {
      case 'ON_SALE':
        return (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-500">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            On Sale
          </div>
        );
      case 'COMING_SOON':
        return (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-clubhouse-gold">
            <div className="w-1.5 h-1.5 rounded-full bg-clubhouse-gold animate-pulse" />
            Coming Soon
          </div>
        );
      case 'SOLD_OUT':
        return (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
            <Ticket className="w-3 h-3" />
            Sold Out
          </div>
        );
      case 'CANCELLED':
        return (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500">
            <XCircle className="w-3 h-3" />
            Cancelled
          </div>
        );
      case 'POSTPONED':
        return (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500">
            <AlertCircle className="w-3 h-3" />
            Postponed
          </div>
        );
      default:
        return null;
    }
  };

  const renderAction = () => {
    if (fixture.status === 'ON_SALE' && fixture.url) {
      return (
        <Button 
          variant="secondary" 
          className="w-full group"
          onClick={() => window.open(fixture.url, '_blank')}
        >
          Buy Tickets
          <ExternalLink className="ml-2 w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
        </Button>
      );
    }

    if (fixture.status === 'COMING_SOON' || (fixture.status === 'ON_SALE' && !fixture.url)) {
      return (
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => onRegister?.(fixture)}
        >
          Register Interest
        </Button>
      );
    }

    if (fixture.status === 'SOLD_OUT') {
      return (
        <div className="w-full py-3 bg-white/5 border border-white/10 text-white/20 rounded font-black text-xs uppercase tracking-widest text-center">
          Allocation Exhausted
        </div>
      );
    }

    if (fixture.status === 'CANCELLED') {
      return (
        <div className="w-full py-3 bg-red-500/5 border border-red-500/10 text-red-500/50 rounded font-black text-xs uppercase tracking-widest text-center">
          Match Cancelled
        </div>
      );
    }

    return (
      <div className="w-full py-3 bg-white/5 border border-white/10 text-white/20 rounded font-black text-xs uppercase tracking-widest text-center italic">
        Viewing Only
      </div>
    );
  };

  const isGrayscale = ['SOLD_OUT', 'CANCELLED', 'ENDED'].includes(fixture.status);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-500 flex flex-col h-full glow-green-card ${isGrayscale ? 'opacity-60 grayscale' : ''}`}
    >
      {/* Cinematic Grain Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none" />
      
      {/* Card Header Tags */}
      <div className="p-4 flex justify-between items-start gap-4 relative z-10">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] bg-white/5 px-2 py-1 rounded">
          {fixture.competition}
        </span>
        {isWorldCupPathway && (
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-3 py-1 bg-clubhouse-gold text-rich-black text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            World Cup Pathway
          </motion.span>
        )}
      </div>

      {/* Main Content */}
      <div className="px-6 py-4 flex-1 relative z-10">
        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-6 group-hover:text-clubhouse-gold transition-colors duration-300">
          {fixture.teams}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-400">
            <Calendar className="w-4 h-4 text-green-500/60" />
            <span className="text-sm font-medium tracking-tight">{fixture.date}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Clock className="w-4 h-4 text-green-500/60" />
            <span className="text-sm font-medium tracking-tight">{fixture.time}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <MapPin className="w-4 h-4 text-green-500/60" />
            <span className="text-sm font-medium line-clamp-1 tracking-tight">
              {fixture.venue}{fixture.city ? `, ${fixture.city}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 mt-auto border-t border-white/5 flex flex-col gap-4 relative z-10 bg-white/[0.01]">
        <div className="flex items-center justify-between">
          {renderStatus()}
          {fixture.status === 'SOLD_OUT' && (
            <span className="text-[10px] font-bold text-white/20 italic tracking-wide">Check official resale</span>
          )}
        </div>

        {renderAction()}
      </div>

      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-linear-to-tr from-clubhouse-gold/0 via-transparent to-clubhouse-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Ticket, Percent, Mail, Trophy, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

interface Benefit {
  title: string;
  category: string;
  desc: string;
  icon: React.ElementType;
  badgeText: string;
}

const fanzoneBenefits: Benefit[] = [
  {
    title: "PRIORITY TICKETS PRESALE",
    category: "MATCHDAY PERK",
    desc: "Get exclusive access to major Sables test match tickets 48 hours before general public release.",
    icon: Ticket,
    badgeText: "PRESALE ACCESS",
  },
  {
    title: "EXCLUSIVE MERCH DISCOUNTS",
    category: "CLUBHOUSE STORE",
    desc: "Enjoy 10% off all official Zimbabwe Rugby jerseys and gear at the ZRU Clubhouse store.",
    icon: Percent,
    badgeText: "10% STORE OFF",
  },
  {
    title: "INSIDER SQUAD NEWSLETTER",
    category: "DIRECT PRESSROOM",
    desc: "Receive official Sable team announcements, matchday lineups, and injury updates first.",
    icon: Mail,
    badgeText: "PRESS INSIDER",
  },
  {
    title: "VIP FAN COMPETITIONS",
    category: "SUPPORTERS DRAW",
    desc: "Enter monthly draws to win signed match balls, player jerseys, and VIP matchday passes.",
    icon: Trophy,
    badgeText: "VIP ACCESS",
  },
];

interface FanzoneFlipShowcaseProps {
  onTriggerJoin: () => void;
}

export default function FanzoneFlipShowcase({ onTriggerJoin }: FanzoneFlipShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-flip timer with animated progress bar
  useEffect(() => {
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / 28), 100));
    }, 100);

    const timer = setTimeout(() => {
      if (!isFlipped) {
        setIsFlipped(true);
      } else {
        if (currentIndex >= fanzoneBenefits.length - 1) {
          onTriggerJoin();
        } else {
          setIsFlipped(false);
          setCurrentIndex((prev) => prev + 1);
        }
      }
    }, 2800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [currentIndex, isFlipped, onTriggerJoin]);

  const current = fanzoneBenefits[currentIndex];
  const IconComponent = current.icon;

  const handleManualFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    } else {
      if (currentIndex >= fanzoneBenefits.length - 1) {
        onTriggerJoin();
      } else {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6">
      {/* 3D Flip Card Container */}
      <div className="perspective-1000 w-full max-w-md h-[350px] sm:h-[370px] cursor-pointer touch-manipulation">
        
        {/* Flip Inner Engine */}
        <div
          onClick={handleManualFlip}
          className={`relative w-full h-full preserve-3d transition-transform duration-700 ease-in-out shadow-2xl rounded-3xl ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          
          {/* ════════════════ FRONT SIDE ════════════════ */}
          <div
            className="backface-hidden absolute inset-0 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden border border-[#006747]/40 shadow-2xl"
            style={{
              background: "radial-gradient(circle at 50% 25%, #0D261C 0%, #003B24 60%, #001F13 100%)",
            }}
          >
            {/* Top Laser-Mint Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/40 overflow-hidden rounded-t-3xl z-20">
              <div
                className="h-full bg-gradient-to-r from-[#006747] via-[#006747] to-white transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Subtle Ambient Inner Glow Frame */}
            <div className="absolute inset-0 border border-white/10 shadow-[inset_0_0_50px_rgba(0,103,71,0.15)] pointer-events-none rounded-3xl" />

            {/* Subtle ZRU Emblem Watermark Backdrop */}
            <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none select-none">
              <Image
                src="/images/logos/zru-logo.svg"
                alt="ZRU Crest Watermark"
                width={220}
                height={220}
                className="object-contain"
              />
            </div>

            {/* Front Top Header Bar */}
            <div className="flex items-center justify-between relative z-10 pt-1">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logos/zru-logo.svg"
                  alt="ZRU Crest"
                  width={26}
                  height={26}
                  className="object-contain"
                />
                <span className="font-heading font-black text-xs text-[#006747] uppercase tracking-wider">
                  ZIMBABWE RUGBY
                </span>
              </div>
              <span className="px-2.5 py-0.5 bg-[#006747]/15 border border-[#006747]/30 text-[#006747] rounded text-[9px] font-black tracking-widest uppercase">
                {current.badgeText}
              </span>
            </div>

            {/* Front Main Content */}
            <div className="relative z-10 space-y-4 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-black/50 border border-[#006747]/40 flex items-center justify-center text-[#006747] shadow-lg shadow-[#006747]/20">
                <IconComponent className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight leading-tight">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed">
                {current.desc}
              </p>
            </div>

            {/* Front Bottom Action Hint */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-black tracking-widest text-[#006747] uppercase">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#006747]" />
                <span>BENEFIT 0{currentIndex + 1} OF 04</span>
              </span>
              <span className="text-white/60 text-[9px] hover:text-white flex items-center gap-1 transition-colors">
                TAP TO FLIP ➔
              </span>
            </div>
          </div>

          {/* ════════════════ BACK SIDE ════════════════ */}
          <div
            className="backface-hidden rotate-y-180 absolute inset-0 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden border border-[#006747] shadow-2xl"
            style={{
              background: "radial-gradient(circle at 50% 25%, #071711 0%, #030C08 60%, #000503 100%)",
            }}
          >
            {/* Top Laser Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/40 overflow-hidden rounded-t-3xl z-20">
              <div
                className="h-full bg-gradient-to-r from-[#006747] via-white to-[#006747] transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Back Glow Overlay */}
            <div className="absolute inset-0 border border-[#006747]/30 shadow-[inset_0_0_60px_rgba(0,103,71,0.25)] pointer-events-none rounded-3xl" />

            {/* Back Top Header */}
            <div className="flex items-center justify-between relative z-10 pt-1">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logos/zru-logo.svg"
                  alt="ZRU Crest"
                  width={28}
                  height={28}
                  className="object-contain"
                />
                <span className="font-heading font-black text-xs text-[#006747] uppercase tracking-wider">
                  ZIMBABWE RUGBY
                </span>
              </div>
              <span className="px-2.5 py-0.5 bg-[#006747] text-[#002D1A] rounded font-black text-[9px] tracking-widest uppercase shadow-sm">
                OFFICIAL ACCESS
              </span>
            </div>

            {/* Back Main Content */}
            <div className="relative z-10 space-y-3 my-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#006747]/15 rounded-lg text-[#006747] text-[10px] font-black tracking-widest uppercase border border-[#006747]/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>MEMBERSHIP UNLOCKED</span>
              </div>
              <h4 className="text-lg font-heading font-black text-white uppercase tracking-tight">
                CLAIM YOUR FANZONE PASS
              </h4>
              <p className="text-xs text-white/80 font-normal leading-relaxed">
                Join thousands of global Sables supporters. Get instant priority tickets, exclusive merchandise discounts, and inner-sanctum match access.
              </p>
            </div>

            {/* Back Action Trigger Button */}
            <div className="relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTriggerJoin();
                }}
                className="w-full bg-[#006747] text-[#002D1A] py-3.5 px-6 rounded-xl hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 font-black text-xs tracking-widest uppercase font-heading shadow-xl shadow-[#006747]/30"
              >
                <span>JOIN THE FANZONE NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Pagination Dots */}
      <div className="flex items-center gap-2 pt-2">
        {fanzoneBenefits.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setIsFlipped(false);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? "bg-[#006747] w-6 shadow-md"
                : "bg-black/20 w-2 hover:bg-black/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

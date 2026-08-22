"use client";

import { useRef } from "react";
import { Printer, Download, X, Trophy, ShieldCheck, User } from "lucide-react";
import type { MatchCardViewModel } from "@/lib/match-centre/types";

interface MatchSheetExporterProps {
  match: MatchCardViewModel;
  onClose: () => void;
}

const DEFAULT_POSITIONS_15 = [
  { num: 1, pos: "Loosehead Prop", defaultName: "Cleopas Kundiona", club: "ZRU / Sharks" },
  { num: 2, pos: "Hooker", defaultName: "Liam Larkan", club: "Old Hararians" },
  { num: 3, pos: "Tighthead Prop", defaultName: "Farai Mudariki", club: "Harare Sports Club" },
  { num: 4, pos: "Lock", defaultName: "Kudakwashe Nyakufanisa", club: "Old Georgians" },
  { num: 5, pos: "Lock", defaultName: "Simbarashe Siraha", club: "Pitbulls RFC" },
  { num: 6, pos: "Blindside Flanker", defaultName: "Vakai Hove", club: "Old Hararians" },
  { num: 7, pos: "Openside Flanker", defaultName: "Tinotenda Mavesere", club: "Sharks / ZRU" },
  { num: 8, pos: "Number Eight", defaultName: "Aiden Burnett", club: "Old Georgians" },
  { num: 9, pos: "Scrum-half (C)", defaultName: "Hilton Mudariki", club: "Harare Sports Club" },
  { num: 10, pos: "Fly-half", defaultName: "Ian Prior", club: "Western Force / ZRU" },
  { num: 11, pos: "Left Wing", defaultName: "Edward Sigauke", club: "Old Hararians" },
  { num: 12, pos: "Inside Centre", defaultName: "Kudzai Mashawi", club: "Harare Sports Club" },
  { num: 13, pos: "Outside Centre", defaultName: "Brandon Mudzekenyedzi", club: "Old Georgians" },
  { num: 14, pos: "Right Wing", defaultName: "Takudzwa Musingwini", club: "Old Hararians" },
  { num: 15, pos: "Fullback", defaultName: "Tapiwa Mafura", club: "Cheetahs / Lions" },
];

const DEFAULT_RESERVES = [
  { num: 16, pos: "Front Row Reserve", defaultName: "Bryan Chiang", club: "Harare Sports Club" },
  { num: 17, pos: "Front Row Reserve", defaultName: "Zvikomborero Chimoto", club: "Old Hararians" },
  { num: 18, pos: "Front Row Reserve", defaultName: "Bornwell Gwinji", club: "Pitbulls RFC" },
  { num: 19, pos: "Forward Reserve", defaultName: "David Makamba", club: "Old Georgians" },
  { num: 20, pos: "Forward Reserve", defaultName: "Tadiwa Gwashu", club: "Harare Sports Club" },
  { num: 21, pos: "Back Reserve", defaultName: "Dion Khumalo", club: "Matabeleland Warriors" },
  { num: 22, pos: "Back Reserve", defaultName: "Keegan Joubert", club: "Old Georgians" },
  { num: 23, pos: "Utility Back", defaultName: "Godfrey Muzanargwo", club: "Old Hararians" },
];

export default function MatchSheetExporter({ match, onClose }: MatchSheetExporterProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const homeTeam = match.homeTeam?.name || "Zimbabwe Sables";
  const awayTeam = match.awayTeam?.name || "Opponent";
  const competition = match.competition || "International Test Match";
  const venue = match.venue || "National Sports Stadium / Police Grounds, Harare";
  const dateStr = match.dateIso ? match.dateIso.split("T")[0] : "Matchday 2026";
  const kickoff = match.time || "15:00 CAT";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white text-black shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
        {/* Modal Action Header - Hidden when printing */}
        <div className="flex items-center justify-between border-b border-black/10 bg-[#00452A] px-6 py-4 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-black uppercase tracking-wider text-white">
                World Rugby Match Sheet
              </h3>
              <p className="text-xs text-white/70">Official Team Roster & Governance Sheet</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-zru-green px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Match Sheet Content */}
        <div ref={printRef} className="p-8 sm:p-10 font-sans text-xs bg-white text-black leading-relaxed print:p-6">
          {/* Official Letterhead */}
          <div className="border-b-2 border-[#006747] pb-6 mb-6 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#006747] mb-1">
                ZIMBABWE RUGBY UNION // OFFICIAL MATCHDAY SHEET
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                {homeTeam} <span className="text-[#006747]">vs</span> {awayTeam}
              </h1>
              <div className="flex flex-wrap gap-4 mt-2 text-black/70 font-mono text-[11px]">
                <span><strong>COMPETITION:</strong> {competition}</span>
                <span><strong>VENUE:</strong> {venue}</span>
                <span><strong>DATE:</strong> {dateStr}</span>
                <span><strong>KICKOFF:</strong> {kickoff}</span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold uppercase tracking-wider text-[#00452A]">ZRU GOVERNANCE</div>
              <div className="text-[10px] font-mono text-black/50">MATCH CODE: ZRU-{match.id.slice(0, 8)}</div>
              <div className="text-[10px] font-mono text-black/50">STATUS: OFFICIAL SANCTIONED</div>
            </div>
          </div>

          {/* Roster Grid: Starting XV and Bench */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Starting 15 */}
            <div>
              <div className="flex items-center justify-between bg-[#00452A] text-white px-3 py-2 rounded-lg font-heading text-xs font-black uppercase tracking-wider mb-3">
                <span>STARTING XV (1–15)</span>
                <span>CLUB / UNION</span>
              </div>
              <table className="w-full text-left border-collapse">
                <tbody>
                  {DEFAULT_POSITIONS_15.map((player) => (
                    <tr key={player.num} className="border-b border-black/5 hover:bg-black/[0.02]">
                      <td className="py-1.5 font-mono font-bold text-[#006747] w-8">{player.num}</td>
                      <td className="py-1.5 font-bold">{player.defaultName}</td>
                      <td className="py-1.5 text-black/60 text-[11px]">{player.pos}</td>
                      <td className="py-1.5 text-right font-mono text-[11px] text-black/50">{player.club}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Replacements (16-23) & Officials */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between bg-[#00452A] text-white px-3 py-2 rounded-lg font-heading text-xs font-black uppercase tracking-wider mb-3">
                  <span>RESERVES & SUBSTITUTES (16–23)</span>
                  <span>CLUB / UNION</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {DEFAULT_RESERVES.map((player) => (
                      <tr key={player.num} className="border-b border-black/5 hover:bg-black/[0.02]">
                        <td className="py-1.5 font-mono font-bold text-[#006747] w-8">{player.num}</td>
                        <td className="py-1.5 font-bold">{player.defaultName}</td>
                        <td className="py-1.5 text-black/60 text-[11px]">{player.pos}</td>
                        <td className="py-1.5 text-right font-mono text-[11px] text-black/50">{player.club}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Match Officials & Medical Staff */}
              <div className="border border-black/10 rounded-xl p-4 bg-[#FDFBF0]">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006747] mb-2">
                  MATCH OFFICIALS & SIGN-OFF
                </div>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-black/50 block">REFEREE:</span>
                    <strong className="text-black">Appointed by Rugby Africa / WR</strong>
                  </div>
                  <div>
                    <span className="text-black/50 block">ASSISTANT REFEREES:</span>
                    <strong className="text-black">ZRU Referees Society</strong>
                  </div>
                  <div>
                    <span className="text-black/50 block">TEAM MEDICAL DOCTOR:</span>
                    <strong className="text-black">Dr. N. Sithole (Certified)</strong>
                  </div>
                  <div>
                    <span className="text-black/50 block">HEAD COACH:</span>
                    <strong className="text-black">Piet Benade (ZRU Sables)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Signatures Footer */}
          <div className="border-t border-black/10 pt-6 grid grid-cols-3 gap-6 text-[10px] text-black/60 font-mono">
            <div>
              <div className="h-10 border-b border-black/30 mb-1" />
              <span>TEAM MANAGER SIGNATURE</span>
            </div>
            <div>
              <div className="h-10 border-b border-black/30 mb-1" />
              <span>MATCH COMMISSIONER SIGNATURE</span>
            </div>
            <div>
              <div className="h-10 border-b border-black/30 mb-1" />
              <span>MEDICAL OFFICER SIGN-OFF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

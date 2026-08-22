"use client";

import { useRef, useEffect, useState } from "react";
import { Download, X, Copy, Check, Share2, Sparkles, Image as ImageIcon } from "lucide-react";
import type { MatchCardViewModel } from "@/lib/match-centre/types";
import { useToast } from "./ui/ToastProvider";

interface MatchSocialCardModalProps {
  match: MatchCardViewModel;
  onClose: () => void;
}

const DEFAULT_SQUAD_NAMES = [
  "1. Cleopas Kundiona", "2. Liam Larkan", "3. Farai Mudariki",
  "4. K. Nyakufanisa", "5. Simbarashe Siraha", "6. Vakai Hove",
  "7. Tinotenda Mavesere", "8. Aiden Burnett", "9. Hilton Mudariki (C)",
  "10. Ian Prior", "11. Edward Sigauke", "12. Kudzai Mashawi",
  "13. B. Mudzekenyedzi", "14. T. Musingwini", "15. Tapiwa Mafura"
];

export default function MatchSocialCardModal({ match, onClose }: MatchSocialCardModalProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  const homeTeam = match.homeTeam?.name || "Zimbabwe Sables";
  const awayTeam = match.awayTeam?.name || "Namibia Welwitschias";
  const competition = match.competition || "VICTORIA CUP 2026";
  const venue = match.venue || "Police Grounds, Harare";
  const dateStr = match.dateIso ? match.dateIso.split("T")[0] : "Matchday 2026";
  const kickoff = match.time || "15:00 CAT";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set 1080x1350 (Instagram/Twitter Portrait Standard)
    canvas.width = 1080;
    canvas.height = 1350;

    // 1. Background Fill (Milk White / Warm Ivory)
    ctx.fillStyle = "#FDFBF0";
    ctx.fillRect(0, 0, 1080, 1350);

    // 2. Header Banner Background (Deep Forest Green)
    ctx.fillStyle = "#00452A";
    ctx.fillRect(0, 0, 1080, 320);

    // Subtle emerald accent band
    ctx.fillStyle = "#00C88C";
    ctx.fillRect(0, 320, 1080, 12);

    // 3. Header Text & Eyebrow
    ctx.fillStyle = "#00C88C";
    ctx.font = "900 24px sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("ZIMBABWE RUGBY UNION // MATCHDAY SQUAD", 80, 80);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 56px sans-serif";
    ctx.fillText(homeTeam.toUpperCase(), 80, 160);

    ctx.fillStyle = "#86EFAC";
    ctx.font = "700 36px sans-serif";
    ctx.fillText(`VS ${awayTeam.toUpperCase()}`, 80, 220);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "500 22px monospace";
    ctx.fillText(`${competition} • ${dateStr} • ${kickoff} • ${venue}`, 80, 275);

    // 4. Starting Lineup Grid Box
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(80, 370, 920, 820, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Lineup Title
    ctx.fillStyle = "#006747";
    ctx.font = "900 28px sans-serif";
    ctx.fillText("STARTING FIFTEEN", 120, 430);

    ctx.fillStyle = "#6B7280";
    ctx.font = "600 18px monospace";
    ctx.fillText("OFFICIAL TEAM ANNOUNCEMENT", 640, 430);

    // Render Players in 2 Columns
    ctx.font = "700 24px sans-serif";
    ctx.fillStyle = "#0E0E0E";

    const col1 = DEFAULT_SQUAD_NAMES.slice(0, 8);
    const col2 = DEFAULT_SQUAD_NAMES.slice(8, 15);

    col1.forEach((player, idx) => {
      const y = 500 + idx * 80;
      ctx.fillStyle = "#006747";
      ctx.fillText(player.split(".")[0] + ".", 120, y);
      ctx.fillStyle = "#0E0E0E";
      ctx.fillText(player.split(".")[1], 170, y);
    });

    col2.forEach((player, idx) => {
      const y = 500 + idx * 80;
      ctx.fillStyle = "#006747";
      ctx.fillText(player.split(".")[0] + ".", 560, y);
      ctx.fillStyle = "#0E0E0E";
      ctx.fillText(player.split(".")[1], 610, y);
    });

    // 5. Footer Sponsor / Authority Plate
    ctx.fillStyle = "#00452A";
    ctx.beginPath();
    ctx.roundRect(80, 1220, 920, 80, 16);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 20px sans-serif";
    ctx.fillText("ZIMBABWE RUGBY UNION • zimrugby.co.zw • #SablesRugby", 120, 1270);

    setIsGenerating(false);
  }, [homeTeam, awayTeam, competition, venue, dateStr, kickoff]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `zru-squad-${match.id.slice(0, 8)}.png`;
    link.href = url;
    link.click();
    toast("Matchday squad graphic downloaded (1080x1350 PNG)", "success");
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        toast("Graphic copied to clipboard", "success");
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      toast("Could not copy directly to clipboard. Please use Download PNG.", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white text-black shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 bg-[#00452A] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-black uppercase tracking-wider text-white">
                Social Squad Graphic (1080x1350)
              </h3>
              <p className="text-xs text-white/70">Instagram & Twitter Matchday Announcement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Canvas Preview Area */}
        <div className="p-6 bg-[#FDFBF0] flex flex-col items-center justify-center">
          <div className="relative max-h-[55vh] overflow-hidden rounded-xl shadow-xl border border-black/10">
            <canvas
              ref={canvasRef}
              className="w-auto h-[50vh] max-w-full object-contain block bg-white"
            />
          </div>

          <p className="mt-4 text-xs font-mono text-black/50 text-center">
            Standard 1080x1350 HD Portrait • Milk White & ZRU Green Palette
          </p>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between border-t border-black/10 bg-white px-6 py-4">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl bg-black/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black/80 hover:bg-black/10 transition-all cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied PNG!" : "Copy to Clipboard"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-zru-green px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
}

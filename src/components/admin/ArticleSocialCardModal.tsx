"use client";

import { useRef, useEffect, useState } from "react";
import { Download, X, Copy, Check, Share2, Sparkles, Image as ImageIcon } from "lucide-react";
import { useToast } from "./ui/ToastProvider";
import { toAssetUrl } from "./ui/ImagePicker";

interface ArticleSocialCardModalProps {
  title: string;
  category?: string;
  subtitle?: string;
  image?: string;
  author?: string;
  photographerCredit?: string;
  onClose: () => void;
}

export default function ArticleSocialCardModal({
  title,
  category = "National Teams",
  subtitle = "",
  image,
  author = "Zimbabwe Rugby Union",
  photographerCredit = "Official ZRU Media",
  onClose,
}: ArticleSocialCardModalProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [cardTheme, setCardTheme] = useState<"branded-dark" | "milk-white">("branded-dark");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set 1200x630 (Standard OpenGraph / Twitter Large Card)
    canvas.width = 1200;
    canvas.height = 630;

    const renderCard = (bgImg?: HTMLImageElement) => {
      if (cardTheme === "branded-dark") {
        // Dark Forest Stadium Theme
        if (bgImg) {
          ctx.drawImage(bgImg, 0, 0, 1200, 630);
          // Dark gradient vignette
          const grad = ctx.createLinearGradient(0, 0, 0, 630);
          grad.addColorStop(0, "rgba(0, 20, 12, 0.4)");
          grad.addColorStop(0.5, "rgba(0, 29, 17, 0.8)");
          grad.addColorStop(1, "rgba(0, 29, 17, 0.98)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 1200, 630);
        } else {
          ctx.fillStyle = "#002d19";
          ctx.fillRect(0, 0, 1200, 630);

          // Stadium Dot Overlay
          ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
          for (let x = 20; x < 1200; x += 30) {
            for (let y = 20; y < 630; y += 30) {
              ctx.beginPath();
              ctx.arc(x, y, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Top Eyebrow Tag
        ctx.fillStyle = "#00C88C";
        ctx.beginPath();
        ctx.roundRect(80, 60, 220, 36, 8);
        ctx.fill();

        ctx.fillStyle = "#002d19";
        ctx.font = "900 13px sans-serif";
        ctx.fillText((category || "OFFICIAL STORY").toUpperCase(), 96, 83);

        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "800 13px monospace";
        ctx.fillText("ZIMBABWE RUGBY UNION", 320, 83);

        // Headline Text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "900 48px sans-serif";

        const words = (title || "ZIMBABWE RUGBY UNION ANNOUNCEMENT").split(" ");
        let line = "";
        let y = 180;
        const maxWidth = 1040;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, 80, y);
            line = words[n] + " ";
            y += 58;
            if (y > 360) {
              line += "...";
              break;
            }
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 80, y);

        // Subtitle / Excerpt
        if (subtitle && y <= 360) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          ctx.font = "500 20px sans-serif";
          ctx.fillText(subtitle.slice(0, 110) + (subtitle.length > 110 ? "..." : ""), 80, y + 55);
        }

        // Footer Bar
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(80, 520);
        ctx.lineTo(1120, 520);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "600 16px sans-serif";
        ctx.fillText(`By ${author} • Photo: ${photographerCredit}`, 80, 565);

        ctx.fillStyle = "#00C88C";
        ctx.font = "900 20px monospace";
        ctx.fillText("zimrugby.co.zw", 960, 565);
      } else {
        // Milk White Editorial Theme (#FDFBF0)
        ctx.fillStyle = "#FDFBF0";
        ctx.fillRect(0, 0, 1200, 630);

        // Left Authority Color Bar
        ctx.fillStyle = "#00452A";
        ctx.fillRect(0, 0, 36, 630);

        // Header
        ctx.fillStyle = "#006747";
        ctx.font = "900 18px sans-serif";
        ctx.fillText("ZIMBABWE RUGBY UNION // OFFICIAL STORY", 80, 80);

        // Category Pill
        ctx.fillStyle = "#00452A";
        ctx.beginPath();
        ctx.roundRect(80, 110, 180, 36, 8);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "800 14px sans-serif";
        ctx.fillText((category || "NEWS").toUpperCase(), 100, 134);

        // Headline
        ctx.fillStyle = "#0E0E0E";
        ctx.font = "900 46px sans-serif";

        const words = (title || "ZIMBABWE RUGBY UNION ANNOUNCEMENT").split(" ");
        let line = "";
        let y = 220;
        const maxWidth = 1040;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, 80, y);
            line = words[n] + " ";
            y += 58;
            if (y > 380) {
              line += "...";
              break;
            }
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 80, y);

        // Footer
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 480);
        ctx.lineTo(1120, 480);
        ctx.stroke();

        ctx.fillStyle = "#4A4A4A";
        ctx.font = "600 18px sans-serif";
        ctx.fillText(`Published by ${author} • Photo: ${photographerCredit}`, 80, 530);

        ctx.fillStyle = "#006747";
        ctx.font = "800 20px monospace";
        ctx.fillText("zimrugby.co.zw", 80, 570);

        ctx.fillStyle = "#00452A";
        ctx.font = "900 24px sans-serif";
        ctx.fillText("ZRU TOUCHLINE", 920, 570);
      }
    };

    const resolvedUrl = toAssetUrl(image);
    if (resolvedUrl && cardTheme === "branded-dark") {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => renderCard(img);
      img.onerror = () => renderCard();
      img.src = resolvedUrl;
    } else {
      renderCard();
    }
  }, [title, category, subtitle, image, author, photographerCredit, cardTheme]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `zru-social-card-${Date.now()}.png`;
    link.href = url;
    link.click();
    toast("Social share card downloaded (1200x630 PNG)", "success");
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
        toast("Card image copied to clipboard", "success");
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      toast("Could not copy directly. Please click Download PNG.", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white text-[#1b1c1c] shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#002d19] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#00C88C]">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-black uppercase tracking-wider text-white">
                Social Share Card Generator (1200x630)
              </h3>
              <p className="text-xs text-white/70">
                HD OpenGraph Graphic for WhatsApp, Twitter/X, Facebook & Instagram
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Theme Selector */}
        <div className="bg-[#fcfaef] px-6 py-3 border-b border-[#eae8de] flex items-center justify-between">
          <span className="text-xs font-bold text-[#404942]">Select Card Style:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCardTheme("branded-dark")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                cardTheme === "branded-dark"
                  ? "bg-[#002d19] text-white shadow-xs"
                  : "bg-white border border-[#eae8de] text-[#404942]"
              }`}
            >
              🌲 Stadium Dark
            </button>
            <button
              onClick={() => setCardTheme("milk-white")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                cardTheme === "milk-white"
                  ? "bg-[#002d19] text-white shadow-xs"
                  : "bg-white border border-[#eae8de] text-[#404942]"
              }`}
            >
              🥛 Milk White
            </button>
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="p-6 bg-[#f7f5ea] flex flex-col items-center justify-center">
          <div className="relative max-h-[50vh] overflow-hidden rounded-xl shadow-2xl border border-[#eae8de]">
            <canvas
              ref={canvasRef}
              className="w-auto h-[35vh] max-w-full object-contain block bg-black"
            />
          </div>

          <p className="mt-4 text-xs font-mono text-[#707972] text-center">
            Standard 1200x630 HD OpenGraph Card • Dynamic @vercel/og parity
          </p>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between border-t border-[#eae8de] bg-white px-6 py-4">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl bg-[#fcfaef] border border-[#eae8de] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1b1c1c] hover:bg-[#eae8de] transition-all cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-[#006c4a]" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied PNG!" : "Copy to Clipboard"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-[#00452a] px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white shadow-xs hover:bg-[#002d19] transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download PNG (1200x630)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

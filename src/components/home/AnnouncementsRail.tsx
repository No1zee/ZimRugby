import React from "react";
import { Megaphone, Calendar, Info, ArrowRight } from "lucide-react";
import { getAnnouncements } from "@/lib/api/announcements";
import { Announcement } from "@/types";
import { ScrollReveal } from "../ui/animations";
import SlantedButton from "../ui/SlantedButton";

export default async function AnnouncementsRail() {
  const allAnnouncements = await getAnnouncements();
  
  // Filter for homepage-scoped spotlight cards
  const homepageAnnouncements = allAnnouncements.filter(
    (ann) => ann.scope.includes("homepage") && ann.designVariant === "spotlight-card"
  );

  if (homepageAnnouncements.length === 0) return null;

  // Limit to max 3 announcements on home screen
  const announcementsToShow = homepageAnnouncements.slice(0, 3);

  // Map segment to icons
  const getSegmentIcon = (segment: Announcement["segment"]) => {
    switch (segment) {
      case "sables":
      case "lady_sables":
        return <Megaphone className="w-4 h-4" />;
      case "schools":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-12 md:py-16 bg-transparent relative overflow-hidden" id="announcements">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Header */}
        <ScrollReveal className="flex justify-between items-end mb-8 md:mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4.5 h-4.5 text-zru-green animate-pulse" />
              <span className="text-[10px] font-black text-zru-green uppercase tracking-[0.3em] font-subheading">Voice of the Union</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading text-white font-black uppercase tracking-tighter">
              Union <span className="text-stroke-white text-transparent">Announcements</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {announcementsToShow.map((ann, idx) => {
            const isCritical = ann.priority === "critical";
            const isHigh = ann.priority === "high";
            
            return (
              <ScrollReveal 
                key={ann.id} 
                delay={idx * 0.1}
                className="flex"
              >
                <div 
                  className={`w-full relative rounded-2xl overflow-hidden p-6 flex flex-col justify-between group transition-all duration-500 backdrop-blur-md ${
                    isCritical
                      ? "border border-red-500/40 bg-gradient-to-br from-red-950/15 via-red-950/5 to-transparent shadow-[0_10px_30px_rgba(239,68,68,0.06)] shadow-red-950 hover:border-red-500/70"
                      : isHigh
                        ? "border border-zru-green/45 bg-gradient-to-br from-zru-green/10 via-zru-green/2 to-transparent hover:border-zru-green/70"
                        : "border border-white/10 bg-white/2 hover:border-white/20"
                  }`}
                >
                  {/* Critical Shimmering Background Overlay */}
                  {isCritical && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                  )}

                  {/* Card Header */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-sm flex items-center justify-center shrink-0 ${
                          isCritical
                            ? "bg-red-500/20 text-red-400"
                            : isHigh
                              ? "bg-zru-green/20 text-zru-green"
                              : "bg-white/10 text-white/60"
                        }`}>
                          {getSegmentIcon(ann.segment)}
                        </span>
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${
                          isCritical
                            ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse"
                            : isHigh
                              ? "bg-zru-green/15 text-zru-green border-zru-green/30"
                              : "bg-white/5 text-white/50 border-white/10"
                        }`}>
                          {ann.badge || ann.segment.replace("_", " ")}
                        </span>
                      </div>
                      
                      {isCritical && (
                        <span className="flex h-2 w-2 relative shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-heading font-black text-lg md:text-xl text-white uppercase tracking-wide leading-snug group-hover:text-zru-green transition-colors duration-300">
                        {ann.title}
                      </h3>
                      <p className="text-sm text-white/70 font-body font-medium leading-relaxed">
                        {ann.body}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer / CTA */}
                  {ann.ctaUrl && (
                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest font-body">
                        {new Date(ann.startsAt).toLocaleDateString('en-ZW', { day: '2-digit', month: 'short' })}
                      </span>
                      <SlantedButton 
                        href={ann.ctaUrl} 
                        variant={isCritical ? "primary" : "secondary"} 
                        size="sm"
                        className="gap-2"
                      >
                        <span>{ann.ctaLabel || "Learn More"}</span>
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </SlantedButton>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

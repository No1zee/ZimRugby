"use client";

import { Ticket, Percent, Mail, Trophy } from "lucide-react";

export interface FanBenefit {
  icon: React.ElementType;
  category: string;
  title: string;
  description: string;
  badge: string;
  perkDetail?: string;
}

export const FAN_BENEFITS: FanBenefit[] = [
  {
    icon: Ticket,
    category: "Matchday Perk",
    title: "Priority Ticket Presale",
    description:
      "Exclusive 48-hour presale window for all Sables, Lady Sables, and international test matches before general public release.",
    badge: "48h Early Access",
    perkDetail: "Direct presale unlock delivered to your inbox & member dashboard.",
  },
  {
    icon: Percent,
    category: "Official Store",
    title: "10% Merch Privilege",
    description:
      "Automatic 10% discount on official jerseys, teamwear, and caps at the ZRU Clubhouse store and online drops.",
    badge: "10% Off Storewide",
    perkDetail: "Applied automatically with your verified supporter code.",
  },
  {
    icon: Mail,
    category: "Pressroom Access",
    title: "Direct Squad Dispatch",
    description:
      "Official team sheets, injury bulletins, and tactical insights delivered straight from the camp before public media drops.",
    badge: "First-to-Know",
    perkDetail: "Verified editorial briefings sent straight to your email.",
  },
  {
    icon: Trophy,
    category: "VIP Experience",
    title: "Exclusive Fan Draws",
    description:
      "Automatic entry into seasonal draws for matchday VIP hospitality, signed test jerseys, and pitchside training access.",
    badge: "VIP Draws",
    perkDetail: "Quarterly supporter draws with verified member authentication.",
  },
];

export default function FanzoneBenefits() {
  const [featuredPerk, ...otherPerks] = FAN_BENEFITS;
  const FeaturedIcon = featuredPerk.icon;

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/10 pb-5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zru-green block mb-1">
            Membership Privileges
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-rich-black uppercase tracking-tight">
            Official Supporter Benefits
          </h2>
        </div>
        <p className="text-xs text-black/60 font-normal max-w-md">
          Every official supporter receives immediate access to verified privileges across ticketing, merchandise, and national squad content.
        </p>
      </div>

      {/* Asymmetric Bento Layout (Hallmark Standard) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Featured Large Perk (Spans 6 cols on desktop) */}
        <div className="md:col-span-6 bg-white border border-black/10 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-zru-green/50 transition-[border-color,box-shadow] duration-200">
          <div>
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-zru-green/10 flex items-center justify-center text-zru-green">
                <FeaturedIcon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono tabular-nums font-bold uppercase tracking-widest text-zru-green bg-zru-green/10 border border-zru-green/20 px-2.5 py-1 rounded-md">
                {featuredPerk.badge}
              </span>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-black/40 block mb-1.5">
              {featuredPerk.category}
            </span>

            <h3 className="text-xl sm:text-2xl font-heading font-black uppercase tracking-tight text-rich-black mb-3">
              {featuredPerk.title}
            </h3>

            <p className="text-xs sm:text-sm text-black/65 font-normal leading-relaxed">
              {featuredPerk.description}
            </p>
          </div>

          {featuredPerk.perkDetail && (
            <div className="mt-6 pt-4 border-t border-black/10 text-xs text-black/60 font-mono tabular-nums">
              {featuredPerk.perkDetail}
            </div>
          )}
        </div>

        {/* 3 Secondary Stacked Bento Columns (Spans 6 cols on desktop, broken into 3 rows or 2+1 grid) */}
        <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherPerks.map((benefit, idx) => {
            const Icon = benefit.icon;
            const isFullWidth = idx === otherPerks.length - 1;

            return (
              <div
                key={benefit.title}
                className={`${isFullWidth ? "sm:col-span-2" : "sm:col-span-1"} bg-white border border-black/10 rounded-2xl p-5 flex flex-col justify-between hover:border-zru-green/40 transition-[border-color] duration-200`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-zru-green/10 flex items-center justify-center text-zru-green">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono tabular-nums font-bold uppercase tracking-widest text-zru-green bg-zru-green/10 border border-zru-green/15 px-2 py-0.5 rounded">
                      {benefit.badge}
                    </span>
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-widest text-black/40 block mb-1">
                    {benefit.category}
                  </span>

                  <h3 className="text-sm font-heading font-black uppercase tracking-tight text-rich-black mb-1.5">
                    {benefit.title}
                  </h3>

                  <p className="text-xs text-black/60 font-normal leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {benefit.perkDetail && (
                  <div className="mt-3 pt-2.5 border-t border-black/5 text-[10px] text-black/50 font-mono tabular-nums">
                    {benefit.perkDetail}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

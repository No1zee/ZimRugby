"use client";

import { Ticket, Percent, Mail, Trophy } from "lucide-react";

interface Benefit {
  icon: React.ElementType;
  category: string;
  title: string;
  description: string;
  badge: string;
}

const benefits: Benefit[] = [
  {
    icon: Ticket,
    category: "Matchday Perk",
    title: "Priority Tickets Presale",
    description:
      "Get exclusive access to major Sables test match tickets 48 hours before general public release.",
    badge: "Presale Access",
  },
  {
    icon: Percent,
    category: "Clubhouse Store",
    title: "Exclusive Merch Discounts",
    description:
      "Enjoy 10% off all official Zimbabwe Rugby jerseys and gear at the ZRU Clubhouse store.",
    badge: "10% Store Off",
  },
  {
    icon: Mail,
    category: "Direct Pressroom",
    title: "Insider Squad Newsletter",
    description:
      "Receive official Sable team announcements, matchday lineups, and injury updates first.",
    badge: "Press Insider",
  },
  {
    icon: Trophy,
    category: "Supporters Draw",
    title: "VIP Fan Competitions",
    description:
      "Enter monthly draws to win signed match balls, player jerseys, and VIP matchday passes.",
    badge: "VIP Access",
  },
];

export default function FanzoneBenefits() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-rich-black uppercase tracking-tight">
          Exclusive Member Benefits
        </h2>
        <p className="text-xs text-black/60 font-normal max-w-md mx-auto">
          Join thousands of global Sables supporters and unlock premium
          matchday perks, merchandise discounts, and inner-circle access.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className="bg-white border border-black/5 rounded-2xl p-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-zru-green/10 flex items-center justify-center text-zru-green mb-4 group-hover:bg-zru-green/15 transition-[background-color] duration-300">
                <Icon className="w-6 h-6" />
              </div>

              <span className="text-[9px] font-black uppercase tracking-widest text-zru-green block mb-1.5">
                {benefit.category}
              </span>

              <h3 className="text-sm font-black uppercase tracking-tight text-rich-black mb-2 group-hover:text-zru-green transition-[color] duration-300">
                {benefit.title}
              </h3>

              <p className="text-xs text-black/60 font-normal leading-relaxed mb-4">
                {benefit.description}
              </p>

              <span className="inline-block text-[9px] font-black uppercase tracking-widest text-zru-green bg-zru-green/10 px-2 py-0.5 rounded">
                {benefit.badge}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

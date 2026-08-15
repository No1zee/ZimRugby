"use client";

import React from "react";
import FanZoneSignup from "@/components/fanzone/FanZoneSignup";

export default function HomeNewsletterBanner() {
  return (
    <section className="w-full bg-milk-white py-10 sm:py-12 lg:py-16 relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <FanZoneSignup variant="full" showBenefits={true} />
      </div>
    </section>
  );
}

"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import type { PageSection } from "@/lib/api/pages";

export default function ContactSection({ section }: { section: PageSection }) {
  const items = (section.items as { label: string; value: string }[]) || [];
  const email = items.find((c) => c.label === "Email")?.value || "info@zimbabwerugby.co.zw";
  const phone = items.find((c) => c.label === "Phone")?.value || "+263 (24) 275 1234";
  const address = items.find((c) => c.label === "Address")?.value || "National Sports Stadium, Harare";

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto pt-8 border-t border-black/5 space-y-6">
        <h3 className="text-lg font-black uppercase tracking-wide text-rich-black">
          {section.title || "Contact & Enquiries"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 text-rich-black/60 hover:text-zru-green transition-colors font-normal"
          >
            <Mail className="w-5 h-5 text-zru-green shrink-0" />
            <span>{email}</span>
          </a>
          <div className="flex items-center gap-3 text-rich-black/60 font-normal">
            <MapPin className="w-5 h-5 text-zru-green shrink-0" />
            <span>{address}</span>
          </div>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex items-center gap-3 text-rich-black/60 hover:text-zru-green transition-colors font-normal"
          >
            <Phone className="w-5 h-5 text-zru-green shrink-0" />
            <span>{phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

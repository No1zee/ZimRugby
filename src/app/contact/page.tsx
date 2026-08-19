"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { saveSubmission } from "@/lib/mockStorage";

const CONTACT_DETAILS = [
  {
    title: "HEADQUARTERS",
    value: "36 Walmer Drive, Newlands, Harare",
    href: "https://www.google.com/maps/search/?api=1&query=36+Walmer+Drive,+Newlands,+Harare,+Zimbabwe",
    icon: MapPin,
    isExternal: true,
  },
  {
    title: "PHONE NUMBER",
    value: "+263 78 782 8474",
    href: "tel:+263787828474",
    icon: Phone,
    isExternal: false,
  },
  {
    title: "EMAIL SUPPORT",
    value: "info@zimbabwerugby.co.zw",
    href: "mailto:info@zimbabwerugby.co.zw",
    icon: Mail,
    isExternal: false,
  },
  {
    title: "OFFICE HOURS",
    value: "Monday – Friday: 8:00 AM – 4:30 PM",
    icon: Clock,
    isExternal: false,
  },
];

const SUBJECTS = [
  "General Enquiry",
  "Ticketing Support",
  "Sponsorships & Partnerships",
  "Referees Committee",
  "Media & Press Relations",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Enquiry");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await saveSubmission("contact_message", {
        name,
        email,
        subject,
        message,
      });

      if (res.success) {
        setSubmitSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setSubmitError(res.message || "Failed to submit message. Please try again.");
      }
    } catch {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-milk-white min-h-screen text-rich-black pb-24">
      {/* Hallmark PageHero Banner */}
      <PageHero
        title="Contact"
        accentTitle="ZRU"
        subtitle="Questions about matches, ticketing, officiating, or sponsorships? Reach out to the relevant committee."
        backgroundImage="/images/gallery/zimbabwe-sables-0351.webp"
        breadcrumb={[{ label: "Contact", href: "/contact" }]}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Form + Details Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Details Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {CONTACT_DETAILS.map((detail, idx) => {
              const Icon = detail.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-zru-green/10 flex items-center justify-center text-zru-green shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h4 className="font-bold text-[10px] text-rich-black/50 tracking-wider uppercase">
                      {detail.title}
                    </h4>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        target={detail.isExternal ? "_blank" : undefined}
                        rel={detail.isExternal ? "noopener noreferrer" : undefined}
                        className="text-rich-black text-sm font-bold leading-relaxed hover:text-zru-green transition-colors inline-block"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <p className="text-rich-black text-sm font-bold leading-relaxed">
                        {detail.value}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-black/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm">
            <div className="border-b border-black/5 pb-5 mb-6">
              <h2 className="font-heading text-2xl sm:text-3xl text-rich-black font-black uppercase tracking-wide">
                Send a Secure Message
              </h2>
              <p className="text-rich-black/60 text-xs font-medium uppercase tracking-wider mt-1">
                Your messages are encrypted and routed directly to the relevant committee.
              </p>
            </div>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-4"
              >
                <div className="inline-flex p-3 bg-zru-green/10 rounded-full text-zru-green mb-1">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-heading text-2xl text-rich-black font-black uppercase tracking-wide">
                  Message Sent Successfully
                </h4>
                <p className="text-rich-black/70 text-sm leading-relaxed max-w-sm mx-auto">
                  Thank you! Your enquiry has been safely received. A ZRU representative from the selected department will reply to your email shortly.
                </p>

                <div className="pt-4 border-t border-black/5 max-w-sm mx-auto space-y-2">
                  <p className="text-rich-black/40 text-[10px] uppercase tracking-widest font-bold">
                    While you wait
                  </p>
                  <a
                    href="/fan-zone"
                    className="inline-flex items-center text-zru-green text-xs font-bold uppercase tracking-wider hover:underline"
                  >
                    Join the Fan Zone for priority tickets and exclusive benefits
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs font-bold uppercase text-zru-green hover:underline tracking-widest block mx-auto"
                  >
                    Send another message
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-[11px] text-rich-black/60 font-bold uppercase tracking-wider block">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kennedy Tsimba"
                      className="w-full bg-milk-white/60 border border-black/15 rounded-xl px-4 py-2.5 text-rich-black placeholder-rich-black/30 focus:bg-white focus:outline-none focus:border-zru-green text-sm transition-colors"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-[11px] text-rich-black/60 font-bold uppercase tracking-wider block">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. kennedy@tsimba.com"
                      className="w-full bg-milk-white/60 border border-black/15 rounded-xl px-4 py-2.5 text-rich-black placeholder-rich-black/30 focus:bg-white focus:outline-none focus:border-zru-green text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="text-[11px] text-rich-black/60 font-bold uppercase tracking-wider block">
                    Subject / Department
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-milk-white/60 border border-black/15 rounded-xl px-4 py-2.5 text-rich-black focus:bg-white focus:outline-none focus:border-zru-green text-sm transition-colors"
                  >
                    {SUBJECTS.map((subj, i) => (
                      <option key={i} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-[11px] text-rich-black/60 font-bold uppercase tracking-wider block">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your request in detail... e.g. Ticketing query"
                    className="w-full bg-milk-white/60 border border-black/15 rounded-xl px-4 py-2.5 text-rich-black placeholder-rich-black/30 focus:bg-white focus:outline-none focus:border-zru-green text-sm transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zru-green hover:bg-green-700 text-white font-bold text-xs uppercase tracking-[0.15em] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Sending..." : "Submit message"}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
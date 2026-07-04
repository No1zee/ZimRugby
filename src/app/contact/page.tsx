"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { saveSubmission } from "@/lib/mockStorage";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Enquiry");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const res = await saveSubmission("contact_message", { name, email, subject, message });
      if (res.success) {
        setSubmitSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setSubmitError(res.message);
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    { title: "HEADQUARTERS", value: "Harare Sports Club, Josiah Tongogara Avenue, Harare, Zimbabwe", icon: MapPin },
    { title: "PHONE NUMBER", value: "+263 (24) 275 1234 / +263 (24) 275 5678", icon: Phone },
    { title: "EMAIL SUPPORT", value: "info@zimbabwerugby.co.zw", icon: Mail },
    { title: "OFFICE HOURS", value: "Monday – Friday: 8:00 AM – 4:30 PM", icon: Clock }
  ];

  return (
    <main className="bg-rich-black min-h-screen text-white flex flex-col justify-between selection:bg-zru-gold selection:text-rich-black">
      <Navigation />

      <div className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        
        {/* Header Section */}
        <section className="mb-16 border-l-4 border-zru-gold pl-6">
          <span className="text-zru-gold text-xs font-black uppercase tracking-[0.4em] mb-2 block">
            GET IN TOUCH
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-glow-green leading-none">
            CONTACT ZRU
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mt-4">
            Have questions about matches, ticketing, officiating, or sponsorships? Reach out to our dedicated committees.
          </p>
        </section>

        {/* Form + Details split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Details Column (1 column) */}
          <div className="lg:col-span-1 space-y-6">
            {contactDetails.map((detail, idx) => {
              const Icon = detail.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white/5 border border-white/5 rounded-2xl p-6 flex items-start gap-4 hover:border-white/10 transition-colors"
                >
                  <div className="w-10 h-10 bg-zru-green/20 rounded-xl flex items-center justify-center text-zru-gold border border-white/5 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xs text-white/40 tracking-wider uppercase">{detail.title}</h4>
                    <p className="text-white text-sm font-semibold leading-relaxed">{detail.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Column (2 columns) */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl glow-green-card">
            
            <div className="border-b border-white/5 pb-6 mb-6">
              <h3 className="text-lg font-black uppercase tracking-widest text-zru-gold flex items-center gap-2">
                <Send className="w-5 h-5" />
                <span>SEND A SECURE MESSAGE</span>
              </h3>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mt-1">
                Your messages are encrypted and routed directly to the relevant committee.
              </p>
            </div>

            {submitSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="inline-flex p-4 bg-zru-green/20 rounded-full border border-zru-gold/30 text-zru-gold mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-black text-lg text-white uppercase tracking-wider">MESSAGE SENT SUCCESSFULLY</h4>
                <p className="text-white/70 text-xs leading-relaxed max-w-sm mx-auto font-medium">
                  Thank you! Your enquiry has been safely received. A ZRU representative from the selected department will reply to your email shortly.
                </p>
                <button 
                  onClick={() => setSubmitSuccess(false)}
                  className="text-xs font-black uppercase text-zru-gold hover:text-white transition-colors tracking-widest pt-6 block mx-auto underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {submitError && (
                  <div className="bg-zru-red/10 border border-zru-red/20 rounded-xl p-4 flex items-center gap-3 text-zru-red text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kennedy Tsimba"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-zru-gold text-xs transition-colors"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. kennedy@tsimba.com"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-zru-gold text-xs transition-colors"
                    />
                  </div>
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">Subject / Department</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-zru-gold text-xs transition-colors"
                  >
                    <option className="bg-rich-black text-white" value="General Enquiry">General Enquiry</option>
                    <option className="bg-rich-black text-white" value="Ticketing Support">Ticketing Support</option>
                    <option className="bg-rich-black text-white" value="Sponsorships & Partnerships">Sponsorships & Partnerships</option>
                    <option className="bg-rich-black text-white" value="Referees Committee">Referees Committee</option>
                    <option className="bg-rich-black text-white" value="Media & Press Relations">Media & Press Relations</option>
                  </select>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your request in detail..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-zru-gold text-xs transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zru-gold hover:bg-white hover:text-rich-black text-rich-black font-black text-xs uppercase tracking-[0.2em] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Sending..." : "Submit message"}</span>
                  <Send className="w-4 h-4" />
                </button>

              </form>
            )}

          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
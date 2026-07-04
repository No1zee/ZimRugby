"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, FileText, Download, Award, Calendar, Bell, Shield, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { getRefereeResources, getRefereeCourses, getRefereeNotices } from "@/lib/api/referees";
import { RefereeResource, RefereeCourse, RefereeNotice } from "@/types";
import { saveSubmission } from "@/lib/mockStorage";

export default function RefereesPortalPage() {
  const [resources, setResources] = useState<RefereeResource[]>([]);
  const [courses, setCourses] = useState<RefereeCourse[]>([]);
  const [notices, setNotices] = useState<RefereeNotice[]>([]);
  const [activeTab, setActiveTab] = useState<"notices" | "laws" | "courses">("notices");

  // Registration Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCourse, setFormCourse] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      getRefereeResources(),
      getRefereeCourses(),
      getRefereeNotices()
    ]).then(([res, crs, ntc]) => {
      setResources(res);
      setCourses(crs);
      setNotices(ntc);
      if (crs.length > 0) {
        setFormCourse(crs[0].title);
      }
    });
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formCourse) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const res = await saveSubmission("referee_course", { name: formName, email: formEmail, course: formCourse });
      if (res.success) {
        setFormSubmitted(true);
      } else {
        setSubmitError(res.message);
      }
    } catch (err) {
      setSubmitError("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "notices" as const, label: "OFFICIAL NOTICES", icon: Bell },
    { id: "laws" as const, label: "LAWS & DOWNLOADS", icon: Landmark },
    { id: "courses" as const, label: "COURSES & ACCREDITATION", icon: Award }
  ];

  return (
    <main className="bg-rich-black min-h-screen pt-24 pb-24 text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cinematic Institutional Header */}
        <section className="bg-zru-green relative overflow-hidden py-16 border border-white/10 rounded-3xl mb-12 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-pattern-diagonal-lines" />
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-zru-gold/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl pl-6 sm:pl-10">
            <span className="text-zru-gold text-xs font-black uppercase tracking-[0.4em] mb-3 block">
              OFFICIAL REPRESENTATION
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              REFEREES & OFFICIALS
            </h1>
            <p className="text-white/80 text-sm md:text-base mt-4 font-medium leading-relaxed">
              Serving the game with integrity. Access domestic variations, training certifications, course calendars, and rules amendments for match officials in Zimbabwe.
            </p>
          </div>
        </section>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 py-1 overflow-x-auto gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-4 text-xs font-black uppercase tracking-wider relative transition-all duration-300 ${
                  isActive ? "text-zru-gold" : "text-white/60 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="refereePortalTabLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-zru-gold"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Area (2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                
                {/* Notices Tab */}
                {activeTab === "notices" && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-zru-gold pl-4 mb-8">
                      <h2 className="text-xl font-black uppercase tracking-wider">OFFICIAL ANNOUNCEMENTS</h2>
                      <p className="text-sm text-white/50 mt-1">Law amendments and pre-season directives for active panels.</p>
                    </div>

                    <div className="space-y-6">
                      {notices.map((notice) => (
                        <div 
                          key={notice.id} 
                          className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-colors duration-300 space-y-4"
                        >
                          <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-wider">
                            <span>ZRU REF COMMITTEE</span>
                            <span>{notice.date}</span>
                          </div>
                          <h3 className="text-lg font-black uppercase tracking-tight text-white">{notice.title}</h3>
                          <p className="text-white/60 text-sm leading-relaxed font-medium">
                            {notice.excerpt}
                          </p>
                          <div className="pt-4 border-t border-white/5">
                            <p className="text-white/80 text-xs leading-relaxed italic bg-white/5 p-4 rounded-xl">
                              &ldquo;{notice.content}&rdquo;
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Laws & Downloads Tab */}
                {activeTab === "laws" && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-zru-gold pl-4 mb-8">
                      <h2 className="text-xl font-black uppercase tracking-wider">RULEBOOKS & TEMPLATES</h2>
                      <p className="text-sm text-white/50 mt-1">Download official World Rugby and ZRU variation PDFs.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {resources.map((doc, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-5 flex items-center justify-between group transition-colors duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zru-gold/10 rounded-lg flex items-center justify-center shrink-0 border border-zru-gold/10">
                              <FileText className="w-5 h-5 text-zru-gold" />
                            </div>
                            <div>
                              <h4 className="font-black text-sm text-white uppercase tracking-tight">{doc.title}</h4>
                              <span className="text-[10px] text-white/40 font-bold uppercase block mt-0.5">{doc.category.toUpperCase()} • {doc.size}</span>
                            </div>
                          </div>
                          <button 
                            className="p-2.5 rounded-full bg-white/5 hover:bg-zru-gold hover:text-rich-black transition-all group-hover:scale-105"
                            title="Download Document"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Courses & Training Tab */}
                {activeTab === "courses" && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-zru-gold pl-4 mb-8">
                      <h2 className="text-xl font-black uppercase tracking-wider">EDUCATION CALENDAR</h2>
                      <p className="text-sm text-white/50 mt-1">World Rugby accredited levels and domestic specialist clinics.</p>
                    </div>

                    <div className="space-y-4">
                      {courses.map((course, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-colors duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zru-gold/10 rounded-lg flex items-center justify-center shrink-0 border border-zru-gold/10 text-zru-gold">
                              <Award className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[9px] text-zru-gold font-black uppercase tracking-widest">{course.level}</span>
                              <h4 className="font-black text-base text-white uppercase tracking-tight mt-0.5">{course.title}</h4>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-8 justify-between md:justify-end">
                            <div className="text-left md:text-right">
                              <div className="flex items-center gap-1.5 justify-end text-[11px] text-white/60 font-bold uppercase tracking-tight">
                                <Calendar className="w-3.5 h-3.5 text-zru-gold" />
                                <span>{course.date}</span>
                              </div>
                              <span className="text-[10px] text-white/40 block mt-1 uppercase tracking-tight">{course.venue}</span>
                            </div>
                            
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                              course.status === 'open' 
                                ? 'bg-zru-green/20 text-zru-gold border border-zru-gold/20' 
                                : 'bg-white/5 text-white/30 border border-white/5'
                            }`}>
                              {course.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Area: Interactive Registration Form */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md sticky top-28 space-y-6 glow-green-card">
              
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-zru-gold">COURSE REGISTRATION</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-1">Submit details to register for ZRU referee courses.</p>
              </div>

              {!formSubmitted ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  {submitError && (
                    <div className="bg-zru-red/10 border border-zru-red/20 rounded-xl p-3 flex items-center gap-2 text-zru-red text-[11px] font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Tendai Mtawarira"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-zru-gold text-xs transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. tendai@zru.co.zw"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-zru-gold text-xs transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 font-black uppercase tracking-wider block">Select Course</label>
                    <select
                      value={formCourse}
                      onChange={(e) => setFormCourse(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-zru-gold text-xs transition-colors"
                    >
                      {courses.map((course, idx) => (
                        <option key={idx} value={course.title} className="bg-rich-black text-white">
                          {course.title} ({course.level})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-zru-gold hover:bg-white hover:text-rich-black text-rich-black font-black text-xs uppercase tracking-[0.15em] py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-6 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Submitting…" : "Submit Registration"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="inline-flex p-3 bg-zru-green/20 rounded-full border border-zru-gold/30 text-zru-gold mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-sm text-white uppercase tracking-wider">APPLICATION RECEIVED</h4>
                  <p className="text-white/60 text-xs leading-relaxed max-w-[220px] mx-auto font-medium">
                    Thank you, <strong>{formName}</strong>. Your registration for <strong>{formCourse}</strong> has been filed. The Referees Committee will contact you at <strong>{formEmail}</strong>.
                  </p>
                  <button 
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormName("");
                      setFormEmail("");
                    }}
                    className="text-[9px] font-black uppercase text-zru-gold hover:text-white transition-colors tracking-widest pt-4"
                  >
                    Register Another Person
                  </button>
                </motion.div>
              )}

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

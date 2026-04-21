"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ArrowRight, 
  Shield, 
  Ticket, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  Info,
  Calendar,
  MapPin,
  Clock,
  Search,
  Filter,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import { FixtureCard, type Fixture } from "@/components/tickets/FixtureCard";
import { StripedBackground } from "@/components/ui/StripedBackground";
import { registerTicketingInterest } from "@/lib/crm";

// --- Mock Data ---

const FIXTURES: Fixture[] = [
  {
    id: "f1",
    competition: "Battle of the Zambezi",
    teams: "Sables vs Namibia",
    date: "Sat 24 August",
    time: "16:00",
    venue: "National Sports Stadium",
    city: "Harare",
    isWorldCupPathway: true,
    status: "ON_SALE",
    url: "https://paynow.co.zw/zru-sables-namibia",
    category: "Sables"
  },
  {
    id: "f2",
    competition: "Nations Cup",
    teams: "Sables vs Kenya",
    date: "Sun 6 October",
    time: "15:00",
    venue: "Hartsfield",
    city: "Bulawayo",
    isWorldCupPathway: true,
    status: "COMING_SOON",
    category: "Sables"
  },
  {
    id: "f3",
    competition: "Super Six Final",
    teams: "Old Georgians vs Old Hararians",
    date: "Sat 30 September",
    time: "14:00",
    venue: "Police Grounds",
    city: "Harare",
    status: "ON_SALE",
    url: "https://paynow.co.zw/zru-super-six-final",
    category: "Domestic"
  },
  {
    id: "f4",
    competition: "Women's Africa Cup",
    teams: "Lady Sables vs Madagascar",
    date: "Sat 12 November",
    time: "13:00",
    venue: "Old Hararians",
    city: "Harare",
    status: "COMING_SOON",
    category: "Lady Sables"
  },
  {
    id: "f5",
    competition: "Zambezi Sevens",
    teams: "ZRU Cheetahs Invitational",
    date: "Fri 15 Dec - Sun 17 Dec",
    time: "All Day",
    venue: "Vic Falls",
    status: "SOLD_OUT",
    category: "Sevens"
  }
];

// --- Local Components ---

const OfficialChannelBadge = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="inline-flex items-center gap-3 px-4 py-2 bg-clubhouse-gold/10 border border-clubhouse-gold/20 rounded-full"
  >
    <div className="w-5 h-5 bg-clubhouse-gold rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
      <Shield className="w-3 h-3 text-rich-black" fill="currentColor" />
    </div>
    <span className="text-[10px] font-black text-clubhouse-gold uppercase tracking-[0.2em]">Official ZRU Ticketing Channel</span>
  </motion.div>
);


const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-clubhouse-gold transition-colors pr-8 leading-tight">
          {question}
        </span>
        <HelpCircle className={`w-6 h-6 shrink-0 transition-transform duration-500 ${isOpen ? "rotate-180 text-clubhouse-gold" : "text-white/20"}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 text-sm leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Page Component ---

export default function TicketsPage() {
  const [filter, setFilter] = useState("All");
  const [isRegistering, setIsRegistering] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegistering) return;
    
    setIsSubmitting(true);
    try {
      await registerTicketingInterest(isRegistering.id, formData);
      setIsSuccess(true);
      setTimeout(() => {
        setIsRegistering(null);
        setIsSuccess(false);
        setFormData({ name: "", email: "" });
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredFixtures = FIXTURES.filter(f => {
    if (filter === "All") return true;
    if (filter === "World Cup Pathway") return f.isWorldCupPathway || f.tags?.includes("World Cup Pathway Fixture");
    return f.category === filter;
  });

  const CATEGORIES = ["All", "Sables", "Lady Sables", "Sevens", "Domestic", "World Cup Pathway"];

  return (
    <main className="bg-rich-black min-h-screen selection:bg-clubhouse-gold selection:text-rich-black">
      <Navigation />

      {/* SECTION A: HERO */}
      <section className="relative min-h-[60vh] flex items-center pt-32 pb-16 overflow-hidden">
        {/* Stadium Background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/campaign/hero.png" 
            alt="Zimbabwe Rugby Stadium"
            fill
            className="object-cover opacity-20 blur-[2px] grayscale"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-rich-black via-rich-black/40 to-rich-black" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none" />
          {/* Splash of Green */}
          <div className="absolute top-1/4 -left-10 w-96 h-96 bg-green-900/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-green-900/10 blur-[120px] rounded-full pointer-events-none" />
          <StripedBackground color="green" variant="subtle" position="left" className="opacity-10" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <OfficialChannelBadge />
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] uppercase tracking-tighter mt-8 mb-8">
                OFFICIAL <br />
                <span className="text-clubhouse-gold text-glow-green">TICKETS</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-12 font-medium leading-relaxed">
                Welcome to the official home of Sables and ZRU tickets. Every link on this page takes you to an authorised partner, with transparent pricing and secure checkout.
              </p>
              
              <div className="bg-white/5 border-l-2 border-clubhouse-gold p-4 mb-12 max-w-lg">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest leading-loose">
                  <Shield className="inline-block w-3 h-3 mr-2 mb-0.5 text-clubhouse-gold" />
                  If you didn’t start from <span className="text-white">zimrugby.co.zw</span> or this page, double‑check before you buy.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 items-center">
                <Link href="#fixtures">
                  <button className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-2 group hover:text-clubhouse-gold transition-colors">
                    View upcoming fixtures
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="#faqs">
                  <button className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-2 group hover:text-clubhouse-gold transition-colors opacity-40 hover:opacity-100">
                    Ticket FAQs & safety
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Stadium Visual / Decoration */}
            <div className="hidden lg:flex justify-end pr-20">
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="relative w-64 h-64 border border-white/5 rounded-2xl bg-white/[0.02] p-8 flex flex-center items-center justify-center rotate-3"
               >
                  <Ticket className="w-32 h-32 text-clubhouse-gold/10" />
                  <div className="absolute inset-0 bg-linear-to-tr from-clubhouse-gold/5 to-transparent rounded-2xl" />
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-rich-black border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle2 className="w-6 h-6 text-clubhouse-gold" />
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: FIXTURES GRID */}
      <section id="fixtures" className="py-24 bg-rich-black border-y border-white/5 scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          
          {/* Header & Filter */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16">
            <div className="max-w-xl">
               <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-6">Upcoming Matches</span>
               <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">FIXTURES & TICKETS</h2>
            </div>
            
            {/* Filter Bar */}
            <div className="w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                      ${filter === cat 
                        ? 'bg-clubhouse-gold text-rich-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                        : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <AnimatePresence mode="popLayout">
            {filteredFixtures.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredFixtures.map((fixture) => (
                  <FixtureCard 
                    key={fixture.id} 
                    fixture={fixture} 
                    onRegister={(f) => setIsRegistering(f)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]"
              >
                <div className="mb-6 opacity-20">
                   <Ticket className="w-16 h-16 mx-auto text-white" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">No fixtures currently on sale</h3>
                <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">We’re finalising the next block of fixtures. Check back soon or join ZRU Nation for early ticket alerts.</p>
                <Button variant="secondary" size="xl" href="/world-cup-campaign">
                  Join ZRU Nation
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helper Text */}
          <div className="mt-16 flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-xl max-w-4xl">
            <Info className="w-5 h-5 text-clubhouse-gold shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              All ticket purchases for Sables and ZRU fixtures are handled by our authorised ticketing partners. You’ll complete your booking on their secure platforms.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION C: HOW IT WORKS */}
      <section className="py-24 bg-linear-to-b from-rich-black to-[#0a0a0a]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-20">
             <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-6">Simple Entry</span>
             <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">HOW TO GET YOUR TICKETS</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: Search,
                title: "Choose your fixture",
                desc: "Browse the list of upcoming tests and tournaments and pick the match you want to attend."
              },
              {
                step: "02",
                icon: ExternalLink,
                title: "Go to our official partner",
                desc: "Click “Buy tickets” to be redirected to our authorised ticketing partner for that event."
              },
              {
                step: "03",
                icon: Shield,
                title: "Select seats & confirm",
                desc: "On the partner site, choose your seats or category, confirm your details and complete payment."
              },
              {
                step: "04",
                icon: Ticket,
                title: "Receive your tickets",
                desc: "Your tickets will be sent as mobile or printable tickets. Bring them, plus ID if required, on matchday."
              }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="text-[60px] font-black text-white/5 absolute -top-10 -left-4 pointer-events-none group-hover:text-clubhouse-gold/5 transition-colors">{step.step}</div>
                <div className="p-8 rounded-xl bg-white/[0.02] border border-white/5 hover:border-clubhouse-gold/20 transition-all duration-500 h-full">
                  <div className="w-12 h-12 bg-clubhouse-gold/10 rounded flex items-center justify-center mb-8">
                    <step.icon className="w-6 h-6 text-clubhouse-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-4">{step.title}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="mt-12 text-center text-xs font-bold text-white/20 uppercase tracking-[0.2em] italic">
            You’ll always see our name or crest on official partner pages. If something feels off, return here and follow the links.
          </p>
        </div>
      </section>

      {/* SECTION D: CATEGORIES */}
      <section className="py-24 bg-rich-black border-y border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-8">Seating Overview</span>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-8">TICKET TYPES <br />& AREAS</h2>
              <p className="text-lg text-gray-400 font-medium mb-12 max-w-lg leading-relaxed">
                Different fixtures and venues use different seating maps, but most matches follow a similar structure. Use this as a guide before you buy.
              </p>
              
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                 <div className="flex items-center gap-3 text-clubhouse-gold mb-4 font-black uppercase text-[10px] tracking-widest">
                    <Info className="w-4 h-4" />
                    Dynamic Pricing
                 </div>
                 <p className="text-xs text-gray-500 font-medium leading-relaxed">
                   Prices may vary by opponent, competition and demand. Some fixtures may use dynamic pricing—booking early is often your best value.
                 </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: "Premium & hospitality", text: "Our most elevated matchday experience, with the best views, lounge access and, at selected fixtures, food and beverage included." },
                { name: "Category 1", text: "Prime main-stand seating with the clearest view of the pitch and every key moment." },
                { name: "Category 2–3", text: "Strong views at more accessible price points, often behind the posts or in corner sections." },
                { name: "Family & supporter zones", text: "Sections designed for families and organised supporter groups. Expect more singing and atmosphere." },
                { name: "Accessible seating", text: "Reserved areas for supporters with accessibility needs, with companion seating where available." }
              ].map((c, i) => (
                <div key={i} className="p-6 bg-white/[0.01] border border-white/5 rounded-lg hover:border-white/10 transition-colors">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">{c.name}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: CAMPAIGN HOOK */}
      <section className="py-16 bg-clubhouse-gold relative overflow-hidden group">
        <Link href="/world-cup-campaign" className="absolute inset-0 z-10" />
        <div className="absolute inset-0 bg-black/off-5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-20 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-black text-rich-black uppercase tracking-tighter leading-none mb-3">MATCHDAY AND THE WORLD CUP JOURNEY</h2>
              <p className="text-sm text-rich-black/70 font-bold leading-relaxed pr-8">
                 Every test is part of a bigger story. When you secure your seat, you’re already backing the Sables. To go further, consider becoming a monthly backer.
              </p>
           </div>
           <div className="flex items-center gap-4 shrink-0">
              <span className="text-sm font-black text-rich-black uppercase tracking-widest">Explore Campaign</span>
              <div className="w-12 h-12 bg-rich-black rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                 <ArrowRight className="w-5 h-5" />
              </div>
           </div>
        </div>
      </section>

      {/* SECTION F: FAQ */}
      <section id="faqs" className="py-32 bg-rich-black scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-3 gap-24">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-8">Security First</span>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-8">TICKET FAQs <br />& SAFETY</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">Direct answers for your peace of mind.</p>
              <div className="pt-8 border-t border-white/5">
                 <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Still unsure?</p>
                 <Link href="/contact" className="inline-flex items-center gap-2 text-xs font-black text-clubhouse-gold uppercase tracking-widest hover:underline">
                    Contact support team <ChevronRight className="w-3 h-3" />
                 </Link>
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 rounded-2xl p-8 md:p-12">
              <FAQItem 
                question="How do I know this is the official ticket source?"
                answer="This page lists every official ticket outlet for ZRU fixtures. If you’re following a link from zimrugby.co.zw or this Tickets page, you are on an approved route."
              />
              <FAQItem 
                question="Will I be redirected to another site to buy?"
                answer="Yes. We partner with trusted ticketing providers like Paynow or Ticketmaster for sales and seat selection. You’ll complete your booking on their secure checkout pages."
              />
              <FAQItem 
                question="What should I watch out for to avoid scams?"
                answer="Only buy using links from this page. Be wary of social media resellers and unofficial marketplaces—especially those offering tickets at suspicious prices. ZRU cannot honour counterfeit tickets."
              />
              <FAQItem 
                question="Are digital tickets accepted at the gate?"
                answer="Yes. Most fixtures accept mobile tickets—simply present the QR or barcode at the gate. Follow the instructions in your confirmation email."
              />
              <FAQItem 
                question="Can I change or upgrade my seats after purchase?"
                answer="Seat changes and upgrades depend on our ticketing partners and venue rules. Check your confirmation email or the partner’s help section for options."
              />
              <FAQItem 
                question="Is there an official resale or ticket transfer option?"
                answer="For selected fixtures, official resale or ticket transfer may be available through our partners. Avoid third‑party resellers that are not listed here."
              />
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION MODAL */}
      <AnimatePresence>
        {isRegistering && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-rich-black/90 backdrop-blur-md"
              onClick={() => setIsRegistering(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsRegistering(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pb-0">
                <span className="inline-block text-[10px] font-black uppercase text-clubhouse-gold mb-2 tracking-widest">Priority Alert List</span>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                  {isRegistering.teams}
                </h3>
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl mb-8"
                  >
                    <p className="text-sm text-green-500 font-bold">Priority registration recorded! We'll alert you via email as soon as tickets go on sale.</p>
                  </motion.div>
                ) : (
                  <p className="text-sm text-gray-400 font-medium mb-8 pr-12">
                    Registration for this fixture hasn't opened yet. Be the first to know when tickets go live.
                  </p>
                )}
              </div>

              {!isSuccess && (
                <form onSubmit={handleRegister} className="p-8 pt-0 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="reg-name" className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">FULL NAME</label>
                      <input 
                        id="reg-name"
                        type="text" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded p-4 text-white font-medium focus:outline-none focus:border-clubhouse-gold transition-colors" 
                        placeholder="Enter your name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-email" className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">EMAIL ADDRESS</label>
                      <input 
                        id="reg-email"
                        type="email" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded p-4 text-white font-medium focus:outline-none focus:border-clubhouse-gold transition-colors" 
                        placeholder="your@email.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button 
                      variant="secondary" 
                      size="xl" 
                      className="w-full" 
                      as="button" 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Register Interest"}
                    </Button>
                    <p className="text-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      Already a ZRU Nation member? <Link href="/auth" className="text-clubhouse-gold underline">Sign in for one-click interest</Link>
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

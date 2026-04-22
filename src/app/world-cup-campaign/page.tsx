"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  CheckCircle2, 
  HelpCircle,
  Zap,
  Star,
  Quote
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import { StripedBackground } from "@/components/ui/StripedBackground";
import { joinZRUNation } from "@/lib/crm";
import { BackgroundText } from "@/components/ui/BackgroundText";

// --- Local Components ---

const CampaignBadge = () => (
  <motion.div 
    initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
    animate={{ rotate: 0, opacity: 1, scale: 1 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center"
  >
    <div className="absolute inset-0 bg-clubhouse-gold/20 rounded-full blur-3xl animate-pulse" />
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B87333" />
        </linearGradient>
      </defs>
      <path 
        d="M50 5 L85 20 L85 55 C85 75 65 90 50 95 C35 90 15 75 15 55 L15 20 L50 5 Z" 
        fill="none" 
        stroke="url(#goldGradient)" 
        strokeWidth="2"
      />
      <path 
        d="M50 15 L75 26 L75 52 C75 68 62 80 50 85 C38 80 25 68 25 52 L25 26 L50 15 Z" 
        fill="url(#goldGradient)" 
        opacity="0.2"
      />
      <text 
        x="50" y="45" 
        textAnchor="middle" 
        fill="#D4AF37" 
        className="text-[8px] font-black uppercase tracking-widest"
      >
        Road to
      </text>
      <text 
        x="50" y="58" 
        textAnchor="middle" 
        fill="#D4AF37" 
        className="text-[10px] font-black uppercase tracking-tighter"
      >
        WORLD CUP
      </text>
      <text 
        x="50" y="70" 
        textAnchor="middle" 
        fill="#D4AF37" 
        className="text-[6px] font-bold uppercase tracking-widest opacity-80"
      >
        2027 Campaign
      </text>
    </svg>
  </motion.div>
);

interface PledgeProps {
  tier: number;
  amount: string;
  name: string;
  description: string;
  benefits: string[];
  highlight?: boolean;
}

const PledgeCard = ({ tier, amount, name, description, benefits, highlight = false }: PledgeProps) => (
  <motion.div
    whileHover={{ y: -10 }}
    className={`relative p-8 rounded-xl border flex flex-col h-full bg-linear-to-b transition-all duration-500 overflow-hidden group
      ${highlight 
        ? "from-clubhouse-gold/20 to-rich-black border-clubhouse-gold shadow-[0_0_40px_rgba(212,175,55,0.15)]" 
        : "from-white/5 to-transparent border-white/10 hover:border-white/20"
      }`}
  >
    {highlight && (
      <div className="absolute top-0 right-0 p-3 bg-clubhouse-gold text-rich-black font-black text-[10px] uppercase tracking-widest rounded-bl-lg">
        Most Impact
      </div>
    )}
    
    <div className="mb-6">
      <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-clubhouse-gold mb-2">
        Tier {tier}
      </span>
      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
        {name}
      </h3>
    </div>

    <div className="mb-8">
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black text-white">USD {amount}</span>
        <span className="text-gray-400 text-sm font-medium">/month</span>
      </div>
      <p className="text-sm text-gray-400 mt-4 leading-relaxed font-medium">
        {description}
      </p>
    </div>

    <ul className="space-y-4 mb-10 flex-1">
      {benefits.map((benefit: string, i: number) => (
        <li key={i} className="flex items-start gap-3">
          <CheckCircle2 className={`w-5 h-5 shrink-0 ${highlight ? "text-clubhouse-gold" : "text-gray-600"}`} />
          <span className="text-xs text-gray-300 font-medium leading-tight">
            {benefit}
          </span>
        </li>
      ))}
    </ul>

    <Button 
      variant={highlight ? "secondary" : "ghost"}
      className="w-full"
      href="#pledge-form"
    >
      Fuel the Journey
    </Button>
  </motion.div>
);

const ImpactStat = ({ value, label }: { value: string, label: string }) => (
  <div className="text-center p-6 border-r border-white/5 last:border-none">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-black text-white mb-2"
    >
      {value}
    </motion.div>
    <div className="text-[10px] font-black text-clubhouse-gold uppercase tracking-[0.3em]">
      {label}
    </div>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-clubhouse-gold transition-colors">
          {question}
        </span>
        <HelpCircle className={`w-6 h-6 transition-transform duration-500 ${isOpen ? "rotate-180 text-clubhouse-gold" : "text-white/50"}`} />
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
            <p className="pb-6 text-gray-400 text-sm leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Page Component ---

export default function WorldCupCampaignPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await joinZRUNation(formData);
      setIsSubmitted(true);
      setFormData({ name: "", email: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative bg-rich-black min-h-screen selection:bg-clubhouse-gold selection:text-rich-black">
      <Navigation />

      {/* SECTION 1: HERO */}
      <section className="relative h-screen w-full overflow-hidden flex items-center pt-20">
        {/* Cinematic Backdrop */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="/images/campaign/hero.png" 
            alt="Zimbabwe Sables High Performance"
            fill
            sizes="100vw"
            className="object-cover opacity-60 grayscale-[0.3]"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-rich-black via-transparent to-transparent" />
        </motion.div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 hidden md:block"
              >
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-clubhouse-gold/10 border border-clubhouse-gold/20 text-clubhouse-gold text-[10px] font-black uppercase tracking-widest">
                  <Star className="w-3 h-3 fill-current" />
                  Official 2027 World Cup Campaign
                </div>
              </motion.div>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-8 drop-shadow-2xl">
                ROAD TO <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-clubhouse-gold to-white">
                  WORLD CUP
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/70 max-w-xl mb-12 font-medium leading-relaxed tracking-wide">
                Zimbabwe is rising. From the dust of grassroots development to the roar of international stadiums, the Sables are carving a path to the World Cup. This isn’t just a tournament; it’s our generational legacy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="xl" variant="secondary" className="group shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                  Become a Backer
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="xl" variant="ghost">
                  Join ZRU Nation
                </Button>
              </div>

              <div className="flex items-center gap-4 text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                <Shield className="w-4 h-4 text-clubhouse-gold" />
                Transparent reporting • Secure Payments • Real Impact
              </div>
            </motion.div>

            {/* Hero Right: Badge Placement */}
            <div className="hidden lg:flex justify-end">
              <CampaignBadge />
            </div>
          </div>
        </div>

        {/* Floating Background Text */}
        <div className="absolute bottom-0 right-0 p-12 pointer-events-none opacity-[0.03] select-none">
          <div className="text-[15vw] font-black text-white italic leading-none whitespace-nowrap">
            PREPARATION
          </div>
        </div>
      </section>

      {/* SECTION 2: STORY */}
      <section className="py-32 relative overflow-hidden bg-rich-black">
        <StripedBackground position="left" variant="subtle" color="gold" />
        
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            
            {/* Story Text */}
            <div className="order-2 lg:order-1">
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-8">
                The Mission
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-10 leading-[1.1]">
                BEYOND THE <br /> <span className="italic text-white/50">80 MINUTES.</span>
              </h2>
              
              <div className="space-y-8 text-gray-400 text-lg leading-relaxed font-medium tracking-wide">
                <p>
                  Rugby in Zimbabwe is more than a game—it’s a heartbeat. It’s the grit of a sunrise training session in Bulawayo and the discipline of a national camp in Harare. When the Sables step onto that pitch, they carry the weight and the pride of a nation that refuses to be sidelined.
                </p>
                <p>
                  This campaign is the fuel for that engine. We are building a system that is deep, resilient, and elite. Your support ensures that the next generation of Sables has the kit, the coaching, and the stage they deserve.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 mt-16 border border-white/5 bg-white/2 rounded-lg">
                <ImpactStat value="15k+" label="Players" />
                <ImpactStat value="120+" label="Youth Teams" />
                <ImpactStat value="12" label="HP Camps" />
              </div>

              <p className="mt-8 text-xs font-black text-white/30 uppercase tracking-[0.2em] italic">
                “Join 5,000+ backers already fueling the Sables&apos; journey as we push for 2027.”
              </p>
            </div>

            {/* Story Visual: Asymmetric Grid Pattern */}
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 h-[600px]">
              <motion.div 
                initial={{ opacity: 0, scale: 1.1 }}
                whileInView={{ opacity: 0.6, scale: 1 }}
                viewport={{ once: true }}
                className="relative row-span-2 col-span-1 rounded-sm overflow-hidden border border-white/5 grayscale"
              >
                <Image src="/images/campaign/youth.png" alt="Youth Pathway" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 0.8, y: 0 }}
                viewport={{ once: true }}
                className="relative rounded-sm overflow-hidden border border-white/5"
              >
                <Image src="/images/campaign/huddle.png" alt="Sables Training" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 0.5, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-sm overflow-hidden border border-white/5 grayscale"
              >
                <Image src="/images/campaign/jersey.png" alt="Heritage Gear" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: PLEDGES */}
      <section id="pledges" className="py-32 bg-linear-to-b from-rich-black to-[#0a0a0a] relative">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-6 border-b border-clubhouse-gold/30 pb-2">
              Monthly Pledges
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 italic">
              BECOME A BACKER.
            </h2>
            <p className="text-lg text-gray-400 font-medium tracking-wide">
              Our push for the World Cup is built on consistency. Monthly pledges provide the predictable fuel needed to sustain elite performance and grassroots growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PledgeCard 
              tier={1}
              amount="5"
              name="Fuel a Session"
              description="Directly supports the logistics of a grassroots youth session or high-performance video analysis."
              benefits={[
                "Digital 'World Cup Backer' Badge",
                "Quarterly Campaign Impact Newsletter",
                "Early Access to Fixture Alerts"
              ]}
            />
            <PledgeCard 
              tier={2}
              amount="15"
              name="Equip a Future Cap"
              highlight={true}
              description="Funds high-quality kit and training equipment for our youth pathway academies."
              benefits={[
                "All Fuel a Session Benefits",
                "Your name on the digital 'Wall of Backers'",
                "10% discount in The Clubhouse"
              ]}
            />
            <PledgeCard 
              tier={3}
              amount="50"
              name="The Inner Circle"
              description="Fuels national team preparation, including specialized coaching, travel, and nutritional support."
              benefits={[
                "All Equip a Future Cap Benefits",
                "Invites to quarterly briefings with staff",
                "Annual Digital Impact Yearbook"
              ]}
            />
            
            {/* Custom Pledge Card */}
            <div className="relative p-8 rounded-xl border border-white/5 flex flex-col justify-center text-center bg-white/1">
              <Zap className="w-10 h-10 text-clubhouse-gold mx-auto mb-6 opacity-30" />
              <h3 className="text-xl font-bold text-white uppercase mb-4">Set Custom Amount</h3>
              <p className="text-xs text-gray-500 mb-8 font-medium">Choose the level that fits you—every pledge counts toward the shield.</p>
              <Button variant="ghost" className="w-full">Choose Amount</Button>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-lg bg-white/2 border border-white/5 text-[10px] font-black text-white/60 uppercase tracking-widest">
              Secure payments powered by Stripe & Paynow • Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: MEMBERSHIP */}
      <section id="zru-nation" className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden border-y border-white/5">
        {/* Background Image: Blurred Player Profile */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/campaign/huddle.png" alt="ZRU Nation" fill sizes="100vw" className="object-cover opacity-20 blur-sm scale-110" />
          <div className="absolute inset-0 bg-rich-black/80" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
                JOIN THE <br /> <span className="text-clubhouse-gold">ZRU NATION.</span>
              </h2>
              <p className="text-lg text-gray-400 font-medium mb-12 max-w-lg leading-relaxed">
                ZRU Nation is the official home for the inner circle. It’s free to join, and it’s where the real story of the World Cup campaign unfolds.
              </p>
              
              <ul className="grid sm:grid-cols-2 gap-6 mb-12">
                {[
                  "Insider 'Inside the Camp' series",
                  "Priority test match ticket alerts",
                  "Digital supporter ID & badge",
                  "Early Clubhouse drop access"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-clubhouse-gold rounded-full" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/3 backdrop-blur-xl border border-white/10 p-10 rounded-2xl">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleMembershipSubmit}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="nation-name" className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">FULL NAME</label>
                      <input 
                        id="nation-name"
                        type="text" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded p-4 text-white font-medium focus:outline-none focus:border-clubhouse-gold transition-colors" 
                        placeholder="Enter your name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="nation-email" className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">EMAIL ADDRESS</label>
                      <input 
                        id="nation-email"
                        type="email" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded p-4 text-white font-medium focus:outline-none focus:border-clubhouse-gold transition-colors" 
                        placeholder="your@email.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <Button 
                      variant="secondary" 
                      size="xl" 
                      className="w-full"
                      as="button"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Initialize Membership"}
                    </Button>
                    <p className="text-center text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      Already a member? <Link href="/auth" className="text-clubhouse-gold underline">Sign in</Link>
                    </p>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-clubhouse-gold rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="w-10 h-10 text-rich-black" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Welcome to the Nation.</h3>
                    <p className="text-sm text-gray-400 font-medium">Your supporter ID and campaign guide are on their way to your inbox.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: MERCH */}
      <section className="py-32 bg-rich-black relative">
        <BackgroundText text="CLUBHOUSE" color="gray" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-8">
                Official Gear
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                WEAR THE <br /> <span className="text-white/60">SHIELD.</span>
              </h2>
              <p className="mt-8 text-lg text-gray-400 font-medium max-w-lg">
                Carry the campaign with you. Every piece from the World Cup Collection contributes a portion of proceeds directly to the Sables&apos; preparation fund.
              </p>
            </div>
            <Link href="/clubhouse" className="flex items-center gap-4 group">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Full Collection</span>
              <div className="w-12 h-[2px] bg-clubhouse-gold group-hover:w-20 transition-all duration-500" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sables World Cup 'V' Jersey", desc: "The official campaign skin.", price: "85", img: "/images/campaign/jersey.png" },
              { name: "World Cup Technical Cap", desc: "Disciplined design for the supporters.", price: "25", img: "/images/campaign/hero.png" },
              { name: "Pathway Training Tee", desc: "Same spec as the junior academies.", price: "35", img: "/images/campaign/youth.png" }
            ].map((product, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-3/4 mb-6 bg-white/3 border border-white/5 rounded overflow-hidden">
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-clubhouse-gold text-rich-black text-[9px] font-black uppercase tracking-widest rounded-full">
                      Campaign Ed.
                    </span>
                  </div>
                  <Image 
                    src={product.img || "/images/placeholder.jpg"} 
                    alt={product.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 font-bold mb-4 uppercase tracking-tighter">{product.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-white">USD {product.price}</span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-clubhouse-gold group-hover:border-clubhouse-gold transition-colors">
                    <ArrowRight className="w-4 h-4 text-white group-hover:text-rich-black transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: IMPACT & SOCIAL PROOF */}
      <section className="py-32 bg-white/5 border-y border-white/5 relative">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="mb-24">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black text-clubhouse-gold uppercase tracking-[0.4em]">CAMPAIGN MOMENTUM</span>
              <span className="text-xl font-black text-white italic">42% OF PREP GOAL REACHED</span>
            </div>
            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "42%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-linear-to-r from-clubhouse-gold to-white rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                quote: "Being a backer isn't just about the money; it's about knowing I'm in that scrum with them, even from London.",
                author: "Farai",
                role: "Backer since 2024"
              },
              { 
                quote: "The kit we received through the campaign has changed how my U16 boys see themselves. They aren't just playing; they are representing.",
                author: "Coach Moyo",
                role: "Harare Academy"
              },
              { 
                quote: "Seeing the progress meter move makes the World Cup feel real. We are actually doing this together.",
                author: "Sarah",
                role: "ZRU Nation Member"
              }
            ].map((t, i) => (
              <div key={i} className="relative p-8 bg-white/2 border border-white/5 rounded-lg">
                <Quote className="w-10 h-10 text-clubhouse-gold/20 absolute -top-4 -left-4" />
                <p className="text-gray-300 italic text-lg leading-relaxed mb-8 relative z-10">“{t.quote}”</p>
                <div>
                  <div className="text-sm font-black text-white uppercase tracking-tighter">{t.author}</div>
                  <div className="text-[10px] font-bold text-clubhouse-gold uppercase tracking-widest">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ */}
      <section className="py-32 bg-rich-black">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-3 gap-24">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-clubhouse-gold mb-8">Transparency</span>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-8">
                FREQUENTLY <br /> ASKED <br /> QUESTIONS.
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                We believe in complete transparency. Our campaign is built on the trust of our supporters.
              </p>
            </div>
            <div className="lg:col-span-2">
              <FAQItem 
                question="Where does my pledge actually go?"
                answer="60% goes directly to High-Performance preparation (national team camps, specialized coaching, travel, and nutritional data), while 40% fuels our Grassroots Pathways (new kit, coaching education, and academy transport programs)."
              />
              <FAQItem 
                question="Can I change or cancel my monthly pledge?"
                answer="Absolutely. You have 100% control over your commitments via your ZRU Nation dashboard. You can adjust the amount, pause, or cancel at any time with no hidden hurdles."
              />
              <FAQItem 
                question="Is my payment information secure?"
                answer="Yes. We use industry-standard encryption architecture. All international payments are handled via Stripe, and local payments via Paynow, ensuring institutional-grade security for your data."
              />
              <FAQItem 
                question="Can businesses or groups get involved?"
                answer="Yes. We have dedicated corporate tiers that provide visible recognition and partnership benefits. Please reach out to partners@zimbabwerugby.co.zw for a formal brief."
              />
              <FAQItem 
                question="What if I can’t give monthly right now?"
                answer="Support comes in many forms. Joining ZRU Nation for free, sharing our campaign stories, or volunteering at localized grassroots events is just as vital to our success."
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CLOSING */}
      <section className="py-32 bg-linear-to-b from-rich-black to-clubhouse-charcoal relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-5 bg-pattern-diagonal-lines" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-10 italic">
            OUR MOMENT <br /> IS NOW.
          </h2>
          <p className="text-xl text-white/60 font-medium leading-relaxed mb-12 tracking-wide">
            History isn&apos;t just made on the pitch; it&apos;s made by the nation that stands behind it. Be part of the team that takes Zimbabwe back to the world stage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link href="#pledges" className="text-[10px] font-black text-white uppercase tracking-[0.4em] hover:text-clubhouse-gold transition-colors">Pledge Support</Link>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 hidden sm:block" />
            <Link href="#zru-nation" className="text-[10px] font-black text-white uppercase tracking-[0.4em] hover:text-clubhouse-gold transition-colors">Join the Nation</Link>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 hidden sm:block" />
            <Link href="/clubhouse" className="text-[10px] font-black text-white uppercase tracking-[0.4em] hover:text-clubhouse-gold transition-colors">Shop Collection</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

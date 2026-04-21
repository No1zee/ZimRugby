"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ScrollReveal, 
  StaggerContainer, 
  staggerItemVariants,
  AnimatedCounter,
  Tilt3DCard,
  MagneticButton,
  TextScramble,
  FloatingParticles,
  GlowButton,
  ImageReveal
} from "@/components/ui/animations";
import { ChevronRight, Target, Trophy, Users, Heart, Globe, Star } from "lucide-react";

export default function RoadToWorldCupPage() {
  return (
    <main className="relative min-h-screen bg-rich-black overflow-hidden selection:bg-zru-green/30">
      {/* Ambient background particles */}
      <FloatingParticles count={30} className="opacity-40" />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/campaign/hero.png"
            alt="Zimbabwe Sables Victory Celebration"
            fill
            className="object-cover opacity-60 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-rich-black/40 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <ScrollReveal delay={0.2}>
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-zru-green/20 border border-zru-green/30 text-zru-green font-subheading text-sm font-semibold tracking-wider uppercase">
              The Journey Begins
            </span>
          </ScrollReveal>
          
          <h1 className="text-6xl md:text-9xl font-heading mb-6 tracking-tighter leading-tight text-glow-heavy">
            <ScrollReveal direction="down" delay={0.4}>
              ROAD TO <span className="text-zru-green">AUSTRALIA</span>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.6}>
              <span className="text-stroke-charcoal text-white">2027</span>
            </ScrollReveal>
          </h1>

          <ScrollReveal delay={0.8} className="max-w-2xl mx-auto mb-10">
            <p className="text-lg md:text-xl text-gray-100/80 font-subheading leading-relaxed">
              Establishing a legacy that transcends borders. We are not just building a team; 
              we are building a nation's pride. Join the movement.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={1.0}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <MagneticButton strength={0.2} className="group relative px-8 py-4 bg-zru-green text-white font-heading text-xl tracking-wide rounded-sm overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,150,80,0.4)]">
                <span className="relative z-10 flex items-center gap-2">
                  JOIN THE SABLES CIRCLE <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </MagneticButton>
              
              <Link href="#vision" className="font-subheading text-white/60 hover:text-white transition-colors tracking-widest text-sm uppercase flex items-center gap-3 group">
                EXPLORE THE MISSION
                <div className="w-12 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-zru-green transition-all" />
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 italic font-subheading text-xs tracking-[0.3em] uppercase">
          <span>Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* Stats / Numbers Section */}
      <section className="py-24 border-y border-white/5 bg-gray-900/30">
        <div className="container mx-auto px-6">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <motion.div variants={staggerItemVariants}>
              <AnimatedCounter value={2027} className="text-5xl md:text-7xl font-heading text-zru-green block mb-2" />
              <span className="text-white/40 uppercase tracking-widest text-xs font-subheading">Target Year</span>
            </motion.div>
            <motion.div variants={staggerItemVariants}>
              <AnimatedCounter value={8} suffix="M+" className="text-5xl md:text-7xl font-heading text-white block mb-2" />
              <span className="text-white/40 uppercase tracking-widest text-xs font-subheading">Fans Globally</span>
            </motion.div>
            <motion.div variants={staggerItemVariants}>
              <AnimatedCounter value={32} className="text-5xl md:text-7xl font-heading text-zru-green block mb-2" />
              <span className="text-white/40 uppercase tracking-widest text-xs font-subheading">Elite Athletes</span>
            </motion.div>
            <motion.div variants={staggerItemVariants}>
              <AnimatedCounter value={100} suffix="%" className="text-5xl md:text-7xl font-heading text-white block mb-2" />
              <span className="text-white/40 uppercase tracking-widest text-xs font-subheading">Commitment</span>
            </motion.div>
          </StaggerContainer>
        </div>
      </section>

      {/* The Vision Section */}
      <section id="vision" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal direction="right">
              <div className="relative group">
                <div className="absolute -inset-4 bg-zru-green/10 rounded-lg blur-2xl group-hover:bg-zru-green/20 transition-all duration-700" />
                <Tilt3DCard className="relative z-10 rounded-lg overflow-hidden aspect-[4/5] md:aspect-square">
                  <Image
                    src="/images/campaign/hero.png" // Using the same one for now or placeholder if needed
                    alt="The Sables Spirit"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zru-green/60 via-transparent to-transparent opacity-60" />
                </Tilt3DCard>
              </div>
            </ScrollReveal>

            <div className="relative">
              <ScrollReveal delay={0.2}>
                <h2 className="text-5xl md:text-7xl font-heading mb-8 leading-none tracking-tight">
                  MORE THAN <span className="text-zru-green">RUGBY</span>
                </h2>
              </ScrollReveal>
              
              <ScrollReveal delay={0.4} className="space-y-6 text-gray-100/70 font-subheading text-lg leading-relaxed">
                <p>
                  The Road to Australia is not just about 80 minutes on a pitch. It's about the decades of resilience that brought us here. It's about every Zimbabwean who ever dreamed of seeing our flag fly high on the world's stage.
                </p>
                <p>
                  Our strategy is built on three pillars: <span className="text-white font-semibold">Elite High Performance</span>, <span className="text-white font-semibold">Institutional Stability</span>, and <span className="text-white font-semibold">Global Community Engagement</span>.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.6} className="mt-12">
                <GlowButton className="px-8 py-3 border border-white/20 text-white font-subheading text-sm uppercase tracking-widest hover:border-zru-green/50 transition-colors">
                  VIEW STRATEGY DECK
                </GlowButton>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Support Tiers Section */}
      <section className="py-32 bg-gray-900/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <ScrollReveal>
              <h2 className="text-5xl md:text-7xl font-heading mb-4">CHOOSE YOUR <span className="text-zru-green">IMPACT</span></h2>
              <p className="text-white/40 font-subheading tracking-widest uppercase text-sm">Become an Institutional Partner or a Global Member</p>
            </ScrollReveal>
          </div>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {/* Tier 1 */}
            <motion.div variants={staggerItemVariants} className="group h-full">
              <div className="p-8 h-full rounded-sm border border-white/5 bg-gray-900/60 transition-all duration-500 hover:border-zru-green/40 hover:-translate-y-2 flex flex-col">
                <div className="w-12 h-12 rounded-full bg-zru-green/10 flex items-center justify-center mb-6 group-hover:bg-zru-green/20 transition-colors">
                  <Star className="w-6 h-6 text-zru-green" />
                </div>
                <h3 className="text-3xl font-heading mb-2">SUPPORTER</h3>
                <p className="text-white/50 text-sm font-subheading mb-8 flex-grow">Join the community and get exclusive monthly updates and early access to match tickets.</p>
                <div className="text-3xl font-heading text-white mb-8">$10 <span className="text-xs text-white/30 font-subheading uppercase">/ month</span></div>
                <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-subheading text-sm uppercase tracking-widest transition-all hover:bg-white hover:text-rich-black">Join Club</button>
              </div>
            </motion.div>

            {/* Tier 2 - Featured */}
            <motion.div variants={staggerItemVariants} className="group h-full relative">
              <div className="absolute -inset-px bg-gradient-to-b from-zru-green/40 to-transparent blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-8 h-full rounded-sm border border-zru-green/40 bg-gray-900/80 transition-all duration-500 hover:-translate-y-2 flex flex-col relative z-10">
                <div className="absolute top-4 right-4 px-2 py-1 rounded-sm bg-zru-green text-[10px] font-subheading font-bold uppercase tracking-widest">Most Popular</div>
                <div className="w-12 h-12 rounded-full bg-zru-green/20 flex items-center justify-center mb-6">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-heading mb-2">INNER CIRCLE</h3>
                <p className="text-white/50 text-sm font-subheading mb-8 flex-grow">Directly fund our high-performance camps. Includes signed merch and virtual meet-and-greets.</p>
                <div className="text-3xl font-heading text-zru-green mb-8">$50 <span className="text-xs text-white/30 font-subheading uppercase">/ month</span></div>
                <button className="w-full py-4 bg-zru-green text-white font-subheading text-sm uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,150,80,0.3)]">Back The Boys</button>
              </div>
            </motion.div>

            {/* Tier 3 */}
            <motion.div variants={staggerItemVariants} className="group h-full">
              <div className="p-8 h-full rounded-sm border border-white/5 bg-gray-900/60 transition-all duration-500 hover:border-zru-green/40 hover:-translate-y-2 flex flex-col">
                <div className="w-12 h-12 rounded-full bg-zru-green/10 flex items-center justify-center mb-6 group-hover:bg-zru-green/20 transition-colors">
                  <Globe className="w-6 h-6 text-zru-green" />
                </div>
                <h3 className="text-3xl font-heading mb-2">GLOBAL PATRON</h3>
                <p className="text-white/50 text-sm font-subheading mb-8 flex-grow">Institutional-level impact. Corporate visibility, VIP hospitality at Australia 2027, and more.</p>
                <div className="text-3xl font-heading text-white mb-8">INQUIRE <span className="text-xs text-white/30 font-subheading uppercase">/ Year</span></div>
                <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-subheading text-sm uppercase tracking-widest transition-all hover:bg-white hover:text-rich-black">Contact Relations</button>
              </div>
            </motion.div>
          </StaggerContainer>
        </div>
      </section>

      {/* Call to Action Sticky */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 w-full max-w-lg pointer-events-none"
      >
        <div className="p-4 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between pointer-events-auto shadow-2xl">
          <div className="flex -space-x-2 mr-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 overflow-hidden bg-gray-800">
                <div className="w-full h-full bg-zru-green/30" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-zru-green flex items-center justify-center text-[10px] font-bold">+12k</div>
          </div>
          <span className="text-xs font-subheading font-medium text-white/60 mr-auto">Joined the Circle</span>
          <button className="px-6 py-2 bg-zru-green text-white rounded-full font-heading tracking-wide hover:scale-105 active:scale-95 transition-all text-sm">JOIN NOW</button>
        </div>
      </motion.div>

      {/* Footer minimal */}
      <footer className="py-12 border-t border-white/5 text-center">
        <div className="container mx-auto px-6">
          <ScrollReveal>
             <div className="text-2xl font-heading text-white/20 mb-4 tracking-[0.2em]">ZIMBABWE RUGBY UNION</div>
             <p className="text-white/30 font-subheading text-[10px] tracking-widest uppercase">© 2026 Institutional Excellence | Antigravity Design</p>
          </ScrollReveal>
        </div>
      </footer>
    </main>
  );
}

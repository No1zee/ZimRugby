"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, GraduationCap, HandHeart, Target } from "lucide-react";
import Link from "next/link";
import { ScrollReveal, StaggerContainer, staggerItemVariants, GlowButton, Tilt3DCard, AnimatedCounter } from "../ui/animations";
import SubtleBackground from "../ui/SubtleBackground";

const programs = [
  {
    id: 1,
    title: "GRASSROOTS DEVELOPMENT",
    description: "Building the future of Zimbabwe Rugby from the ground up in communities across the nation.",
    icon: Users,
    stat: 50,
    statLabel: "CLUBS",
    cta: "Get Involved",
    ctaLink: "/community/grassroots",
    color: "from-zru-green to-green-900"
  },
  {
    id: 2,
    title: "SCHOOLS PROGRAMME",
    description: "Partnering with schools nationwide to introduce young Zimbabweans to the game of rugby.",
    icon: GraduationCap,
    stat: 200,
    statLabel: "SCHOOLS",
    cta: "Learn More",
    ctaLink: "/community/schools",
    color: "from-gray-900 to-black"
  },
  {
    id: 3,
    title: "WOMEN'S RUGBY",
    description: "Empowering women and girls through rugby with pathways from community to international level.",
    icon: Heart,
    stat: 5000,
    statLabel: "PLAYERS",
    cta: "Join Us",
    ctaLink: "/community/womens",
    color: "from-zru-green to-black"
  },
];

export default function PlayRugbyDevelopment() {
  return (
    <section className="bg-gray-50 py-16 lg:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12 lg:mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HandHeart className="w-6 h-6 text-white" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">Community Impact</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-zru-green uppercase mb-4">
              Rugby For Good
            </h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              From grassroots development to community outreach, Zimbabwe Rugby Union is committed to using the power of sport to transform lives.
            </p>
          </div>
        </ScrollReveal>

        {/* Programs Grid - 3 Column Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" staggerDelay={0.15}>
          {programs.map((program) => (
            <motion.div key={program.id} variants={staggerItemVariants}>
              <Tilt3DCard tiltAmount={5} glareEnabled>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col relative">
                  <SubtleBackground variant="flow" intensity="low" />
                  
                  {/* Visual Header with Icon & Stats */}
                  <div className={`h-44 bg-linear-to-br ${program.color} relative overflow-hidden`}>
                    {/* Pattern */}
                    <div 
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='2' fill='%23fff'/%3E%3C/svg%3E\")",
                      }}
                    />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <program.icon className="w-10 h-10 mb-3" />
                      </motion.div>
                      <div className="text-4xl font-black">
                        <AnimatedCounter value={program.stat} suffix="+" />
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-80">
                        {program.statLabel}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-zru-green font-black text-lg uppercase mb-3">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                      {program.description}
                    </p>
                    
                    <Link href={program.ctaLink}>
                      <motion.button 
                        className="w-full bg-zru-green hover:bg-green-800 text-white text-xs font-bold uppercase tracking-wider py-3 rounded flex items-center justify-center gap-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {program.cta} <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </Tilt3DCard>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* Impact Summary Bar */}
        <ScrollReveal delay={0.3}>
          <div className="bg-zru-green rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-white font-black text-xl uppercase mb-2">
                Want to Make a Difference?
              </h3>
              <p className="text-white/80 text-sm">
                Support Zimbabwe Rugby's community initiatives through volunteering, donations, or partnerships.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/volunteer">
                <GlowButton 
                  className="bg-white text-zru-green px-6 py-3 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  glowColor="rgba(255,255,255,0.3)"
                >
                  Volunteer
                </GlowButton>
              </Link>
              <Link href="/donate">
                <motion.button 
                  className="bg-white text-zru-green px-6 py-3 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Donate <Heart className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}

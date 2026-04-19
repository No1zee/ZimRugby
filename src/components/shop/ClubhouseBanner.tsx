"use client";

import { motion } from "framer-motion";

export default function ClubhouseBanner() {
  return (
    <section className="bg-white py-32 px-6 md:px-12 relative overflow-hidden grain-texture">
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-clubhouse-charcoal relative overflow-hidden group rounded-sm border border-white/5 transition-all duration-700 hover:border-clubhouse-gold/50 shadow-2xl">
          
          {/* Members Only Cinematic Pulse */}
          <motion.div 
            animate={{ 
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.05, 1],
              rotate: [0, 1, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset--20 z-0 pointer-events-none blur-3xl"
          >
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--color-clubhouse-gold)_0%,transparent_70%)] opacity-20" />
          </motion.div>
          
          {/* Interactive Shine Effect */}
          <div className="absolute inset-0 z-10 pointer-events-none shine-glass opacity-30" />

          {/* Background Structural Elements */}
          <div className="absolute inset-0 z-0 opacity-40">
             <motion.div 
               whileInView={{ y: [-20, 20] }}
               transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
               className="absolute top-0 right-0 w-1/2 h-full bg-clubhouse-green transform skew-x-12 translate-x-20 blur-3xl opacity-20" 
             />
             <motion.div 
               whileInView={{ y: [20, -20] }}
               transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
               className="absolute bottom-0 left-0 w-1/4 h-full bg-clubhouse-gold transform -skew-x-12 -translate-x-10 blur-3xl opacity-10" 
             />
          </div>

          <div className="relative z-20 px-8 py-24 md:p-40 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto"
            >
              <motion.span 
                initial={{ opacity: 0, letterSpacing: "1.2em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="block text-[10px] font-black uppercase tracking-[0.5em] text-clubhouse-gold mb-12"
              >
                Establish Your Legacy
              </motion.span>
              
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-12 leading-[0.9] overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  THE SABLES
                </motion.span>
                <motion.span
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-clubhouse-gold/90 block"
                >
                  CLUBHOUSE
                </motion.span>
              </h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="text-sm md:text-lg text-white/50 mb-16 leading-relaxed tracking-wide font-medium"
              >
                Unlock early access to seasonal drops, exclusive matchday kits, 
                and private events at the Sables training grounds. This is the inner sanctum.
              </motion.p>

              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto relative z-30"
              >
                <input 
                  type="email" 
                  placeholder="ENTER YOUR EMAIL"
                  className="flex-1 bg-white/5 border border-white/10 px-8 py-6 text-[11px] font-bold tracking-[0.3em] text-white focus:outline-none focus:border-clubhouse-gold transition-all duration-500 rounded-none placeholder:text-white/20"
                  required
                />
                <button 
                  type="submit"
                  className="px-14 py-6 bg-white text-clubhouse-charcoal text-[11px] font-black uppercase tracking-[0.3em] hover:bg-clubhouse-gold transition-all duration-500 rounded-none shadow-2xl"
                >
                  APPLY FOR ACCESS
                </button>
              </motion.form>

              <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-12 border-t border-white/5 pt-16">
                {[
                  "Early Access",
                  "Limited Drops",
                  "Training Events",
                  "Member Pricing"
                ].map((perk, idx) => (
                  <motion.div 
                    key={perk} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 + (idx * 0.1), duration: 0.8 }}
                    className="flex flex-col items-center group/perk"
                  >
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 group-hover/perk:text-clubhouse-gold transition-colors">{perk}</span>
                    <div className="w-4 h-px bg-clubhouse-gold/0 group-hover/perk:bg-clubhouse-gold group-hover/perk:w-8 transition-all mt-2" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

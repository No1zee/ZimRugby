import React from 'react';

export default function PartnersHero() {
  return (
    <section className="relative w-full min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center bg-rich-black overflow-hidden pt-24 pb-12">
      {/* Background Gradient/Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zru-green/10 to-transparent opacity-50" />
        {/* Subtle grid pattern overlay for premium feel */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center space-y-6">
        <h1 className="font-black text-white uppercase tracking-tight leading-none text-5xl md:text-7xl lg:text-8xl text-glow-heavy">
          Our Partners
        </h1>
        <p className="text-gray-400 text-lg md:text-xl lg:text-2xl max-w-2xl font-medium tracking-wide">
          Proudly partnered with the brands that fuel Zimbabwe Rugby.
        </p>
      </div>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-rich-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}

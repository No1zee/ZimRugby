import React from 'react';
import Image from 'next/image';
import { Partner } from '../../data/partners';

interface PartnerLogoProps {
  partner: Partner;
}

export default function PartnerLogo({ partner }: PartnerLogoProps) {
  return (
    <a 
      href={partner.websiteUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center p-4 transition-all duration-500 hover:scale-105"
    >
      {/* 
        Premium micro-interaction:
        - Starts grayscale and slightly transparent
        - On hover, transitions to full color and full opacity
        - Subtle glow effect behind the logo on hover
      */}
      <div className="absolute inset-0 bg-zru-green/0 group-hover:bg-zru-green/20 blur-xl rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none" />
      
      <div className="relative w-full h-auto flex items-center justify-center">
        {/* We use standard img here instead of next/image since we are using data URIs for placeholders.
            For production with real logos, switch to next/image if configured. */}
        <img 
          src={partner.logoUrl} 
          alt={`${partner.name} logo`}
          className="w-full max-w-[200px] md:max-w-[250px] lg:max-w-[300px] h-auto object-contain grayscale opacity-60 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
        />
      </div>
    </a>
  );
}

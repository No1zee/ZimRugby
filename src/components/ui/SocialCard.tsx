"use client";

import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  Phone,
} from "lucide-react";

const platforms = [
  { Icon: Phone, href: "tel:+263242700100", label: "Call Us" },
  { Icon: Facebook, href: "https://facebook.com/zimbabwerugby", label: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com/zimbabwerugby", label: "X" },
  { Icon: Instagram, href: "https://instagram.com/zimbabwerugby", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/zimbabwerugby", label: "YouTube" },
  { Icon: Linkedin, href: "https://linkedin.com/zimbabwerugby", label: "LinkedIn" },
];

/**
 * Animated social bar — adapted from Uiverse dovatgabriel.
 * Single card shows "GET IN TOUCH" label. On hover the two-tone
 * green background splits apart revealing phone + 5 social icons,
 * which bounce on individual hover. Slanted clip + ZRU palette.
 */
export default function SocialCard() {
  return (
    <div className="social-card">
      {/* Top face — slides up on hover */}
      <div className="card-face-top" style={{ backgroundColor: "#006747" }} />

      {/* Bottom face — slides down on hover */}
      <div className="card-face-bottom" style={{ backgroundColor: "#004D34" }} />

      {/* Label — fades on hover */}
      <span className="card-label">Get in Touch</span>

      {/* Phone + social icons revealed on hover */}
      {platforms.map(({ Icon, href, label }, i) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("tel:") ? undefined : "_blank"}
          rel={href.startsWith("tel:") ? undefined : "noopener noreferrer"}
          aria-label={href.startsWith("tel:") ? "Call ZRU" : `Official ZRU on ${label}`}
          className="social-icon-link"
          style={{ transitionDelay: `${i * 50}ms` }}
        >
          <Icon className="w-[18px] h-[18px]" />
        </a>
      ))}
    </div>
  );
}

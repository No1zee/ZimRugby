"use client";

import { useState, useRef, useEffect } from "react";
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
 * Single card shows "GET IN TOUCH" label. On hover (desktop) or
 * tap (mobile), the two-tone green background splits apart revealing
 * phone + 5 social icons. First tap opens; second tap navigates.
 */
export default function SocialCard() {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <div
      ref={cardRef}
      className={`social-card ${isOpen ? "is-open" : ""}`}
      onClick={(e) => {
        // Only toggle if clicking the card face or label, not an icon link
        if ((e.target as HTMLElement).closest(".social-icon-link")) return;
        setIsOpen((prev) => !prev);
      }}
    >
      {/* Top face — slides up on open */}
      <div className="card-face-top" style={{ backgroundColor: "#006747" }} />

      {/* Bottom face — slides down on open */}
      <div className="card-face-bottom" style={{ backgroundColor: "#004D34" }} />

      {/* Label — fades on open */}
      <span className="card-label">Get in Touch</span>

      {/* Phone + social icons revealed on open */}
      {platforms.map(({ Icon, href, label }, i) => (
        <a
          key={label}
          href={isOpen ? href : "#"}
          onClick={(e) => {
            if (!isOpen) {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
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

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Ticket, Users, ShoppingBag, ShieldCheck, ArrowUpRight, User } from "lucide-react";
import gsap from "gsap";
import type { NavItem, NavChild } from "@/lib/navConfig";
import { useAdaptivePerformance } from "@/context/AdaptivePerformanceContext";

interface KineticNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  pathname: string;
}

export default function KineticNav({ isOpen, onClose, navItems, pathname }: KineticNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { isLowEndDevice, isSlowConnection, prefersReducedMotion } = useAdaptivePerformance();
  const disableParticles = isLowEndDevice || isSlowConnection || prefersReducedMotion;


  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (href: string, children?: NavChild[]) => {
    if (href === "/") return pathname === "/";
    const [hrefPath] = href.split("?");
    const pathMatches = pathname.startsWith(hrefPath);
    if (!pathMatches) return false;
    if (children?.length) {
      const childMatches = children.some((child) => {
        const [childPath] = child.href.split("?");
        return pathname.startsWith(childPath);
      });
      if (childMatches) return false;
    }
    return true;
  };

  // Open/close animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const navWrap = containerRef.current!.querySelector(".k-nav-wrapper");
      const menu = containerRef.current!.querySelector(".k-menu-content");
      const overlay = containerRef.current!.querySelector(".k-overlay");
      const bgPanel = containerRef.current!.querySelector(".k-backdrop");
      const menuLinks = containerRef.current!.querySelectorAll(".k-link");
      const fadeTargets = containerRef.current!.querySelectorAll("[data-menu-fade]");
      const menuButton = containerRef.current!.querySelector(".k-close-btn");
      const menuButtonTexts = menuButton?.querySelectorAll("p");
      const menuButtonIcon = menuButton?.querySelector(".k-close-icon");

      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.5 } });

      if (isOpen) {
        if (navWrap) navWrap.setAttribute("data-nav", "open");

        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<");

        if (menuButtonTexts?.length) {
          tl.fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.15, duration: 0.4 }, "<");
        }
        if (menuButtonIcon) {
          tl.fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315, duration: 0.4 }, "<");
        }

        tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(bgPanel, { xPercent: 101 }, { xPercent: 0, duration: 0.5 }, "<")
          .fromTo(menuLinks, { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.04, duration: 0.4 }, "<+=0.25");

        if (fadeTargets.length) {
          tl.fromTo(fadeTargets, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, stagger: 0.03, clearProps: "all" }, "<+=0.15");
        }
      } else {
        if (navWrap) navWrap.setAttribute("data-nav", "closed");

        tl.to(menuLinks, { yPercent: 40, opacity: 0, duration: 0.25, stagger: { each: 0.02, from: "end" } })
          .to(overlay, { autoAlpha: 0, duration: 0.3 }, "<")
          .to(menu, { xPercent: 100, duration: 0.4 }, "<+=0.1");

        if (menuButtonTexts?.length) {
          tl.to(menuButtonTexts, { yPercent: 0, duration: 0.3 }, "<");
        }
        if (menuButtonIcon) {
          tl.to(menuButtonIcon, { rotate: 0, duration: 0.3 }, "<");
        }

        tl.set(navWrap, { display: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [isOpen]);

  return (
    <div ref={containerRef}>
      <section className="k-fullscreen-menu">
        <div data-nav="closed" className="k-nav-wrapper">
          <div className="k-overlay" onClick={onClose} />
          <nav className="k-menu-content">
            {/* Ambient background — CSS-only blurred orbs, no SVGs */}
            <div className="k-menu-bg">
              <div className="k-backdrop" />
              {!disableParticles && (
                <>
                  <div className="k-orb k-orb-1" />
                  <div className="k-orb k-orb-2" />
                  <div className="k-orb k-orb-3" />
                </>
              )}
            </div>

            <div className="k-content-wrapper">
              {/* Top bar */}
              <div className="k-top-bar">
                <Link href="/" onClick={onClose} className="k-logo-link">
                  <Image src="/images/logos/zru-logo.svg" alt="ZRU" width={36} height={36} className="object-contain" />
                  <div>
                    <span className="k-logo-title">ZIMBABWE RUGBY</span>
                    <span className="k-logo-subtitle">OFFICIAL UNION NAVIGATION</span>
                  </div>
                </Link>

                <button onClick={onClose} className="k-close-btn" aria-label="Close menu">
                  <div className="k-close-text">
                    <p>Menu</p>
                    <p>Close</p>
                  </div>
                  <div className="k-close-icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="k-close-icon">
                      <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor" />
                      <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" />
                      <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor" />
                      <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor" />
                      <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor" />
                      <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Quick Actions strip */}
              <div data-menu-fade className="k-quick-actions">
                <Link href="/tickets" onClick={onClose} className="k-quick-action-primary">
                  <Ticket className="w-4 h-4" />
                  <span>MATCH TICKETS</span>
                </Link>
                <Link href="/shop" onClick={onClose} className="k-quick-action-secondary">
                  <ShoppingBag className="w-4 h-4" />
                  <span>STORE</span>
                </Link>
              </div>

              {/* Nav links — grouped under Browse */}
              <div className="k-links-area">
                <div className="k-section-label" data-menu-fade>BROWSE</div>
                <ul className="k-nav-list">
                  {navItems.map((item) => {
                    const hasChildren = !!item.children?.length;
                    const isExpanded = expandedItems.includes(item.label);
                    const active = isActive(item.href, item.children);

                    return (
                      <li key={item.label} className="k-menu-item">
                        {hasChildren ? (
                          <div className="k-nav-item-expandable">
                            <button
                              onClick={() => toggleExpand(item.label)}
                              className={`k-link ${active ? "is-active" : ""}`}
                            >
                              <span className="k-link-text">{item.label}</span>
                              <div className={`k-expand-icon ${isExpanded ? "is-open" : ""}`}>
                                <ChevronRight className="w-5 h-5" />
                              </div>
                            </button>
                            <div className={`k-sub-links ${isExpanded ? "is-open" : ""}`}>
                              {item.children!.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={onClose}
                                  className={`k-sub-link ${isActive(child.href) ? "is-active" : ""}`}
                                >
                                  <span>{child.label}</span>
                                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link href={item.href} onClick={onClose} className={`k-link ${active ? "is-active" : ""}`}>
                            <span className="k-link-text">{item.label}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Account & Actions section */}
                <div className="k-section-label k-section-label--actions" data-menu-fade>ACCOUNT &amp; ACTIONS</div>
                <ul className="k-nav-list" data-menu-fade>
                  <li className="k-menu-item">
                    <Link href="/login" onClick={onClose} className="k-link">
                      <span className="k-link-text">SIGN IN</span>
                    </Link>
                  </li>
                  <li className="k-menu-item">
                    <Link href="/fan-zone" onClick={onClose} className="k-link">
                      <span className="k-link-text">FAN ZONE</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Bottom CTA strip */}
              <div className="k-bottom-strip">
                <div className="k-bottom-inner">
                  <div className="k-copyright">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ZIMBABWE RUGBY UNION &copy; {new Date().getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

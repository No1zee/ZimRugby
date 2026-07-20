"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, CheckCircle } from "lucide-react";

const socialLinks = [
  { Icon: Facebook, href: "https://facebook.com/zimbabwerugby", label: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com/zimbabwerugby", label: "Twitter" },
  { Icon: Instagram, href: "https://instagram.com/zimbabwerugby", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/zimbabwerugby", label: "YouTube" },
  { Icon: Linkedin, href: "https://linkedin.com/zimbabwerugby", label: "LinkedIn" },
];

const footerLinks = {
  "About ZRU": [
    { label: "Our Story", href: "/about" },
    { label: "Leadership", href: "/about/leadership" },
    { label: "Careers", href: "/about/careers" },
    { label: "Contact", href: "/contact" },
  ],
  "Rugby": [
    { label: "Tickets", href: "/tickets" },
    { label: "Match Centre", href: "/match-centre" },
    { label: "Our Teams", href: "/teams" },
    { label: "Events", href: "/events" },
    { label: "News", href: "/media" },
  ],
  "Get Involved": [
    { label: "Play Rugby", href: "/play-rugby" },
    { label: "Find a Club", href: "/clubs" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Back the Sables", href: "/world-cup-campaign", descriptor: "Monthly pledges. Direct impact." },
  ],
  "Resources": [
    { label: "Downloads", href: "/resources" },
    { label: "Laws of the Game", href: "/resources/laws" },
    { label: "Shop", href: "/about/clubhouse" },
    { label: "FAQs", href: "/faqs" },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (pathname?.startsWith('/about/clubhouse') || pathname?.startsWith('/admin')) return null;

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // TODO Phase 2: wire to Supabase email_subscribers table
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <footer className="bg-clubhouse-charcoal text-white relative overflow-hidden pt-16 pb-8">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-zru-green/5 to-transparent pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-16">
          <div className="max-w-md space-y-6">
            <Link href="/" className="inline-block group">
              <div className="space-y-4">
                <span className="text-6xl font-black text-white tracking-tighter block leading-none">ZIMBABWE <br /><span className="text-zru-green">RUGBY</span></span>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-px bg-white/20" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">The Pride of Zimbabwe</span>
                </div>
              </div>
            </Link>
            <p className="text-white/60 font-medium leading-relaxed">
              Founded in 1895, the Zimbabwe Rugby Union is the custodian of the game&apos;s rich heritage and its ambitious future on the world stage.
            </p>
            <div className="flex gap-6">
              {socialLinks.map(({ Icon, href, label }) => (
                <a 
                  key={label} 
                  href={href} 
                  className="text-white/50 hover:text-zru-green transition-colors"
                  aria-label={`ZRU on ${label}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-4xl p-8 md:p-12 max-w-2xl w-full relative">
             <div className="space-y-6 relative z-10">
                <div className="space-y-1">
                   <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.4em]">Stay in the Loop</span>
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter">THE SABLES BULLETIN</h3>
                </div>
                {submitted ? (
                  <div className="flex items-center gap-3 text-zru-green py-4">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold text-sm">You&apos;re in! We&apos;ll be in touch.</span>
                  </div>
                ) : (
                  <form className="relative" onSubmit={handleSubscribe} aria-label="Newsletter signup">
                     <label htmlFor="footer-email" className="sr-only">Email Address</label>
                     <input 
                       id="footer-email"
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="Enter your email" 
                       required
                       disabled={loading}
                       className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:outline-hidden focus:border-zru-green transition-all placeholder:text-white/20 text-lg font-medium disabled:opacity-50"
                     />
                      <button 
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-zru-green text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zru-green/80 transition-colors shadow-lg disabled:opacity-60"
                      >
                        {loading ? "..." : "Subscribe"}
                     </button>
                  </form>
                )}
             </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green">{title}</h4>
              <ul className="space-y-3">
                 {links.map((link: { label: string; href: string; descriptor?: string }) => (
                    <li key={link.label}>
                       <Link href={link.href} className="flex flex-col group/link">
                         <span className="text-sm font-bold text-white/60 group-hover/link:text-white transition-colors">
                           {link.label}
                         </span>
                         {link.descriptor && (
                           <span className="text-[10px] font-medium text-white/50">
                             {link.descriptor}
                           </span>
                         )}
                       </Link>
                    </li>
                 ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-between">
              <Link href="/world-cup-campaign" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/50 hover:text-zru-green transition-colors">
                Fueling the pathway, one pledge at a time.
              </Link>
              <div className="flex items-center gap-8">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50">© 2026 ZRU OFFICIAL</span>
                <div className="hidden md:flex gap-8">
                  {['Privacy Policy', 'Terms of Use', 'Accessibility'].map((item) => (
                    <Link key={item} href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
           </div>
        </div>

      </div>
    </footer>
  );
}

"use client";

import EdgyGradient from "@/components/ui/EdgyGradient";
import PageHero from "@/components/ui/PageHero";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Info, Users, Shield, Landmark, Hourglass, Briefcase } from "lucide-react";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Overview", href: "/about", icon: Info },
    { label: "Board & Leadership", href: "/about/board", icon: Users },
    { label: "Governance & Compliance", href: "/about/governance", icon: Landmark },
    { label: "History & Heritage", href: "/about/history", icon: Hourglass },
    { label: "Safeguarding Policies", href: "/about/safeguarding", icon: Shield },
    { label: "Careers & Vacancies", href: "/about/careers", icon: Briefcase }
  ];

  return (
    <div className="bg-milk-white min-h-screen text-rich-black pb-12 relative overflow-hidden">
      {/* Institutional Banner */}
      <PageHero 
        title="About The Union"
        subtitle="Discover the structure, values, history, and governance of the Zimbabwe Rugby Union."
        tag="INSTITUTIONAL PORTAL"
        backgroundImage="/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp"
      />

      {/* Main Grid Layout: Sidebar + Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Responsive Left Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-widest text-zru-green mb-6 border-b border-black/5 pb-3">
                PORTAL NAVIGATION
              </h2>
              
              {/* Desktop menu */}
              <nav className="hidden lg:flex flex-col gap-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                        isActive
                          ? "bg-zru-green text-white shadow-lg"
                          : "text-black/60 hover:text-black hover:bg-black/5"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile menu (horizontal scroll) */}
              <nav className="flex lg:hidden overflow-x-auto py-2 gap-2 no-scrollbar">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2.5 clip-slanted-sm text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                        isActive
                          ? "bg-zru-green text-white shadow-md"
                          : "text-black/60 hover:text-black hover:bg-black/5"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

            </div>
          </aside>

          {/* Right Content Area */}
          <section className="lg:col-span-3">
            <div className="bg-white border border-black/5 rounded-3xl p-6 md:p-10 shadow-sm min-h-[50vh]">
              {children}
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}

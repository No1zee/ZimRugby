"use client";

import EdgyGradient from "@/components/ui/EdgyGradient";
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
    <div className="bg-rich-black min-h-screen text-white pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <EdgyGradient opacity={0.4} />
      </div>

      {/* Institutional Banner */}
      <section className="bg-zru-green relative overflow-hidden py-16 border-b border-white/10 mb-12">
        <div className="absolute inset-0 opacity-10 bg-pattern-diagonal-lines" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-zru-green text-xs font-black uppercase tracking-[0.4em] mb-2 block">
            INSTITUTIONAL PORTAL
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
            ABOUT THE UNION
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mt-3 font-medium">
            Discover the structure, values, history, and governance of the Zimbabwe Rugby Union.
          </p>
        </div>
      </section>

      {/* Main Grid Layout: Sidebar + Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Responsive Left Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xs font-black uppercase tracking-widest text-zru-green mb-6 border-b border-white/5 pb-3">
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
                          ? "bg-zru-green text-rich-black shadow-lg"
                          : "text-white/60 hover:text-white hover:bg-white/5"
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
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                        isActive
                          ? "bg-zru-green text-rich-black shadow-md"
                          : "text-white/60 hover:text-white hover:bg-white/5"
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
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 md:p-10 backdrop-blur-sm min-h-[50vh]">
              {children}
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}

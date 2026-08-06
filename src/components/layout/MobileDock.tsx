'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, User, Newspaper, Ticket, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MobileDock() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  const mainAuthLabel = isAuthenticated ? (user?.handle || 'Passport') : 'Sign In';
  const mainAuthHref = isAuthenticated ? '/fan-zone' : '/login';

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/matches', label: 'Fixtures', icon: Calendar },
    {
      href: mainAuthHref,
      label: mainAuthLabel,
      icon: isAuthenticated ? UserCheck : User,
      primary: true,
    },
    { href: '/tickets', label: 'Tickets', icon: Ticket },
    { href: '/media', label: 'News', icon: Newspaper },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="bg-emerald-950/90 backdrop-blur-xl border-t border-emerald-800/40 px-3 py-2 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            if (item.primary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center -mt-5 transition-transform active:scale-95`}
                >
                  <div className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg border-2 ${
                    isActive
                      ? 'bg-emerald-500 border-white text-emerald-950 shadow-emerald-500/30'
                      : 'bg-emerald-600 border-emerald-400/60 text-white shadow-emerald-900/50'
                  }`}>
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-emerald-300 truncate max-w-[70px]">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
                  isActive
                    ? 'text-emerald-400 font-semibold'
                    : 'text-zinc-400 hover:text-emerald-200'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

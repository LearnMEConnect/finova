"use client";

import { Home, PieChart, WalletCards, Settings } from 'lucide-react';
import { cn } from '@/utils/helpers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'Transactions', icon: WalletCards, href: '/transactions' },
    { name: 'Goals', icon: PieChart, href: '/goals' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col pt-8 z-50">
      <div className="flex items-center justify-center md:justify-start md:px-8 mb-12">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
          <WalletCards className="text-slate-950 w-6 h-6" />
        </div>
        <span className="hidden md:block ml-4 text-xl font-semibold text-white tracking-tight">Finova</span>
      </div>
      
      <div className="flex flex-col gap-2 px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex justify-center md:justify-start items-center p-3 rounded-lg transition-colors group",
                isActive ? "bg-emerald-500/10 text-emerald-400" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <Icon className="w-5 h-5 md:mr-4 shrink-0" />
              <span className="hidden md:block font-medium">{link.name}</span>
            </Link>
          )
        })}
      </div>

      <div className="mt-auto mb-8 mx-auto md:mx-0 md:px-8 text-center md:text-left opacity-70">
        <span className="text-[10px] md:text-xs text-slate-500 font-medium tracking-wide">
          <span className="hidden md:inline">Created by </span>
          <span className="font-semibold text-slate-400 hover:text-emerald-500 transition-colors cursor-default">MEConnect&trade;</span>
        </span>
      </div>
    </nav>
  );
}

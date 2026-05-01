"use client";

import { WalletCards } from "lucide-react";

/**
 * TopBar — slim app header replacing the heavyweight sidebar.
 * No navigation links needed for a single-page dashboard.
 */
export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <WalletCards className="text-slate-950 w-4.5 h-4.5" />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">
            Finova
          </span>
        </div>

        <span className="text-[10px] text-slate-500 font-medium tracking-wide">
          <span className="font-semibold text-slate-400">MEConnect&trade;</span>
        </span>
      </div>
    </header>
  );
}

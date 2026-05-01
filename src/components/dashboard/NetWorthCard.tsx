"use client";

/**
 * NetWorthCard — The hero of the dashboard.
 * Shows net worth prominently with a breakdown:
 *   Assets − Liabilities + (Income − Expenses) = Net Worth
 * All values are live-computed from FinanceContext.
 */

import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/utils/helpers";
import {
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  CreditCard,
} from "lucide-react";

export default function NetWorthCard() {
  const { netWorth, totalAssets, totalLiabilities, totalIncome, totalExpenses } =
    useFinance();

  const cashFlow = totalIncome - totalExpenses;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8">
      {/* Glow accent */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-emerald-500/15 blur-[80px] rounded-full pointer-events-none" />

      {/* Net Worth headline */}
      <div className="relative z-10 mb-6">
        <p className="text-sm text-slate-400 font-medium mb-1">Total Net Worth</p>
        <h2
          className={`text-4xl sm:text-5xl font-bold tracking-tight leading-none ${
            netWorth >= 0 ? "text-white" : "text-rose-400"
          }`}
        >
          {formatCurrency(netWorth)}
        </h2>
      </div>

      {/* Breakdown grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Assets */}
        <div className="rounded-xl bg-emerald-500/[0.07] border border-emerald-500/10 p-3">
          <span className="flex items-center text-xs text-slate-400 mb-1">
            <Landmark className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Assets
          </span>
          <span className="text-base sm:text-lg font-semibold text-emerald-400">
            {formatCurrency(totalAssets)}
          </span>
        </div>

        {/* Liabilities */}
        <div className="rounded-xl bg-rose-500/[0.07] border border-rose-500/10 p-3">
          <span className="flex items-center text-xs text-slate-400 mb-1">
            <CreditCard className="w-3.5 h-3.5 mr-1 text-rose-400" />
            Liabilities
          </span>
          <span className="text-base sm:text-lg font-semibold text-rose-400">
            {formatCurrency(totalLiabilities)}
          </span>
        </div>

        {/* Income */}
        <div className="rounded-xl bg-white/5 border border-white/5 p-3">
          <span className="flex items-center text-xs text-slate-400 mb-1">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Income
          </span>
          <span className="text-base sm:text-lg font-semibold text-white">
            {formatCurrency(totalIncome)}
          </span>
        </div>

        {/* Expenses */}
        <div className="rounded-xl bg-white/5 border border-white/5 p-3">
          <span className="flex items-center text-xs text-slate-400 mb-1">
            <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-rose-400" />
            Expenses
          </span>
          <span className="text-base sm:text-lg font-semibold text-white">
            {formatCurrency(totalExpenses)}
          </span>
        </div>
      </div>

      {/* Cash flow summary line */}
      <div className="relative z-10 mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-sm">
        <span className="text-slate-500">Net Cash Flow</span>
        <span
          className={`font-semibold ${
            cashFlow >= 0 ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {cashFlow >= 0 ? "+" : ""}
          {formatCurrency(cashFlow)}
        </span>
      </div>
    </section>
  );
}

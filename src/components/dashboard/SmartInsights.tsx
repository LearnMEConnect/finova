"use client";

/**
 * SmartInsights — Condensed to a slim banner.
 * Still uses the 50/30/20 rule but takes up minimal space.
 */

import { useFinance } from "@/context/FinanceContext";
import { Lightbulb, ShieldCheck, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/utils/helpers";
import { useMemo } from "react";

export default function SmartInsights() {
  const { transactions } = useFinance();

  const insight = useMemo(() => {
    let income = 0;
    let fixedExpenses = 0;

    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else if (["Housing", "Utilities", "Transport"].includes(t.category)) {
        fixedExpenses += t.amount;
      }
    });

    const isGood = income === 0 || fixedExpenses <= income * 0.5;
    const remaining = Math.max(0, income - fixedExpenses);

    return {
      isGood,
      text: isGood
        ? `Fixed costs are healthy — ${formatCurrency(remaining)} remaining for savings & wants.`
        : `Fixed expenses (${formatCurrency(fixedExpenses)}) exceed 50% of income. Consider reducing fixed costs.`,
    };
  }, [transactions]);

  return (
    <section className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          insight.isGood
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-amber-500/10 text-amber-400"
        }`}
      >
        {insight.isGood ? (
          <ShieldCheck className="w-4 h-4" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-white font-medium">
          {insight.isGood ? "Healthy Budget" : "Budget Warning"}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 flex items-start gap-1">
          <Lightbulb className="w-3 h-3 mt-0.5 shrink-0 text-amber-400/60" />
          {insight.text}
        </p>
      </div>
    </section>
  );
}

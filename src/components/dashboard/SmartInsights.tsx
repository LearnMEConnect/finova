"use client";

import { useFinance } from '@/context/FinanceContext';
import { Lightbulb, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from '@/utils/helpers';
import { useMemo } from 'react';

export default function SmartInsights() {
  const { transactions } = useFinance();

  const insight = useMemo(() => {
    let income = 0;
    let fixedExpenses = 0;
    
    // Simplistic mapping for the 50/30/20 insight
    transactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else if (['Housing', 'Utilities', 'Transport'].includes(t.category)) {
        fixedExpenses += t.amount;
      }
    });

    const isGood = income === 0 || fixedExpenses <= income * 0.5;
    const remaining = Math.max(0, income - fixedExpenses);

    return {
      status: isGood ? 'Excellent' : 'Warning',
      description: isGood 
        ? "Your fixed expenses are well below 50% of your income. Great job keeping your overhead low."
        : `Your fixed expenses (${formatCurrency(fixedExpenses)}) exceed 50% of your income (${formatCurrency(income)}). Consider finding ways to lower fixed costs.`,
      action: isGood
        ? `You have ${formatCurrency(remaining)} remaining outside fixed costs. Consider allocating 50% of this towards an emergency fund or investments.`
        : "Prioritize paying off high-interest debt or reducing major bills.",
      icon: isGood ? ShieldCheck : AlertCircle,
      iconColor: isGood ? "text-emerald-400" : "text-amber-400",
      shadowColor: isGood ? "shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "shadow-[0_0_30px_rgba(251,191,36,0.1)]"
    };
  }, [transactions]);

  const Icon = insight.icon;

  return (
    <Card className="bg-slate-900 border-white/5 col-span-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
      
      <CardContent className="p-6 flex flex-col md:flex-row gap-6 relative z-10">
        <div className={`flex-shrink-0 w-16 h-16 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-center ${insight.shadowColor}`}>
          <Icon className={`w-8 h-8 ${insight.iconColor}`} />
        </div>

        <div className="flex-1">
          <h3 className="text-white font-medium text-lg mb-1">Financial Health: {insight.status}</h3>
          <p className="text-slate-400 text-sm mb-4">{insight.description}</p>
          
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-3">
            <Lightbulb className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300">
              <span className="font-medium text-white">Insight:</span> {insight.action}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

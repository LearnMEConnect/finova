"use client";

import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/helpers';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function NetWorthCard() {
  const { transactions } = useFinance();
  
  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    });
    return { income, expenses };
  }, [transactions]);

  const netWorth = 45200 + stats.income - stats.expenses;

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 col-span-12 lg:col-span-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none" />
      
      <CardContent className="p-6">
        <h3 className="text-slate-400 font-medium mb-2">Total Net Worth</h3>
        <div className="flex items-end gap-4 mb-8">
          <span className="text-4xl font-bold text-white tracking-tight">{formatCurrency(netWorth)}</span>
          <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-sm font-medium mb-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            +2.4%
          </span>
        </div>

        <div className="flex space-x-6">
          <div>
            <span className="flex items-center text-slate-400 text-sm mb-1">
              <ArrowUpRight className="w-4 h-4 mr-1 text-emerald-400" /> Income
            </span>
            <span className="text-lg font-semibold text-white">{formatCurrency(stats.income || 5000)}</span>
          </div>
          <div>
            <span className="flex items-center text-slate-400 text-sm mb-1">
              <ArrowDownRight className="w-4 h-4 mr-1 text-rose-400" /> Expenses
            </span>
            <span className="text-lg font-semibold text-white">{formatCurrency(stats.expenses || 2700)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

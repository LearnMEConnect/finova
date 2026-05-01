"use client";

import { useFinance } from '@/context/FinanceContext';
import { formatCurrency, cn } from '@/utils/helpers';
import { Coffee, Home, Zap, DollarSign, Film, Car, LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from 'next/link';

const categoryIcons: Record<string, LucideIcon> = {
  'Housing': Home,
  'Utilities': Zap,
  'Food': Coffee,
  'Entertainment': Film,
  'Transport': Car,
  'Salary': DollarSign
};

export default function TransactionList() {
  const { transactions } = useFinance();

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 col-span-12 lg:col-span-7 pt-2">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-white font-medium text-lg">Recent Transactions</CardTitle>
        <Link href="/transactions" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">View All</Link>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const Icon = categoryIcons[tx.category] || DollarSign;

            return (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    isIncome ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{tx.description}</h4>
                    <p className="text-slate-400 text-sm hidden sm:block">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={cn(
                    "font-semibold flex items-center justify-end",
                    isIncome ? "text-emerald-400" : "text-white"
                  )}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <span className="text-slate-500 text-xs mt-1 block sm:hidden">{new Date(tx.date).toLocaleDateString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}

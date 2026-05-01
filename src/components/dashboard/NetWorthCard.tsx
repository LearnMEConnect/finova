"use client";

import { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/helpers';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Edit3, Check } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NetWorthCard() {
  const { transactions, netWorth, baselineNetWorth, setBaselineNetWorth } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(baselineNetWorth.toString());
  
  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    });
    return { income, expenses };
  }, [transactions]);

  const handleSaveBaseline = () => {
    const val = parseFloat(editValue);
    if (!isNaN(val)) {
      setBaselineNetWorth(val);
    }
    setIsEditing(false);
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 col-span-12 lg:col-span-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none" />
      
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-slate-400 font-medium">Total Net Worth</h3>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-white transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-end gap-4 mb-8 h-[40px]">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                value={editValue} 
                onChange={(e) => setEditValue(e.target.value)} 
                className="w-32 bg-slate-900 border-slate-700 text-white font-bold"
                autoFocus
              />
              <Button onClick={handleSaveBaseline} size="icon" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 h-10 w-10">
                <Check className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <span className="text-4xl font-bold text-white tracking-tight leading-none">{formatCurrency(netWorth)}</span>
          )}
          {!isEditing && (
            <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-sm font-medium mb-0.5">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2.4%
            </span>
          )}
        </div>

        <div className="flex space-x-6">
           <div>
             <span className="flex items-center text-slate-400 text-sm mb-1">
               <ArrowUpRight className="w-4 h-4 mr-1 text-emerald-400" /> Income
             </span>
             <span className="text-lg font-semibold text-white">{formatCurrency(stats.income)}</span>
           </div>
           <div>
             <span className="flex items-center text-slate-400 text-sm mb-1">
               <ArrowDownRight className="w-4 h-4 mr-1 text-rose-400" /> Expenses
             </span>
             <span className="text-lg font-semibold text-white">{formatCurrency(stats.expenses)}</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

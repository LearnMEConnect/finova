"use client";

import { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select";

export default function ExpenseForm() {
  const { addTransaction } = useFinance();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    addTransaction({
      id: '',
      amount: parseFloat(amount),
      description,
      category,
      date,
      type: category === 'Salary' ? 'income' : 'variable-expense'
    });

    setAmount('');
    setDescription('');
  };

  return (
    <Card className="col-span-12 lg:col-span-5 bg-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 p-8 w-40 h-40 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />
      
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-white text-lg font-medium">Quick Add</CardTitle>
      </CardHeader>

      <CardContent className="relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <Input 
                  type="number" 
                  required 
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="pl-8 bg-slate-900 border-slate-700 text-white focus-visible:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Category</label>
              <NativeSelect 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white focus:ring-emerald-500"
              >
                <option>Food</option>
                <option>Transport</option>
                <option>Entertainment</option>
                <option>Utilities</option>
                <option>Housing</option>
                <option>Salary</option>
              </NativeSelect>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400">Description</label>
            <Input 
              type="text" 
              required 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white focus-visible:ring-emerald-500"
              placeholder="e.g. Weekly groceries"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400">Date</label>
            <Input 
              type="date" 
              required 
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white focus-visible:ring-emerald-500"
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium mt-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

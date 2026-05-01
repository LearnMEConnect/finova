"use client";

import { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from '@/utils/helpers';
import { Plus, Target, CheckCircle2, TrendingUp } from 'lucide-react';

export default function GoalsPage() {
  const { goals, addGoal, transactions, allocateToGoal } = useFinance();
  
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  // Local state for inline allocation forms per goal ID
  const [allocations, setAllocations] = useState<Record<string, string>>({});

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !targetAmount || !deadline) return;
    
    addGoal({
      id: '', // Context assigns ID
      name: goalName,
      targetAmount: parseFloat(targetAmount),
      deadlineDate: deadline
    });
    
    setGoalName('');
    setTargetAmount('');
    setDeadline('');
  };

  const handleAllocate = (goalId: string) => {
    const amt = parseFloat(allocations[goalId] || '0');
    if (amt > 0) {
      allocateToGoal(goalId, amt);
      setAllocations(prev => ({ ...prev, [goalId]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Financial Goals</h1>
        <p className="text-slate-400">Track and allocate your funds dynamically from your main ledger.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Goal Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white font-medium flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" /> Create Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Goal Name</label>
                  <Input 
                    required 
                    value={goalName} 
                    onChange={e=>setGoalName(e.target.value)} 
                    placeholder="e.g. Down Payment" 
                    className="bg-slate-900 border-slate-700 text-white" 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Target Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <Input 
                      type="number" 
                      required 
                      value={targetAmount} 
                      onChange={e=>setTargetAmount(e.target.value)} 
                      className="pl-8 bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Target Date</label>
                  <Input 
                    type="date" 
                    required 
                    value={deadline} 
                    onChange={e=>setDeadline(e.target.value)} 
                    className="bg-slate-900 border-slate-700 text-white" 
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium mt-2">
                  <Plus className="w-4 h-4 mr-2" /> Initialize Goal
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div className="lg:col-span-2 space-y-4">
          {goals.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-xl bg-white/5">
                <Target className="w-12 h-12 text-slate-500 mb-3" />
                <p className="text-slate-400 text-center px-4">No goals configured yet. <br/> Start plotting your future on the left!</p>
             </div>
          ) : (
            goals.map(goal => {
              // Aggregate dynamically from global transactions array!
              let currentSaved = 0;
              transactions.forEach(t => {
                if (t.goalId === goal.id && t.category === 'Goal Contribution') {
                  currentSaved += t.amount;
                }
              });

              const percentage = Math.min(100, Math.round((currentSaved / goal.targetAmount) * 100)) || 0;
              const isCompleted = percentage >= 100;

              return (
                <Card key={goal.id} className="bg-slate-900/50 border-white/10 relative overflow-hidden">
                  {isCompleted && (
                    <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-emerald-500/20 blur-[40px] rounded-full pointer-events-none" />
                  )}
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-medium text-lg flex items-center gap-2">
                          {goal.name} 
                          {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </h3>
                        <p className="text-sm text-slate-400">Target Date: {new Date(goal.deadlineDate).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-2 md:mt-0 text-right">
                        <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(currentSaved)}</p>
                        <p className="text-xs text-slate-500">of {formatCurrency(goal.targetAmount)}</p>
                      </div>
                    </div>

                    {/* Progress Bar Component Native */}
                    <div className="mb-5 mt-2 h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-in-out ${isCompleted ? 'bg-emerald-400' : 'bg-emerald-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-white/5 pt-4">
                      <span className="text-sm font-medium text-slate-300">
                        {percentage}% Achieved
                      </span>
                      
                      {!isCompleted && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                           <div className="relative w-full sm:w-40">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                              <Input 
                                type="number" 
                                placeholder="Amount" 
                                value={allocations[goal.id] || ''}
                                onChange={(e) => setAllocations(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                className="pl-6 h-9 bg-slate-950 border-slate-700 text-white text-sm"
                              />
                           </div>
                           <Button onClick={() => handleAllocate(goal.id)} size="sm" className="bg-slate-800 hover:bg-slate-700 text-white h-9">
                             <TrendingUp className="w-4 h-4 mr-1.5" /> Allocate
                           </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

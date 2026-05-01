"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Transaction, Asset, Liability, FinancialGoal } from '../types/finance';
import { mockTransactions, mockAssets, mockLiabilities } from '../data/mock';

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  assets: Asset[];
  addAsset: (a: Asset) => void;
  liabilities: Liability[];
  addLiability: (l: Liability) => void;
  baselineNetWorth: number;
  setBaselineNetWorth: (v: number) => void;
  goals: FinancialGoal[];
  addGoal: (g: FinancialGoal) => void;
  allocateToGoal: (goalId: string, amount: number) => void;
  netWorth: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [liabilities, setLiabilities] = useState<Liability[]>(mockLiabilities);
  const [baselineNetWorth, setBaselineNetWorth] = useState<number>(0);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);

  const addTransaction = (tx: Transaction) => {
    let resolvedType = tx.type;
    if (!resolvedType) {
      if (tx.amount > 0 && tx.category.toLowerCase() === 'salary') resolvedType = 'income';
      else resolvedType = 'variable-expense';
    }
    const newTx = { ...tx, type: resolvedType, id: Math.random().toString(36).substr(2, 9) };
    setTransactions((prev) => [newTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const addAsset = (a: Asset) => {
    const newA = { ...a, id: Math.random().toString(36).substr(2, 9) };
    setAssets((prev) => [newA, ...prev]);
  };

  const addLiability = (l: Liability) => {
    const newL = { ...l, id: Math.random().toString(36).substr(2, 9) };
    setLiabilities((prev) => [newL, ...prev]);
  };

  const addGoal = (g: FinancialGoal) => {
    const newG = { ...g, id: Math.random().toString(36).substr(2, 9) };
    setGoals((prev) => [newG, ...prev]);
  };

  const allocateToGoal = (goalId: string, amount: number) => {
    const goalTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: amount,
      category: 'Goal Contribution',
      date: new Date().toISOString().split('T')[0],
      description: `Contribution to Goal`,
      type: 'variable-expense',
      goalId: goalId
    };
    setTransactions((prev) => [goalTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const netWorth = useMemo(() => {
    let transactionSum = 0;
    transactions.forEach(t => {
      if (t.type === 'income') transactionSum += t.amount;
      else transactionSum -= t.amount;
    });

    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0);
    
    return baselineNetWorth + totalAssets - totalLiabilities + transactionSum;
  }, [baselineNetWorth, transactions, assets, liabilities]);

  return (
    <FinanceContext.Provider value={{ 
      transactions, addTransaction, 
      assets, addAsset, 
      liabilities, addLiability, 
      baselineNetWorth, setBaselineNetWorth,
      goals, addGoal, allocateToGoal,
      netWorth 
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

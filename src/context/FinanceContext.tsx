"use client";

import React, { createContext, useContext, useState } from 'react';
import { Transaction } from '../types/finance';
import { mockTransactions } from '../data/mock';

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const addTransaction = (tx: Transaction) => {
    // Determine type heuristically if missing
    let resolvedType = tx.type;
    if (!resolvedType) {
      if (tx.amount > 0 && tx.category.toLowerCase() === 'salary') resolvedType = 'income';
      else resolvedType = 'variable-expense';
    }
    
    const newTx = { ...tx, type: resolvedType, id: Math.random().toString(36).substr(2, 9) };
    setTransactions((prev) => [newTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  return (
    <FinanceContext.Provider value={{ transactions, addTransaction }}>
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

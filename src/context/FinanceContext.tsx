"use client";

/**
 * FinanceContext.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all financial data. Every component reads from
 * here, every mutation (add / edit / delete) happens here, and Net Worth
 * recomputes automatically via useMemo.
 *
 * Exposed actions:
 *   Transactions → add, update, delete
 *   Assets       → add, update, delete
 *   Liabilities  → add, update, delete
 */

import React, { createContext, useContext, useState, useMemo } from "react";
import { Transaction, Asset, Liability } from "../types/finance";
import { mockTransactions, mockAssets, mockLiabilities } from "../data/mock";
import {
  MAX_TRANSACTION_AMOUNT,
  validateTransaction,
} from "@/hooks/useTransactionValidation";

// ── Safe numeric helpers ────────────────────────────────────────────────────

function safeAmount(n: number, ceiling = MAX_TRANSACTION_AMOUNT): number {
  if (typeof n !== "number" || !isFinite(n) || isNaN(n)) return 0;
  return Math.round(Math.min(Math.max(0, n), ceiling) * 100) / 100;
}

function safeAssetValue(n: number): number {
  if (typeof n !== "number" || !isFinite(n) || isNaN(n)) return 0;
  return Math.round(Math.min(Math.max(0, n), 10_000_000) * 100) / 100;
}

// ── ID generator ────────────────────────────────────────────────────────────

function genId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// ── Sort helper ─────────────────────────────────────────────────────────────

function sortByDate(txs: Transaction[]): Transaction[] {
  return [...txs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// ── Context type ────────────────────────────────────────────────────────────

interface FinanceContextType {
  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Assets
  assets: Asset[];
  addAsset: (a: Asset) => void;
  updateAsset: (id: string, patch: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;

  // Liabilities
  liabilities: Liability[];
  addLiability: (l: Liability) => void;
  updateLiability: (id: string, patch: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;

  // Computed
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  totalIncome: number;
  totalExpenses: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [liabilities, setLiabilities] =
    useState<Liability[]>(mockLiabilities);

  // ── Transactions ──────────────────────────────────────────────────────────

  const addTransaction = (tx: Transaction) => {
    const errors = validateTransaction(String(tx.amount), tx.description, tx.date);
    if (Object.keys(errors).length > 0) return;

    let resolvedType = tx.type;
    if (!resolvedType) {
      resolvedType =
        tx.amount > 0 && tx.category.toLowerCase() === "salary"
          ? "income"
          : "variable-expense";
    }

    const newTx: Transaction = {
      ...tx,
      amount: safeAmount(tx.amount),
      description: tx.description.trim(),
      type: resolvedType,
      id: genId(),
    };
    setTransactions((prev) => sortByDate([newTx, ...prev]));
  };

  const updateTransaction = (id: string, patch: Partial<Transaction>) => {
    setTransactions((prev) =>
      sortByDate(
        prev.map((t) => {
          if (t.id !== id) return t;
          const updated = { ...t, ...patch };
          if (patch.amount !== undefined) updated.amount = safeAmount(patch.amount);
          if (patch.description !== undefined)
            updated.description = patch.description.trim();
          return updated;
        })
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // ── Assets ────────────────────────────────────────────────────────────────

  const addAsset = (a: Asset) => {
    setAssets((prev) => [
      { ...a, value: safeAssetValue(a.value), id: genId() },
      ...prev,
    ]);
  };

  const updateAsset = (id: string, patch: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const updated = { ...a, ...patch };
        if (patch.value !== undefined) updated.value = safeAssetValue(patch.value);
        return updated;
      })
    );
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // ── Liabilities ───────────────────────────────────────────────────────────

  const addLiability = (l: Liability) => {
    setLiabilities((prev) => [
      { ...l, value: safeAssetValue(l.value), id: genId() },
      ...prev,
    ]);
  };

  const updateLiability = (id: string, patch: Partial<Liability>) => {
    setLiabilities((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, ...patch };
        if (patch.value !== undefined) updated.value = safeAssetValue(patch.value);
        return updated;
      })
    );
  };

  const deleteLiability = (id: string) => {
    setLiabilities((prev) => prev.filter((l) => l.id !== id));
  };

  // ── Computed values ───────────────────────────────────────────────────────

  const computed = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach((t) => {
      const safe = safeAmount(t.amount);
      if (t.type === "income") income += safe;
      else expenses += safe;
    });

    const assetsTotal = assets.reduce(
      (s, a) => s + safeAssetValue(a.value),
      0
    );
    const liabilitiesTotal = liabilities.reduce(
      (s, l) => s + safeAssetValue(l.value),
      0
    );

    return {
      totalIncome: Math.round(income * 100) / 100,
      totalExpenses: Math.round(expenses * 100) / 100,
      totalAssets: Math.round(assetsTotal * 100) / 100,
      totalLiabilities: Math.round(liabilitiesTotal * 100) / 100,
      netWorth:
        Math.round(
          (assetsTotal - liabilitiesTotal + (income - expenses)) * 100
        ) / 100,
    };
  }, [transactions, assets, liabilities]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        assets,
        addAsset,
        updateAsset,
        deleteAsset,
        liabilities,
        addLiability,
        updateLiability,
        deleteLiability,
        ...computed,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}

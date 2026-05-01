"use client";

/**
 * FinanceContext.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global finance state provider.
 *
 * KEY CHANGES (Data Validation & Integrity):
 *
 * 1. addTransaction() now runs the same validation gate that the form uses,
 *    acting as a second-layer defence against programmatic bad data.
 *
 * 2. safeAmount() — a utility that clamps, rounds, and sanitises any numeric
 *    input before it enters state. Prevents NaN, Infinity, negatives, and
 *    extreme outliers from corrupting net-worth or cash-flow totals.
 *
 * 3. Net Worth computation uses safeAmount() on every transaction, asset,
 *    and liability value so an outlier injected into mock data (or via a
 *    future API) cannot skew the figure.
 *
 * 4. MAX_SINGLE_TRANSACTION_AMOUNT is imported from the validation hook so
 *    the context and the form share the exact same ceiling.
 */

import React, { createContext, useContext, useState, useMemo } from "react";
import { Transaction, Asset, Liability, FinancialGoal } from "../types/finance";
import { mockTransactions, mockAssets, mockLiabilities } from "../data/mock";
import {
  MAX_TRANSACTION_AMOUNT,
  validateTransaction,
} from "@/hooks/useTransactionValidation";

// ── Safe numeric helpers ────────────────────────────────────────────────────

/**
 * safeAmount(n)
 * Converts any value to a safe, finite, non-negative number ≤ ceiling.
 * Used everywhere a monetary value enters the computation pipeline.
 */
function safeAmount(n: number, ceiling = MAX_TRANSACTION_AMOUNT): number {
  if (typeof n !== "number" || !isFinite(n) || isNaN(n)) return 0;
  // Clamp to [0, ceiling] and round to 2 decimal places
  const clamped = Math.min(Math.max(0, n), ceiling);
  return Math.round(clamped * 100) / 100;
}

/**
 * safeAssetValue(n)
 * Assets / liabilities can be larger than a single transaction
 * (e.g. 401k balance), so we use a higher ceiling but still guard
 * against Infinity / NaN.
 */
function safeAssetValue(n: number): number {
  if (typeof n !== "number" || !isFinite(n) || isNaN(n)) return 0;
  const clamped = Math.min(Math.max(0, n), 10_000_000); // $10M ceiling
  return Math.round(clamped * 100) / 100;
}

// ── Context type ────────────────────────────────────────────────────────────

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
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [liabilities, setLiabilities] =
    useState<Liability[]>(mockLiabilities);
  const [baselineNetWorth, setBaselineNetWorth] = useState<number>(0);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);

  // ── addTransaction ────────────────────────────────────────────────────────
  // Second-layer validation: even if the form is bypassed, the context
  // refuses invalid data.
  const addTransaction = (tx: Transaction) => {
    // Run the pure validation function as a backend-style guard
    const validationErrors = validateTransaction(
      String(tx.amount),
      tx.description,
      tx.date
    );
    if (Object.keys(validationErrors).length > 0) {
      console.warn(
        "[FinanceContext] Rejected invalid transaction:",
        validationErrors
      );
      return; // silently reject — the UI should have already caught this
    }

    let resolvedType = tx.type;
    if (!resolvedType) {
      if (tx.amount > 0 && tx.category.toLowerCase() === "salary")
        resolvedType = "income";
      else resolvedType = "variable-expense";
    }

    const newTx = {
      ...tx,
      // Re-sanitise the amount through safeAmount
      amount: safeAmount(tx.amount),
      description: tx.description.trim(),
      type: resolvedType,
      id: Math.random().toString(36).substr(2, 9),
    };

    setTransactions((prev) =>
      [newTx, ...prev].sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  };

  // ── addAsset / addLiability ───────────────────────────────────────────────
  const addAsset = (a: Asset) => {
    const newA = {
      ...a,
      value: safeAssetValue(a.value),
      id: Math.random().toString(36).substr(2, 9),
    };
    setAssets((prev) => [newA, ...prev]);
  };

  const addLiability = (l: Liability) => {
    const newL = {
      ...l,
      value: safeAssetValue(l.value),
      id: Math.random().toString(36).substr(2, 9),
    };
    setLiabilities((prev) => [newL, ...prev]);
  };

  // ── Goals ─────────────────────────────────────────────────────────────────
  const addGoal = (g: FinancialGoal) => {
    const newG = { ...g, id: Math.random().toString(36).substr(2, 9) };
    setGoals((prev) => [newG, ...prev]);
  };

  const allocateToGoal = (goalId: string, amount: number) => {
    const safe = safeAmount(amount);
    if (safe <= 0) return; // Guard: refuse zero / negative allocations

    const goalTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: safe,
      category: "Goal Contribution",
      date: new Date().toISOString().split("T")[0],
      description: "Contribution to Goal",
      type: "variable-expense",
      goalId: goalId,
    };
    setTransactions((prev) =>
      [goalTx, ...prev].sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  };

  // ── Net Worth — computed with safe parsing on every value ──────────────────
  const netWorth = useMemo(() => {
    let transactionSum = 0;
    transactions.forEach((t) => {
      // safeAmount ensures no NaN / Infinity / negative leaks into the sum
      const safe = safeAmount(t.amount);
      if (t.type === "income") transactionSum += safe;
      else transactionSum -= safe;
    });

    const totalAssets = assets.reduce(
      (sum, a) => sum + safeAssetValue(a.value),
      0
    );
    const totalLiabilities = liabilities.reduce(
      (sum, l) => sum + safeAssetValue(l.value),
      0
    );

    // Round the final result to avoid floating-point drift
    return (
      Math.round(
        (baselineNetWorth + totalAssets - totalLiabilities + transactionSum) *
          100
      ) / 100
    );
  }, [baselineNetWorth, transactions, assets, liabilities]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        assets,
        addAsset,
        liabilities,
        addLiability,
        baselineNetWorth,
        setBaselineNetWorth,
        goals,
        addGoal,
        allocateToGoal,
        netWorth,
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

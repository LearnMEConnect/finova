"use client";

/**
 * TransactionList — Editable & deletable transaction rows.
 * Click the pencil to inline-edit any transaction.
 * Click the trash to delete (with brief undo state).
 * Every mutation flows through context → net worth recalculates instantly.
 */

import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, cn } from "@/utils/helpers";
import {
  Coffee,
  Home,
  Zap,
  DollarSign,
  Film,
  Car,
  Pencil,
  Trash2,
  Check,
  X,
  LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const categoryIcons: Record<string, LucideIcon> = {
  Housing: Home,
  Utilities: Zap,
  Food: Coffee,
  Entertainment: Film,
  Transport: Car,
  Salary: DollarSign,
};

export default function TransactionList() {
  const { transactions, updateTransaction, deleteTransaction } = useFinance();

  // Track which row is being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const startEdit = (tx: {
    id: string;
    amount: number;
    description: string;
    category: string;
  }) => {
    setEditingId(tx.id);
    setEditAmount(String(tx.amount));
    setEditDescription(tx.description);
    setEditCategory(tx.category);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = () => {
    if (!editingId) return;
    const parsed = parseFloat(editAmount);
    if (isNaN(parsed) || parsed <= 0 || editDescription.trim().length < 2) return;

    updateTransaction(editingId, {
      amount: Math.round(parsed * 100) / 100,
      description: editDescription.trim(),
      category: editCategory,
      type: editCategory === "Salary" ? "income" : "variable-expense",
    });
    setEditingId(null);
  };

  if (transactions.length === 0) {
    return (
      <section>
        <h3 className="text-sm font-medium text-slate-400 mb-3">Transactions</h3>
        <div className="border border-dashed border-white/10 rounded-xl p-8 text-center">
          <p className="text-slate-500 text-sm">
            No transactions yet. Add one above!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-400">Transactions</h3>
        <span className="text-xs text-slate-600">
          {transactions.length} item{transactions.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="rounded-xl border border-white/5 overflow-hidden divide-y divide-white/5">
        {transactions.map((tx) => {
          const isIncome = tx.type === "income";
          const Icon = categoryIcons[tx.category] || DollarSign;
          const isEditing = editingId === tx.id;

          if (isEditing) {
            return (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-3 py-2.5 bg-slate-900/80"
              >
                {/* Amount */}
                <div className="relative sm:w-28">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="pl-5 h-8 bg-slate-950 border-slate-700 text-white text-sm"
                    autoFocus
                  />
                </div>

                {/* Category */}
                <NativeSelect
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="h-8 sm:w-32 bg-slate-950 border-slate-700 text-white text-sm"
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Entertainment</option>
                  <option>Utilities</option>
                  <option>Housing</option>
                  <option>Salary</option>
                </NativeSelect>

                {/* Description */}
                <Input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="h-8 flex-1 bg-slate-950 border-slate-700 text-white text-sm"
                />

                {/* Save / Cancel */}
                <div className="flex gap-1 justify-end">
                  <Button
                    size="sm"
                    onClick={saveEdit}
                    className="h-8 w-8 p-0 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={cancelEdit}
                    className="h-8 w-8 p-0 bg-slate-800 hover:bg-slate-700 text-slate-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    isIncome
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    {tx.category} · {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    isIncome ? "text-emerald-400" : "text-white"
                  )}
                >
                  {isIncome ? "+" : "−"}
                  {formatCurrency(tx.amount)}
                </span>

                {/* Action buttons — visible on hover (always on mobile) */}
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 sm:transition-opacity">
                  <button
                    onClick={() => startEdit(tx)}
                    className="p-1.5 rounded-md hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="p-1.5 rounded-md hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

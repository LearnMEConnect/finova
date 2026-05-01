"use client";

/**
 * ExpenseForm — Compact inline Quick Add row.
 * Sits right below the Net Worth hero so adding a transaction is
 * one glance away. All validation from the previous iteration is preserved.
 */

import { useState, useCallback } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select";
import {
  useTransactionValidation,
  MAX_TRANSACTION_AMOUNT,
} from "@/hooks/useTransactionValidation";

export default function ExpenseForm() {
  const { addTransaction } = useFinance();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const { errors, validate, clearErrors, revalidateField, hasAttempted } =
    useTransactionValidation();

  const handleAmountChange = useCallback(
    (v: string) => {
      setAmount(v);
      revalidateField("amount", v, description, date);
    },
    [description, date, revalidateField]
  );

  const handleDescriptionChange = useCallback(
    (v: string) => {
      setDescription(v);
      revalidateField("description", amount, v, date);
    },
    [amount, date, revalidateField]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(amount, description, date)) {
      setShakeKey((k) => k + 1);
      return;
    }

    addTransaction({
      id: "",
      amount: Math.round(parseFloat(amount) * 100) / 100,
      description: description.trim(),
      category,
      date,
      type: category === "Salary" ? "income" : "variable-expense",
    });

    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    clearErrors();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const fieldErr = (field: "amount" | "description" | "date") =>
    errors[field]
      ? "ring-2 ring-red-500/70 border-red-500/50"
      : "border-slate-700/50";

  // Collect all error messages
  const errorMessages = Object.values(errors).filter(Boolean);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-400">Quick Add</h3>
        {showSuccess && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-3 h-3" />
            Added
          </span>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        key={shakeKey}
        className={`flex flex-col sm:flex-row gap-2 ${
          hasAttempted && errorMessages.length > 0 ? "animate-shake" : ""
        }`}
      >
        {/* Amount */}
        <div className="relative sm:w-32">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
            $
          </span>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            max={MAX_TRANSACTION_AMOUNT}
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className={`pl-6 h-9 bg-slate-900/60 text-white text-sm ${fieldErr("amount")}`}
            placeholder="0.00"
          />
        </div>

        {/* Category */}
        <NativeSelect
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 sm:w-36 bg-slate-900/60 border-slate-700/50 text-white text-sm"
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
          maxLength={120}
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className={`h-9 flex-1 bg-slate-900/60 text-white text-sm ${fieldErr("description")}`}
          placeholder="Description (min 2 chars)"
        />

        {/* Date */}
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`h-9 sm:w-36 bg-slate-900/60 text-white text-sm ${fieldErr("date")}`}
        />

        {/* Submit */}
        <Button
          type="submit"
          size="sm"
          className="h-9 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium px-4 active:scale-[0.97] transition-all"
        >
          <Plus className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </form>

      {/* Error messages */}
      {hasAttempted && errorMessages.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-2">
          {errorMessages.map((msg, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-xs text-red-400 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              {msg}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

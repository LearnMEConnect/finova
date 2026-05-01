"use client";

/**
 * QuickAddForm (ExpenseForm.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * Quick-entry form for new transactions with full client-side validation.
 *
 * Validation behaviour:
 *  • On first submit — all fields are validated at once.
 *  • After a failed submit — each field revalidates on change (live feedback).
 *  • Error fields receive a red ring + shake animation + helper text.
 *  • A success toast animates briefly after a valid submission.
 */

import { useState, useCallback } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select";
import {
  useTransactionValidation,
  MAX_TRANSACTION_AMOUNT,
} from "@/hooks/useTransactionValidation";

export default function ExpenseForm() {
  const { addTransaction } = useFinance();

  // ── Form state ──────────────────────────────────────────────────────────
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // ── Validation hook ─────────────────────────────────────────────────────
  const { errors, validate, clearErrors, revalidateField, hasAttempted } =
    useTransactionValidation();

  // ── Shake animation state — triggers CSS keyframe on invalid submit ─────
  const [shakeKey, setShakeKey] = useState(0);

  // ── Success flash state ─────────────────────────────────────────────────
  const [showSuccess, setShowSuccess] = useState(false);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const triggerShake = () => setShakeKey((k) => k + 1);

  const handleAmountChange = useCallback(
    (value: string) => {
      setAmount(value);
      revalidateField("amount", value, description, date);
    },
    [description, date, revalidateField]
  );

  const handleDescriptionChange = useCallback(
    (value: string) => {
      setDescription(value);
      revalidateField("description", amount, value, date);
    },
    [amount, date, revalidateField]
  );

  const handleDateChange = useCallback(
    (value: string) => {
      setDate(value);
      revalidateField("date", amount, description, value);
    },
    [amount, description, revalidateField]
  );

  // ── Submit handler ──────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate(amount, description, date);

    if (!isValid) {
      triggerShake();
      return;
    }

    // Safe float parsing — guaranteed positive & ≤ MAX by validation
    const parsedAmount = Math.round(parseFloat(amount) * 100) / 100;

    addTransaction({
      id: "", // Context will assign a real id
      amount: parsedAmount,
      description: description.trim(),
      category,
      date,
      type: category === "Salary" ? "income" : "variable-expense",
    });

    // Reset form
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    clearErrors();

    // Flash success indicator
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // ── Style helpers ───────────────────────────────────────────────────────
  const fieldRing = (field: "amount" | "description" | "date") =>
    errors[field]
      ? "ring-2 ring-red-500/80 border-red-500/60 focus-visible:ring-red-500"
      : "border-slate-700 focus-visible:ring-emerald-500";

  const errorText = (msg?: string) =>
    msg ? (
      <span className="flex items-center gap-1 text-xs text-red-400 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        {msg}
      </span>
    ) : null;

  return (
    <Card className="col-span-12 lg:col-span-5 bg-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 p-8 w-40 h-40 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg font-medium">
            Quick Add
          </CardTitle>

          {/* ── Success toast ─────────────────────────────────────── */}
          {showSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Added
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        {/* key={shakeKey} re-mounts the form wrapper to retrigger the
            CSS shake animation each time validation fails. */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-4 ${hasAttempted && Object.keys(errors).length > 0 ? "animate-shake" : ""}`}
          key={shakeKey}
        >
          <div className="grid grid-cols-2 gap-4">
            {/* ── Amount ──────────────────────────────────────────── */}
            <div className="space-y-1.5">
              <label htmlFor="qa-amount" className="text-xs text-slate-400">
                Amount{" "}
                <span className="text-slate-600">
                  (max ${MAX_TRANSACTION_AMOUNT.toLocaleString()})
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  $
                </span>
                <Input
                  id="qa-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={MAX_TRANSACTION_AMOUNT}
                  required
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={`pl-8 bg-slate-900 text-white ${fieldRing("amount")}`}
                  placeholder="0.00"
                />
              </div>
              {errorText(errors.amount)}
            </div>

            {/* ── Category ────────────────────────────────────────── */}
            <div className="space-y-1.5">
              <label htmlFor="qa-category" className="text-xs text-slate-400">
                Category
              </label>
              <NativeSelect
                id="qa-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

          {/* ── Description ─────────────────────────────────────── */}
          <div className="space-y-1.5">
            <label htmlFor="qa-description" className="text-xs text-slate-400">
              Description{" "}
              <span className="text-slate-600">(min 2 characters)</span>
            </label>
            <Input
              id="qa-description"
              type="text"
              required
              maxLength={120}
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className={`bg-slate-900 text-white ${fieldRing("description")}`}
              placeholder="e.g. Weekly groceries"
            />
            {errorText(errors.description)}
          </div>

          {/* ── Date ────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <label htmlFor="qa-date" className="text-xs text-slate-400">
              Date
            </label>
            <Input
              id="qa-date"
              type="date"
              required
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className={`bg-slate-900 text-white ${fieldRing("date")}`}
            />
            {errorText(errors.date)}
          </div>

          {/* ── Submit ──────────────────────────────────────────── */}
          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium mt-2 transition-all duration-200 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>

          {/* ── Aggregate error summary (shown only when errors exist) */}
          {hasAttempted && Object.keys(errors).length > 0 && (
            <p className="text-xs text-red-400/80 text-center animate-in fade-in duration-300">
              Please fix the highlighted fields above.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

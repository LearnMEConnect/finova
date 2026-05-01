/**
 * useTransactionValidation.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized validation engine for the Quick Add transaction form.
 *
 * Design Rationale
 * ────────────────
 * All validation rules live in one hook so every entry point (QuickAddForm,
 * programmatic imports, future API routes) shares the same constraints.
 *
 * Rules enforced
 * ──────────────
 * 1. Amount must be a finite, positive number                (no negatives / zero / NaN)
 * 2. Amount must not exceed MAX_TRANSACTION_AMOUNT ($20 000) (anti-fraud / fat-finger guard)
 * 3. Amount must have at most 2 decimal places               (monetary precision)
 * 4. Description must be ≥ 2 characters after trimming       (no single-char placeholders)
 * 5. Description must not exceed 120 characters              (reasonable storage bound)
 * 6. Date string must be a valid ISO-8601 date (YYYY-MM-DD)  (prevents future parsing bugs)
 */

import { useState, useCallback } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
export const MAX_TRANSACTION_AMOUNT = 20_000;
export const MIN_DESCRIPTION_LENGTH = 2;
export const MAX_DESCRIPTION_LENGTH = 120;

// ── Error map type ───────────────────────────────────────────────────────────
export interface ValidationErrors {
  amount?: string;
  description?: string;
  date?: string;
}

// ── Pure validation function (testable without React) ────────────────────────
export function validateTransaction(
  rawAmount: string,
  description: string,
  date: string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // ── Amount checks ──────────────────────────────────────────────────────────
  const parsed = parseFloat(rawAmount);

  if (rawAmount.trim() === "" || isNaN(parsed)) {
    errors.amount = "Please enter a valid amount.";
  } else if (!isFinite(parsed)) {
    errors.amount = "Amount must be a finite number.";
  } else if (parsed <= 0) {
    errors.amount = "Amount must be greater than zero.";
  } else if (parsed > MAX_TRANSACTION_AMOUNT) {
    errors.amount = `Amount cannot exceed $${MAX_TRANSACTION_AMOUNT.toLocaleString()}.`;
  } else {
    // Check decimal precision — at most 2 decimal places
    const decimalPart = rawAmount.split(".")[1];
    if (decimalPart && decimalPart.length > 2) {
      errors.amount = "Amount must have at most 2 decimal places.";
    }
  }

  // ── Description checks ─────────────────────────────────────────────────────
  const trimmed = description.trim();
  if (trimmed.length === 0) {
    errors.description = "Description is required.";
  } else if (trimmed.length < MIN_DESCRIPTION_LENGTH) {
    errors.description = `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters.`;
  } else if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be under ${MAX_DESCRIPTION_LENGTH} characters.`;
  }

  // ── Date checks ────────────────────────────────────────────────────────────
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = "Please select a valid date.";
  } else {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      errors.date = "Invalid date value.";
    }
  }

  return errors;
}

// ── React hook that wraps the pure function with state ───────────────────────
export function useTransactionValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});
  /** True after the first submission attempt — used to enable live revalidation */
  const [hasAttempted, setHasAttempted] = useState(false);

  /**
   * validate() — call on submit. Returns `true` if the form is clean.
   */
  const validate = useCallback(
    (rawAmount: string, description: string, date: string): boolean => {
      setHasAttempted(true);
      const result = validateTransaction(rawAmount, description, date);
      setErrors(result);
      return Object.keys(result).length === 0;
    },
    []
  );

  /**
   * clearErrors() — call after a successful submit to reset the UI.
   */
  const clearErrors = useCallback(() => {
    setErrors({});
    setHasAttempted(false);
  }, []);

  /**
   * revalidateField() — call on individual field change *after* first
   * submission attempt so live feedback appears while the user corrects input.
   */
  const revalidateField = useCallback(
    (
      field: keyof ValidationErrors,
      rawAmount: string,
      description: string,
      date: string
    ) => {
      if (!hasAttempted) return; // Don't show errors before first submit
      const result = validateTransaction(rawAmount, description, date);
      setErrors((prev) => {
        const next = { ...prev };
        if (result[field]) {
          next[field] = result[field];
        } else {
          delete next[field];
        }
        return next;
      });
    },
    [hasAttempted]
  );

  return { errors, validate, clearErrors, revalidateField, hasAttempted };
}

"use client";

/**
 * BudgetChart.tsx — Cash Flow Overview
 * ─────────────────────────────────────────────────────────────────────────────
 * KEY CHANGE: The chart now derives its data dynamically from the live
 * transaction list instead of the static `mockCashFlow` array.
 *
 * How it works:
 *  1. Group all transactions by month (YYYY-MM).
 *  2. For each month, safely parse and sum income vs expenses using the same
 *     safeFloat() guard used elsewhere.
 *  3. Render both series (income / expenses) as stacked area charts so the
 *     user can visually compare inflows and outflows.
 *
 * This means any new transaction added via QuickAdd immediately appears in
 * the chart — no manual data sync required.
 */

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/select";

// ── Safe float parser — prevents NaN / Infinity from corrupting chart data ──
function safeFloat(n: number): number {
  if (typeof n !== "number" || !isFinite(n) || isNaN(n)) return 0;
  return Math.round(Math.max(0, n) * 100) / 100;
}

// Short month names for the X axis
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface CashFlowPoint {
  month: string;
  income: number;
  expenses: number;
}

export default function BudgetChart() {
  const { transactions } = useFinance();

  // ── Derive cash-flow data from live transactions ──────────────────────────
  const cashFlowData: CashFlowPoint[] = useMemo(() => {
    // Bucket: { "2026-04": { income: 5000, expenses: 1490 }, ... }
    const buckets: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach((t) => {
      // Extract YYYY-MM key from the transaction date
      const key = t.date?.slice(0, 7); // "2026-04"
      if (!key || !/^\d{4}-\d{2}$/.test(key)) return; // skip malformed dates

      if (!buckets[key]) buckets[key] = { income: 0, expenses: 0 };

      const safe = safeFloat(t.amount);
      if (t.type === "income") {
        buckets[key].income += safe;
      } else {
        // fixed-expense, variable-expense, or anything else → expenses
        buckets[key].expenses += safe;
      }
    });

    // Sort chronologically and convert keys to human-readable month labels
    return Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, vals]) => {
        const monthIdx = parseInt(key.split("-")[1], 10) - 1;
        return {
          month: MONTH_LABELS[monthIdx] ?? key,
          income: Math.round(vals.income * 100) / 100,
          expenses: Math.round(vals.expenses * 100) / 100,
        };
      });
  }, [transactions]);

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 col-span-12 lg:col-span-8 flex flex-col pt-2">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-white font-medium text-lg">
          Cash Flow Overview
        </CardTitle>
        <NativeSelect className="w-40 bg-slate-900 border-slate-700 text-slate-300 focus:ring-emerald-500">
          <option>Last 6 Months</option>
          <option>This Year</option>
        </NativeSelect>
      </CardHeader>

      <CardContent className="flex-1 w-full min-h-[250px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={cashFlowData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#334155"
            />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                color: "#fff",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#fff" }}
              formatter={(value) => {
                const num = Number(value) || 0;
                return `$${num.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}`;
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

"use client";

/**
 * BudgetChart — Cash Flow chart derived from live transactions.
 * Simplified: removed the period dropdown for a cleaner UI.
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

function safeFloat(n: number): number {
  if (typeof n !== "number" || !isFinite(n) || isNaN(n)) return 0;
  return Math.round(Math.max(0, n) * 100) / 100;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function BudgetChart() {
  const { transactions } = useFinance();

  const cashFlowData = useMemo(() => {
    const buckets: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach((t) => {
      const key = t.date?.slice(0, 7);
      if (!key || !/^\d{4}-\d{2}$/.test(key)) return;
      if (!buckets[key]) buckets[key] = { income: 0, expenses: 0 };

      const safe = safeFloat(t.amount);
      if (t.type === "income") buckets[key].income += safe;
      else buckets[key].expenses += safe;
    });

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

  if (cashFlowData.length === 0) {
    return (
      <section>
        <h3 className="text-sm font-medium text-slate-400 mb-3">Cash Flow</h3>
        <div className="border border-dashed border-white/10 rounded-xl p-8 text-center">
          <p className="text-slate-500 text-sm">
            Add transactions to see your cash flow chart.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h3 className="text-sm font-medium text-slate-400 mb-3">Cash Flow</h3>
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={cashFlowData}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1e293b"
            />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "12px",
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
              fill="url(#gIncome)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#gExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

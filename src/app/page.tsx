import NetWorthCard from "@/components/dashboard/NetWorthCard";
import BudgetChart from "@/components/dashboard/BudgetChart";
import TransactionList from "@/components/dashboard/TransactionList";
import ExpenseForm from "@/components/dashboard/ExpenseForm";
import SmartInsights from "@/components/dashboard/SmartInsights";
import BalanceSheet from "@/components/dashboard/BalanceSheet";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero — Net Worth with full breakdown */}
      <NetWorthCard />

      {/* Quick Add inline form */}
      <ExpenseForm />

      {/* Transactions — editable & deletable */}
      <TransactionList />

      {/* Assets & Liabilities — side by side, inline-editable */}
      <BalanceSheet />

      {/* Cash Flow chart */}
      <BudgetChart />

      {/* Insights banner */}
      <SmartInsights />
    </div>
  );
}

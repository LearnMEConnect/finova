import NetWorthCard from "@/components/dashboard/NetWorthCard";
import BudgetChart from "@/components/dashboard/BudgetChart";
import TransactionList from "@/components/dashboard/TransactionList";
import ExpenseForm from "@/components/dashboard/ExpenseForm";
import SmartInsights from "@/components/dashboard/SmartInsights";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Overview</h1>
        <p className="text-slate-400">Welcome back! Here is your financial summary.</p>
      </header>

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <NetWorthCard />
        <BudgetChart />
        <TransactionList />
        <ExpenseForm />
        <SmartInsights />
      </div>
    </div>
  );
}

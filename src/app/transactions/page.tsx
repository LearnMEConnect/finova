import TransactionList from "@/components/dashboard/TransactionList";
import ExpenseForm from "@/components/dashboard/ExpenseForm";

export default function TransactionsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Transactions</h1>
        <p className="text-slate-400">View and manage all your historical transactions.</p>
      </header>
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <ExpenseForm />
        <TransactionList />
      </div>
    </div>
  );
}

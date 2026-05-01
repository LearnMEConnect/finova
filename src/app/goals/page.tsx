import SmartInsights from "@/components/dashboard/SmartInsights";

export default function GoalsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Financial Goals</h1>
        <p className="text-slate-400">Track and manage your savings and investment goals.</p>
      </header>
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
         <SmartInsights />
         <div className="col-span-12 p-8 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center min-h-[300px]">
           <p className="text-slate-400 text-lg">Goal Tracking module coming soon...</p>
         </div>
      </div>
    </div>
  );
}

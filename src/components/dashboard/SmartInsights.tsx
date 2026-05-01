import { Lightbulb, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export default function SmartInsights() {
  return (
    <Card className="bg-slate-900 border-white/5 col-span-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
      
      <CardContent className="p-6 flex flex-col md:flex-row gap-6 relative z-10">
        <div className="flex-shrink-0 w-16 h-16 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>

        <div className="flex-1">
          <h3 className="text-white font-medium text-lg mb-1">Financial Health: Excellent</h3>
          <p className="text-slate-400 text-sm mb-4">Your fixed expenses are well below 50% of your income. Great job keeping your overhead low.</p>
          
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-3">
            <Lightbulb className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300">
              <span className="font-medium text-white">Insight:</span> You have $1,200 remaining in your budget this month. Consider allocating 50% of this towards an emergency fund or investments.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

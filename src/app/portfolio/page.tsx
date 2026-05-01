"use client";

import { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select";
import { formatCurrency } from '@/utils/helpers';
import { Plus, Building2, CreditCard, Landmark } from 'lucide-react';

export default function PortfolioPage() {
  const { assets, liabilities, addAsset, addLiability } = useFinance();
  
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('Bank Account');
  const [assetValue, setAssetValue] = useState('');

  const [liabilityName, setLiabilityName] = useState('');
  const [liabilityType, setLiabilityType] = useState('Credit Card');
  const [liabilityValue, setLiabilityValue] = useState('');

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !assetValue) return;
    addAsset({ id: '', name: assetName, type: assetType, value: parseFloat(assetValue) });
    setAssetName(''); setAssetValue('');
  };

  const handleAddLiability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liabilityName || !liabilityValue) return;
    addLiability({ id: '', name: liabilityName, type: liabilityType, value: parseFloat(liabilityValue) });
    setLiabilityName(''); setLiabilityValue('');
  };

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Portfolio & Wealth</h1>
        <p className="text-slate-400">Manage your assets, investments, and liabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Assets Column */}
        <div className="space-y-6">
          <Card className="bg-emerald-950/20 border-emerald-500/20 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-emerald-400 font-medium text-lg">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white tracking-tight">{formatCurrency(totalAssets)}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white font-medium">Add New Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAsset} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Name</label>
                    <Input required value={assetName} onChange={e=>setAssetName(e.target.value)} placeholder="e.g. Savings" className="bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Type</label>
                    <NativeSelect value={assetType} onChange={e=>setAssetType(e.target.value)} className="bg-slate-900 border-slate-700 text-white">
                      <option>Bank Account</option>
                      <option>Investment</option>
                      <option>Real Estate</option>
                      <option>Vehicle</option>
                    </NativeSelect>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Current Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <Input type="number" required value={assetValue} onChange={e=>setAssetValue(e.target.value)} className="pl-8 bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium"><Plus className="w-4 h-4 mr-2" /> Add Asset</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-white font-medium text-lg ml-1">Your Assets</h3>
            {assets.map(a => (
              <Card key={a.id} className="bg-slate-900 border-white/5">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      {a.type.includes('Bank') ? <Landmark className="w-5 h-5"/> : <Building2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">{a.name}</p>
                      <p className="text-slate-400 text-sm">{a.type}</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-semibold">{formatCurrency(a.value)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Liabilities Column */}
        <div className="space-y-6">
          <Card className="bg-rose-950/20 border-rose-500/20 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-rose-400 font-medium text-lg">Total Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white tracking-tight">{formatCurrency(totalLiabilities)}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white font-medium">Add New Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddLiability} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Name</label>
                    <Input required value={liabilityName} onChange={e=>setLiabilityName(e.target.value)} placeholder="e.g. Mortgage" className="bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Type</label>
                    <NativeSelect value={liabilityType} onChange={e=>setLiabilityType(e.target.value)} className="bg-slate-900 border-slate-700 text-white">
                      <option>Credit Card</option>
                      <option>Loan</option>
                      <option>Mortgage</option>
                    </NativeSelect>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Outstanding Balance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <Input type="number" required value={liabilityValue} onChange={e=>setLiabilityValue(e.target.value)} className="pl-8 bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium"><Plus className="w-4 h-4 mr-2" /> Add Liability</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-white font-medium text-lg ml-1">Your Liabilities</h3>
            {liabilities.map(l => (
              <Card key={l.id} className="bg-slate-900 border-white/5">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{l.name}</p>
                      <p className="text-slate-400 text-sm">{l.type}</p>
                    </div>
                  </div>
                  <span className="text-rose-400 font-semibold">{formatCurrency(l.value)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

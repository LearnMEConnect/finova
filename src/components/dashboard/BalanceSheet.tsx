"use client";

/**
 * BalanceSheet — Inline-editable Assets & Liabilities side-by-side.
 * Replaces the separate Portfolio page. Every edit/add/delete instantly
 * recalculates net worth via context.
 */

import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/utils/helpers";
import {
  Landmark,
  Building2,
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

/* ─── Asset types & icons ─────────────────────────────────────────────────── */

const ASSET_TYPES = ["Bank Account", "Investment", "Real Estate", "Vehicle"];
const LIABILITY_TYPES = ["Credit Card", "Loan", "Mortgage"];

function AssetIcon({ type }: { type: string }) {
  return type.includes("Bank") ? (
    <Landmark className="w-4 h-4" />
  ) : (
    <Building2 className="w-4 h-4" />
  );
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function BalanceSheet() {
  const {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    liabilities,
    addLiability,
    updateLiability,
    deleteLiability,
    totalAssets,
    totalLiabilities,
  } = useFinance();

  return (
    <section>
      <h3 className="text-sm font-medium text-slate-400 mb-3">
        Assets & Liabilities
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── Assets Column ────────────────────────────────────────────── */}
        <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] overflow-hidden">
          <div className="px-4 py-3 border-b border-emerald-500/10 flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-400">Assets</span>
            <span className="text-xs text-emerald-400/70 tabular-nums">
              {formatCurrency(totalAssets)}
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {assets.map((a) => (
              <EditableRow
                key={a.id}
                id={a.id}
                name={a.name}
                type={a.type}
                value={a.value}
                types={ASSET_TYPES}
                accentColor="emerald"
                icon={<AssetIcon type={a.type} />}
                onUpdate={(patch) => updateAsset(a.id, patch)}
                onDelete={() => deleteAsset(a.id)}
              />
            ))}
          </div>

          <AddRow
            types={ASSET_TYPES}
            accentColor="emerald"
            onAdd={(name, type, value) =>
              addAsset({ id: "", name, type, value })
            }
          />
        </div>

        {/* ── Liabilities Column ───────────────────────────────────────── */}
        <div className="rounded-xl border border-rose-500/10 bg-rose-500/[0.03] overflow-hidden">
          <div className="px-4 py-3 border-b border-rose-500/10 flex items-center justify-between">
            <span className="text-sm font-medium text-rose-400">Liabilities</span>
            <span className="text-xs text-rose-400/70 tabular-nums">
              {formatCurrency(totalLiabilities)}
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {liabilities.map((l) => (
              <EditableRow
                key={l.id}
                id={l.id}
                name={l.name}
                type={l.type}
                value={l.value}
                types={LIABILITY_TYPES}
                accentColor="rose"
                icon={<CreditCard className="w-4 h-4" />}
                onUpdate={(patch) => updateLiability(l.id, patch)}
                onDelete={() => deleteLiability(l.id)}
              />
            ))}
          </div>

          <AddRow
            types={LIABILITY_TYPES}
            accentColor="rose"
            onAdd={(name, type, value) =>
              addLiability({ id: "", name, type, value })
            }
          />
        </div>
      </div>
    </section>
  );
}

/* ─── EditableRow ─────────────────────────────────────────────────────────── */

interface EditableRowProps {
  id: string;
  name: string;
  type: string;
  value: number;
  types: string[];
  accentColor: "emerald" | "rose";
  icon: React.ReactNode;
  onUpdate: (patch: { name?: string; type?: string; value?: number }) => void;
  onDelete: () => void;
}

function EditableRow({
  name,
  type,
  value,
  types,
  accentColor,
  icon,
  onUpdate,
  onDelete,
}: EditableRowProps) {
  const [editing, setEditing] = useState(false);
  const [eName, setEName] = useState(name);
  const [eType, setEType] = useState(type);
  const [eValue, setEValue] = useState(String(value));

  const save = () => {
    const parsed = parseFloat(eValue);
    if (isNaN(parsed) || parsed < 0 || eName.trim().length === 0) return;
    onUpdate({
      name: eName.trim(),
      type: eType,
      value: Math.round(parsed * 100) / 100,
    });
    setEditing(false);
  };

  const cancel = () => {
    setEName(name);
    setEType(type);
    setEValue(String(value));
    setEditing(false);
  };

  const accent =
    accentColor === "emerald"
      ? { icon: "text-emerald-400 bg-emerald-500/10", value: "text-emerald-400" }
      : { icon: "text-rose-400 bg-rose-500/10", value: "text-rose-400" };

  if (editing) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 px-3 py-2.5 bg-slate-900/50">
        <Input
          value={eName}
          onChange={(e) => setEName(e.target.value)}
          className="h-8 flex-1 bg-slate-950 border-slate-700 text-white text-sm"
          autoFocus
        />
        <NativeSelect
          value={eType}
          onChange={(e) => setEType(e.target.value)}
          className="h-8 sm:w-32 bg-slate-950 border-slate-700 text-white text-sm"
        >
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </NativeSelect>
        <div className="relative sm:w-28">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
            $
          </span>
          <Input
            type="number"
            step="0.01"
            value={eValue}
            onChange={(e) => setEValue(e.target.value)}
            className="pl-5 h-8 bg-slate-950 border-slate-700 text-white text-sm"
          />
        </div>
        <div className="flex gap-1 justify-end">
          <Button
            size="sm"
            onClick={save}
            className="h-8 w-8 p-0 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
          >
            <Check className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            onClick={cancel}
            className="h-8 w-8 p-0 bg-slate-800 hover:bg-slate-700 text-slate-400"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.02] transition-colors group">
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${accent.icon}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-white font-medium truncate">{name}</p>
          <p className="text-xs text-slate-500">{type}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        <span className={`text-sm font-semibold tabular-nums ${accent.value}`}>
          {formatCurrency(value)}
        </span>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 sm:transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded-md hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded-md hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── AddRow ──────────────────────────────────────────────────────────────── */

interface AddRowProps {
  types: string[];
  accentColor: "emerald" | "rose";
  onAdd: (name: string, type: string, value: number) => void;
}

function AddRow({ types, accentColor, onAdd }: AddRowProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState(types[0]);
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(value);
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return;
    onAdd(name.trim(), type, Math.round(parsed * 100) / 100);
    setName("");
    setValue("");
    setOpen(false);
  };

  const btnColor =
    accentColor === "emerald"
      ? "text-emerald-400 hover:bg-emerald-500/10"
      : "text-rose-400 hover:bg-rose-500/10";

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`w-full flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors ${btnColor}`}
      >
        <Plus className="w-3.5 h-3.5" />
        Add
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col sm:flex-row gap-2 px-3 py-2.5 border-t border-white/5"
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="h-8 flex-1 bg-slate-950 border-slate-700 text-white text-sm"
        autoFocus
      />
      <NativeSelect
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="h-8 sm:w-32 bg-slate-950 border-slate-700 text-white text-sm"
      >
        {types.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </NativeSelect>
      <div className="relative sm:w-28">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
          $
        </span>
        <Input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0.00"
          className="pl-5 h-8 bg-slate-950 border-slate-700 text-white text-sm"
        />
      </div>
      <div className="flex gap-1 justify-end">
        <Button
          type="submit"
          size="sm"
          className="h-8 w-8 p-0 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
        >
          <Check className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => setOpen(false)}
          className="h-8 w-8 p-0 bg-slate-800 hover:bg-slate-700 text-slate-400"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    </form>
  );
}

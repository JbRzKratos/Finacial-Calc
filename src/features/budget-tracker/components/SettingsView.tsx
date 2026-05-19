"use client";

import { useFinance } from "../contexts/FinanceContext";
import { Shield, Download, RotateCcw } from "lucide-react";
import { useState } from "react";

export function SettingsView() {
  const { exportData, resetData } = useFinance();
  const [showReset, setShowReset] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleExport() {
    const data = exportData();
    if (typeof window !== "undefined" && "clipboard" in navigator) {
      navigator.clipboard.writeText(data).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    resetData();
    setShowReset(false);
  }

  return (
    <div className="px-5 pt-6 pb-6">
      <h1 className="text-lg font-bold text-white mb-6">Settings</h1>

      {/* Privacy Card */}
      <div className="rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 p-5 mb-5 border border-white/5">
        <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center mb-3">
          <Shield size={20} className="text-violet-400" />
        </div>
        <p className="text-sm font-bold text-white mb-1">Your Data is Private</p>
        <p className="text-[12px] text-white/50 leading-relaxed">
          All your financial data is stored locally on this device. Nothing is sent to any server.
          You own your data — always.
        </p>
      </div>

      {/* Export */}
      <button
        type="button"
        onClick={handleExport}
        className="w-full rounded-2xl bg-neutral-800/60 border border-white/[0.04] px-5 py-4 flex items-center gap-4 hover:bg-neutral-800 transition-all active:scale-[0.98] mb-3"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
          <Download size={18} className="text-emerald-400" />
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-semibold text-white">Export Data</p>
          <p className="text-[11px] text-white/40">Download your transactions as JSON</p>
        </div>
        <span className="text-xs font-medium text-emerald-400">{copied ? "Copied!" : "Export"}</span>
      </button>

      {/* Reset */}
      {showReset ? (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-5 py-4">
          <p className="text-sm font-semibold text-red-400 mb-3">Are you sure? This will delete all data.</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowReset(false)} className="flex-1 rounded-xl bg-neutral-700 text-white/70 text-sm font-semibold py-2.5 hover:bg-neutral-600 transition-colors">
              Cancel
            </button>
            <button type="button" onClick={handleReset} className="flex-1 rounded-xl bg-red-500 text-white text-sm font-semibold py-2.5 hover:bg-red-600 transition-colors">
              Delete All
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowReset(true)}
          className="w-full rounded-2xl bg-neutral-800/60 border border-white/[0.04] px-5 py-4 flex items-center gap-4 hover:bg-neutral-800 transition-all active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <RotateCcw size={18} className="text-red-400" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-white">Reset Data</p>
            <p className="text-[11px] text-white/40">Remove all transactions</p>
          </div>
          <span className="text-xs font-medium text-red-400">Reset</span>
        </button>
      )}
    </div>
  );
}

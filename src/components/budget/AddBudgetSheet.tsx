"use client";

import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";

const EMOJIS = ["🍔", "🛒", "🚗", "✈️", "🎬", "🏥", "💊", "🎓", "📱", "💻", "👔", "🏠", "💡", "🐶", "💰", "🎁", "🏋️", "☕", "🍕", "🎮"];
const COLORS = ["#FF6B00", "#14B8A6", "#8B5CF6", "#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#EC4899"];

interface AddBudgetSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; icon: string; iconBg: string; monthlyLimit: number; color: string }) => void;
}

export function AddBudgetSheet({ open, onClose, onSave }: AddBudgetSheetProps) {
  const [name, setName] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [icon, setIcon] = useState("🍔");
  const [color, setColor] = useState("#FF6B00");
  const [closing, setClosing] = useState(false);

  useEffect(() => { if (open) { setName(""); setMonthlyLimit(""); setIcon("🍔"); setColor("#FF6B00"); setClosing(false); } }, [open]);

  const handleClose = useCallback(() => { setClosing(true); setTimeout(onClose, 250); }, [onClose]);
  const handleBackdrop = useCallback((e: React.MouseEvent) => { if (e.target === e.currentTarget) handleClose(); }, [handleClose]);

  const handleSubmit = useCallback(() => {
    if (!name.trim() || !monthlyLimit) return;
    onSave({ name: name.trim(), icon, iconBg: color, monthlyLimit: Number(monthlyLimit), color });
    handleClose();
  }, [name, monthlyLimit, icon, color, onSave, handleClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className={closing ? "animate-modal-out" : "animate-modal-in"}>
          <div className="w-9 h-1 rounded-full bg-[#333] mx-auto mt-3 mb-4" />
          <div className="px-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[17px] font-semibold text-[#F5F5F5]">New Budget</p>
              <button type="button" onClick={handleClose} className="w-8 h-8 rounded-lg bg-[#1C1C1F] flex items-center justify-center hover:bg-[#222226] transition-colors" aria-label="Close">
                <X size={16} className="text-[#8A8A90]" />
              </button>
            </div>

            <div className="mb-5">
              <label className="text-[11px] font-semibold text-[#8A8A90] uppercase tracking-wider mb-2 block">Category Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Entertainment" className="w-full bg-[#141416] border border-[rgba(255,255,255,0.06)] rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-[#FF6B00]/50 transition-all placeholder:text-[#55555C]" />
            </div>

            <div className="mb-5">
              <label className="text-[11px] font-semibold text-[#8A8A90] uppercase tracking-wider mb-2 block">Monthly Limit</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55555C] font-mono">₹</span>
                <input type="number" inputMode="numeric" value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value)} placeholder="5,000" className="w-full bg-[#141416] border border-[rgba(255,255,255,0.06)] rounded-xl py-3 pl-8 pr-4 text-white font-mono text-lg font-bold outline-none focus:border-[#FF6B00]/50 transition-all placeholder:text-[#55555C]" />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-[11px] font-semibold text-[#8A8A90] uppercase tracking-wider mb-3 block">Icon</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button key={e} type="button" onClick={() => setIcon(e)} className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${icon === e ? "bg-[#FF6B00] scale-110 shadow-md" : "bg-[#141416] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]"}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[11px] font-semibold text-[#8A8A90] uppercase tracking-wider mb-3 block">Color</label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setColor(c)} className={`w-9 h-9 rounded-xl transition-all border-2 ${color === c ? "border-[#FF6B00] scale-110" : "border-transparent hover:border-white/20"}`} style={{ background: c }} aria-label={`Color ${c}`} />
                ))}
              </div>
            </div>

            <button type="button" onClick={handleSubmit} disabled={!name.trim() || !monthlyLimit} className={`w-full rounded-xl py-4 text-base font-bold transition-all active:scale-[0.97] ${name.trim() && monthlyLimit ? "bg-[#FF6B00] text-white shadow-lg shadow-orange-500/30" : "bg-[#141416] text-[#55555C] cursor-not-allowed"}`}>
              Create Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
